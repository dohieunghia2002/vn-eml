# Linh vật chim Lạc

Ngày 8/11/2026 nhóm quyết định tạo hình linh vật bằng công cụ AI sinh ảnh. Đây là ngoại lệ duy nhất về AI trong dự án, chỉ áp dụng cho hình ảnh thương hiệu.

## Quyết định cho MVP

- **Hình chính thức:** [`mockup/linh-vat/chim-lac-chinh-thuc.png`](../mockup/linh-vat/chim-lac-chinh-thuc.png).
  - Chim nhìn từ bên cạnh, đứng một chân, đúng tư thế quen thuộc của loài chim nước.
  - Nền trong suốt, có viền trắng đều để nổi trên cả nền sáng lẫn nền tối.
- **Một hình dùng cho mọi chỗ.** Cảm xúc (chào, chúc mừng, nhắc ôn) thể hiện bằng lời trong bóng thoại.

  | Màn hình | Cách dùng |
  |---|---|
  | Trang chính, cạnh lời chào | Cận cảnh đầu trong vòng tròn |
  | Màn hình chào khi mở app | Toàn thân, phía trước mặt trống đồng |
  | Tải bài, tải xong, chưa có mạng | Toàn thân, phía trước mặt trống đồng |
  | Tổng kết sau buổi học | Toàn thân, phía trước mặt trống đồng |
  | Sổ từ khi chưa có mục nào | Toàn thân, phía trước mặt trống đồng |

- **Không đặt linh vật** trong màn hình làm bài tập hay trong dải phản hồi đúng sai, để người học tập trung và màn hình 360px không bị chật.
- **Sau MVP:** thuê người biết thiết kế vẽ lại thành vector (SVG), đặt đúng mã màu và vẽ thêm biểu cảm. Mô tả nhân vật và prompt bên dưới là bản yêu cầu để gửi cho người đó.

## Bài học từ lần tạo hình bằng AI

- **Soát kỹ giải phẫu trước khi chốt:** đếm số cánh, số chân, số ngón, xem mắt và mỏ có đúng chỗ không. Hình đầu tiên được chọn bị lỗi 3 cánh mà không ai thấy ngay.
- **AI sửa chi tiết trên hình có sẵn rất kém.** Hai lần nhờ Gemini sửa mào và màu gần như không có kết quả.
- **Đừng yêu cầu AI làm nền trong suốt.** Nó vẽ hoạ tiết ô vuông giả vào ảnh. Cứ để nền trắng, sau đó tách nền bằng script.
- **AI không tô đúng mã màu.** Màu chỉ khớp tuyệt đối khi chuyển sang vector và đặt mã màu cho từng vùng.

## Mô tả nhân vật và prompt tham khảo

Dùng khi sinh lại bằng AI, hoặc gửi kèm cho người vẽ lại. Prompt viết bằng tiếng Anh vì công cụ sinh ảnh hiểu tiếng Anh tốt hơn. Mỗi lần gửi prompt, đính kèm ảnh bảng màu [`mockup/linh-vat/bang-mau-linh-vat.png`](../mockup/linh-vat/bang-mau-linh-vat.png).

### Nhân vật chính

```
A friendly mascot character for a language-learning mobile app: a stylized Lac bird (chim Lạc) inspired by the engraved birds on ancient Dong Son bronze drums of Vietnam.
Shape: long, slender, straight pointed beak; long elegant neck; a crest of three long feathers sweeping backward; long flowing tail feathers; wings decorated with Dong Son geometric motifs (concentric circles joined by tangent lines, zigzag bands, small dots).
Anatomy: exactly two wings and two legs.
Proportions: slightly larger head, big round expressive eyes with a white highlight, warm and kind expression. Respectful and warm, suitable for adult learners, not babyish.
STRICT COLOR PALETTE (also shown in the attached palette image). Use ONLY these exact colors as flat fills, no gradients, no other hues:
- Body, head, neck: orange #E8590C (RGB 232, 89, 12)
- Small shadow areas on the body, legs and feet: dark orange #B4440A (RGB 180, 68, 10)
- Beak and the Dong Son patterns on the wings: golden yellow #F2B230 (RGB 242, 178, 48)
- Crest feathers, wing tips, tail feathers: cobalt blue #2B4ACB (RGB 43, 74, 203)
- Small shadow areas on blue parts: dark blue #1F3596 (RGB 31, 53, 150)
- Belly: cream #FBF4EA (RGB 251, 244, 234)
- Outlines and pupils: near-black #1E1B2E (RGB 30, 27, 46), thick and rounded
- Eye highlights and the outer sticker border: white #FFFFFF
Style: flat 2D vector illustration, clean simple shapes, minimal shading, die-cut sticker look with a thin white outer border so it reads well on both light and dark backgrounds.
Consistency: the crest must be identical in every view (three long feathers sweeping backward); long tail feathers without eye-spots (not a peacock).
Layout: character turnaround sheet showing front view, three-quarter view, side view and back view of the same character, evenly spaced on a plain white background.
No text, no letters, no logo, no flag, no realistic photo, no 3D render, no wood carving, not an owl.
```

