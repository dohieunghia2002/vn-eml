# Đề xuất schema cơ sở dữ liệu và cấu trúc thư mục

Soạn ngày 8/11/2026. **Hiếu Nghĩa đã duyệt toàn bộ ngày 8/11/2026** (cả 6 câu ở mục 9). Riêng việc lên CH Play hoãn lại vì kinh phí hiện là 0; xem mục 10.

Những chỗ cần quyết được gom ở mục 9. Phần ảnh hưởng tới Huy (định dạng Google Sheet) nằm ở mục 6.

Quy ước: **tên trong code và cơ sở dữ liệu viết bằng tiếng Anh**, còn chữ hiển thị cho người dùng viết bằng tiếng Việt.

---

## 1. Bức tranh chung

```
Google Sheet (Huy)  --xuất CSV-->  Script import (máy tính)  --ghi-->  Supabase
                                                                        ├─ Postgres: bài, mục, tiến độ, báo lỗi
                                                                        └─ Storage: file âm thanh MP3
                                                                              │
                                     App Expo trên điện thoại  <──tải bài, gửi tiến độ──┘
                                     └─ SQLite trên máy: bài đã tải, tiến độ, hàng chờ gửi
```

- **Nội dung chỉ đi một chiều:** Google Sheet → CSV → script import → Supabase → app. App không bao giờ sửa nội dung.
- **Tiến độ học lưu trên máy trước,** rồi mới gửi lên Supabase khi có mạng. SQLite trên máy là nơi giữ tiến độ chính. Bản trên Supabase dùng để thống kê và để khôi phục khi cần.
- **Bài tập không lưu trong cơ sở dữ liệu.** App tự sinh bài tập từ danh sách mục theo quy tắc cố định trong code (`docs/lo-trinh-hoc-tap.md`). Cơ sở dữ liệu chỉ lưu kết quả trả lời.

## 2. Schema Postgres trên Supabase

### 2.1. Nội dung

| Bảng | Mỗi dòng là | Ghi chú |
|---|---|---|
| `languages` | Một ngôn ngữ | MVP chỉ có một dòng: tiếng Khmer (`km`). Có sẵn để thêm tiếng khác sau này |
| `lessons` | Một bài học | Thuộc một ngôn ngữ. Có `recommended_order` để đổi thứ tự gợi ý mà không phải đánh số lại bài |
| `items` | Một mục: từ, cụm từ hoặc câu hội thoại | Tên cột đặt chung chung (`target_text`, `target_segmented`), không gắn với tiếng Khmer |

### 2.2. Người học và tiến độ

| Bảng | Mỗi dòng là | Ghi chú |
|---|---|---|
| `profiles` | Một người học | Tạo khi đăng nhập ẩn danh lần đầu. Không lưu tên, số điện thoại hay thông tin cá nhân |
| `item_progress` | Cấp độ nhớ của một người với một mục | Cấp 1–5 và ngày đến hạn ôn. Chính là "hộp Leitner" |
| `answer_events` | Một lần trả lời | Gồm cả câu tự đánh giá ở dạng 5. Thống kê tỉ lệ đúng tính từ bảng này |
| `lesson_completions` | Một người hoàn thành một bài | Kèm điểm bài kiểm tra cuối bài |
| `content_reports` | Một báo lỗi nội dung | App gửi khi có mạng. Đội nội dung xử lý trên Supabase |

### 2.3. Mã SQL đề xuất

Khi được duyệt, đoạn này sẽ thành file migration đầu tiên trong `supabase/migrations/`.

