import { Pressable, Text, View } from 'react-native';

import { useThemeColors } from '../theme/useThemeColors';
import { Icon } from './Icon';
import { ProgressBar } from './ProgressBar';

// Phần trên cùng của khuôn câu hỏi chung: nút thoát, thanh tiến độ, số câu.
type Props = {
  current: number;
  total: number;
  tone: 'primary' | 'accent';
  onClose: () => void;
  closeLabel: string;
  progressLabel: string;
};

export function SessionHeader({ current, total, tone, onClose, closeLabel, progressLabel }: Props) {
  const c = useThemeColors();
  return (
    <View className="flex-row items-center gap-3 px-4 py-3">
      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel={closeLabel}
        hitSlop={6}
        className="h-11 w-11 items-center justify-center rounded-xl active:bg-line"
      >
        <Icon name="close" color={c.muted} size={26} />
      </Pressable>
      <ProgressBar value={total > 0 ? current / total : 0} tone={tone} accessibilityLabel={progressLabel} />
      <Text className="font-ui-bold text-[15px] text-muted">
        {current}/{total}
      </Text>
    </View>
  );
}
