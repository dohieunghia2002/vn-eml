import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

/** Trượt từ dưới lên khi xuất hiện (0,22 giây), dùng cho dải phản hồi và bảng trượt. */
export function useSlideUp(distance = 260) {
  const y = useRef(new Animated.Value(distance)).current;
  useEffect(() => {
    Animated.timing(y, { toValue: 0, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, [y]);
  return { transform: [{ translateY: y }] };
}
