# App VN-EML (Expo)

App Android viết bằng React Native + Expo + TypeScript. Thiết kế: `docs/de-xuat-schema-va-thu-muc.md`.

## Phiên bản đã chốt (10/11/2026)

| Thành phần | Phiên bản | Ghi chú |
|---|---|---|
| Expo SDK | 57 (React Native 0.86) | Chưa dùng SDK 58: tài liệu NativeWind 4.2.7 chỉ ghi hỗ trợ SDK 57, và đang có lỗi mở trên GitHub với SDK 58 |
| NativeWind | 4.2.7 (ghi cố định) | Bản ổn định mới nhất. Bản 5 còn đang thử nghiệm |
| Tailwind CSS | 3.4.19 (ghi cố định) | NativeWind 4 cần Tailwind 3 |

Lên SDK 58 khi NativeWind ghi rõ là hỗ trợ. Trước khi nâng, chạy lại màn hình kiểm tra trên máy thật.

## Chạy thử trên điện thoại

1. Cài **Expo Go dành cho SDK 57** (bản 57.0.9). Bản trên CH Play chỉ chạy SDK mới nhất nên không dùng được; nếu máy đã có thì gỡ ra trước.
   - Mở link sau **bằng trình duyệt trên điện thoại**, tải file (khoảng 209 MB, nên dùng Wi-Fi) rồi bấm cài. Android sẽ hỏi có cho phép cài từ trình duyệt không, chọn cho phép.
     https://github.com/expo/expo-go-releases/releases/download/Expo-Go-57.0.9/Expo-Go-57.0.9.apk
   - Link này lấy từ dữ liệu phiên bản chính thức của Expo (`https://api.expo.dev/v2/versions/latest`, mục `sdkVersions["57.0.0"].androidClientUrl`). Khi đổi SDK thì tra lại ở đó.
2. Trên máy tính:
   ```
   cd mobile
   npm install
   npm start
   ```
3. Mở Expo Go, quét mã QR hiện trong terminal. Điện thoại và máy tính phải dùng chung mạng Wi-Fi. Nếu không quét được, chạy `npx expo start --tunnel`.

App mở màn hình chào, bấm "Bắt đầu học" sẽ sang màn hình tải bài (giả lập), rồi vào trang chính.

## Các màn hình

Dựng theo bản mẫu `mockup/` (số trong ngoặc là tên ảnh trong `mockup/che-do-sang/`).

| File | Màn hình |
|---|---|
| `app/welcome.tsx` | Màn hình chào (00) |
| `app/download.tsx` | Tải bài: đang tải (20), tải xong (21), chưa có mạng (22) |
| `app/(tabs)/index.tsx` | Trang chính: linh vật chào, mục tiêu ngày, ôn tập, lộ trình bài (01, 01b) |
| `app/(tabs)/vocabulary.tsx` | Sổ từ: biểu đồ cấp độ nhớ, lọc, xem mục, báo lỗi (16, 16b) |
| `app/(tabs)/more.tsx` | Thêm: tải bài, giao diện, cỡ chữ, âm báo, báo lỗi chờ gửi (17) |
| `app/lesson/[lessonId]/[partNo].tsx` | Học một phần mới: thẻ làm quen (02), báo lỗi (03), rồi các bài tập |
| `app/lesson/[lessonId]/test.tsx` | Kiểm tra cuối bài (10 câu) |
| `app/review.tsx` | Ôn tập hôm nay: thẻ nhớ (13, 14, 15) và các dạng nhận ra |
| `app/practice.tsx` | Luyện thêm từ Sổ từ, không đổi cấp độ nhớ |
| `app/summary.tsx` | Tổng kết buổi (12) |
| `app/credits.tsx`, `app/guide.tsx`, `app/about.tsx` | Ghi công nguồn, hướng dẫn, giới thiệu |
| `app/dev-check.tsx` | Chỉ cho lập trình viên: font, màu, và nút chuyển các trạng thái mẫu (Sổ từ trống, đã ôn xong, chưa có mạng...). Mở từ cuối mục Thêm |

