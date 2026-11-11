// Thông số học tập, theo mục 14 của docs/lo-trinh-hoc-tap.md.
// Chỉnh số ở đây, không sửa trong logic.
export const learningConfig = {
  /** Số mục mới mỗi phần (khoảng 6 đến 8). */
  newItemsPerPart: 7,
  /** Số cặp trong một câu ghép cặp. */
  matchPairsCount: 4,
  /** Số câu trong bài kiểm tra cuối bài. */
  testQuestionCount: 10,
  /** Đúng dưới tỉ lệ này thì gợi ý ôn lại bài (không chặn người học). */
  testPassRatio: 0.7,
  /** Số ngày chờ trước khi ôn lại, theo cấp độ nhớ 1 đến 5. */
  levelIntervalsDays: [1, 2, 4, 7, 14],
  /** Số mục tối đa mỗi buổi ôn. */
  maxReviewItems: 20,
  /** Câu có nhiều phần hơn số này thì không dùng cho dạng sắp xếp câu. */
  maxOrderParts: 8,
  /** Số câu tối đa mỗi lần "Luyện thêm" trong Sổ từ. */
  practiceMaxQuestions: 10,
  /** Thời gian giả lập phát âm thanh, khi chưa có file âm thanh thật (mili giây). */
  fakeAudioMs: 1400,
} as const;
