const { neutral, roleNames, cssVarsFor } = require('./src/theme/palette');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    // Thay hẳn bảng màu mặc định của Tailwind: chỉ dùng được tên vai trò (bg-primary, text-ink...).
    // Mã màu nằm trong src/theme/palette.js. Màu đổi theo chế độ sáng/tối qua biến CSS,
    // do app/_layout.tsx đặt bằng vars().
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: neutral.white,
      black: neutral.black,
      ...Object.fromEntries(
        roleNames.map((name) => [name, `rgb(var(--color-${name}) / <alpha-value>)`]),
      ),
    },
    extend: {
      // Mỗi độ đậm là một font riêng. KHÔNG dùng font-bold / font-semibold: trên Android
      // chúng không chuyển sang file font đậm của font tự đóng gói.
      // Tên phải khớp khoá trong src/theme/fonts.ts.
      fontFamily: {
        ui: ['BeVietnamPro-Regular'],
        'ui-semibold': ['BeVietnamPro-SemiBold'],
        'ui-bold': ['BeVietnamPro-Bold'],
        'ui-extrabold': ['BeVietnamPro-ExtraBold'],
        // Font cho chữ của ngôn ngữ đang học. MVP: tiếng Khmer (Noto Sans Khmer).
        target: ['NotoSansKhmer-Regular'],
        'target-bold': ['NotoSansKhmer-Bold'],
        // Chỉ dùng cho ô giữ chỗ [KM_..] khi chưa có nội dung thật (font đơn cách có sẵn trên Android).
        placeholder: ['monospace'],
      },
    },
  },
  plugins: [
    // Giá trị mặc định (chế độ sáng), phòng khi một màn hình nằm ngoài khung đặt biến của _layout.
    ({ addBase }) => addBase({ ':root': cssVarsFor('light') }),
  ],
};
