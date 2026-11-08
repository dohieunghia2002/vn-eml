# Supabase

Cơ sở dữ liệu và kho file âm thanh của VN-EML. Thiết kế nằm ở `docs/de-xuat-schema-va-thu-muc.md`.

Mọi thay đổi cơ sở dữ liệu đều là một file SQL mới trong `migrations/`. **Không sửa bảng bằng tay trên trang Supabase**, nếu không bản trong git sẽ lệch với bản thật.

## Lần đầu: tạo dự án và chạy migration

Cần Node.js. Supabase CLI chạy qua `npx`, không phải cài riêng.

1. Hiếu Nghĩa tạo dự án trên https://supabase.com (gói miễn phí). Gửi **mã dự án** (project ref, nằm trong đường link của dự án) cho kỹ sư.
2. Tại thư mục gốc của repo, chạy:

   ```
   npx supabase init
   npx supabase login
   npx supabase link --project-ref <mã dự án>
   npx supabase db push
   ```

   - `init` tạo file `supabase/config.toml`. Thư mục `migrations/` đã có sẵn nên được giữ nguyên.
   - `db push` chạy các file trong `migrations/` lên dự án thật.
3. Trên trang Supabase, vào **Authentication → Sign In / Providers** và bật **Allow anonymous sign-ins**. App dùng đăng nhập ẩn danh.
4. Kiểm tra:
   - Bảng `languages` có một dòng `km`.
   - Mục Storage có bucket `audio`, ở chế độ public.

## Xem thống kê cho hồ sơ thi

Mở **SQL Editor** trên trang Supabase rồi chạy:

```sql
select * from stats.overview;
```

## Khoá bí mật

- **`anon key`** dùng trong app, được phép nằm trong app.
- **`service_role key`** chỉ dùng cho script import trên máy tính. **Không bao giờ đưa vào app, không đưa lên git.** Lưu trong file `.env` (đã có trong `.gitignore`).
