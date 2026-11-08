# Bối cảnh dự án: VN-EML, app học tiếng dân tộc thiểu số cho cán bộ (MVP: tiếng Khmer Nam Bộ)

## 1. Dự án là gì
- Ứng dụng di động viết bằng React Native (làm cho Android trước) giúp **cán bộ cấp xã, công an, giáo viên, nhân viên y tế** học **tiếng Khmer Nam Bộ** để giao tiếp với đồng bào Khmer ở Việt Nam.
- Bài học theo **tình huống công việc thật**, không dạy tiếng Khmer học thuật hay giọng Campuchia.
- Dự án dự thi khởi nghiệp. Lộ trình 12 tuần: 2/11/2026 → 24/1/2027.
- **Tên chính thức: VN-EML** (EML viết tắt của Ethnic Minority Languages, tức tiếng dân tộc thiểu số), chốt ngày 7/11/2026.
  - Trên CH Play và màn hình chào, tên app luôn đi kèm dòng phụ "Học tiếng dân tộc thiểu số" để người dùng hiểu ngay app là gì.
  - Phần giới thiệu app và trang CH Play ghi rõ đây là sản phẩm của nhóm khởi nghiệp, không phải ứng dụng của cơ quan nhà nước. Lý do: tên đặt theo kiểu VNeID, lại có linh vật chim Lạc, nên dễ bị hiểu nhầm là app chính thức.
- **Định hướng dài hạn (ghi nhận ngày 7/11/2026):** app học **nhiều tiếng dân tộc thiểu số**, không chỉ tiếng Khmer. MVP 12 tuần vẫn chỉ làm tiếng Khmer Nam Bộ. Vì vậy:
  - Nhận diện thương hiệu (tên app, màu sắc, linh vật) không gắn riêng với văn hoá Khmer.
  - **Linh vật: chim Lạc** (nhóm chốt ngày 7/11/2026, vì giá trị văn hoá và tinh thần dân tộc).
    - Vẽ mới, lấy cảm hứng từ hoa văn chim Lạc trên trống đồng Đông Sơn.
    - Không sao chép con chim gỗ trong MV "Come My Way" của Sơn Tùng M-TP, vì đó là thiết kế có bản quyền của ê-kíp MV.
    - Ngày 8/11/2026 nhóm quyết định **tạo hình linh vật bằng công cụ AI sinh ảnh**. Prompt và lưu ý nằm trong `docs/linh-vat.md`. Đây là ngoại lệ duy nhất về AI. Nó chỉ áp dụng cho hình ảnh thương hiệu, không áp dụng cho nội dung dạy hay tính năng của app.
    - **Hình dùng trong MVP:** `mockup/linh-vat/chim-lac-chinh-thuc.png` (chim nhìn từ bên cạnh, nền trong suốt). Chỉ dùng **một hình cho mọi chỗ**: cận cảnh đầu trong vòng tròn ở trang chính, toàn thân ở các màn hình khác. Cảm xúc thể hiện bằng lời trong bóng thoại.
    - Sau MVP: thuê người vẽ lại thành vector (SVG) đúng mã màu, và vẽ thêm 5–6 biểu cảm.
  - Schema và code không gắn cứng vào tiếng Khmer. Mỗi bài thuộc một ngôn ngữ, và tên cột trong cơ sở dữ liệu đặt chung chung, không dùng tên riêng của tiếng Khmer.

## 2. Đội ngũ
- **Hiếu Nghĩa:** trưởng nhóm, lập trình viên chính. Bạn đang làm việc với người này.
- **2 kỹ sư thuê ngoài:** cùng phát triển app, quen React Native. Họ cũng phải tuân thủ mọi nguyên tắc trong file này.
- **Trương Chấn Huy:** phụ trách nội dung. Làm việc với cộng tác viên người Khmer, soạn bài, quản lý thu âm, nhập nội dung vào Google Sheet.
- **Diệp Nguyễn Minh Tuyến:** phụ trách người dùng và hồ sơ thi. Không đụng vào code.

