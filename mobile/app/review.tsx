import { Redirect, router } from 'expo-router';
import { useState } from 'react';

import { demoItems, demoLanguage, findItem } from '../src/demo/sampleContent';
import { demoActions, getDemoState } from '../src/demo/store';
import { intervalDays, MAX_LEVEL, nextLevel } from '../src/learning/leitner';
import { buildReviewSteps } from '../src/learning/plan';
import { stepItems, type Item } from '../src/learning/types';
import { SessionRunner, summaryParams } from '../src/session/SessionRunner';
import { languageWords, strings as s } from '../src/strings';

// Buổi ôn tập hôm nay. Chỉ câu trả lời ở đây mới làm đổi cấp độ nhớ
// (docs/lo-trinh-hoc-tap.md, mục 8). Bản mẫu: 13, 14, 15 (thẻ nhớ).
export default function ReviewScreen() {
  const [steps] = useState(() => {
    const due = Object.entries(getDemoState().levels)
      .map(([id, level]) => ({ item: findItem(id), level }))
      .filter((d): d is { item: Item; level: number } => d.item !== undefined);
    return buildReviewSteps(due, demoItems);
  });

  if (steps.length === 0) return <Redirect href="/" />;

  return (
    <SessionRunner
      kind="review"
      steps={steps}
      lang={languageWords(demoLanguage)}
      retryWrong={false}
      onResult={(step, result) => {
        if (result.correct === undefined) return;
        const ids = stepItems(step).map((i) => i.id);
        const before = getDemoState().levels[ids[0]] ?? 1;
        demoActions.answerInReview(ids, result.correct);
        if (!result.selfAssessed) return;
        if (!result.correct) return s.flashcard.toastDown;
        const after = nextLevel(before, true);
        return before >= MAX_LEVEL ? s.flashcard.toastStay(intervalDays(after)) : s.flashcard.toastUp(after, intervalDays(after));
      }}
      onFinish={(stats) => {
        demoActions.finishReview(steps.length);
        router.replace({ pathname: '/summary', params: summaryParams('review', stats, { itemCount: steps.length }) });
      }}
    />
  );
}
