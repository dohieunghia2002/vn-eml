import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useThemeColors } from '../theme/useThemeColors';

// Vòng tròn "Mục tiêu hôm nay" ở trang chính.
type Props = { done: number; total: number; accessibilityLabel: string; size?: number };

export function ProgressRing({ done, total, accessibilityLabel, size = 60 }: Props) {
  const c = useThemeColors();
  const r = 26;
  const circumference = 2 * Math.PI * r;
  const ratio = total > 0 ? Math.min(done / total, 1) : 0;

  return (
    <View style={{ width: size, height: size }} accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <Svg width={size} height={size} viewBox="0 0 64 64">
        <Circle cx={32} cy={32} r={r} fill="none" stroke={c.line} strokeWidth={8} />
        {ratio > 0 && (
          <Circle
            cx={32}
            cy={32}
            r={r}
            fill="none"
            stroke={c.accent}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={`${circumference * ratio} ${circumference}`}
            transform="rotate(-90 32 32)"
          />
        )}
      </Svg>
      <View className="absolute inset-0 items-center justify-center">
        <Text className="font-ui-extrabold text-[17px] text-ink">
          {done}/{total}
        </Text>
      </View>
    </View>
  );
}
