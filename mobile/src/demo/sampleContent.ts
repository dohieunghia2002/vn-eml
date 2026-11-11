import type { Item, ItemType, Language } from '../learning/types';

// =====================================================================================
// DỮ LIỆU MẪU ĐỂ DỰNG GIAO DIỆN. KHÔNG PHẢI NỘI DUNG THẬT, KHÔNG ĐƯỢC PHÁT HÀNH.
// - Chữ Khmer và phiên âm là ô giữ chỗ [KM_..], [PHIÊN_ÂM_..]. Claude Code không tự viết
//   chữ Khmer, phiên âm hay bản dịch (CLAUDE.md, mục 3).
// - Nghĩa tiếng Việt và mọi con số chỉ là ví dụ, phần lớn lấy từ bản mẫu giao diện.
// TODO(content): bước 6 thay file này bằng nội dung đã duyệt, tải từ Supabase về SQLite.
// =====================================================================================

export const demoLanguage: Language = { code: 'km', nameVi: 'Tiếng Khmer', varietyVi: 'Nam Bộ' };

export type DemoLesson = {
  no: number;
  titleVi: string;
  /** Thứ tự gợi ý học (tab "Bài học" trong Google Sheet). */
  recommendedOrder: number;
  /** Số mục của từng phần. Mảng rỗng: bài chưa có mục nào được duyệt ("Sắp có"). */
  partSizes: number[];
};

export const demoLessons: DemoLesson[] = [
  { no: 1, titleVi: 'Chào hỏi và cách xưng hô', recommendedOrder: 0, partSizes: [7, 7, 7, 6] },
  { no: 2, titleVi: 'Giới thiệu bản thân và cơ quan', recommendedOrder: 1, partSizes: [7, 7, 7] },
  { no: 3, titleVi: 'Hỏi thông tin cá nhân, giấy tờ', recommendedOrder: 3, partSizes: [7, 7, 6] },
  { no: 4, titleVi: 'Số đếm, ngày, giờ', recommendedOrder: 2, partSizes: [7, 7, 7, 6] },
  { no: 5, titleVi: 'Hỏi đường và địa điểm trong ấp, xã', recommendedOrder: 4, partSizes: [7, 7, 7, 7] },
  { no: 6, titleVi: 'Gia đình và người thân', recommendedOrder: 5, partSizes: [7, 7, 6] },
  { no: 7, titleVi: 'Sức khoẻ và khám bệnh cơ bản', recommendedOrder: 6, partSizes: [7, 7, 7, 6] },
  { no: 8, titleVi: 'Giải thích một thủ tục hành chính đơn giản', recommendedOrder: 7, partSizes: [7, 7, 6] },
  { no: 9, titleVi: 'Lễ hội Khmer và cách ứng xử khi đến chùa', recommendedOrder: 8, partSizes: [] },
  { no: 10, titleVi: 'Ôn tập: hội thoại tổng hợp', recommendedOrder: 9, partSizes: [7, 7, 7] },
];

/** Bài ôn tập tổng hợp, chỉ mở khi đã xong các bài trước. */
export const FINAL_LESSON_NO = 10;
/** Tổng số mục đã duyệt (hiện ở Sổ từ). */
export const demoTotalApprovedItems = 250;
/** Số bài tải về được và dung lượng (hiện ở màn hình tải bài và mục Thêm). */
export const demoDownloadableLessons = 8;
export const demoDownloadSize = '2,1 MB';

function item(id: string, type: ItemType, vi: string, itemNo: number, segmented?: string): Item {
  return {
    id,
    lessonNo: 1,
    itemNo,
    type,
    vi,
    target: `[KM_${id}]`,
    targetSegmented: segmented,
    romanization: `[PHIÊN_ÂM_${id}]`,
  };
}

export const demoItems: Item[] = [
  item('01', 'word', 'Xin chào', 10),
  item('02', 'word', 'Cảm ơn', 20),
  item('03', 'word', 'Tạm biệt', 30),
  item('04', 'word', 'Xin lỗi', 40),
  item('05', 'phrase', 'Anh/chị khoẻ không?', 50, '[KM_Q]|[KM_R]|[KM_S]'),
  item('06', 'phrase', 'Hẹn gặp lại', 60),
  item('07', 'phrase', 'Tôi là cán bộ xã', 70, '[KM_A]|[KM_B]|[KM_C]|[KM_D]'),
  item('08', 'phrase', 'Rất vui được gặp anh/chị', 80, '[KM_T]|[KM_U]|[KM_V]|[KM_W]'),
  item('09', 'phrase', 'Anh/chị tên là gì?', 90, '[KM_X]|[KM_Y]|[KM_Z]'),
  item('12', 'dialogue_line', 'Anh/chị đến làm giấy tờ gì?', 120, '[KM_E]|[KM_F]|[KM_G]|[KM_H]|[KM_I]'),
  item('13', 'phrase', 'Mời anh/chị ngồi', 130, '[KM_J]|[KM_K]|[KM_L]'),
  item('14', 'dialogue_line', 'Cho tôi xem căn cước', 140, '[KM_M]|[KM_N]|[KM_O]|[KM_P]'),
  item('15', 'word', 'Ông', 150),
  item('16', 'word', 'Bà', 160),
  item('17', 'word', 'Anh', 170),
  item('18', 'word', 'Chị', 180),
  item('19', 'word', 'Em', 190),
  item('20', 'word', 'Số điện thoại', 200),
  item('21', 'word', 'Ngày sinh', 210),
];

/** Cấp độ nhớ ban đầu của các mục "đã học" (12 mục cần ôn hôm nay, như bản mẫu). */
export const demoInitialLevels: Record<string, number> = {
  '01': 5,
  '02': 5,
  '03': 4,
  '04': 2,
  '05': 3,
  '06': 2,
  '07': 2,
  '12': 3,
  '13': 4,
  '14': 5,
  '20': 1,
  '21': 1,
};

/** Các mục của từng phần. Phần không có trong bảng thì lấy lần lượt từ danh sách mẫu. */
const demoPartItemIds: Record<string, string[]> = {
  '1-3': ['15', '16', '17', '18', '19', '08', '09'],
};

export function findLesson(no: number): DemoLesson | undefined {
  return demoLessons.find((l) => l.no === no);
}

export function findItem(id: string): Item | undefined {
  return demoItems.find((i) => i.id === id);
}

export function getPartItems(lessonNo: number, partNo: number): Item[] {
  const ids = demoPartItemIds[`${lessonNo}-${partNo}`];
  if (ids) return ids.map((id) => findItem(id)).filter((i): i is Item => !!i);
  const size = findLesson(lessonNo)?.partSizes[partNo - 1] ?? 7;
  const start = ((partNo - 1) * 7) % demoItems.length;
  return Array.from({ length: size }, (_, k) => demoItems[(start + k) % demoItems.length]);
}

export function getLessonItems(_lessonNo: number): Item[] {
  return demoItems;
}
