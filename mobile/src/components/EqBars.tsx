import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

// Ba vạch nhấp nhô báo "đang phát âm thanh". Hiệu ứng nhẹ, chạy trên luồng giao diện gốc.
type Props = { color: string; size?: 'sm' | 'md' | 'lg' };

const dims = {
  sm: { w: 4, h: 20, gap: 4 },
  md: { w: 5, h: 26, gap: 4 },
  lg: { w: 6, h: 34, gap: 6 },
};

export function EqBars({ color, size = 'sm' }: Props) {
  const bars = useRef([0, 1, 2].map(() => new Animated.Value(0.35))).current;
  const d = dims[size];

  useEffect(() => {
    const loops = bars.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(v, { toValue: 1, duration: 400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(v, { toValue: 0.35, duration: 400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ]),
      ),
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [bars]);

  return (
    <View className="flex-row items-center" style={{ height: d.h + 2, gap: d.gap }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {bars.map((v, i) => (
        <Animated.View
          key={i}
          style={{ width: d.w, height: d.h, borderRadius: d.w / 2, backgroundColor: color, transform: [{ scaleY: v }] }}
        />
      ))}
    </View>
  );
}
