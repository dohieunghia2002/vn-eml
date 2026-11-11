import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { Block } from '../src/components/Block';
import { BlockButton } from '../src/components/BlockButton';
import { Icon } from '../src/components/Icon';
import { MascotHero } from '../src/components/Mascot';
import { Screen } from '../src/components/Screen';
import { learningConfig } from '../src/config/learning';
import { findLesson } from '../src/demo/sampleContent';
import { dailyGoal, streakDays, useDemoState } from '../src/demo/store';
import type { SessionKind } from '../src/learning/types';
import { strings as s } from '../src/strings';
import { palette } from '../src/theme/palette';
import { useThemeColors } from '../src/theme/useThemeColors';

// Tổng kết sau mỗi buổi: số câu đúng, số mục, thời gian, lời động viên, chuỗi ngày học.
// Bản mẫu: 12-tong-ket.
type Tone = 'ok' | 'secondary' | 'primary';
const toneClass: Record<Tone, { face: string; shadow: string; value: string }> = {
  ok: { face: 'border-2 border-ok bg-surface', shadow: 'bg-ok', value: 'text-ok-ink' },
  secondary: { face: 'border-2 border-secondary bg-surface', shadow: 'bg-secondary', value: 'text-secondary-text' },
  primary: { face: 'border-2 border-primary bg-surface', shadow: 'bg-primary', value: 'text-primary-text' },
};

