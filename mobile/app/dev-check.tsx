import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { BlockButton } from '../src/components/BlockButton';
import { PageHeader } from '../src/components/PageHeader';
import { Screen } from '../src/components/Screen';
import { demoActions, useDemoState, type ThemeChoice } from '../src/demo/store';
import { KHMER_FONT_TEST_TEXT } from '../src/dev/fontTestText';
import { devStrings as d, strings as s } from '../src/strings';

// Màn hình kiểm tra cho lập trình viên: màu, font, chế độ sáng/tối và các trạng thái mẫu
// (Sổ từ trống, đã ôn xong, chưa có mạng...). Chỉ mở được từ mục Thêm ở bản phát triển.

const schemeChoices: { value: ThemeChoice; label: string }[] = [
  { value: 'system', label: s.more.themeSystem },
  { value: 'light', label: s.more.themeLight },
  { value: 'dark', label: s.more.themeDark },
];

const uiWeights = [
  { className: 'font-ui', label: d.weightRegular },
  { className: 'font-ui-semibold', label: d.weightSemiBold },
  { className: 'font-ui-bold', label: d.weightBold },
  { className: 'font-ui-extrabold', label: d.weightExtraBold },
];

const swatches = [
  { className: 'bg-primary', name: 'primary' },
  { className: 'bg-secondary', name: 'secondary' },
  { className: 'bg-accent', name: 'accent' },
  { className: 'bg-ok', name: 'ok' },
  { className: 'bg-bad', name: 'bad' },
  { className: 'bg-pattern', name: 'pattern' },
];

// Hermes (engine JavaScript của app) chưa có Intl.Segmenter: đã kiểm tra trên máy thật ngày 11/11/2026.
const hasSegmenter = typeof Intl !== 'undefined' && 'Segmenter' in Intl;

export default function DevCheck() {
  const { setColorScheme } = useColorScheme();
  const st = useDemoState();
  const reviewDone = st.reviewedToday > 0;

  return (
    <Screen bottom>
      <PageHeader title={d.title} />
      <ScrollView contentContainerClassName="gap-5 px-4 pb-10 pt-1">
        <Text className="font-ui text-[15px] leading-[22px] text-muted">{d.note}</Text>

        <View className="gap-2">
          <Text className="font-ui-extrabold text-[18px] text-ink">{s.more.theme}</Text>
          <View className="flex-row gap-2">
            {schemeChoices.map((c) => (
              <Pressable
                key={c.value}
                onPress={() => {
                  demoActions.setThemeChoice(c.value);
                  setColorScheme(c.value);
                }}
                accessibilityRole="button"
                className={`min-h-[48px] flex-1 items-center justify-center rounded-xl border-2 ${st.themeChoice === c.value ? 'border-secondary bg-secondary-soft' : 'border-line bg-surface'}`}
              >
                <Text className="font-ui-bold text-[16px] text-ink">{c.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="gap-3">
          <Text className="font-ui-extrabold text-[18px] text-ink">{d.demoTitle}</Text>
          <BlockButton
            size="md"
            variant="neutral"
            label={d.showWelcome}
            onPress={() => {
              demoActions.showWelcomeAgain();
              router.replace('/welcome');
            }}
          />
          <BlockButton
            size="md"
            variant="neutral"
            label={d.showOffline}
            onPress={() => {
              demoActions.setOfflineDemo(true);
              router.push('/download');
            }}
          />
          <BlockButton
            size="md"
            variant="neutral"
            label={st.vocabularyEmptyDemo ? d.vocabEmptyOff : d.vocabEmptyOn}
            onPress={() => demoActions.setVocabularyEmptyDemo(!st.vocabularyEmptyDemo)}
          />
          <BlockButton
            size="md"
            variant="neutral"
            label={reviewDone ? d.reviewDoneOff : d.reviewDoneOn}
            onPress={() => demoActions.setReviewDone(!reviewDone)}
          />
          <BlockButton size="md" variant="neutral" label={d.openTest} onPress={() => router.push('/lesson/1/test')} />
          <BlockButton size="md" variant="outlineBad" label={d.resetProgress} onPress={() => demoActions.resetProgress()} />
        </View>

        <View className="gap-2 rounded-2xl border-2 border-line bg-surface p-4">
          <Text className="font-ui-extrabold text-[18px] text-ink">{d.fontsUi}</Text>
          {uiWeights.map((w) => (
            <View key={w.className}>
              <Text className="font-ui text-[13px] text-muted">{w.label}</Text>
              <Text className={`${w.className} text-[17px] leading-[24px] text-ink`}>{d.sampleVi}</Text>
            </View>
          ))}
        </View>

        <View className="gap-2 rounded-2xl border-2 border-line bg-surface p-4">
          <Text className="font-ui-extrabold text-[18px] text-ink">{d.fontsTarget}</Text>
          <Text className="font-ui text-[13px] text-muted">{d.weightRegular}</Text>
          <Text className="font-target text-[28px] leading-[50px] text-ink">{KHMER_FONT_TEST_TEXT}</Text>
          <Text className="font-ui text-[13px] text-muted">{d.weightBold}</Text>
          <Text className="font-target-bold text-[28px] leading-[50px] text-ink">{KHMER_FONT_TEST_TEXT}</Text>
          <Text className="font-ui text-[15px] text-muted">
            {d.segmenter}: {hasSegmenter ? d.yes : d.no}
          </Text>
        </View>

        <View className="gap-2">
          <Text className="font-ui-extrabold text-[18px] text-ink">{d.colors}</Text>
          <View className="flex-row flex-wrap gap-2">
            {swatches.map((c) => (
              <View key={c.name} className="items-center gap-1">
                <View className={`h-12 w-12 rounded-xl border border-line ${c.className}`} />
                <Text className="font-ui text-[12px] text-muted">{c.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