## 3. Nguyên tắc bắt buộc (không được vi phạm)
1. **Không dùng AI cho nội dung dạy.** Không dùng LLM để tạo, dịch hay chấm nội dung. Không dùng TTS hay máy dịch cho tiếng Khmer. Mọi chữ Khmer, phiên âm, nghĩa và âm thanh đều do người bản ngữ làm và duyệt.
2. **Bạn (Claude Code) không bao giờ tự viết chữ Khmer, phiên âm hay bản dịch.** Khi cần dữ liệu mẫu, dùng placeholder ghi rõ là giả, ví dụ `[KM_PLACEHOLDER_01]`, và đánh dấu `TODO(content)`.
3. **Nội dung tách khỏi code.** Nội dung nằm trong Google Sheet, xuất ra CSV, rồi script import nạp vào Supabase. Sửa nội dung không bao giờ phải sửa code.
4. **Chỉ mục có trạng thái "Đã duyệt" mới hiển thị cho người học.**
5. Mỗi mục nội dung ghi rõ **nguồn và giấy phép**. Một phần nội dung có thể chuyển thể từ sách *Basic Khmer* (Vathanak Sok, **CC BY-NC 4.0**, tức là không được dùng vào mục đích thương mại; đã kiểm tra trên trang của nhà xuất bản MSU ngày 3/11/2026), nên app cần trang ghi công nguồn.

## 4. Người dùng và ràng buộc
- Người lớn, không rành công nghệ. **Giao diện tiếng Việt**, chữ to, thao tác đơn giản. Câu chữ trên giao diện theo `docs/cau-chu-giao-dien.md`: gọi người dùng là "anh/chị", không dùng dấu "·", không dùng từ chuyên môn.
- **Android trước**, kể cả máy đời cũ, cấu hình yếu. Thiết kế mobile-first, kiểm tra ở bề ngang 360px.
- Mạng có thể chập chờn, nên phải **học được offline** sau khi tải bài.
- Thời gian code của Hiếu Nghĩa khoảng **1 giờ/ngày** (thời gian của 2 kỹ sư thuê ngoài chưa xác định). Chia việc thành phần nhỏ, mỗi phần làm xong và kiểm tra được trong dưới 1 giờ. Cuối mỗi phiên, tóm tắt ngắn đã làm gì và bước tiếp theo.

## 5. Công nghệ
Ngày 7/11/2026 nhóm chốt chuyển từ PWA (Next.js) sang **React Native**, vì phần lớn người phát triển quen React Native.
- **React Native + Expo + TypeScript** (đã chốt dùng Expo ngày 7/11/2026). Điều hướng bằng Expo Router, là mặc định của Expo.
- Giao diện dùng **NativeWind** (viết class kiểu Tailwind), chốt ngày 7/11/2026.
  - Màu, cỡ chữ và khoảng cách lấy từ bản mẫu trong `mockup/`, khai báo ở một chỗ duy nhất là `tailwind.config.js`.
  - **Bảng màu đã chốt** (7/11/2026) là "Đồng và trời" với màu cam chính `#E8590C`, có cả chế độ sáng và tối. Chi tiết từng màu theo tên vai trò nằm trong `docs/bang-mau.md`. Trong code chỉ dùng tên vai trò (ví dụ `bg-primary`), không viết thẳng mã màu.
  - Khi dựng khung, chọn phiên bản NativeWind tương thích với bản Expo SDK đang dùng theo tài liệu chính thức, rồi ghi cố định phiên bản trong `package.json`.
  - Giá trị tính lúc chạy, như độ rộng thanh tiến độ hay chiều cao cột biểu đồ, vẫn dùng prop `style`.
  - Muốn thêm thư viện giao diện khác thì hỏi trước.
- Supabase: Postgres, Storage cho file âm thanh, Anonymous Auth để theo dõi tiến độ người dùng thử.
- Offline: tải bài về máy, lưu chữ vào SQLite trên máy và lưu file âm thanh vào bộ nhớ của app. Tiến độ ghi trên máy rồi đồng bộ khi có mạng.
- Dự kiến dùng các module chính chủ của Expo: `expo-sqlite` (dữ liệu offline), `expo-file-system` (file âm thanh), `expo-audio` (phát âm thanh), `expo-notifications` (nhắc ôn hẹn giờ ngay trên máy), `expo-font` (font).
- Font: **Noto Sans Khmer đóng gói sẵn trong app**, không phụ thuộc font hệ thống. Trên Android, class `font-bold` có thể không tự chuyển sang file font đậm của một font tự đóng gói. Phải kiểm tra khi dựng khung. Cách chắc chắn là đặt mỗi độ đậm một tên font riêng và khai báo thành class riêng trong `tailwind.config.js`.
- Build bằng EAS Build ra file APK hoặc AAB cho Android.
- Tên gói Android: **`com.vneml.app`** (chốt ngày 8/11/2026). Tên gói không đổi được sau khi app đã lên CH Play.
- **Kinh phí hiện là 0 (8/11/2026).** Mọi dịch vụ dùng gói miễn phí: GitHub, Supabase, Expo/EAS. **MVP và đợt dùng thử phát hành bằng file APK qua đường link của EAS** (phát hành nội bộ), chưa lên CH Play.
  - Supabase gói miễn phí tạm dừng dự án nếu khoảng 1 tuần không có hoạt động.
  - EAS gói miễn phí giới hạn số lần build mỗi tháng, nên đừng build liên tục.