export default function SummaryScreen() {
  const p = useLocalSearchParams<Record<string, string>>();
  const st = useDemoState();
  const c = useThemeColors();
  const num = (k: string) => Number(p[k] ?? 0) || 0;

  const kind = (p.kind ?? 'learn') as SessionKind;
  const lesson = findLesson(num('lessonNo'));
  const autoCorrect = num('autoCorrect');
  const autoTotal = num('autoTotal');
  const selfRemembered = num('selfRemembered');
  const selfTotal = num('selfTotal');
  const itemCount = num('itemCount');
  const minutes = Math.max(1, num('minutes'));

  const title =
    kind === 'learn'
      ? s.summary.titleLearn(num('partNo'))
      : kind === 'review'
        ? s.summary.titleReview
        : kind === 'test'
          ? s.summary.titleTest
          : s.summary.titlePractice;
  const subtitle =
    (kind === 'learn' || kind === 'test') && lesson
      ? s.summary.subtitleLesson(lesson.no, lesson.titleVi)
      : kind === 'review'
        ? s.summary.subtitleReview
        : s.summary.subtitlePractice;

  const correctTile = { value: `${autoCorrect}/${autoTotal}`, label: s.summary.statCorrect, tone: 'ok' as Tone };
  const timeTile = { value: s.summary.minutes(minutes), label: s.summary.statTime, tone: 'primary' as Tone };
  const testRatio = autoTotal > 0 ? autoCorrect / autoTotal : 1;
  const tiles =
    kind === 'learn'
      ? [correctTile, { value: String(itemCount), label: s.summary.statNewItems, tone: 'secondary' as Tone }, timeTile]
      : kind === 'test'
        ? [correctTile, { value: `${Math.round(testRatio * 100)}%`, label: s.summary.statPercent, tone: 'secondary' as Tone }, timeTile]
        : kind === 'review'
          ? [
              autoTotal > 0 ? correctTile : { value: String(itemCount), label: s.summary.statReviewed, tone: 'ok' as Tone },
              { value: `${selfRemembered}/${selfTotal}`, label: s.summary.statRemembered, tone: 'secondary' as Tone },
              timeTile,
            ]
          : [correctTile, { value: String(itemCount), label: s.summary.statPracticed, tone: 'secondary' as Tone }, timeTile];

  const streak = streakDays(st);
  const goal = dailyGoal(st);
  const todayIndex = (new Date().getDay() + 6) % 7; // Thứ Hai là 0
  const week = s.summary.weekdays.map((label, i) => {
    const daysAgo = todayIndex - i;
    const done = i === todayIndex ? st.studiedToday : daysAgo > 0 && daysAgo <= st.streakBeforeToday;
    return { label, done, today: i === todayIndex };
  });

  return (
    <Screen bottom>
      <ScrollView contentContainerClassName="items-center gap-4 px-5 pb-4 pt-12">
        <MascotHero label={s.summary.mascotLabel} mascotHeight={175} boxHeight={200} drumTop={-50} />
        <View className="items-center">
          <Text accessibilityRole="header" className="text-center font-ui-extrabold text-[28px] leading-[36px] text-ink">
            {title}
          </Text>
          <Text className="mt-1 text-center font-ui text-[17px] leading-[24px] text-muted">{subtitle}</Text>
        </View>

        <View className="w-full flex-row gap-2.5">
          {tiles.map((t) => (
            <Block
              key={t.label}
              className="flex-1"
              faceClassName={`items-center gap-0.5 px-1.5 py-3 ${toneClass[t.tone].face}`}
              shadowClassName={toneClass[t.tone].shadow}
            >
              <Text className={`font-ui-extrabold text-[24px] leading-[32px] ${toneClass[t.tone].value}`}>{t.value}</Text>
              <Text className="text-center font-ui text-[15px] text-muted">{t.label}</Text>
            </Block>
          ))}
        </View>

        <View className="w-full rounded-2xl bg-secondary-soft px-4 py-3.5">
          {kind === 'learn' ? (
            <Text className="font-ui text-[17px] leading-[25px] text-ink">
              {s.summary.learnNoteBefore}
              <Text className="font-ui-extrabold text-secondary-text">{s.summary.learnNoteBold(itemCount)}</Text>
              {s.summary.learnNoteAfter}
            </Text>
          ) : (
            <Text className="font-ui text-[17px] leading-[25px] text-ink">
              {kind === 'review'
                ? s.summary.reviewNote
                : kind === 'test'
                  ? testRatio >= learningConfig.testPassRatio
                    ? s.summary.testPassNote
                    : s.summary.testRetryNote
                  : s.summary.practiceNote}
            </Text>
          )}
        </View>

        <View className="w-full gap-3 rounded-2xl border-2 border-line bg-surface px-4 py-3.5">
          <View className="flex-row items-center gap-2.5">
            <Icon name="calendarCheck" color={c['accent-ink']} size={24} strokeWidth={2.2} />
            <Text className="font-ui-extrabold text-[18px] text-accent-ink">{s.summary.streakTitle(streak)}</Text>
          </View>
          <View className="flex-row">
            {week.map((d) => (
              <View key={d.label} className="flex-1 items-center gap-1">
                <View
                  className={`h-[30px] w-[30px] items-center justify-center rounded-full border-2 ${d.done ? 'border-accent bg-accent' : 'border-line bg-surface'}`}
                >
                  {/* Dấu tích luôn tối trên nền vàng, ở cả hai chế độ. */}
                  {d.done && <Icon name="check" color={palette.light.ink} size={16} strokeWidth={3.2} />}
                </View>
                <Text className={`text-[14px] text-muted ${d.today ? 'font-ui-extrabold' : 'font-ui'}`}>{d.label}</Text>
              </View>
            ))}
          </View>
          {goal.done >= goal.total ? (
            <Text className="font-ui text-[16px] text-muted">
              {s.summary.goalDoneBefore}
              <Text className="font-ui-extrabold text-ok-ink">{s.summary.goalDoneBold}</Text>
              {s.summary.goalDoneAfter}
            </Text>
          ) : (
            <Text className="font-ui text-[16px] text-muted">{s.summary.goalLeft(goal.total - goal.done)}</Text>
          )}
        </View>
      </ScrollView>

      <View className="px-5 pb-7 pt-4">
        <BlockButton
          label={s.common.backHome}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        />
      </View>
    </Screen>
  );
}
