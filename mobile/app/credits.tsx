import { ScrollView, Text, View } from 'react-native';

import { PageHeader } from '../src/components/PageHeader';
import { Screen } from '../src/components/Screen';
import { strings as s } from '../src/strings';

// Trang ghi công nguồn tài liệu (CLAUDE.md, mục 3, nguyên tắc 5).
// TODO(content): khi có nội dung đã duyệt, liệt kê nguồn và giấy phép lấy từ cột source,
// licence của các mục (ví dụ sách Basic Khmer, giấy phép CC BY-NC 4.0, nếu có dùng).
// TODO: bổ sung nguồn và giấy phép của hình mặt trống đồng (docs/bang-mau.md).
export default function CreditsScreen() {
  return (
    <Screen bottom>
      <PageHeader title={s.credits.title} />
      <ScrollView contentContainerClassName="gap-4 px-4 pb-8 pt-1">
        <Section title={s.credits.contentTitle} lines={[s.credits.contentBody, s.credits.contentTodo]} />
        <Section title={s.credits.fontsTitle} lines={[s.credits.fontBeVietnam, s.credits.fontNoto]} />
        <Section title={s.credits.imagesTitle} lines={[s.credits.mascot, s.credits.drumTodo]} />
      </ScrollView>
    </Screen>
  );
}

function Section({ title, lines }: { title: string; lines: string[] }) {
  return (
    <View className="gap-2 rounded-[18px] border-2 border-line bg-surface p-4">
      <Text accessibilityRole="header" className="font-ui-extrabold text-[18px] text-ink">
        {title}
      </Text>
      {lines.map((l) => (
        <Text key={l} className="font-ui text-[16px] leading-[24px] text-muted">
          {l}
        </Text>
      ))}
    </View>
  );
}