```sql
-- Kiểu liệt kê
create type content_status as enum ('draft', 'in_review', 'approved', 'retired');
create type item_type      as enum ('word', 'phrase', 'dialogue_line');
create type dialogue_role  as enum ('official', 'villager');
create type exercise_type  as enum (
  'listen_choose_meaning',  -- dạng 1: nghe, chọn nghĩa
  'read_choose_audio',      -- dạng 2: xem chữ, chọn âm thanh
  'match_pairs',            -- dạng 3: ghép cặp
  'order_words',            -- dạng 4: sắp xếp câu
  'recall_meaning',         -- dạng 5, cấp 2: nghe, tự nhớ nghĩa (tự đánh giá)
  'recall_speak'            -- dạng 5, cấp 3–5: xem nghĩa, tự nói (tự đánh giá)
);
create type session_type   as enum ('learn', 'review', 'lesson_test', 'free_practice');
create type report_reason  as enum ('wrong_script', 'wrong_romanization', 'wrong_meaning', 'bad_audio', 'other');
create type report_status  as enum ('new', 'in_progress', 'resolved', 'rejected');

-- Nội dung
create table languages (
  id          smallint generated always as identity primary key,
  code        text not null unique,        -- 'km'
  name_vi     text not null,               -- 'Tiếng Khmer'
  variety_vi  text,                        -- 'Nam Bộ'
  font_family text not null,               -- font app dùng cho ngôn ngữ này, ví dụ 'NotoSansKhmer'
  is_active   boolean not null default false
);

create table lessons (
  id                 uuid primary key default gen_random_uuid(),
  language_id        smallint not null references languages (id),
  lesson_no          smallint not null,
  title_vi           text not null,
  recommended_order  smallint not null,
  content_updated_at timestamptz not null default now(),  -- import đổi giá trị này khi có mục trong bài thay đổi
  unique (language_id, lesson_no)
);

create table items (
  id               uuid primary key default gen_random_uuid(),
  lesson_id        uuid not null references lessons (id),
  item_no          integer not null,
  item_type        item_type not null,
  vi               text not null,
  target_text      text not null,
  target_segmented text,                    -- các phần ngăn cách bằng '|'
  romanization     text not null,
  audio_path       text not null,           -- đường dẫn trong bucket 'audio'
  speaker          text not null,           -- người đọc thu âm
  dialogue_role    dialogue_role,           -- vai trong hội thoại, chỉ có ở câu hội thoại
  source           text not null,
  licence          text not null,
  reviewer         text,
  status           content_status not null,
  content_hash     text not null,           -- import dùng để biết dòng có đổi không
  updated_at       timestamptz not null default now(),
  unique (lesson_id, item_no),
  check (dialogue_role is null or item_type = 'dialogue_line'),
  check (status <> 'approved' or reviewer is not null)
);

-- Người học và tiến độ
create table profiles (
  user_id      uuid primary key references auth.users (id) on delete cascade,
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz,
  app_version  text
);

create table item_progress (
  user_id          uuid not null references auth.users (id) on delete cascade,
  item_id          uuid not null references items (id),
  level            smallint not null check (level between 1 and 5),
  due_date         date not null,            -- ngày lịch theo giờ Việt Nam
  first_learned_at timestamptz not null,
  last_reviewed_at timestamptz,
  updated_at       timestamptz not null,     -- giờ thay đổi trên máy, dùng khi đồng bộ
  primary key (user_id, item_id)
);

create table answer_events (
  id            uuid primary key,             -- app sinh sẵn, gửi lại nhiều lần cũng không bị trùng
  user_id       uuid not null references auth.users (id) on delete cascade,
  item_id       uuid not null references items (id),
  session_type  session_type not null,
  exercise_type exercise_type not null,
  is_correct    boolean not null,             -- với dạng 5: true nghĩa là "Nhớ rồi"
  level_before  smallint,
  level_after   smallint,
  answered_at   timestamptz not null,         -- giờ trên máy
  received_at   timestamptz not null default now()
);
create index answer_events_user_time on answer_events (user_id, answered_at);

create table lesson_completions (
  user_id      uuid not null references auth.users (id) on delete cascade,
  lesson_id    uuid not null references lessons (id),
  completed_at timestamptz not null,
  test_correct smallint not null,
  test_total   smallint not null,
  primary key (user_id, lesson_id)
);

create table content_reports (
  id          uuid primary key,               -- app sinh sẵn, dùng cho hàng chờ offline
  user_id     uuid references auth.users (id) on delete set null,
  item_id     uuid not null references items (id),
  reason      report_reason not null,
  note        text,
  reported_at timestamptz not null,
  received_at timestamptz not null default now(),
  status      report_status not null default 'new',
  app_version text
);
```

