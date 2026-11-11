// Kiểu dữ liệu dùng chung cho phần học. Tên trường đặt chung chung (target, không phải km)
// để sau này thêm ngôn ngữ khác mà không phải đổi code (CLAUDE.md, mục 1).

export type ItemType = 'word' | 'phrase' | 'dialogue_line';

export type Item = {
  id: string;
  lessonNo: number;
  itemNo: number;
  type: ItemType;
  /** Nghĩa tiếng Việt. */
  vi: string;
  /** Chữ của ngôn ngữ đang học. */
  target: string;
  /** Câu đã được đội nội dung tách sẵn, các phần ngăn bằng '|'. */
  targetSegmented?: string;
  romanization: string;
};

export type Language = {
  code: string;
  /** Ví dụ "Tiếng Khmer". */
  nameVi: string;
  /** Ví dụ "Nam Bộ". */
  varietyVi?: string;
};

export type SessionKind = 'learn' | 'review' | 'test' | 'practice';

export type Step =
  | { key: string; kind: 'intro'; item: Item }
  | { key: string; kind: 'match_pairs'; items: Item[] }
  | { key: string; kind: 'listen_choose_meaning'; item: Item; options: Item[] }
  | { key: string; kind: 'read_choose_audio'; item: Item; options: Item[] }
  | { key: string; kind: 'order_words'; item: Item; parts: string[]; startOrder: number[] }
  | { key: string; kind: 'recall_meaning' | 'recall_speak'; item: Item; level: number };

export type StepResult = {
  /** Bỏ trống với thẻ làm quen (không chấm). */
  correct?: boolean;
  /** Câu tự đánh giá ở dạng 5, thống kê riêng (CLAUDE.md, mục 7). */
  selfAssessed?: boolean;
};

/** Các mục mà một bước hỏi tới, để cập nhật cấp độ nhớ. */
export function stepItems(step: Step): Item[] {
  return step.kind === 'match_pairs' ? step.items : [step.item];
}
