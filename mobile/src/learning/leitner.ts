import { learningConfig } from '../config/learning';

// Cấp độ nhớ 1 đến 5 (hộp Leitner). Quy tắc ở mục 8 của docs/lo-trinh-hoc-tap.md:
// đúng hoặc "Nhớ rồi" thì lên một cấp (tối đa 5), sai hoặc "Chưa nhớ" thì về cấp 1.
export const MIN_LEVEL = 1;
export const MAX_LEVEL = learningConfig.levelIntervalsDays.length;

export function nextLevel(level: number, correct: boolean): number {
  if (!correct) return MIN_LEVEL;
  return Math.min(Math.max(level, MIN_LEVEL) + 1, MAX_LEVEL);
}

/** Số ngày chờ trước lần ôn sau, khi mục đang ở cấp `level`. */
export function intervalDays(level: number): number {
  const i = Math.min(Math.max(level, MIN_LEVEL), MAX_LEVEL) - 1;
  return learningConfig.levelIntervalsDays[i];
}