### 2.4. Phân quyền (Row Level Security)

Bật RLS cho tất cả các bảng.

| Bảng | App được đọc | App được ghi |
|---|---|---|
| `languages` | Dòng có `is_active = true` | Không |
| `lessons` | Tất cả. App cần hiện cả bài "Sắp ra mắt" | Không |
| `items` | **Chỉ dòng có `status = 'approved'`** | Không |
| `profiles`, `item_progress`, `lesson_completions` | Chỉ dòng của chính mình (`user_id = auth.uid()`) | Chỉ dòng của chính mình |
| `answer_events` | Chỉ dòng của chính mình | Chỉ thêm dòng của chính mình, không sửa, không xoá |
| `content_reports` | Không | Chỉ thêm dòng của chính mình |

- Ghi nội dung chỉ làm được bằng **service role key**, và key này chỉ nằm trong script import trên máy tính. **Không bao giờ đưa service role key vào app.**
- Nguyên tắc "chỉ mục Đã duyệt mới hiển thị" được giữ ở hai lớp: RLS trên Supabase, và câu truy vấn trong app.

### 2.5. Âm thanh

- Bucket `audio` trên Supabase Storage, **cho đọc công khai**. App tải file về máy dễ hơn, và đây là nội dung app vốn sẽ phát cho mọi người dùng.
- Đường dẫn: `{mã ngôn ngữ}/{số bài 2 chữ số}/{tên file}`, ví dụ `km/01/01_010.mp3`.
- Script import chỉ tải lên file mới hoặc file đã đổi, so bằng mã hash của file.

### 2.6. Thống kê cho hồ sơ thi

Các view đặt trong schema riêng tên `stats`. **Schema này không mở qua API**, chỉ xem bằng trình soạn SQL trên trang Supabase, nên người dùng app không đọc được.

```sql
create schema stats;

create view stats.overview as
select
  (select count(*) from profiles)                                         as users,
  (select count(distinct user_id) from answer_events
     where answered_at > now() - interval '7 days')                       as active_users_7d,
  (select count(*) from lesson_completions)                               as lessons_completed,
  (select round(100.0 * avg(is_correct::int), 1) from answer_events
     where exercise_type not in ('recall_meaning', 'recall_speak'))       as accuracy_pct,           -- chỉ dạng 1–4
  (select round(100.0 * avg(is_correct::int), 1) from answer_events
     where exercise_type in ('recall_meaning', 'recall_speak'))           as self_remembered_pct;    -- dạng 5, ghi riêng
```

Sau này thêm view theo từng bài, theo từng ngày, và theo dạng bài tập.

## 3. SQLite trên điện thoại

Trên máy có các bảng giống phía Supabase, cộng thêm các bảng phục vụ chạy offline:

| Bảng trên máy | Dùng để |
|---|---|
| `languages`, `lessons`, `items` | Bản sao nội dung đã duyệt của các bài đã tải |
| `downloads` | Bài nào đã tải, bản nội dung nào (`content_updated_at`), âm thanh tải đủ chưa |
| `item_progress` | **Nguồn chính** của cấp độ nhớ và ngày đến hạn |
| `answer_events`, `lesson_completions`, `content_reports` | Có thêm cột `synced_at`. Dòng chưa có `synced_at` là dòng đang chờ gửi |
| `settings` | Giao diện sáng/tối/theo máy, cỡ chữ, âm báo, giờ nhắc ôn |

Chuỗi ngày học, mục tiêu ngày và danh sách mục cần ôn hôm nay **đều tính trên máy** từ các bảng trên. Không cần mạng.

## 4. Đồng bộ

