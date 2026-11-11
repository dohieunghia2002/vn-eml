import Constants from 'expo-constants';
import { ScrollView, Text, View } from 'react-native';

import { MascotHero } from '../src/components/Mascot';
import { PageHeader } from '../src/components/PageHeader';
import { Screen } from '../src/components/Screen';
import { demoLanguage } from '../src/demo/sampleContent';
import { languageWords, strings as s } from '../src/strings';

// Giới thiệu app. Luôn ghi rõ không phải app của cơ quan nhà nước (CLAUDE.md, mục 1).
// TODO: Tuyến bổ sung thông tin nhóm và cách liên hệ.
export default function AboutScreen() {
  const version = Constants.expoConfig?.version ?? '1.0.0';
  return (
    <Screen bottom>
      <PageHeader title={s.about.title} />
      <ScrollView contentContainerClassName="items-center gap-3 px-5 pb-8 pt-4">
        <MascotHero label={s.mascotLabel} mascotHeight={170} boxHeight={190} drumTop={-55} />
        <Text className="font-ui-extrabold text-[30px] leading-[38px] text-ink">{s.appName}</Text>
        <Text className="text-center font-ui-bold text-[18px] text-muted">{s.tagline}</Text>
        <View className="mt-2 w-full gap-3 rounded-[18px] border-2 border-line bg-surface p-4">
          <Text className="font-ui text-[17px] leading-[25px] text-ink">{s.about.body}</Text>
          <Text className="font-ui-semibold text-[17px] leading-[25px] text-ink">{s.about.current(languageWords(demoLanguage))}</Text>
        </View>
        <View className="w-full rounded-[18px] bg-accent-soft px-4 py-3.5">
          <Text className="font-ui-semibold text-[16px] leading-[23px] text-accent-ink">{s.disclaimer}</Text>
        </View>
        <Text className="font-ui text-[14px] text-muted">{s.more.version(version)}</Text>
      </ScrollView>
    </Screen>
  );
}