### Các biểu cảm

Mỗi lần sinh **một** biểu cảm, đính kèm hình nhân vật chính và ảnh bảng màu. Thay `[POSE]` bằng dòng tương ứng trong bảng.

```
Using the first attached image as the exact character reference (same shape, patterns and outline) and the second attached image as the exact color palette (same colors on the same body parts, flat fills, no other hues), draw the Lac bird mascot [POSE]. The bird has exactly two wings and two legs.
Same flat 2D vector sticker style with a thin white outer border, plain white background, character centered, square image, no text.
```

| # | Dùng ở đâu trong app | Thay `[POSE]` bằng |
|---|---|---|
| 1 | Trang chính, lời chào | `waving one wing in greeting with a warm smile, head slightly tilted` |
| 2 | Trả lời đúng | `jumping happily with both wings raised, eyes curved in joy, a few small sparkles around it` |
| 3 | Trả lời sai, động viên | `gently encouraging, one wing on its chest, soft kind smile, a small reassuring nod; supportive, not sad or disappointed` |
| 4 | Xong một phần học hoặc một bài | `celebrating with wings spread wide, a few confetti pieces in orange, blue and gold around it` |
| 5 | Nhắc ôn tập | `holding a small round alarm clock in one wing, friendly reminding look` |
| 6 | Hôm nay đã ôn xong | `resting peacefully with eyes closed, head slightly tucked, calm and content` |
| 7 | Sổ từ (không bắt buộc) | `reading an open book held in both wings, curious and focused expression` |

Với biểu cảm 1 và 5, sinh thêm một bản cận cảnh: thêm `head and shoulders close-up`. Lý do: ở trang chính, linh vật nằm trong vòng tròn khoảng 84 px, mà dáng chim cao và mảnh.

### Biểu tượng app (icon)

```
App icon: the head and neck of the same Lac bird mascot, facing right, centered on a rounded-square background in deep cobalt blue (#2B4ACB), with a subtle golden (#F2B230) Dong Son sun-star ring pattern behind the head.
Flat vector, bold simple shapes that stay readable at 48 x 48 pixels, no text, no letters.
```

Dùng **nền xanh**, không dùng nền cam: chim màu cam trên nền cam sẽ bị chìm, nhất là ở cỡ 48 px trên màn hình điện thoại.

## Bản quyền và hồ sơ thi

- **Đọc điều khoản của công cụ AI đã dùng** để chắc chắn được phép dùng hình cho mục đích thương mại.
- Hình do AI tạo hoàn toàn **có thể không được bảo hộ quyền tác giả**, vì luật yêu cầu tác giả là con người. Để bảo vệ thương hiệu, nhờ người vẽ lại dựa trên hình AI, rồi đăng ký nhãn hiệu cho logo.
- **Trong hồ sơ thi nên nói rõ:** hình linh vật được tạo với sự hỗ trợ của AI sinh ảnh, còn toàn bộ nội dung dạy (chữ, phiên âm, nghĩa, âm thanh) do người bản ngữ làm và duyệt.
- **Không nhắc đến** Sơn Tùng M-TP, MV "Come My Way" hay linh vật của thương hiệu khác trong prompt.
- Trước khi chốt hình mới, **tra ngược hình bằng Google Lens** để chắc chắn không giống logo hay linh vật đã có.
- Chim Lạc là biểu tượng văn hoá. **Tránh các tư thế gây cười quá đà hoặc thiếu trang trọng.**

## Nhật ký tạo hình

Các hình gốc do AI tạo (bản 1, bản 2) và các góc nhìn bị lỗi đã được xoá khỏi dự án khi dọn thư mục. Chỉ giữ hình chính thức.

| Ngày | Công cụ | Việc | Kết quả |
|---|---|---|---|
| 8/11/2026 | *(cần ghi tên công cụ)* | Sinh bản 1: tờ 4 góc nhìn | Màu và phong cách hợp với app. Lỗi: mào khác nhau giữa các góc, đuôi góc sau có đốm giống chim công, nền trắng |
| 8/11/2026 | Gemini | Sửa bản 1 thành bản 2 (màu, mào, đuôi, nền) | Chỉ bỏ được đốm ở đuôi. Màu gần như giữ nguyên, mào không đổi, "nền trong suốt" là hoạ tiết ô vuông giả |
| 8/11/2026 | Gemini | Sửa mào từng góc của bản 2 | Không thay đổi gì. Nhóm dừng việc sửa bằng AI |
| 8/11/2026 | (không sinh mới) | Chọn hình chính thức | Lúc đầu chọn góc nghiêng giơ cánh chào, nhưng bị lỗi 3 cánh. Đổi sang góc bên cạnh của bản 2 (đã tách nền, vẽ lại viền trắng) |