**Tải nội dung** (khi người học bấm "Tải bài", hoặc tự động khi có mạng):
1. Lấy danh sách bài, so `content_updated_at` với bảng `downloads` trên máy.
2. Bài nào mới hoặc đã đổi thì tải các mục đã duyệt, rồi tải file âm thanh vào bộ nhớ app.
3. Chỉ đánh dấu bài "đã tải" khi chữ và âm thanh đã về đủ.

**Gửi tiến độ** (mỗi khi có mạng, và khi mở app):
1. Gửi các dòng `answer_events`, `lesson_completions`, `content_reports` chưa có `synced_at`. Vì `id` do app sinh sẵn nên gửi lại nhiều lần cũng không bị trùng.
2. Gửi `item_progress` theo kiểu ghi đè. Bản nào có `updated_at` mới hơn thì giữ bản đó.
3. Gửi thành công thì ghi `synced_at` cho các dòng vừa gửi.

**Giới hạn cần biết:** đăng nhập ẩn danh gắn với máy. **Nếu người học gỡ app hoặc xoá dữ liệu app, tiến độ sẽ mất**, vì app không còn cách nhận ra người cũ. Với đợt dùng thử, Tuyến cần dặn người dùng không gỡ app. Sau MVP có thể cho liên kết với số điện thoại hoặc email.

## 5. Cấu trúc thư mục

```
Nhom_Ba_Tree/
├─ CLAUDE.md
├─ docs/                      tài liệu thiết kế (đang có)
├─ mockup/                    ảnh bản mẫu, không đóng gói vào app (đang có)
├─ tai-lieu-tham-khao/        PDF tham khảo, KHÔNG đưa vào git (đang có)
│
├─ mobile/                    app Expo
│  ├─ app/                    các màn hình (Expo Router)
│  │  ├─ _layout.tsx          nạp font, theme sáng/tối, kết nối dữ liệu
│  │  ├─ (tabs)/              ba tab ở thanh điều hướng dưới
│  │  │  ├─ _layout.tsx
│  │  │  ├─ index.tsx         Học: trang chính, đường lộ trình
│  │  │  ├─ vocabulary.tsx    Sổ từ
│  │  │  └─ more.tsx          Thêm: cài đặt, tải bài
│  │  ├─ lesson/[lessonId]/[partNo].tsx   một buổi học phần mới
│  │  ├─ lesson/[lessonId]/test.tsx       kiểm tra cuối bài
│  │  ├─ review.tsx           buổi ôn tập hôm nay
│  │  ├─ summary.tsx          tổng kết buổi
│  │  └─ credits.tsx          ghi công nguồn tài liệu
│  ├─ src/
│  │  ├─ learning/            LOGIC THUẦN, không đụng giao diện: chia phần, sinh bài tập, Leitner, chọn mục ôn
│  │  ├─ exercises/           5 dạng bài tập, mỗi dạng một component
│  │  ├─ components/          nút dạng khối, thẻ, dải phản hồi, nút loa, linh vật...
│  │  ├─ data/                SQLite: tạo bảng, truy vấn
│  │  ├─ sync/                tải bài, gửi tiến độ, hàng chờ báo lỗi
│  │  ├─ audio/               phát âm thanh
│  │  ├─ notifications/       hẹn giờ nhắc ôn (giai đoạn 2)
│  │  ├─ config/learning.ts   các thông số ở mục 14 của docs/lo-trinh-hoc-tap.md
│  │  ├─ strings.ts           toàn bộ chữ tiếng Việt trên giao diện
│  │  └─ lib/supabase.ts
│  ├─ assets/
│  │  ├─ fonts/               Noto Sans Khmer (đóng gói sẵn), font giao diện
│  │  └─ images/              linh vật chim Lạc, biểu tượng app
│  ├─ tailwind.config.js      bảng màu theo tên vai trò, lấy từ docs/bang-mau.md
│  ├─ global.css
│  ├─ app.json                tên gói com.vneml.app
│  └─ package.json
│
├─ supabase/                  dùng với Supabase CLI
│  └─ migrations/             các file SQL tạo bảng, RLS, view thống kê
│
└─ scripts/
   └─ import-content/         script import CSV → Supabase (Node + TypeScript)
      ├─ src/
      │  ├─ index.ts          chạy từ dòng lệnh: đọc CSV, kiểm tra, ghi
      │  ├─ validate.ts       các lỗi và cảnh báo ở mục 7
      │  └─ mapping.ts        đổi tên cột CSV (km, km_segmented...) sang tên trong cơ sở dữ liệu
      ├─ sample/              CSV mẫu dùng placeholder, MP3 mẫu im lặng
      └─ package.json
```

