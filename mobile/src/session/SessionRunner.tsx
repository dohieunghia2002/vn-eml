import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ReportForm } from '../components/ReportForm';
import { SessionHeader } from '../components/SessionHeader';
import { SheetModal } from '../components/SheetModal';
import { Toast } from '../components/Toast';
import { demoActions } from '../demo/store';
import { Flashcard } from '../exercises/Flashcard';
import { IntroCard } from '../exercises/IntroCard';
import { ListenChooseMeaning } from '../exercises/ListenChooseMeaning';
import { MatchPairs } from '../exercises/MatchPairs';
import { OrderWords } from '../exercises/OrderWords';
import { ReadChooseAudio } from '../exercises/ReadChooseAudio';
import type { Item, SessionKind, Step, StepResult } from '../learning/types';
import { strings as s, type LanguageWords } from '../strings';

// Chạy một buổi: học phần mới, ôn tập, kiểm tra cuối bài hoặc luyện thêm.
// Mọi câu hỏi dùng chung một khuôn: nút thoát và thanh tiến độ ở trên, câu hỏi ở giữa,
// nút lớn ở dưới (docs/lo-trinh-hoc-tap.md, mục 6). Không có chuyện "trượt": sai thì làm lại.

export type SessionStats = {
  /** Câu app tự chấm (dạng 1 đến 4), chỉ tính lần trả lời đầu tiên. */
  autoCorrect: number;
  autoTotal: number;
  /** Câu tự đánh giá (dạng 5), thống kê riêng. */
  selfRemembered: number;
  selfTotal: number;
  minutes: number;
};

type Props = {
  kind: SessionKind;
  steps: Step[];
  lang: LanguageWords;
  /** Câu trả lời sai được hỏi lại một lần vào cuối buổi. */
  retryWrong: boolean;
  /** Gọi sau mỗi câu. Trả về một câu ngắn thì hiện thành thông báo (ví dụ "Lên cấp 4..."). */
  onResult?: (step: Step, result: StepResult) => string | void;
  onFinish: (stats: SessionStats) => void;
};

const RETRY_SUFFIX = ':retry';

export function SessionRunner({ kind, steps, lang, retryWrong, onResult, onFinish }: Props) {
  const insets = useSafeAreaInsets();
  const [queue, setQueue] = useState<Step[]>(steps);
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [reportItem, setReportItem] = useState<Item | null>(null);
  const retried = useRef(new Set<string>());
  const stats = useRef({ autoCorrect: 0, autoTotal: 0, selfRemembered: 0, selfTotal: 0 });
  const startedAt = useRef(Date.now());
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (message: string) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  const step = queue[index];
  if (!step) return null;
  const isRetry = step.key.endsWith(RETRY_SUFFIX);

  const handleDone = (result: StepResult) => {
    if (result.correct !== undefined) {
      if (result.selfAssessed) {
        stats.current.selfTotal += 1;
        if (result.correct) stats.current.selfRemembered += 1;
      } else if (!isRetry) {
        stats.current.autoTotal += 1;
        if (result.correct) stats.current.autoCorrect += 1;
      }
    }

    const message = onResult?.(step, result);
    if (message) showToast(message);

    let nextQueue = queue;
    if (retryWrong && result.correct === false && !result.selfAssessed && !isRetry && !retried.current.has(step.key)) {
      retried.current.add(step.key);
      nextQueue = [...queue, { ...step, key: `${step.key}${RETRY_SUFFIX}` }];
      setQueue(nextQueue);
    }

    if (index + 1 >= nextQueue.length) {
      const minutes = Math.max(1, Math.round((Date.now() - startedAt.current) / 60000));
      onFinish({ ...stats.current, minutes });
    } else {
      setIndex(index + 1);
    }
  };

  const common = {
    lang,
    mode: kind,
    willRetry: retryWrong && !isRetry && !retried.current.has(step.key),
    onDone: handleDone,
    onReport: setReportItem,
  };

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <SessionHeader
        current={index + 1}
        total={queue.length}
        tone={kind === 'review' ? 'accent' : 'primary'}
        onClose={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        closeLabel={kind === 'review' ? s.common.exitReview : s.common.exitSession}
        progressLabel={kind === 'review' ? s.common.reviewProgress : s.common.sessionProgress}
      />

      <View className="flex-1">
        {step.kind === 'intro' && <IntroCard key={step.key} step={step} {...common} />}
        {step.kind === 'match_pairs' && <MatchPairs key={step.key} step={step} {...common} />}
        {step.kind === 'listen_choose_meaning' && <ListenChooseMeaning key={step.key} step={step} {...common} />}
        {step.kind === 'read_choose_audio' && <ReadChooseAudio key={step.key} step={step} {...common} />}
        {step.kind === 'order_words' && <OrderWords key={step.key} step={step} {...common} />}
        {(step.kind === 'recall_meaning' || step.kind === 'recall_speak') && (
          <Flashcard key={step.key} step={step} {...common} />
        )}
      </View>

      {toast && (
        <View pointerEvents="none" className="absolute left-5 right-5" style={{ bottom: 120 + insets.bottom }}>
          <Toast message={toast} center />
        </View>
      )}

      <SheetModal visible={reportItem !== null} onClose={() => setReportItem(null)} accessibilityLabel={s.report.title}>
        {reportItem && (
          <ReportForm
            item={reportItem}
            lang={lang}
            onCancel={() => setReportItem(null)}
            onSend={() => {
              demoActions.queueReport();
              setReportItem(null);
              showToast(s.report.sent);
            }}
          />
        )}
      </SheetModal>
    </View>
  );
}

/** Tham số gửi sang màn hình tổng kết (expo-router chỉ nhận chuỗi). */
export function summaryParams(kind: SessionKind, stats: SessionStats, extra: Record<string, number>) {
  const out: Record<string, string> = { kind };
  for (const [k, v] of Object.entries({ ...stats, ...extra })) out[k] = String(v);
  return out;
}
