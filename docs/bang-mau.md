# Bảng màu VN-EML

Chốt ngày 7/11/2026: dùng hướng **"Đồng và trời"**, nhưng thay màu đồng bằng **màu cam của hướng "Chùa vàng" (#E8590C)**.

Bản mẫu áp dụng bảng màu này: https://claude.ai/artifact/6h4qbgLCTB64geYXKWBgxZ. Ảnh chụp nằm trong thư mục `mockup/che-do-sang/` (chế độ sáng) và `mockup/che-do-toi/` (chế độ tối).

Khi dựng app, khai báo các màu dưới đây **theo tên vai trò** (cột đầu tiên) trong `tailwind.config.js`, kèm biến thể `dark:` của NativeWind. Trong code không viết thẳng mã màu.

## Bảng màu

| Tên vai trò | Sáng | Tối | Dùng cho |
|---|---|---|---|
| `bg` | `#FBF4EA` | `#14121C` | Nền màn hình |
| `surface` | `#FFFFFF` | `#1E1B2A` | Thẻ, ô lựa chọn, thanh điều hướng |
| `ink` | `#1E1B2E` | `#F1EEF8` | Chữ chính |
| `muted` | `#5A5468` | `#B3ADC6` | Chữ phụ, biểu tượng phụ |
| `line` | `#EBDCC8` | `#34304A` | Viền, đường kẻ, bóng dưới của ô thường |
| `primary` | `#E8590C` | `#E8590C` | Nút chính (Ôn tập, Tiếp tục, Kiểm tra), thanh tiến độ khi học |
| `primary-shadow` | `#B4440A` | `#8A3508` | Bóng dưới của nút chính |
| `primary-soft` | `#FFE8D6` | `#3A2014` | Nền nhạt màu cam |
| `primary-text` | `#B4440A` | `#FF8A3D` | Chữ màu cam trên nền sáng hoặc tối (mục đang chọn ở thanh điều hướng) |
| `secondary` | `#2B4ACB` | `#4263EB` | Nút phụ (Học tiếp), nút phát âm thanh, nút đã xong trên lộ trình, ô đang chọn |
| `secondary-shadow` | `#1F3596` | `#2B4ACB` | Bóng dưới của nút phụ |
| `secondary-soft` | `#E5EAFF` | `#232A4D` | Nền ô đang chọn, nhãn cấp độ nhớ |
| `secondary-text` | `#2B4ACB` | `#91A7FF` | Chữ màu xanh (nhãn "BÀI 1 · ĐANG HỌC", số liệu) |
| `accent` | `#F2B230` | `#F2B230` | Vòng phần đang học, chuỗi ngày, thanh tiến độ khi ôn tập |
| `accent-soft` | `#FDEBC4` | `#3A2C0B` | Nền nhãn chuỗi ngày, nhãn "TỪ MỚI", "ÔN TẬP" |
| `accent-ink` | `#6E4600` | `#FFD480` | Chữ trên nền `accent-soft` |
| `ok` | `#2B8A3E` | `#37B24D` | Viền và biểu tượng khi trả lời đúng |
| `ok-bg` | `#E3F7E8` | `#12301B` | Nền dải phản hồi đúng |
| `ok-ink` | `#1E6B30` | `#8CE99A` | Chữ khi trả lời đúng |
| `ok-btn` | `#2B8A3E` | `#2B8A3E` | Nút "Tiếp tục" sau khi đúng, nút "Nhớ rồi" |
| `ok-btn-shadow` | `#1E6B30` | `#1B5E27` | Bóng dưới của nút trên |
| `bad` | `#C92A2A` | `#F03E3E` | Viền và biểu tượng khi trả lời sai |
| `bad-bg` | `#FFE5E5` | `#3B1414` | Nền dải phản hồi sai |
| `bad-ink` | `#A12020` | `#FFA8A8` | Chữ khi trả lời sai |
| `bad-btn` | `#C92A2A` | `#E03131` | Nút "Tiếp tục" sau khi sai |
| `bad-btn-shadow` | `#8F1D1D` | `#A12020` | Bóng dưới của nút trên |
| `disabled-bg` | `#EDE6DB` | `#2A2738` | Nút chưa bấm được (chưa chọn đáp án) |
| `disabled-ink` | `#5A5468` | `#9A94AD` | Chữ trên nút chưa bấm được |
| `toast-bg` | `#1E1B2E` | `#F1EEF8` | Thông báo ngắn ("Đã lưu báo lỗi...") |
| `toast-ink` | `#FFFFFF` | `#14121C` | Chữ của thông báo ngắn |
| `pattern` | `#D9822B` | `#F2B230` | Hoa văn trống đồng (xem mục bên dưới) |

## Hoa văn trống đồng: chi tiết thương hiệu riêng

| Hoa văn | Hình dạng | Dùng ở đâu | Độ mờ (sáng / tối) |
|---|---|---|---|
| **Mặt trống đồng** | Ảnh mặt trống đồng do nhóm cung cấp ngày 8/11/2026, đã tách nền và tô màu `pattern`, rộng 300 px | Phía sau chim Lạc ở màn hình chào, tải bài, tổng kết, Sổ từ khi trống | 0,35 / 0,4 |

**Nguồn ảnh mặt trống đồng: TODO, cần xác định trước khi phát hành.**
- Trống đồng là di sản chung, nhưng **bản vẽ vector cụ thể này là của người vẽ lại**, và có thể có giấy phép riêng (ghi tên tác giả, cấm dùng làm nhận diện thương hiệu, hoặc phải trả phí).
- Tìm nguồn bằng Google Lens, rồi ghi tên trang, tác giả và giấy phép vào đây.
- Nếu không tìm ra nguồn, hoặc giấy phép không cho dùng thương mại hay làm thương hiệu, thì nhờ người vẽ lại mặt trống, hoặc quay về hình mặt trời đơn giản đã vẽ trước đó.
- File: `mockup/hoa-van/trong-dong-goc.png` (ảnh gốc), `trong-dong-sang.png` và `trong-dong-toi.png` (đã tách nền, tô màu cho chế độ sáng và tối).

- Hoa văn chỉ để trang trí, nên đánh dấu `aria-hidden` và không gắn chức năng bấm.
- **Không đặt hoa văn ở màn hình làm bài tập,** để người học không bị phân tâm.
- **Chỉ dùng một kiểu hoa văn là mặt trống đồng.** Dải hoa văn ở mép trên màn hình đã bỏ ngày 8/11/2026, vì nó nằm sát mặt trống, hai kiểu hoa văn chồng lên nhau trông rối.
- Khi làm app thật, chuyển mặt trống đồng thành component dùng chung.

## Quy tắc dùng màu

- **Nút dạng khối:** mỗi nút có bóng dưới đậm hơn, dày 4–5 px (`box-shadow: 0 5px 0 <màu bóng>`). Ô lựa chọn thường dùng màu `line` làm bóng.
- **Chữ trắng trên nút cam (`primary`) chỉ đạt độ tương phản cho chữ to và đậm.** Chữ trên nút cam phải từ 17 px trở lên và đậm. Chữ nhỏ màu cam thì dùng `primary-text`.
- **Báo đúng hay sai không chỉ dựa vào màu:** luôn kèm biểu tượng ✓ hoặc ✗ và chữ "Đúng rồi!" hoặc "Chưa đúng".
- **Chế độ tối:**
  - Mặc định theo cài đặt sáng hoặc tối của máy.
  - Người dùng đổi được trong mục Thêm: "Theo máy / Sáng / Tối".
  - Màu cam chính giữ nguyên ở cả hai chế độ, để app luôn dễ nhận ra.
- **Linh vật chim Lạc** phải nhìn rõ trên cả nền `bg` sáng lẫn tối, ví dụ có viền ngoài.
