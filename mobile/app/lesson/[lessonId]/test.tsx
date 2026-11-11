import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { demoItems, demoLanguage, getLessonItems } from '../../../src/demo/sampleContent';
import { demoActions } from '../../../src/demo/store';
import { buildTestSteps } from '../../../src/learning/plan';
import { SessionRunner, summaryParams } from '../../../src/session/SessionRunner';
import { languageWords } from '../../../src/strings';

// Kiểm tra cuối bài: 10 câu, không chặn người học, không hỏi lại câu sai
// (docs/lo-trinh-hoc-tap.md, mục 7).
export default function LessonTestScreen() {
  const params = useLocalSearchParams<{ lessonId: string }>();
  const lessonNo = Number(params.lessonId) || 1;
  const [steps] = useState(() => buildTestSteps(getLessonItems(lessonNo), demoItems));

  return (
    <SessionRunner
      kind="test"
      steps={steps}
      lang={languageWords(demoLanguage)}
      retryWrong={false}
      onFinish={(stats) => {
        demoActions.finishTest(lessonNo);
        router.replace({
          pathname: '/summary',
          params: summaryParams('test', stats, { lessonNo, itemCount: steps.length }),
        });
      }}
    />
  );
}
