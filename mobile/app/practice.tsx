import { Redirect, router } from 'expo-router';
import { useState } from 'react';

import { demoItems, demoLanguage, findItem } from '../src/demo/sampleContent';
import { demoActions, getDemoState } from '../src/demo/store';
import { MAX_LEVEL } from '../src/learning/leitner';
import { buildPracticeSteps } from '../src/learning/plan';
import type { Item } from '../src/learning/types';
import { SessionRunner, summaryParams } from '../src/session/SessionRunner';
import { languageWords } from '../src/strings';

// "Luyện thêm" trong Sổ từ: ưu tiên mục cấp 1 đến 2, không làm đổi cấp độ nhớ
// (docs/lo-trinh-hoc-tap.md, mục 9).
export default function PracticeScreen() {
  const [steps] = useState(() => {
    const learned = Object.entries(getDemoState().levels)
      .map(([id, level]) => ({ item: findItem(id), level }))
      .filter((x): x is { item: Item; level: number } => x.item !== undefined);
    const weak = learned.filter((x) => x.level <= 2);
    const pick = (weak.length > 0 ? weak : learned.filter((x) => x.level < MAX_LEVEL)).map((x) => x.item);
    return buildPracticeSteps(pick, demoItems);
  });

  if (steps.length === 0) return <Redirect href="/vocabulary" />;

  return (
    <SessionRunner
      kind="practice"
      steps={steps}
      lang={languageWords(demoLanguage)}
      retryWrong
      onFinish={(stats) => {
        demoActions.finishPractice();
        router.replace({ pathname: '/summary', params: summaryParams('practice', stats, { itemCount: steps.length }) });
      }}
    />
  );
}
