-- Migration đầu tiên của VN-EML: bảng nội dung, bảng tiến độ, phân quyền, bucket âm thanh, view thống kê.
-- Thiết kế: docs/de-xuat-schema-va-thu-muc.md (đã duyệt ngày 8/11/2026).

-- ============================================================
-- Kiểu liệt kê
-- ============================================================
create type public.content_status as enum ('draft', 'in_review', 'approved', 'retired');
create type public.item_type      as enum ('word', 'phrase', 'dialogue_line');
create type public.dialogue_role  as enum ('official', 'villager');
create type public.exercise_type  as enum (
  'listen_choose_meaning',  -- dạng 1: nghe, chọn nghĩa
  'read_choose_audio',      -- dạng 2: xem chữ, chọn âm thanh
  'match_pairs',            -- dạng 3: ghép cặp
  'order_words',            -- dạng 4: sắp xếp câu
  'recall_meaning',         -- dạng 5, cấp 2: nghe, tự nhớ nghĩa (tự đánh giá)
  'recall_speak'            -- dạng 5, cấp 3–5: xem nghĩa, tự nói (tự đánh giá)
);
create type public.session_type   as enum ('learn', 'review', 'lesson_test', 'free_practice');
create type public.report_reason  as enum ('wrong_script', 'wrong_romanization', 'wrong_meaning', 'bad_audio', 'other');
create type public.report_status  as enum ('new', 'in_progress', 'resolved', 'rejected');

-- ============================================================
-- Nội dung (chỉ script import ghi, bằng service role key)
-- ============================================================
create table public.languages (
  id          smallint generated always as identity primary key,
  code        text not null unique,
  name_vi     text not null,
  variety_vi  text,
  font_family text not null,
  is_active   boolean not null default false
);

create table public.lessons (
  id                 uuid primary key default gen_random_uuid(),
  language_id        smallint not null references public.languages (id),
  lesson_no          smallint not null,
  title_vi           text not null,
  recommended_order  smallint not null,
  content_updated_at timestamptz not null default now(),
  unique (language_id, lesson_no)
);

create table public.items (
  id               uuid primary key default gen_random_uuid(),
  lesson_id        uuid not null references public.lessons (id),
  item_no          integer not null,
  item_type        public.item_type not null,
  vi               text not null,
  target_text      text not null,
  target_segmented text,
  romanization     text not null,
  audio_path       text not null,
  speaker          text not null,
  dialogue_role    public.dialogue_role,
  source           text not null,
  licence          text not null,
  reviewer         text,
  status           public.content_status not null,
  content_hash     text not null,
  updated_at       timestamptz not null default now(),
  unique (lesson_id, item_no),
  constraint items_role_only_for_dialogue check (dialogue_role is null or item_type = 'dialogue_line'),
  constraint items_approved_needs_reviewer check (status <> 'approved' or nullif(btrim(reviewer), '') is not null)
);
create index items_lesson_status on public.items (lesson_id, status);

-- ============================================================
-- Người học và tiến độ
-- ============================================================
create table public.profiles (
  user_id      uuid primary key references auth.users (id) on delete cascade,
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz,
  app_version  text
);

create table public.item_progress (
  user_id          uuid not null references auth.users (id) on delete cascade,
  item_id          uuid not null references public.items (id),
  level            smallint not null check (level between 1 and 5),
  due_date         date not null,
  first_learned_at timestamptz not null,
  last_reviewed_at timestamptz,
  updated_at       timestamptz not null,
  primary key (user_id, item_id)
);

create table public.answer_events (
  id            uuid primary key,
  user_id       uuid not null references auth.users (id) on delete cascade,
  item_id       uuid not null references public.items (id),
  session_type  public.session_type not null,
  exercise_type public.exercise_type not null,
  is_correct    boolean not null,
  level_before  smallint,
  level_after   smallint,
  answered_at   timestamptz not null,
  received_at   timestamptz not null default now()
);
create index answer_events_user_time on public.answer_events (user_id, answered_at);

