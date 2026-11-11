import { Text, View } from 'react-native';

import { neutral } from '../theme/palette';
import { useThemeColors, type ThemeColors } from '../theme/useThemeColors';
import { Block } from './Block';
import { Icon, type IconName } from './Icon';

// Nút dạng khối (docs/bang-mau.md, "Quy tắc dùng màu").
// Chữ trắng trên nút cam phải từ 17 px trở lên và đậm.
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ok'
  | 'bad'
  | 'outlineSecondary'
  | 'outlineBad'
  | 'neutral';

const variants: Record<
  ButtonVariant | 'disabled',
  { face: string; shadow: string; text: string; icon: keyof ThemeColors | 'white' }
> = {
  primary: { face: 'bg-primary', shadow: 'bg-primary-shadow', text: 'text-white', icon: 'white' },
  secondary: { face: 'bg-secondary', shadow: 'bg-secondary-shadow', text: 'text-white', icon: 'white' },
  ok: { face: 'bg-ok-btn', shadow: 'bg-ok-btn-shadow', text: 'text-white', icon: 'white' },
  bad: { face: 'bg-bad-btn', shadow: 'bg-bad-btn-shadow', text: 'text-white', icon: 'white' },
  outlineSecondary: {
    face: 'border-2 border-secondary bg-surface',
    shadow: 'bg-secondary',
    text: 'text-secondary-text',
    icon: 'secondary-text',
  },
  outlineBad: { face: 'border-2 border-bad bg-surface', shadow: 'bg-bad', text: 'text-bad-ink', icon: 'bad-ink' },
  neutral: { face: 'border-2 border-line bg-surface', shadow: 'bg-line', text: 'text-ink', icon: 'ink' },
  disabled: { face: 'bg-disabled-bg', shadow: 'bg-line', text: 'text-disabled-ink', icon: 'disabled-ink' },
};

type Props = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  sublabel?: string;
  size?: 'lg' | 'md';
  className?: string;
  accessibilityHint?: string;
};

export function BlockButton({
  label,
  onPress,
  variant = 'primary',
  disabled,
  icon,
  iconPosition = 'left',
  sublabel,
  size = 'lg',
  className,
  accessibilityHint,
}: Props) {
  const c = useThemeColors();
  const v = variants[disabled ? 'disabled' : variant];
  const iconColor = v.icon === 'white' ? neutral.white : c[v.icon];
  const iconEl = icon ? <Icon name={icon} color={iconColor} size={size === 'lg' ? 24 : 22} /> : null;

  return (
    <Block
      className={className}
      faceClassName={`${v.face} ${size === 'lg' ? 'min-h-[56px]' : 'min-h-[52px]'} items-center justify-center px-4 py-2`}
      shadowClassName={v.shadow}
      depth={size === 'lg' ? 5 : 4}
      onPress={onPress ?? (() => {})}
      disabled={disabled}
      accessibilityLabel={sublabel ? `${label}. ${sublabel}` : label}
      accessibilityHint={accessibilityHint}
    >
      <View className="flex-row items-center justify-center gap-2.5">
        {iconPosition === 'left' && iconEl}
        <Text className={`font-ui-extrabold text-center ${size === 'lg' ? 'text-[19px] leading-[26px]' : 'text-[17px] leading-[24px]'} ${v.text}`}>
          {label}
        </Text>
        {iconPosition === 'right' && iconEl}
      </View>
      {sublabel ? <Text className={`font-ui-semibold text-[14px] leading-[20px] ${v.text}`}>{sublabel}</Text> : null}
    </Block>
  );
}
