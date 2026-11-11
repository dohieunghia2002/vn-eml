import { useSyncExternalStore } from 'react';

import { nextLevel } from '../learning/leitner';
import {
  demoDownloadableLessons,
  demoInitialLevels,
  demoLessons,
  FINAL_LESSON_NO,
} from './sampleContent';

// Trạng thái MẪU của app, chỉ nằm trong bộ nhớ: tắt app là mất.
// TODO: bước 6 thay bằng tiến độ lưu trong SQLite (src/data) và đồng bộ lên Supabase.

export type ThemeChoice = 'system' | 'light' | 'dark';
export type TextSize = 'large' | 'xlarge';

export type DemoState = {
  welcomeSeen: boolean;
  /** Bật để xem màn hình "Chưa có mạng" khi tải bài. */
  offlineDemo: boolean;
  downloadedLessons: number;
  themeChoice: ThemeChoice;
  /** TODO: chưa áp dụng cỡ chữ "Rất lớn" cho toàn app. */
  textSize: TextSize;
  feedbackSound: boolean;
  /** Số báo lỗi đang chờ gửi (hàng chờ khi không có mạng). */
  pendingReports: number;
  /** Cấp độ nhớ của các mục đã học, theo id mục. */
  levels: Record<string, number>;
  reviewedToday: number;
  learnedPartToday: boolean;
  /** Số ngày học liên tiếp tính đến hôm qua. */
  streakBeforeToday: number;
  studiedToday: boolean;
  currentLessonNo: number;
  /** Số phần đã học xong của từng bài. */
  partsDone: Record<number, number>;
  completedLessons: number[];
  /** Bật để xem Sổ từ khi chưa học mục nào. */
  vocabularyEmptyDemo: boolean;
};

function initialState(): DemoState {
  return {
    welcomeSeen: false,
    offlineDemo: false,
    downloadedLessons: 0,
    themeChoice: 'system',
    textSize: 'large',
    feedbackSound: true,
    pendingReports: 0,
    levels: { ...demoInitialLevels },
    reviewedToday: 0,
    learnedPartToday: false,
    streakBeforeToday: 6,
    studiedToday: false,
    currentLessonNo: 1,
    partsDone: { 1: 2 },
    completedLessons: [],
    vocabularyEmptyDemo: false,
  };
}

let state: DemoState = initialState();
const listeners = new Set<() => void>();

function update(patch: Partial<DemoState> | ((s: DemoState) => Partial<DemoState>)) {
  state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

export function useDemoState(): DemoState {
  return useSyncExternalStore(subscribe, getSnapshot);
}

/** Đọc trạng thái một lần, không theo dõi thay đổi (dùng khi tạo danh sách câu hỏi của buổi). */
export function getDemoState(): DemoState {
  return state;
}

/** Bài nên học tiếp: bài chưa xong, có nội dung, theo thứ tự gợi ý. */
export function recommendedLessonNo(s: DemoState, exclude?: number): number | undefined {
  return demoLessons
    .filter((l) => l.no !== exclude && l.no !== FINAL_LESSON_NO && l.partSizes.length > 0)
    .filter((l) => !s.completedLessons.includes(l.no))
    .sort((a, b) => a.recommendedOrder - b.recommendedOrder)[0]?.no;
}

export function dueCount(s: DemoState): number {
  return s.reviewedToday > 0 ? 0 : Object.keys(s.levels).length;
}

export function streakDays(s: DemoState): number {
  return s.streakBeforeToday + (s.studiedToday ? 1 : 0);
}

/** Mục tiêu ngày: ôn hết mục cần ôn và học 1 phần mới (mục 11 của docs/lo-trinh-hoc-tap.md). */
export function dailyGoal(s: DemoState): { done: number; total: number; reviewDone: boolean } {
  const reviewDone = s.reviewedToday > 0 || Object.keys(s.levels).length === 0;
  return { done: (reviewDone ? 1 : 0) + (s.learnedPartToday ? 1 : 0), total: 2, reviewDone };
}

export const demoActions = {
  finishDownload(lessons: number) {
    update({ welcomeSeen: true, downloadedLessons: lessons, offlineDemo: false });
  },
  setDownloadedAll() {
    update({ downloadedLessons: demoDownloadableLessons });
  },
  setThemeChoice(themeChoice: ThemeChoice) {
    update({ themeChoice });
  },
  setTextSize(textSize: TextSize) {
    update({ textSize });
  },
  toggleFeedbackSound() {
    update((s) => ({ feedbackSound: !s.feedbackSound }));
  },
  queueReport() {
    update((s) => ({ pendingReports: s.pendingReports + 1 }));
  },
  /** Chỉ câu trả lời trong buổi ôn tập mới làm đổi cấp độ nhớ. */
  answerInReview(itemIds: string[], correct: boolean) {
    update((s) => {
      const levels = { ...s.levels };
      for (const id of itemIds) levels[id] = nextLevel(levels[id] ?? 1, correct);
      return { levels };
    });
  },
  finishReview(count: number) {
    update({ reviewedToday: count, studiedToday: true });
  },
  /** Học xong một phần: các mục mới vào cấp độ nhớ 1. */
  finishLearnPart(lessonNo: number, partNo: number, newItemIds: string[]) {
    update((s) => {
      const levels = { ...s.levels };
      for (const id of newItemIds) if (levels[id] === undefined) levels[id] = 1;
      return {
        levels,
        currentLessonNo: lessonNo,
        partsDone: { ...s.partsDone, [lessonNo]: Math.max(s.partsDone[lessonNo] ?? 0, partNo) },
        learnedPartToday: true,
        studiedToday: true,
        vocabularyEmptyDemo: false,
      };
    });
  },
  /** Làm xong bài kiểm tra cuối bài: bài được tính là hoàn thành, chuyển sang bài gợi ý tiếp. */
  finishTest(lessonNo: number) {
    update((s) => {
      const completedLessons = s.completedLessons.includes(lessonNo)
        ? s.completedLessons
        : [...s.completedLessons, lessonNo];
      const next = recommendedLessonNo({ ...s, completedLessons }, lessonNo) ?? lessonNo;
      return { completedLessons, currentLessonNo: next, studiedToday: true };
    });
  },
  finishPractice() {
    update({ studiedToday: true });
  },

  // Chỉ dùng ở màn hình kiểm tra của lập trình viên (app/dev-check.tsx).
  showWelcomeAgain() {
    update({ welcomeSeen: false, offlineDemo: false });
  },
  setOfflineDemo(offlineDemo: boolean) {
    update({ offlineDemo });
  },
  setVocabularyEmptyDemo(vocabularyEmptyDemo: boolean) {
    update({ vocabularyEmptyDemo });
  },
  setReviewDone(done: boolean) {
    update((s) => ({ reviewedToday: done ? Object.keys(s.levels).length : 0 }));
  },
  resetProgress() {
    update((s) => ({ ...initialState(), welcomeSeen: s.welcomeSeen, downloadedLessons: s.downloadedLessons, themeChoice: s.themeChoice }));
  },
};
