import { View } from 'react-native';

type Props = {
  /** Từ 0 đến 1. */
  value: number;
  tone?: 'primary' | 'accent';
  heightClassName?: string;
  accessibilityLabel?: string;
};

export function ProgressBar({ value, tone = 'primary', heightClassName = 'h-[14px]', accessibilityLabel }: Props) {
  const pct = Math.round(Math.min(Math.max(value, 0), 1) * 100);
  return (
    <View
      className={`flex-1 overflow-hidden rounded-full bg-line ${heightClassName}`}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: pct }}
    >
      {/* Độ rộng tính lúc chạy nên dùng style (CLAUDE.md, mục 5). */}
      <View className={`h-full rounded-full ${tone === 'accent' ? 'bg-accent' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
    </View>
  );
}
