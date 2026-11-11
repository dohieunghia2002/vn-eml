import { useColorScheme } from 'nativewind';

import { palette } from './palette';

export type ThemeColors = typeof palette.light;

// Mã màu của chế độ đang dùng, cho những chỗ không dùng được class: biểu tượng SVG,
// màu chữ gợi ý trong ô nhập. Vẫn đọc từ bảng màu, không viết thẳng mã màu.
export function useThemeColors(): ThemeColors {
  const { colorScheme } = useColorScheme();
  return colorScheme === 'dark' ? palette.dark : palette.light;
}

export function useIsDark(): boolean {
  return useColorScheme().colorScheme === 'dark';
}
