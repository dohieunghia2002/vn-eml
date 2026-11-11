import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { BlockButton } from '../src/components/BlockButton';
import { Icon } from '../src/components/Icon';
import { MascotHero } from '../src/components/Mascot';
import { Screen } from '../src/components/Screen';
import { demoLanguage } from '../src/demo/sampleContent';
import { languageWords, strings as s } from '../src/strings';
import { useThemeColors } from '../src/theme/useThemeColors';

// Màn hình chào khi mở app lần đầu. Bản mẫu: 00-man-hinh-chao.
// Tên app luôn đi kèm dòng phụ, và ghi rõ không phải app của cơ quan nhà nước (CLAUDE.md, mục 1).
export default function WelcomeScreen() {
  const c = useThemeColors();
  const lang = languageWords(demoLanguage);

  return (
    <Screen bottom>
      <ScrollView contentContainerClassName="flex-grow items-center gap-2.5 px-6 pb-2 pt-10">
        <MascotHero label={s.mascotLabel} />
        <Text className="mt-1.5 font-ui-extrabold text-[40px] leading-[50px] tracking-[0.8px] text-ink">{s.appName}</Text>
        <Text className="text-center font-ui-bold text-[19px] leading-[26px] text-muted">{s.tagline}</Text>
        <View className="rounded-full bg-accent-soft px-3.5 py-1">
          <Text className="font-ui-bold text-[15px] text-accent-ink">{s.welcome.available(lang)}</Text>
        </View>
        <View className="mt-2.5 w-full gap-2.5">
          {s.welcome.features.map((f) => (
            <View key={f} className="flex-row items-center gap-3 rounded-[14px] border-2 border-line bg-surface px-3.5 py-2.5">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-secondary-soft">
                <Icon name="check" color={c['secondary-text']} size={18} />
              </View>
              <Text className="flex-1 font-ui-semibold text-[16px] leading-[22px] text-ink">{f}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View className="gap-3 px-6 pb-5 pt-2">
        <BlockButton label={s.welcome.start} onPress={() => router.replace('/download')} />
        <Text className="mt-1 text-center font-ui text-[14px] leading-[20px] text-muted">{s.disclaimer}</Text>
      </View>
    </Screen>
  );
}
