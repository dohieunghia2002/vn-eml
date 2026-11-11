import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Block } from '../../src/components/Block';
import { BlockButton } from '../../src/components/BlockButton';
import { Icon } from '../../src/components/Icon';
import { MascotHead } from '../../src/components/Mascot';
import { ProgressRing } from '../../src/components/ProgressRing';
import { Screen } from '../../src/components/Screen';
import { learningConfig } from '../../src/config/learning';
import { demoLanguage, demoLessons, FINAL_LESSON_NO, findLesson, type DemoLesson } from '../../src/demo/sampleContent';
import { dailyGoal, dueCount, recommendedLessonNo, streakDays, useDemoState, type DemoState } from '../../src/demo/store';
import { languageWords, strings as s } from '../../src/strings';
import { neutral } from '../../src/theme/palette';
import { useThemeColors } from '../../src/theme/useThemeColors';

// Trang chính (tab Học). Bản mẫu: 01-trang-chinh, 01b-trang-chinh-da-on-xong.
export default function HomeScreen() {
  const st = useDemoState();
  const c = useThemeColors();
  const lang = languageWords(demoLanguage);

  const due = dueCount(st);
  const goal = dailyGoal(st);
  const hasLearned = Object.keys(st.levels).length > 0;
  const lesson = findLesson(st.currentLessonNo) ?? demoLessons[0];

  const greeting = !goal.reviewDone
    ? s.home.greetingPending(due)
    : st.learnedPartToday
      ? s.home.greetingAllDone
      : s.home.greetingReviewDone;
  const learnLine = st.learnedPartToday ? s.home.goalLearnDone : goal.reviewDone ? s.home.goalLearnLeft : s.home.goalLearn;
  const reviewLine = goal.reviewDone ? s.home.goalReviewDone(st.reviewedToday) : s.home.goalReview(due);

  const others = demoLessons.filter((l) => l.no !== lesson.no).sort((a, b) => a.recommendedOrder - b.recommendedOrder);
  const recommended = recommendedLessonNo(st, lesson.no);

  return (
    <Screen>
      <View className="flex-row items-center justify-between gap-3 px-4 pb-2 pt-4">
        <View>
          <Text className="font-ui-extrabold text-[22px] leading-[28px] tracking-[0.4px] text-ink">{s.appName}</Text>
          <Text className="font-ui-semibold text-[15px] text-muted">{s.home.learning(lang)}</Text>
        </View>
        <View className="flex-row items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5">
          <Icon name="calendarCheck" color={c['accent-ink']} size={20} />
          <Text className="font-ui-bold text-[16px] text-accent-ink">{s.home.streak(streakDays(st))}</Text>
        </View>
      </View>

      <ScrollView contentContainerClassName="gap-4 px-4 pb-6 pt-2">
        <View className="flex-row items-center gap-3">
          <MascotHead label={s.mascotLabel} />
          <View className="flex-1 rounded-2xl border-2 border-line bg-surface px-3 py-2.5">
            <Text className="font-ui-semibold text-[16px] leading-[22px] text-ink">{greeting}</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-4 rounded-[18px] border-2 border-line bg-surface px-4 py-3.5">
          <ProgressRing done={goal.done} total={goal.total} accessibilityLabel={s.home.goalRing(goal.done, goal.total)} />
          <View className="flex-1 gap-0.5">
            <Text className="font-ui-extrabold text-[18px] text-ink">{s.home.goalTitle}</Text>
            <Text className="font-ui text-[16px] leading-[22px] text-muted">
              {hasLearned ? `${reviewLine}\n${learnLine}` : learnLine}
            </Text>
          </View>
        </View>

        {hasLearned &&
          (!goal.reviewDone ? (
            <BlockButton label={s.home.reviewButton(due)} icon="refresh" onPress={() => router.push('/review')} />
          ) : (
            <View className="min-h-[60px] flex-row items-center gap-3 rounded-2xl bg-ok-bg px-4 py-3">
              <View className="h-9 w-9 items-center justify-center rounded-full bg-ok">
                <Icon name="check" color={neutral.white} size={20} />
              </View>
              <Text className="flex-1 font-ui-extrabold text-[18px] leading-[24px] text-ok-ink">{s.home.reviewDone(st.reviewedToday)}</Text>
            </View>
          ))}

        <CurrentLesson lesson={lesson} st={st} />

        <Text accessibilityRole="header" className="mt-2 font-ui-extrabold text-[18px] text-ink">
          {s.home.otherLessons}
        </Text>
        {others.map((l) => (
          <LessonRow key={l.no} lesson={l} st={st} recommended={l.no === recommended} />
        ))}
      </ScrollView>
    </Screen>
  );
}

