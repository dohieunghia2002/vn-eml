# Font đóng gói trong app

Cả hai font dùng giấy phép **SIL Open Font License 1.1** (OFL): được dùng, đóng gói và phát hành kèm app, kể cả mục đích thương mại. Bản giấy phép nằm cạnh file font. Trang ghi công nguồn trong app cần liệt kê hai font này.

| File | Font | Nguồn | Phiên bản |
|---|---|---|---|
| `BeVietnamPro-Regular.ttf`, `-SemiBold`, `-Bold`, `-ExtraBold` | Be Vietnam Pro (chữ giao diện tiếng Việt, theo bản mẫu) | https://github.com/google/fonts/tree/main/ofl/bevietnampro | Bản trên Google Fonts, tải ngày 10/11/2026 |
| `NotoSansKhmer-Regular.ttf`, `-Bold` | Noto Sans Khmer (chữ Khmer) | https://github.com/notofonts/khmer/releases/tag/NotoSansKhmer-v2.004 (thư mục `unhinted/ttf`) | v2.004 |

- Mỗi độ đậm là một file riêng. React Native không dùng được font biến thiên (variable font).
- Tên file trùng tên PostScript trong font, như tài liệu NativeWind yêu cầu.
- Noto Sans Khmer dùng bản không hinting cho nhẹ (khoảng 68 KB mỗi file). Android gần như không dùng thông tin hinting.
- Thêm độ đậm mới: chép file vào đây, thêm vào `src/theme/fonts.ts` và `fontFamily` trong `tailwind.config.js`.