- **App và script import tách làm hai `package.json` riêng.** Như vậy script không kéo thư viện của app vào, và ngược lại. Không dùng workspace để giữ mọi thứ đơn giản.
- **Logic học tập để riêng trong `src/learning/`, không đụng giao diện.** Nhờ vậy viết được kiểm thử tự động cho phần dễ sai nhất: Leitner, chia phần, sinh bài tập.
- Màu chỉ khai báo trong `tailwind.config.js`. Thông số học tập chỉ khai báo trong `config/learning.ts`.

## 6. Thay đổi trong Google Sheet (cho Huy)

1. **Thêm cột `dialogue_role`** (không bắt buộc). Chỉ điền cho câu hội thoại, giá trị là `Cán bộ` hoặc `Người dân`. Đây là vai nhân vật trong hội thoại. Người thu âm vẫn ghi ở cột `speaker`.
2. **Thêm một tab "Bài học"** gồm 3 cột: `lesson_no`, `title_vi`, `recommended_order`. Hiện CSV chưa có chỗ ghi tên bài, mà tên bài cũng là nội dung, nên phải nằm trong Sheet chứ không nằm trong code.
3. **Đánh số `item_no` cách nhau 10** (10, 20, 30...). Khi cần chen một mục vào giữa thì dùng số 15, không phải đánh số lại. **Không đổi số của một mục đã duyệt**, vì tiến độ của người học gắn với số đó.
4. **Đặt tên file âm thanh** theo dạng `{số bài}_{số mục}.mp3`, ví dụ `01_010.mp3`.
5. Cột trạng thái vẫn viết tiếng Việt (`Nháp`, `Chờ duyệt`, `Đã duyệt`). Script tự đổi sang mã trong cơ sở dữ liệu.
6. Mục bị xoá khỏi Sheet **không bị xoá khỏi cơ sở dữ liệu**. Script đặt trạng thái `retired` để ẩn đi, để tiến độ cũ của người học không bị hỏng.

## 7. Script import kiểm tra những gì

**Báo lỗi và dừng, không ghi gì** (4 lỗi bắt buộc theo CLAUDE.md, cộng thêm vài lỗi khác):
- Thiếu cột.
- Thiếu file âm thanh.
- Trùng `(lesson_no, item_no)`.
- `km_segmented` ghép lại (bỏ dấu `|`) không khớp `km`. Cả hai chuỗi được chuẩn hoá Unicode (NFC) trước khi so sánh.
- Giá trị không hợp lệ ở `item_type`, `status`, `dialogue_role`.
- Mục `Đã duyệt` nhưng chưa ghi người duyệt.
- Có `dialogue_role` ở dòng không phải câu hội thoại.
- `lesson_no` không có trong tab "Bài học".

**Cảnh báo, vẫn cho ghi:**
- Hai mục trong cùng một bài có nghĩa tiếng Việt giống nhau.
- Câu có hơn 8 phần, nên app sẽ không dùng cho dạng sắp xếp câu.
- Bài có ít hơn 4 mục cùng loại.

Script có chế độ `--dry-run`: chỉ kiểm tra và in báo cáo, không ghi gì. Huy nên chạy chế độ này trước mỗi lần nhập thật.

## 8. Thư viện cần duyệt

Theo CLAUDE.md, thêm thư viện nào cũng phải hỏi trước. Danh sách đề xuất:

**App:**

