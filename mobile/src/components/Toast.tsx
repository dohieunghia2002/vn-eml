import { Text, View } from 'react-native';

// Thông báo ngắn, ví dụ "Đã ghi nhận. Khi có mạng, app sẽ tự gửi đi."
export function Toast({ message, center = false }: { message: string; center?: boolean }) {
  return (
    <View className="rounded-xl bg-toast-bg px-3.5 py-3" accessibilityRole="alert" accessibilityLiveRegion="polite">
      <Text className={`font-ui-semibold text-[16px] leading-[22px] text-toast-ink ${center ? 'text-center' : ''}`}>{message}</Text>
    </View>
  );
}
