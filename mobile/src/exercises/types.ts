import type { Item, SessionKind, Step, StepResult } from '../learning/types';
import type { LanguageWords } from '../strings';

// Mọi dạng bài nhận cùng một bộ props, do src/session/SessionRunner.tsx truyền vào.
export type ExerciseProps<K extends Step['kind']> = {
  step: Extract<Step, { kind: K }>;
  lang: LanguageWords;
  mode: SessionKind;
  /** Câu này trả lời sai thì cuối buổi có được hỏi lại không. */
  willRetry: boolean;
  onDone: (result: StepResult) => void;
  onReport: (item: Item) => void;
};
