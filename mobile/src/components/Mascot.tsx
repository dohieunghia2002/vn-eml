import { Image, View } from 'react-native';

import { useIsDark } from '../theme/useThemeColors';

// Linh vật chim Lạc: một hình cho mọi chỗ (CLAUDE.md, mục 1). Toàn thân đặt trước mặt
// trống đồng; cận cảnh đầu trong vòng tròn ở trang chính (docs/linh-vat.md).
// TODO: hình mặt trống đồng chưa rõ nguồn và giấy phép (docs/bang-mau.md).
const mascot = require('../../assets/images/chim-lac.png');
const drumLight = require('../../assets/images/trong-dong-sang.png');
const drumDark = require('../../assets/images/trong-dong-toi.png');

const MASCOT_RATIO = 331 / 541;

type HeroProps = {
  label: string;
  mascotHeight?: number;
  boxHeight?: number;
  /** Mặt trống đồng rộng 300 px, lệch lên trên bao nhiêu so với khung. */
  drumTop?: number;
};

export function MascotHero({ label, mascotHeight = 200, boxHeight = 215, drumTop = -42 }: HeroProps) {
  const dark = useIsDark();
  return (
    <View className="w-[260px] items-center justify-center" style={{ height: boxHeight }}>
      <Image
        source={dark ? drumDark : drumLight}
        style={{ position: 'absolute', left: -20, top: drumTop, width: 300, height: 300, opacity: dark ? 0.4 : 0.35 }}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <Image
        source={mascot}
        style={{ height: mascotHeight, width: mascotHeight * MASCOT_RATIO }}
        accessible
        accessibilityRole="image"
        accessibilityLabel={label}
      />
    </View>
  );
}

export function MascotHead({ label }: { label: string }) {
  const width = 139;
  return (
    <View
      className="h-[84px] w-[84px] overflow-hidden rounded-full border-[3px] border-line bg-surface"
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
    >
      <Image source={mascot} style={{ position: 'absolute', width, height: width / MASCOT_RATIO, left: -44, top: -10 }} />
    </View>
  );
}
