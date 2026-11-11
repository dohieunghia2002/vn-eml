import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { demoItems, demoLanguage, getPartItems } from '../../../src/demo/sampleContent';
import { demoActions } from '../../../src/demo/store';
import { buildLearnSteps } from '../../../src/learning/plan';
import { SessionRunner, summaryParams } from '../../../src/session/SessionRunner';
import { languageWords } from '../../../src/strings';

// Học một phần mới: làm quen, luyện tập, làm lại câu sai, tổng kết (docs/lo-trinh-hoc-tap.md, mục 6).
export default function LearnPartScreen() {
  const params = useLocalSearchParams<{ lessonId: string; partNo: string }>();
  const lessonNo = Number(params.lessonId) || 1;
  const partNo = Number(params.partNo) || 1;
  const [setup] = useState(() => {
    const items = getPartItems(lessonNo, partNo);
    return { items, steps: buildLearnSteps(items, demoItems) };
  });

  return (
    <SessionRunner
      kind="learn"
      steps={setup.steps}
      lang={languageWords(demoLanguage)}
      retryWrong
      onFinish={(stats) => {
        demoActions.finishLearnPart(
          lessonNo,
          partNo,
          setup.items.map((i) => i.id),
        );
        router.replace({
          pathname: '/summary',
          params: summaryParams('learn', stats, { lessonNo, partNo, itemCount: setup.items.length }),
        });
      }}
    />
  );
}
