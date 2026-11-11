import { learningConfig } from '../config/learning';
import type { Item, Step } from './types';

// Sinh danh sách câu hỏi của một buổi theo quy tắc cố định (không dùng AI), theo
// mục 6 đến 8 của docs/lo-trinh-hoc-tap.md. Chỉ là logic thuần, không đụng giao diện.
// TODO: viết kiểm thử tự động cho file này (jest-expo, đã duyệt).

export function shuffle<T>(list: readonly T[]): T[] {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Tách câu theo dấu '|' do đội nội dung đánh sẵn. Không tự tách từ bằng thuật toán. */
export function splitSegments(item: Item): string[] {
  if (!item.targetSegmented) return [];
  return item.targetSegmented
    .split('|')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

export function canOrderWords(item: Item): boolean {
  if (item.type === 'word') return false;
  const n = splitSegments(item).length;
  return n >= 2 && n <= learningConfig.maxOrderParts;
}

/** 4 lựa chọn: đáp án đúng và 3 mục khác có nghĩa khác. */
function choicesFor(item: Item, pool: readonly Item[]): Item[] {
  const others = shuffle(pool.filter((p) => p.id !== item.id && p.vi !== item.vi)).slice(0, 3);
  return shuffle([item, ...others]);
}

function orderStep(item: Item, key: string): Step {
  const parts = splitSegments(item);
  let startOrder = shuffle(parts.map((_, i) => i));
  // Tránh trường hợp trộn xong vẫn đúng thứ tự.
  if (startOrder.every((v, i) => v === i)) startOrder = startOrder.slice().reverse();
  return { key, kind: 'order_words', item, parts, startOrder };
}

function listenStep(item: Item, pool: readonly Item[], key: string): Step {
  return { key, kind: 'listen_choose_meaning', item, options: choicesFor(item, pool) };
}

function readStep(item: Item, pool: readonly Item[], key: string): Step {
  return { key, kind: 'read_choose_audio', item, options: choicesFor(item, pool) };
}

/**
 * Học một phần mới: làm quen từng mục, rồi luyện tập từ dễ đến khó
 * (ghép cặp, nghe chọn nghĩa, xem chữ chọn âm thanh, sắp xếp câu).
 */
export function buildLearnSteps(newItems: readonly Item[], pool: readonly Item[]): Step[] {
  const steps: Step[] = newItems.map((item) => ({ key: `intro-${item.id}`, kind: 'intro', item }));

  const pairable = newItems.filter((i) => i.type !== 'dialogue_line').slice(0, learningConfig.matchPairsCount);
  if (pairable.length >= 3) {
    steps.push({ key: `match-${pairable.map((i) => i.id).join('-')}`, kind: 'match_pairs', items: pairable });
  }

  for (const item of shuffle(newItems)) steps.push(listenStep(item, pool, `listen-${item.id}`));

  const forReading = shuffle(newItems).slice(0, Math.ceil(newItems.length / 2));
  for (const item of forReading) steps.push(readStep(item, pool, `read-${item.id}`));

  for (const item of newItems.filter(canOrderWords)) steps.push(orderStep(item, `order-${item.id}`));

  return steps;
}

/**
 * Buổi ôn tập: tối đa 20 mục, cấp thấp ôn trước. Cách hỏi theo cấp độ nhớ (mục 8):
 * cấp 1 nhận ra; cấp 2 nhớ nghĩa, xen kẽ xem chữ chọn âm thanh; cấp 3 đến 5 nhớ và nói,
 * xen kẽ sắp xếp câu nếu mục là câu.
 */
export function buildReviewSteps(due: readonly { item: Item; level: number }[], pool: readonly Item[]): Step[] {
  const picked = due
    .slice()
    .sort((a, b) => a.level - b.level)
    .slice(0, learningConfig.maxReviewItems);

  return picked.map(({ item, level }, i): Step => {
    const key = `review-${item.id}`;
    if (level <= 1) return listenStep(item, pool, key);
    if (level === 2) {
      return i % 2 === 0 ? { key, kind: 'recall_meaning', item, level } : readStep(item, pool, key);
    }
    if (canOrderWords(item) && i % 2 === 1) return orderStep(item, key);
    return { key, kind: 'recall_speak', item, level };
  });
}

/** Kiểm tra cuối bài: 10 câu trộn cả 4 dạng, lấy từ toàn bộ mục trong bài. */
export function buildTestSteps(lessonItems: readonly Item[], pool: readonly Item[]): Step[] {
  const total = learningConfig.testQuestionCount;
  const items = shuffle(lessonItems);
  const steps: Step[] = [];

  const pairable = items.filter((i) => i.type !== 'dialogue_line').slice(0, learningConfig.matchPairsCount);
  if (pairable.length >= 3) steps.push({ key: 'test-match', kind: 'match_pairs', items: pairable });

  let i = 0;
  while (steps.length < total && items.length > 0) {
    const item = items[i % items.length];
    const key = `test-${steps.length}-${item.id}`;
    const turn = steps.length % 3;
    if (turn === 0 && canOrderWords(item)) steps.push(orderStep(item, key));
    else if (turn === 1) steps.push(readStep(item, pool, key));
    else steps.push(listenStep(item, pool, key));
    i++;
  }
  return steps;
}

/** Luyện thêm trong Sổ từ: chỉ các dạng nhận ra, không làm đổi cấp độ nhớ. */
export function buildPracticeSteps(items: readonly Item[], pool: readonly Item[]): Step[] {
  return shuffle(items)
    .slice(0, learningConfig.practiceMaxQuestions)
    .map((item, i) =>
      i % 2 === 0 ? listenStep(item, pool, `practice-${item.id}`) : readStep(item, pool, `practice-${item.id}`),
    );
}
