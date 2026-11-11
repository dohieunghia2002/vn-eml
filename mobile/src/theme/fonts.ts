// Font đóng gói sẵn trong app (không phụ thuộc font của máy).
// Khoá = tên font dùng trong tailwind.config.js (fontFamily), và trùng tên PostScript của file.
// Nguồn và giấy phép: assets/fonts/README.md
export const fontAssets = {
  'BeVietnamPro-Regular': require('../../assets/fonts/BeVietnamPro-Regular.ttf'),
  'BeVietnamPro-SemiBold': require('../../assets/fonts/BeVietnamPro-SemiBold.ttf'),
  'BeVietnamPro-Bold': require('../../assets/fonts/BeVietnamPro-Bold.ttf'),
  'BeVietnamPro-ExtraBold': require('../../assets/fonts/BeVietnamPro-ExtraBold.ttf'),
  'NotoSansKhmer-Regular': require('../../assets/fonts/NotoSansKhmer-Regular.ttf'),
  'NotoSansKhmer-Bold': require('../../assets/fonts/NotoSansKhmer-Bold.ttf'),
};
