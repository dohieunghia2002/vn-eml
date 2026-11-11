import { ScrollView, Text, View } from 'react-native';

import { PageHeader } from '../src/components/PageHeader';
import { Screen } from '../src/components/Screen';
import { strings as s } from '../src/strings';

// Hướng dẫn sử dụng ngắn gọn. TODO: Tuyến đọc lại và chỉnh câu chữ sau đợt dùng thử.
export default function GuideScreen() {
  return (
    <Screen bottom>
      <PageHeader title={s.guide.title} />
      <ScrollView contentContainerClassName="gap-3 px-4 pb-8 pt-1">
        {s.guide.steps.map((step, i) => (
          <View key={step.title} className="flex-row gap-3 rounded-[18px] border-2 border-line bg-surface p-4">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-secondary-soft">
              <Text className="font-ui-extrabold text-[17px] text-secondary-text">{i + 1}</Text>
            </View>
            <View className="flex-1 gap-1">
              <Text className="font-ui-extrabold text-[18px] leading-[25px] text-ink">{step.title}</Text>
              <Text className="font-ui text-[16px] leading-[24px] text-muted">{step.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
