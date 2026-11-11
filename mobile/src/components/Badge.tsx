import { Text, View } from 'react-native';

// Nhãn nhỏ bo tròn: "TỪ MỚI", "ÔN TẬP", "Cấp độ nhớ 3", "Cấp 5"...
type Tone = 'accent' | 'secondary' | 'secondarySolid';

const tones: Record<Tone, { bg: string; text: string }> = {
  accent: { bg: 'bg-accent-soft', text: 'text-accent-ink' },
  secondary: { bg: 'bg-secondary-soft', text: 'text-secondary-text' },
  secondarySolid: { bg: 'bg-secondary', text: 'text-white' },
};

type Props = {
  label: string;
  tone?: Tone;
  /** 'md': chữ in hoa giãn cách (TỪ MỚI, ÔN TẬP); 'sm': nhãn cấp độ. */
  size?: 'md' | 'sm';
  /** Ví dụ 'self-start' khi đặt trong cột, để nhãn không giãn hết bề ngang. */
  className?: string;
};

export function Badge({ label, tone = 'accent', size = 'md', className = '' }: Props) {
  const t = tones[tone];
  return (
    <View className={`rounded-full px-3 py-1 ${t.bg} ${className}`}>
      <Text className={`font-ui-extrabold text-[14px] ${size === 'md' ? 'tracking-[0.7px]' : ''} ${t.text}`}>{label}</Text>
    </View>
  );
}