- **Khi có kinh phí để lên CH Play** (phí 25 USD, trả một lần): theo quy định hiện tại của Google Play, tài khoản nhà phát triển cá nhân mới phải chạy thử kín với ít nhất 12 người trong 14 ngày liên tục trước khi được phát hành công khai. Cần kiểm tra lại quy định khi đăng ký.
- **Thư viện đã duyệt ngày 8/11/2026:** danh sách ở mục 8 của `docs/de-xuat-schema-va-thu-muc.md`. Thư viện ngoài danh sách đó vẫn phải hỏi trước.
- Thống kê cho hồ sơ thi làm bằng SQL view trên Supabase, vì không còn web app để làm trang admin.
- Script import CSV → Supabase viết bằng Node.js + TypeScript, chạy trên máy tính, tách riêng khỏi app.
- Hỏi trước khi thêm thư viện mới. Ưu tiên giải pháp đơn giản.

## 6. Lưu ý kỹ thuật về chữ Khmer
- Chữ Khmer là hệ chữ phức tạp, có phụ âm chân (coeng) xếp chồng. **Không cắt chuỗi theo code point.**
  - Trong app, để `<Text numberOfLines>` tự cắt khi hiển thị.
  - Nếu buộc phải cắt chuỗi, cắt theo grapheme cluster. Script Node dùng được `Intl.Segmenter` với granularity `grapheme`. Hermes, engine JavaScript của React Native, có thể chưa hỗ trợ `Intl.Segmenter`, nên phải kiểm tra trước và hỏi trước khi thêm thư viện thay thế.
- Tiếng Khmer **không có dấu cách giữa các từ**. Không tự tách từ bằng thuật toán. Đội nội dung cung cấp sẵn câu đã tách từ, ngăn cách bằng `|`, trong cột `km_segmented`.

## 7. Phạm vi MVP
**Làm:**
- 10 bài học, khoảng 250 từ và cụm từ. Mỗi mục có chữ Khmer, phiên âm, nghĩa tiếng Việt và âm thanh người bản ngữ.
- 5 dạng bài tập, sinh **theo quy tắc cố định** từ dữ liệu (không AI):
  1. Nghe âm thanh, chọn nghĩa tiếng Việt (4 lựa chọn).
  2. Xem chữ Khmer, chọn đúng âm thanh.
  3. Ghép cặp Khmer với tiếng Việt.
  4. Sắp xếp từ thành câu, dùng `km_segmented`.
  5. Thẻ nhớ chủ động: xem gợi ý (âm thanh Khmer hoặc nghĩa tiếng Việt), tự nhớ và nói thành tiếng, lật thẻ nghe người bản ngữ, rồi tự đánh giá "Nhớ rồi" hoặc "Chưa nhớ". Không chấm phát âm.
- Ôn tập theo hộp Leitner: 5 hộp, khoảng cách 1/2/4/7/14 ngày. Trả lời sai thì về hộp 1. Trên giao diện gọi là "cấp độ nhớ 1–5". Cấp càng cao thì cách hỏi càng khó, từ nhận ra đáp án đến tự nhớ và nói.
- Giao diện học theo cách làm của Duolingo: đường lộ trình, khuôn câu hỏi chung, phản hồi ngay sau mỗi câu. **Không sao chép hình thức** (linh vật, màu sắc, hình vẽ) và không có tim hay bảng xếp hạng.
- Thiết kế chi tiết trải nghiệm học nằm trong `docs/lo-trinh-hoc-tap.md`.
- Học offline, lưu tiến độ.
- Nút "Báo lỗi nội dung" trên từng mục, gửi được cả khi offline (xếp hàng chờ gửi).
- Thống kê cơ bản phục vụ hồ sơ thi: số người dùng, số bài hoàn thành, tỉ lệ trả lời đúng (chỉ tính dạng 1–4; câu tự đánh giá ở dạng 5 ghi riêng). Có thể làm bằng SQL view hoặc trang admin đơn giản.

