import { Text, View } from 'react-native';

// Chữ của ngôn ngữ đang học (MVP: tiếng Khmer), dùng font đóng gói sẵn, cỡ lớn và giãn dòng
// rộng vì chữ Khmer có phụ âm chân xếp chồng (docs/lo-trinh-hoc-tap.md, mục 10).
// Không cắt chuỗi: nếu cần rút gọn thì dùng numberOfLines (CLAUDE.md, mục 6).
//
// Khi chưa có nội dung thật, ô giữ chỗ dạng [KM_01] được hiện bằng font đơn cách, có khung
// đứt nét như bản mẫu, để không ai nhầm là chữ thật.
type Size = 'xl' | 'lg' | 'md' | 'sm';

const realSizes: Record<Size, string> = {
  xl: 'text-[30px] leading-[54px]',
  lg: 'text-[28px] leading-[50px]',
  md: 'text-[22px] leading-[40px]',
  sm: 'text-[18px] leading-[32px]',
};

const placeholderSizes: Record<Size, string> = {
  xl: 'text-[26px] leading-[44px]',
  lg: 'text-[24px] leading-[40px]',
  md: 'text-[17px] leading-[26px]',
  sm: 'text-[16px] leading-[24px]',
};

export function isPlaceholder(text: string): boolean {
  return /^(\[[^\]]+\]\s*)+$/.test(text.trim());
}

type Props = {
  text: string;
  size?: Size;
  /** Lớp màu chữ, ví dụ 'text-ink', 'text-ok-ink'. */
  colorClassName?: string;
  /** Khung đứt nét quanh ô giữ chỗ (dùng ở thẻ lớn). */
  framed?: boolean;
  bold?: boolean;
  numberOfLines?: number;
};

export function TargetText({ text, size = 'md', colorClassName = 'text-ink', framed = false, bold = false, numberOfLines }: Props) {
  if (isPlaceholder(text)) {
    const label = (
      <Text
        numberOfLines={numberOfLines}
        className={`font-placeholder ${placeholderSizes[size]} ${framed ? 'text-muted' : colorClassName}`}
      >
        {text}
      </Text>
    );
    if (!framed) return label;
    return <View className="rounded-xl border-2 border-dashed border-muted px-4 py-1">{label}</View>;
  }
  return (
    <Text numberOfLines={numberOfLines} className={`${bold ? 'font-target-bold' : 'font-target'} ${realSizes[size]} ${colorClassName}`}>
      {text}
    </Text>
  );
}