function CurrentLesson({ lesson, st }: { lesson: DemoLesson; st: DemoState }) {
  const c = useThemeColors();
  const partsDone = st.partsDone[lesson.no] ?? 0;
  const allPartsDone = partsDone >= lesson.partSizes.length;
  const lessonDone = st.completedLessons.includes(lesson.no);

  return (
    <View className="rounded-[18px] border-2 border-line bg-surface p-4">
      <Text className="font-ui-extrabold text-[13px] tracking-[0.7px] text-secondary-text">{s.home.currentLesson(lesson.no)}</Text>
      <Text className="mb-4 mt-0.5 font-ui-extrabold text-[20px] leading-[26px] text-ink">{lesson.titleVi}</Text>

      <View>
        <View className="absolute bottom-[22px] left-[20px] top-[22px] w-1 rounded-full bg-line" />
        <View className="gap-3.5">
          {lesson.partSizes.map((size, i) => {
            const part = i + 1;
            if (part <= partsDone) {
              return (
                <PathRow key={part} node={<DoneNode />} title={s.home.part(part)} meta={s.home.partDone(size)} />
              );
            }
            if (part === partsDone + 1) {
              return (
                <View key={part} className="flex-row items-center gap-3.5">
                  <CurrentNode label={String(part)} />
                  <PathButton label={s.home.continuePart(part)} onPress={() => router.push(`/lesson/${lesson.no}/${part}`)} />
                </View>
              );
            }
            return (
              <PathRow
                key={part}
                node={<FutureNode label={String(part)} />}
                title={s.home.part(part)}
                meta={s.home.partItems(size)}
              />
            );
          })}

          {lessonDone ? (
            <PathRow node={<DoneNode />} title={s.home.lessonTest} meta={s.home.lessonTestDone} />
          ) : allPartsDone ? (
            <View className="flex-row items-center gap-3.5">
              <CurrentNode icon={<Icon name="flag" color={c.ink} size={20} />} />
              <PathButton label={s.home.lessonTestStart} onPress={() => router.push(`/lesson/${lesson.no}/test`)} />
            </View>
          ) : (
            <PathRow
              node={<FutureNode icon={<Icon name="flag" color={c.muted} size={20} />} />}
              title={s.home.lessonTest}
              meta={s.home.lessonTestCount(learningConfig.testQuestionCount)}
            />
          )}
        </View>
      </View>
    </View>
  );
}

function PathRow({ node, title, meta }: { node: ReactNode; title: string; meta: string }) {
  return (
    <View className="flex-row items-center gap-3.5">
      {node}
      <View className="flex-1">
        <Text className="font-ui-bold text-[17px] text-ink">{title}</Text>
        <Text className="font-ui text-[15px] text-muted">{meta}</Text>
      </View>
    </View>
  );
}

function DoneNode() {
  return (
    <Block
      faceClassName="h-11 w-11 items-center justify-center bg-secondary"
      shadowClassName="bg-secondary-shadow"
      roundedClassName="rounded-full"
      depth={4}
    >
      <Icon name="check" color={neutral.white} size={22} strokeWidth={2.8} />
    </Block>
  );
}

function CurrentNode({ label, icon }: { label?: string; icon?: ReactNode }) {
  return (
    <View className="h-11 w-11 items-center justify-center rounded-full border-[5px] border-accent bg-surface">
      {icon ?? <Text className="font-ui-extrabold text-[17px] text-ink">{label}</Text>}
    </View>
  );
}

