import { Pressable, Text, View } from 'react-native';

import { strings as s } from '../strings';
import { neutral } from '../theme/palette';
import { useThemeColors } from '../theme/useThemeColors';
import { Block } from './Block';
import { EqBars } from './EqBars';
import { Icon } from './Icon';

// Nút loa. Ba kiểu theo bản mẫu:
// - hero: nút tròn lớn ở giữa màn hình (nghe chọn nghĩa, thẻ nhớ).
// - round: nút tròn nhỏ (Sổ từ, sắp xếp câu).
// - pill: nút dài "Nghe lại" / "Đang phát" (thẻ làm quen, mặt sau thẻ nhớ).
type Props = {
  playing: boolean;
  onPress: () => void;
  accessibilityLabel: string;
  variant: 'hero' | 'round' | 'pill';
  /** Cỡ nút tròn (px). */
  size?: number;
  /** Chữ trên nút dài khi không phát. */
  label?: string;
};

export function SpeakerButton({ playing, onPress, accessibilityLabel, variant, size, label }: Props) {
  const c = useThemeColors();

  if (variant === 'pill') {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        className="min-h-[56px] flex-row items-center gap-2.5 self-center rounded-full border-2 border-secondary bg-secondary-soft px-6 active:opacity-80"
      >
        {playing ? <EqBars color={c['secondary-text']} /> : <Icon name="speaker" color={c['secondary-text']} />}
        <Text className="font-ui-extrabold text-[18px] text-secondary-text">{playing ? s.common.playing : (label ?? s.common.listenAgain)}</Text>
      </Pressable>
    );
  }

  const d = size ?? (variant === 'hero' ? 112 : 44);
  const big = variant === 'hero';
  return (
    <Block
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      faceClassName="items-center justify-center bg-secondary"
      shadowClassName="bg-secondary-shadow"
      roundedClassName="rounded-full"
      depth={big ? 7 : 3}
      className="self-center"
    >
      <View style={{ width: d, height: d }} className="items-center justify-center">
        {playing ? (
          <EqBars color={neutral.white} size={big ? 'lg' : 'sm'} />
        ) : (
          <Icon name={big ? 'speaker' : 'speakerSmall'} color={neutral.white} size={big ? Math.round(d * 0.43) : Math.round(d * 0.46)} strokeWidth={big ? 2 : 2.2} />
        )}
      </View>
    </Block>
  );
}
