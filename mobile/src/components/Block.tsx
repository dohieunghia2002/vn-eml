import type { ReactNode } from 'react';
import { Pressable, View, type AccessibilityRole, type AccessibilityState } from 'react-native';

// Khối nổi kiểu bản mẫu: mặt khối nằm trên một lớp "bóng" đậm hơn, dày vài px.
// Bấm vào thì mặt khối lún xuống. Làm bằng hai lớp View thay cho box-shadow để
// hiển thị giống nhau trên mọi máy Android, kể cả máy cũ.
//
// Các class truyền vào phải là chuỗi viết sẵn đầy đủ (ví dụ 'bg-primary-shadow'),
// không ghép chuỗi kiểu `bg-${x}`, vì NativeWind chỉ tạo style cho class nhìn thấy trong mã.
type Props = {
  children: ReactNode | ((pressed: boolean) => ReactNode);
  faceClassName: string;
  shadowClassName: string;
  roundedClassName?: string;
  depth?: number;
  className?: string;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityState?: AccessibilityState;
};

export function Block({
  children,
  faceClassName,
  shadowClassName,
  roundedClassName = 'rounded-2xl',
  depth = 4,
  className,
  onPress,
  disabled,
  accessibilityRole = 'button',
  accessibilityLabel,
  accessibilityHint,
  accessibilityState,
}: Props) {
  const render = (pressed: boolean) => (
    <View
      className={`${roundedClassName} ${shadowClassName}`}
      style={{ paddingBottom: pressed ? 0 : depth, marginTop: pressed ? depth : 0 }}
    >
      <View className={`${roundedClassName} ${faceClassName}`}>
        {typeof children === 'function' ? children(pressed) : children}
      </View>
    </View>
  );

  if (!onPress) {
    return <View className={className}>{render(false)}</View>;
  }

  return (
    <Pressable
      className={className}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled, ...accessibilityState }}
    >
      {({ pressed }) => render(pressed && !disabled)}
    </Pressable>
  );
}