function FutureNode({ label, icon }: { label?: string; icon?: ReactNode }) {
  return (
    <View className="h-11 w-11 items-center justify-center rounded-full border-[3px] border-line bg-surface">
      {icon ?? <Text className="font-ui-bold text-[17px] text-muted">{label}</Text>}
    </View>
  );
}

function PathButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Block
      className="flex-1"
      onPress={onPress}
      accessibilityLabel={label}
      faceClassName="min-h-[52px] flex-row items-center justify-between bg-secondary pl-4 pr-3"
      shadowClassName="bg-secondary-shadow"
      roundedClassName="rounded-[14px]"
    >
      <Text className="flex-1 font-ui-extrabold text-[17px] text-white">{label}</Text>
      <Icon name="chevronRight" color={neutral.white} size={22} strokeWidth={2.6} />
    </Block>
  );
}

function LessonRow({ lesson, st, recommended }: { lesson: DemoLesson; st: DemoState; recommended: boolean }) {
  const c = useThemeColors();
  const completed = st.completedLessons.includes(lesson.no);
  const comingSoon = lesson.partSizes.length === 0;
  const isFinal = lesson.no === FINAL_LESSON_NO;
  const finalUnlocked = demoLessons
    .filter((l) => l.no !== FINAL_LESSON_NO && l.partSizes.length > 0)
    .every((l) => st.completedLessons.includes(l.no));

  if (comingSoon) {
    return (
      <View className="min-h-[68px] flex-row items-center gap-3 rounded-2xl border-2 border-dashed border-line bg-bg px-3.5 py-3">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-surface">
          <Text className="font-ui-extrabold text-[17px] text-muted">{lesson.no}</Text>
        </View>
        <View className="flex-1">
          <Text className="font-ui-bold text-[17px] leading-[23px] text-ink">{lesson.titleVi}</Text>
          <Text className="font-ui text-[15px] text-muted">{s.home.comingSoon}</Text>
        </View>
      </View>
    );
  }

  if (isFinal && !finalUnlocked) {
    return (
      <View className="min-h-[68px] flex-row items-center gap-3 rounded-2xl border-2 border-line bg-bg px-3.5 py-3">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-surface">
          <Icon name="lock" color={c.muted} size={20} />
        </View>
        <View className="flex-1">
          <Text className="font-ui-bold text-[17px] leading-[23px] text-ink">{s.home.finalTitle(lesson.no, lesson.titleVi)}</Text>
          <Text className="font-ui text-[15px] text-muted">{s.home.finalLocked(FINAL_LESSON_NO - 1)}</Text>
        </View>
      </View>
    );
  }

  const partsDone = st.partsDone[lesson.no] ?? 0;
  const nextPart = completed ? 1 : Math.min(partsDone + 1, lesson.partSizes.length);
  const meta = completed ? s.home.lessonCompleted : recommended ? s.home.recommended : s.home.partsCount(lesson.partSizes.length);

  return (
    <Block
      onPress={() => router.push(`/lesson/${lesson.no}/${nextPart}`)}
      accessibilityLabel={`${s.home.openLesson(lesson.no, lesson.titleVi)}. ${meta}`}
      faceClassName={`min-h-[68px] flex-row items-center gap-3 border-2 bg-surface px-3.5 py-3 ${recommended ? 'border-accent' : 'border-line'}`}
      shadowClassName={recommended ? 'bg-accent' : 'bg-line'}
      depth={3}
    >
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-secondary-soft">
        <Text className="font-ui-extrabold text-[17px] text-secondary-text">{lesson.no}</Text>
      </View>
      <View className="flex-1">
        <Text className="font-ui-bold text-[17px] leading-[23px] text-ink">{lesson.titleVi}</Text>
        <Text className={`text-[15px] ${recommended ? 'font-ui-bold text-accent-ink' : completed ? 'font-ui-semibold text-ok-ink' : 'font-ui text-muted'}`}>
          {meta}
        </Text>
      </View>
      <Icon name="chevronRight" color={c.muted} size={20} />
    </Block>
  );
}
