import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Khung màn hình: nền theo chế độ sáng/tối, chừa vùng tai thỏ và thanh điều hướng của máy
// (Android mới hiển thị tràn viền).
type Props = { children: ReactNode; top?: boolean; bottom?: boolean };

export function Screen({ children, top = true, bottom = false }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: top ? insets.top : 0, paddingBottom: bottom ? insets.bottom : 0 }}>
      {children}
    </View>
  );
}