| Thư viện | Lý do | Ghi chú |
|---|---|---|
| `expo-router` | Điều hướng giữa các màn hình | Có sẵn khi tạo dự án Expo |
| `nativewind`, `tailwindcss` | Viết giao diện | Đã chốt. Chọn phiên bản khớp với Expo SDK |
| `@supabase/supabase-js` | Kết nối Supabase | |
| `expo-sqlite` | Dữ liệu offline | Module chính chủ của Expo. Có sẵn kho key-value, dùng được để lưu phiên đăng nhập Supabase thay cho thư viện AsyncStorage. Cần kiểm tra lại theo tài liệu Supabase hiện hành |
| `expo-file-system`, `expo-audio`, `expo-font`, `expo-notifications` | Âm thanh, font, nhắc ôn | Module chính chủ của Expo |
| `expo-network` | Biết máy có mạng hay không, để quyết định lúc đồng bộ | Module chính chủ của Expo |
| `expo-crypto` | Sinh `id` cho sự kiện ngay trên máy | Module chính chủ của Expo |
| `react-native-svg` | Vẽ biểu tượng, vòng tiến độ "Mục tiêu hôm nay", biểu đồ Sổ từ | Duyệt thêm ngày 11/11/2026. Expo hỗ trợ chính thức, có sẵn trong Expo Go |

**Script import:**

| Thư viện | Lý do |
|---|---|
| `csv-parse` | Đọc CSV đúng chuẩn, kể cả ô có dấu phẩy hoặc xuống dòng |
| `@supabase/supabase-js` | Ghi vào Supabase |
| `tsx` | Chạy thẳng TypeScript, không cần bước build |

**Công cụ cho lập trình viên** (không đóng gói vào app):
- Supabase CLI, để quản lý migration.
- EAS CLI, để build APK.

## 9. Cần quyết định (đã duyệt hết ngày 8/11/2026)

| # | Câu hỏi | Đề xuất (đã duyệt) |
|---|---|---|
| 1 | Để app trong thư mục `mobile/`, cạnh `supabase/` và `scripts/` như mục 5, hay để app ngay ở thư mục gốc? | Để trong `mobile/`, cho gọn khi repo có cả app lẫn script |
| 2 | Duyệt danh sách thư viện ở mục 8 | Duyệt cả |
| 3 | Bucket âm thanh cho đọc công khai? | Có |
| 4 | Huy đánh số mục cách nhau 10 và thêm tab "Bài học"? | Có |
| 5 | Thêm thư viện kiểm thử (`jest-expo`) để kiểm thử logic trong `src/learning/`? | Có. Leitner và sinh bài tập là phần dễ sai nhất |
| 6 | Dùng Supabase CLI để quản lý migration, thay vì gõ SQL tay trên trang Supabase? | Có. Mọi thay đổi cơ sở dữ liệu được lưu trong git |

## 10. Sau khi duyệt: các bước làm, mỗi bước khoảng 1 giờ

1. Tạo dự án Supabase. Chạy migration đầu tiên (bảng, RLS, bucket `audio`, view thống kê).
2. Tạo dự án Expo trong `mobile/`, cài NativeWind, khai báo bảng màu và font.
3. Build APK bằng EAS (chế độ phát hành nội bộ, có link và mã QR để tải) rồi chạy thử trên máy Android thật. Kiểm tra chữ Khmer hiển thị đúng và font đậm hoạt động.

**Phát hành khi kinh phí là 0:** MVP và đợt dùng thử phát hành bằng file APK qua đường link của EAS, chưa lên CH Play. Tuyến cần một hướng dẫn cài APK có ảnh cho cán bộ, vì Android sẽ hỏi "cho phép cài từ nguồn này". Khi có 25 USD thì đăng ký Google Play Console; lúc đó còn phải chạy thử kín 14 ngày với ít nhất 12 người.
4. Script import, phần 1: đọc CSV mẫu và kiểm tra lỗi (chế độ `--dry-run`).
5. Script import, phần 2: ghi vào Supabase và tải file âm thanh lên.
6. App: đăng nhập ẩn danh, tải một bài về SQLite, hiện danh sách mục.

Bước 1–3 có thể giao cho một kỹ sư, bước 4–5 cho người còn lại, chạy song song.
