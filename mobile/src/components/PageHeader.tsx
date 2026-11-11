import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { strings as s } from '../strings';
import { useThemeColors } from '../theme/useThemeColors';
import { Icon } from './Icon';

// Tiêu đề của các trang phụ (ghi công, hướng dẫn, giới thiệu), có nút quay lại.
export function PageHeader({ title }: { title: string }) {
  const c = useThemeColors();
  return (
    <View className="flex-row items-center gap-1 px-2 pb-2 pt-3">
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel={s.common.back}
        className="h-12 w-12 items-center justify-center rounded-xl active:bg-line"
      >
        <Icon name="chevronLeft" color={c.ink} size={26} />
      </Pressable>
      <Text accessibilityRole="header" className="flex-1 font-ui-extrabold text-[22px] text-ink">
        {title}
      </Text>
    </View>
  );
}