create table public.lesson_completions (
  user_id      uuid not null references auth.users (id) on delete cascade,
  lesson_id    uuid not null references public.lessons (id),
  completed_at timestamptz not null,
  test_correct smallint not null,
  test_total   smallint not null,
  primary key (user_id, lesson_id)
);

create table public.content_reports (
  id          uuid primary key,
  user_id     uuid references auth.users (id) on delete set null,
  item_id     uuid not null references public.items (id),
  reason      public.report_reason not null,
  note        text,
  reported_at timestamptz not null,
  received_at timestamptz not null default now(),
  status      public.report_status not null default 'new',
  app_version text
);

-- Tự tạo hồ sơ khi có người dùng mới (kể cả đăng nhập ẩn danh).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Phân quyền (Row Level Security)
-- Script import dùng service role key nên không bị RLS chặn.
-- ============================================================
alter table public.languages          enable row level security;
alter table public.lessons            enable row level security;
alter table public.items              enable row level security;
alter table public.profiles           enable row level security;
alter table public.item_progress      enable row level security;
alter table public.answer_events      enable row level security;
alter table public.lesson_completions enable row level security;
alter table public.content_reports    enable row level security;

create policy "read active languages" on public.languages
  for select to anon, authenticated using (is_active);

create policy "read lessons" on public.lessons
  for select to anon, authenticated using (true);

create policy "read approved items only" on public.items
  for select to anon, authenticated using (status = 'approved');

create policy "read own profile" on public.profiles
  for select to authenticated using (user_id = (select auth.uid()));
create policy "update own profile" on public.profiles
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "read own progress" on public.item_progress
  for select to authenticated using (user_id = (select auth.uid()));
create policy "insert own progress" on public.item_progress
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "update own progress" on public.item_progress
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Sự kiện trả lời: chỉ thêm, không sửa, không xoá.
create policy "read own answers" on public.answer_events
  for select to authenticated using (user_id = (select auth.uid()));
create policy "insert own answers" on public.answer_events
  for insert to authenticated with check (user_id = (select auth.uid()));

create policy "read own completions" on public.lesson_completions
  for select to authenticated using (user_id = (select auth.uid()));
create policy "insert own completions" on public.lesson_completions
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "update own completions" on public.lesson_completions
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Báo lỗi: chỉ gửi lên, app không đọc lại.
create policy "insert own reports" on public.content_reports
  for insert to authenticated with check (user_id = (select auth.uid()));

-- ============================================================
-- Bucket âm thanh: đọc công khai, chỉ service role được ghi.
-- Đường dẫn file: {mã ngôn ngữ}/{số bài 2 chữ số}/{tên file}, ví dụ km/01/01_010.mp3
-- ============================================================
insert into storage.buckets (id, name, public)
values ('audio', 'audio', true)
on conflict (id) do nothing;

-- ============================================================
-- Thống kê cho hồ sơ thi. Schema 'stats' KHÔNG mở qua API,
-- chỉ xem bằng trình soạn SQL trên trang Supabase.
-- ============================================================
create schema if not exists stats;
revoke all on schema stats from public, anon, authenticated;

create view stats.overview as
select
  (select count(*) from public.profiles) as users,
  (select count(distinct user_id) from public.answer_events
     where answered_at > now() - interval '7 days') as active_users_7d,
  (select count(*) from public.lesson_completions) as lessons_completed,
  (select round(100.0 * avg(is_correct::int), 1) from public.answer_events
     where exercise_type not in ('recall_meaning', 'recall_speak')) as accuracy_pct,
  (select round(100.0 * avg(is_correct::int), 1) from public.answer_events
     where exercise_type in ('recall_meaning', 'recall_speak')) as self_remembered_pct;

-- ============================================================
-- Dữ liệu tham chiếu: ngôn ngữ đầu tiên của MVP.
-- ============================================================
insert into public.languages (code, name_vi, variety_vi, font_family, is_active)
values ('km', 'Tiếng Khmer', 'Nam Bộ', 'NotoSansKhmer', true);