**Không làm:**
- AI dưới mọi hình thức trong nội dung dạy và trong tính năng của app. Ngoại lệ duy nhất là hình linh vật (xem mục 1).
- Chấm phát âm.
- Bản iOS: không build và không kiểm thử iOS trong MVP.
- Thanh toán.
- Ngôn ngữ thứ hai (nhưng schema chuẩn bị sẵn để thêm ngôn ngữ sau này mà không phải làm lại).
- Dạy viết tay.

## 8. Khung 10 bài
1. Chào hỏi và cách xưng hô
2. Giới thiệu bản thân và cơ quan
3. Hỏi thông tin cá nhân, giấy tờ
4. Số đếm, ngày, giờ
5. Hỏi đường và địa điểm trong ấp, xã
6. Gia đình và người thân
7. Sức khoẻ và khám bệnh cơ bản
8. Giải thích một thủ tục hành chính đơn giản
9. Lễ hội Khmer và cách ứng xử khi đến chùa
10. Ôn tập: hội thoại tổng hợp

## 9. Định dạng dữ liệu nội dung (CSV xuất từ Google Sheet)
Mỗi dòng là một mục:

`lesson_no, item_no, item_type (word|phrase|dialogue_line), vi, km, km_segmented, romanization, audio_file, speaker, dialogue_role, source, licence, reviewer, status`

Cập nhật ngày 8/11/2026 theo đề xuất đã duyệt (mục 6 của `docs/de-xuat-schema-va-thu-muc.md`):
- `dialogue_role` không bắt buộc, chỉ điền cho câu hội thoại: `Cán bộ` hoặc `Người dân`. Đây là vai nhân vật; người đọc thu âm vẫn ghi ở `speaker`.
- Thêm một tab **"Bài học"** gồm 3 cột: `lesson_no, title_vi, recommended_order`.
- `item_no` đánh số cách nhau 10 (10, 20, 30...). Không đổi số của mục đã duyệt.
- Tên file âm thanh theo dạng `{số bài 2 chữ số}_{số mục 3 chữ số}.mp3`, ví dụ `01_010.mp3`.
- Mục bị xoá khỏi Sheet không bị xoá trong cơ sở dữ liệu, mà chuyển sang trạng thái ẩn (`retired`).
- `romanization` theo hệ phiên âm do đội nội dung quyết định. Lưu đúng như được cung cấp, không tự sinh.
- `audio_file` là tên file MP3 trong thư mục âm thanh, sẽ upload lên Supabase Storage.
- `status` có các giá trị: `Nháp`, `Chờ duyệt`, `Đã duyệt`.
- Script import phải báo lỗi rõ ràng khi: thiếu cột, thiếu file âm thanh, trùng `(lesson_no, item_no)`, hoặc `km_segmented` ghép lại (bỏ dấu `|`) không khớp với `km`.

## 10. Trạng thái hiện tại và việc tiếp theo
Cập nhật ngày 8/11/2026:
- **Đã xong:**
  - Bản mẫu giao diện: `mockup/` và https://claude.ai/artifact/6h4qbgLCTB64geYXKWBgxZ
  - Thiết kế trải nghiệm học: `docs/lo-trinh-hoc-tap.md`
  - Bảng màu: `docs/bang-mau.md`
  - Quy tắc câu chữ: `docs/cau-chu-giao-dien.md`
  - **Đề xuất schema và cấu trúc thư mục đã được duyệt:** `docs/de-xuat-schema-va-thu-muc.md`
- **Đang làm:** các bước ở mục 10 của đề xuất. Bước 1 là migration SQL đầu tiên trong `supabase/migrations/`.

Tuần 1–2 (2/11 → 15/11/2026) cần xong:
1. Dựng khung app Expo + Supabase, build được APK chạy thử trên máy Android thật.
2. Schema cơ sở dữ liệu (đã duyệt, đang viết migration).
3. Script import CSV → Supabase, chạy thử với 1 file CSV mẫu dùng placeholder.