Các dạng bài tập nằm trong `src/exercises/` (ghép cặp 04–05, nghe chọn nghĩa 06–08, xem chữ chọn âm thanh 09, sắp xếp câu 10–11, thẻ nhớ 13–15). Khuôn câu hỏi chung (thanh tiến độ, nút Kiểm tra, dải phản hồi, hỏi lại câu sai cuối buổi) nằm trong `src/session/SessionRunner.tsx`. Cách chia câu hỏi theo quy tắc cố định nằm trong `src/learning/plan.ts`, thông số trong `src/config/learning.ts`.

## Đang dùng dữ liệu mẫu

- **Nội dung** (`src/demo/sampleContent.ts`): chữ Khmer và phiên âm là ô giữ chỗ `[KM_01]`, `[PHIÊN_ÂM_01]`, hiện bằng font đơn cách trong khung đứt nét để không ai nhầm là chữ thật. Nghĩa tiếng Việt chỉ là ví dụ.
- **Tiến độ** (`src/demo/store.ts`): chỉ nằm trong bộ nhớ, tắt app là mất, và mở app lại sẽ thấy màn hình chào.
- **Âm thanh** (`src/audio/usePlayback.ts`): chỉ giả lập hiệu ứng "Đang phát", chưa phát tiếng.
- **Chưa làm:** cỡ chữ "Rất lớn" (mới ghi nhận lựa chọn), âm báo đúng sai, lưu lựa chọn giao diện sau khi tắt app.
- Bước 6 (tải bài về SQLite) sẽ thay cả thư mục `src/demo/` bằng dữ liệu và tiến độ thật.

## Lệnh hay dùng

| Lệnh | Việc |
|---|---|
| `npm start` | Chạy app ở chế độ phát triển |
| `npm run typecheck` | Kiểm tra lỗi kiểu TypeScript |
| `npx expo install <gói>` | Cài thư viện đúng phiên bản hợp với SDK. Nhớ hỏi trước khi thêm thư viện ngoài danh sách đã duyệt |
| `npx expo install --check` | Kiểm tra phiên bản các gói có khớp với SDK không |

## Quy ước

- **Màu:** chỉ dùng tên vai trò (`bg-primary`, `text-ink`, `border-line`...). Mã màu nằm duy nhất trong `src/theme/palette.js`. Bảng màu mặc định của Tailwind (`bg-red-500`...) đã bị tắt. Một class tự đổi màu theo chế độ sáng/tối, không cần viết `dark:`.
- **Font:** dùng `font-ui`, `font-ui-semibold`, `font-ui-bold`, `font-ui-extrabold` cho tiếng Việt; `font-target`, `font-target-bold` cho chữ của ngôn ngữ đang học. **Không dùng `font-bold`, `font-semibold`**: trên Android chúng không chuyển sang file font đậm.
- **Chữ giao diện:** nằm trong `src/strings.ts`, viết theo `docs/cau-chu-giao-dien.md`.
- **Chữ Khmer:** không cắt chuỗi theo ký tự; để `<Text numberOfLines>` tự cắt (CLAUDE.md, mục 6).
- **Giá trị tính lúc chạy** (độ rộng thanh tiến độ...) thì dùng prop `style`.
- **Class viết đủ chữ:** NativeWind chỉ tạo style cho class nhìn thấy nguyên văn trong mã. Viết `isOn ? 'bg-secondary' : 'bg-surface'`, không ghép chuỗi kiểu `` `bg-${tone}` ``.
- **Nút và ô dạng khối:** dùng `src/components/Block.tsx`, `BlockButton.tsx`, `OptionTile.tsx`, không tự làm bóng bằng `shadow-*`.
- **Biểu tượng:** dùng `src/components/Icon.tsx` (vẽ bằng `react-native-svg`, chép từ bản mẫu). Màu biểu tượng lấy từ `useThemeColors()`.
- **Không đặt linh vật và hoa văn trống đồng trong màn hình làm bài tập** (docs/linh-vat.md).
