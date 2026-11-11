import type { Language } from './learning/types';

// Toàn bộ chữ tiếng Việt trên giao diện. Viết theo docs/cau-chu-giao-dien.md:
// gọi người dùng là "anh/chị", linh vật xưng "mình", không dùng dấu "·", không dùng từ
// chuyên môn ("đến hạn", "đồng bộ", "dữ liệu", "Leitner"), nút chỉ 2 đến 4 chữ.
// Tên ngôn ngữ luôn truyền vào, không viết cứng, để sau này thêm ngôn ngữ khác.

/** "Tiếng Khmer" → { full: "Tiếng Khmer", inSentence: "tiếng Khmer", bare: "Khmer" } */
export function languageWords(lang: Language) {
  const full = lang.nameVi;
  const bare = full.replace(/^tiếng\s+/i, '');
  return {
    full,
    inSentence: full.charAt(0).toLowerCase() + full.slice(1),
    bare,
    withVariety: lang.varietyVi ? `${full} ${lang.varietyVi}` : full,
  };
}
export type LanguageWords = ReturnType<typeof languageWords>;

export const strings = {
  appName: 'VN-EML',
  tagline: 'Học tiếng dân tộc thiểu số',
  disclaimer: 'Sản phẩm của nhóm khởi nghiệp, không phải ứng dụng của cơ quan nhà nước.',
  mascotLabel: 'Linh vật chim Lạc',

  common: {
    continue: 'Tiếp tục',
    check: 'Kiểm tra',
    cancel: 'Huỷ',
    send: 'Gửi',
    back: 'Quay lại',
    backHome: 'Về trang chính',
    exitSession: 'Thoát buổi học',
    exitReview: 'Thoát buổi ôn tập',
    sessionProgress: 'Tiến độ buổi học',
    reviewProgress: 'Tiến độ buổi ôn tập',
    playing: 'Đang phát',
    listenAgain: 'Nghe lại',
    listen: 'Nghe',
    romanization: 'Phiên âm',
    meaning: 'Nghĩa',
    level: (n: number) => `Cấp ${n}`,
    memoryLevel: (n: number) => `Cấp độ nhớ ${n}`,
  },

  feedback: {
    correct: 'Đúng rồi!',
    wrong: 'Chưa đúng',
    retryLater: 'Lát nữa mình làm lại câu này nhé.',
  },

  welcome: {
    available: (lang: LanguageWords) => `Hiện có: ${lang.withVariety}`,
    features: [
      'Bài học theo tình huống công việc thật',
      'Giọng người bản ngữ đọc từng câu',
      'Học được cả khi không có mạng',
    ],
    start: 'Bắt đầu học',
  },

  download: {
    loadingTitle: 'Đang tải bài học',
    loadingBody: 'Chỉ cần tải một lần. Sau đó anh/chị học được cả khi không có mạng.',
    progressLabel: 'Tiến độ tải bài',
    lessons: (done: number, total: number) => `${done}/${total} bài`,
    wifiTip: 'Nên dùng Wi-Fi nếu có.',
    loadingButton: 'Đang tải…',
    doneTitle: 'Đã tải xong!',
    doneBody: (total: number) => `${total} bài đã nằm trong máy. Giờ anh/chị học được cả khi không có mạng.`,
    doneBadge: 'Chữ và âm thanh đã tải đủ',
    enter: 'Vào học',
    offlineTitle: 'Chưa có mạng',
    offlineBody: (n: number) =>
      `Anh/chị vẫn học được ${n} bài đã tải. Khi có mạng, app sẽ tự tải bài mới và gửi tiến độ học.`,
    offlineSafe: 'Tiến độ học được lưu trong máy, không bị mất.',
    offlineLearn: 'Học các bài đã tải',
    retry: 'Thử lại',
    stillOffline: 'Vẫn chưa có mạng. App sẽ tự thử lại.',
  },

  tabs: {
    learn: 'Học',
    vocabulary: 'Sổ từ',
    more: 'Thêm',
    navLabel: 'Điều hướng chính',
  },

  home: {
    learning: (lang: LanguageWords) => `Đang học: ${lang.full}`,
    streak: (days: number) => `${days} ngày học`,
    greetingPending: (n: number) => `Chào anh/chị! Hôm nay mình ôn lại ${n} mục cũ, rồi học tiếp phần mới nhé.`,
    greetingReviewDone: 'Anh/chị ôn xong hết rồi, giỏi quá! Mình học thêm một phần mới nhé?',
    greetingAllDone: 'Hôm nay anh/chị đạt mục tiêu rồi, giỏi quá! Mai mình học tiếp nhé.',
    goalTitle: 'Mục tiêu hôm nay',
    goalRing: (done: number, total: number) => `Đã xong ${done} trên ${total} việc của hôm nay`,
    goalReview: (n: number) => `Ôn lại ${n} mục cũ`,
    goalReviewDone: (n: number) => `Đã ôn xong ${n} mục`,
    goalLearn: 'Học 1 phần mới',
    goalLearnLeft: 'Còn 1 phần mới để học',
    goalLearnDone: 'Đã học 1 phần mới',
    reviewButton: (n: number) => `Ôn tập hôm nay (${n} mục)`,
    reviewDone: (n: number) => `Đã ôn xong ${n} mục hôm nay`,
    currentLesson: (no: number) => `ĐANG HỌC BÀI ${no}`,
    part: (p: number) => `Phần ${p}`,
    partDone: (n: number) => `Đã học xong ${n} mục`,
    partItems: (n: number) => `${n} mục`,
    continuePart: (p: number) => `Học tiếp phần ${p}`,
    lessonTest: 'Kiểm tra cuối bài',
    lessonTestCount: (n: number) => `${n} câu`,
    lessonTestStart: 'Làm bài kiểm tra',
    lessonTestDone: 'Đã làm xong',
    otherLessons: 'Các bài khác',
    recommended: 'Nên học tiếp bài này',
    partsCount: (n: number) => `${n} phần`,
    lessonCompleted: 'Đã học xong',
    comingSoon: 'Sắp có',
    finalTitle: (no: number, title: string) => `Bài ${no}. ${title}`,
    finalLocked: (lastNo: number) => `Mở sau khi học xong bài 1 đến ${lastNo}`,
    openLesson: (no: number, title: string) => `Bài ${no}: ${title}`,
  },

  intro: {
    label: { word: 'TỪ MỚI', phrase: 'CỤM TỪ MỚI', dialogue_line: 'CÂU MỚI' },
  },

  match: {
    title: (lang: LanguageWords) => `Ghép ${lang.inSentence} với nghĩa đúng`,
    hint: 'Chạm một ô bên trái để nghe, rồi chạm nghĩa đúng bên phải.',
    progress: (done: number, total: number) => `Đã ghép đúng ${done}/${total} cặp`,
    allDone: 'Giỏi lắm! Ghép đúng hết rồi.',
  },

  listen: {
    title: 'Nghe và chọn nghĩa đúng',
    play: (lang: LanguageWords) => `Nghe lại câu ${lang.inSentence}`,
    optionsLabel: 'Các nghĩa để chọn',
    answerIs: 'Câu đúng là: ',
  },

  read: {
    title: 'Chữ này đọc thế nào?',
    hint: 'Chạm từng ô để nghe, rồi chọn ô đúng.',
    optionsLabel: 'Các âm thanh để chọn',
    option: (n: number) => `Âm thanh ${n}`,
    answerIs: (n: number) => `Âm thanh đúng là ô số ${n}. Chạm vào ô đó để nghe lại.`,
  },

  order: {
    title: (lang: LanguageWords) => `Xếp các từ thành câu ${lang.inSentence}`,
    playSample: 'Nghe câu mẫu',
    answerArea: 'Câu của anh/chị',
    bank: 'Các phần để chọn',
    remove: (part: string) => `Bỏ ${part} khỏi câu`,
    wrongTitle: 'Chưa đúng thứ tự',
    answerIs: 'Thứ tự đúng: ',
  },

  flashcard: {
    review: 'ÔN TẬP',
    practice: 'LUYỆN THÊM',
    promptSpeak: (lang: LanguageWords) => `Nói câu này bằng ${lang.inSentence}`,
    promptMeaning: 'Câu này nghĩa là gì?',
    hintSpeak: 'Hãy nói thành tiếng trước, rồi bấm xem đáp án để so với giọng người bản ngữ.',
    hintMeaning: 'Tự nhớ nghĩa tiếng Việt trong đầu, rồi bấm xem đáp án.',
    play: (lang: LanguageWords) => `Nghe câu ${lang.inSentence}`,
    showAnswer: 'Xem đáp án',
    listenNative: 'Nghe người bản ngữ',
    forgot: 'Chưa nhớ',
    forgotSub: 'Ôn lại ngày mai',
    remembered: 'Nhớ rồi',
    rememberedSub: (days: number) => `Ôn lại sau ${days} ngày`,
    toastUp: (level: number, days: number) => `Lên cấp ${level}. Ôn lại sau ${days} ngày.`,
    toastStay: (days: number) => `Vẫn ở cấp 5. Ôn lại sau ${days} ngày.`,
    toastDown: 'Về cấp 1. Mai mình ôn lại nhé.',
  },

  report: {
    link: 'Báo lỗi nội dung',
    title: 'Báo lỗi nội dung',
    item: (target: string, vi: string) => `Mục: ${target} (${vi})`,
    reasons: (lang: LanguageWords) =>
      [
        { code: 'wrong_script', label: `Chữ ${lang.bare} sai` },
        { code: 'wrong_romanization', label: 'Phiên âm sai' },
        { code: 'wrong_meaning', label: 'Nghĩa tiếng Việt sai' },
        { code: 'bad_audio', label: 'Âm thanh sai hoặc khó nghe' },
        { code: 'other', label: 'Lỗi khác' },
      ] as const,
    noteLabel: 'Ghi thêm nếu muốn',
    sent: 'Đã ghi nhận. Khi có mạng, app sẽ tự gửi đi.',
  },

  summary: {
    titleLearn: (part: number) => `Xong phần ${part}!`,
    titleReview: 'Ôn tập xong!',
    titleTest: 'Xong bài kiểm tra!',
    titlePractice: 'Luyện thêm xong!',
    subtitleLesson: (no: number, title: string) => `Bài ${no}: ${title}`,
    subtitleReview: 'Buổi ôn tập hôm nay',
    subtitlePractice: 'Cấp độ nhớ không bị thay đổi',
    mascotLabel: 'Linh vật chim Lạc chúc mừng',
    statCorrect: 'câu đúng',
    statRemembered: 'nhớ rồi',
    statNewItems: 'mục mới',
    statReviewed: 'mục đã ôn',
    statPracticed: 'mục đã luyện',
    statPercent: 'tỉ lệ đúng',
    statTime: 'thời gian',
    minutes: (n: number) => `${n} phút`,
    learnNoteBefore: 'Anh/chị vừa học ',
    learnNoteBold: (n: number) => `${n} mục mới`,
    learnNoteAfter: '. Ngày mai app sẽ nhắc ôn lại cho nhớ lâu.',
    reviewNote: 'Mục nào đã nhớ sẽ được ôn lại sau lâu hơn. Mục chưa nhớ sẽ ôn lại vào ngày mai.',
    testPassNote: 'Anh/chị đã hoàn thành bài này. Giỏi lắm!',
    testRetryNote: 'Bài này đã được tính là hoàn thành. Anh/chị nên ôn lại thêm một lần cho chắc nhé.',
    practiceNote: 'Luyện thêm giúp nhớ lâu hơn. Cấp độ nhớ của các mục không bị thay đổi.',
    streakTitle: (days: number) => `Học liền ${days} ngày rồi!`,
    weekdays: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    goalDoneBefore: 'Hôm nay anh/chị đã ',
    goalDoneBold: 'đạt mục tiêu',
    goalDoneAfter: '.',
    goalLeft: (n: number) => `Còn ${n} việc nữa là đạt mục tiêu hôm nay.`,
  },

  vocabulary: {
    title: 'Sổ từ',
    learned: (total: number) => `/ ${total} mục đã thuộc`,
    chartLabel: (counts: number[]) =>
      `Số mục theo cấp độ nhớ: ${counts
        .map((n, i) => (i === 4 ? `cấp 5 đã thuộc có ${n}` : `cấp ${i + 1} có ${n}`))
        .join(', ')}`,
    levelShort: (n: number) => `Cấp ${n}`,
    mastered: 'Đã thuộc',
    filterLabel: 'Lọc theo cấp độ nhớ',
    all: 'Tất cả',
    emptyFilter: 'Chưa có mục nào ở cấp này.',
    listen: (vi: string) => `Nghe ${vi}`,
    open: (vi: string) => `Xem mục ${vi}`,
    practice: 'Luyện thêm các mục chưa thuộc',
    practiceNote: 'Luyện thêm thoải mái, cấp độ nhớ không bị thay đổi.',
    emptyTitle: 'Sổ từ đang trống',
    emptyBody: 'Học xong phần đầu tiên, các từ và câu sẽ hiện ở đây.',
    emptyCta: 'Học phần đầu tiên',
  },

  more: {
    title: 'Thêm',
    offlineTitle: 'Học không cần mạng',
    downloadedSome: (done: number, total: number, size: string) =>
      `Đã tải ${done} trên ${total} bài (${size}). Khi có bài mới, app sẽ báo ở đây.`,
    downloading: 'Đang tải chữ và âm thanh…',
    downloadedAll: (total: number) => `Đã tải đủ ${total} bài. Anh/chị học được cả khi không có mạng.`,
    downloadButton: 'Tải tất cả bài',
    downloadingButton: 'Đang tải…',
    downloadedButton: 'Đã tải xong',
    theme: 'Giao diện',
    themeSystem: 'Theo máy',
    themeLight: 'Sáng',
    themeDark: 'Tối',
    textSize: 'Cỡ chữ',
    textLarge: 'Lớn',
    textXLarge: 'Rất lớn',
    sound: 'Âm thanh báo đúng sai',
    pendingReports: (n: number) => `${n} báo lỗi đang chờ gửi.`,
    pendingReportsNote: 'App sẽ tự gửi khi có mạng.',
    credits: 'Ghi công nguồn tài liệu',
    guide: 'Hướng dẫn sử dụng',
    about: 'Giới thiệu app',
    devCheck: 'Kiểm tra giao diện (chỉ bản phát triển)',
    version: (v: string) => `VN-EML, học tiếng dân tộc thiểu số (phiên bản ${v})`,
  },

  credits: {
    title: 'Ghi công nguồn tài liệu',
    contentTitle: 'Nội dung bài học',
    contentBody:
      'Chữ, phiên âm, nghĩa và âm thanh do người bản ngữ làm và duyệt. Mỗi mục đều ghi rõ nguồn và giấy phép.',
    contentTodo: 'Danh sách nguồn của từng bài sẽ hiện ở đây khi có nội dung đã duyệt.',
    fontsTitle: 'Phông chữ',
    fontBeVietnam: 'Be Vietnam Pro, của nhóm tác giả Be Vietnam Pro. Giấy phép SIL Open Font License 1.1.',
    fontNoto: 'Noto Sans Khmer, của nhóm tác giả Noto. Giấy phép SIL Open Font License 1.1.',
    imagesTitle: 'Hình ảnh',
    mascot: 'Linh vật chim Lạc lấy cảm hứng từ hoa văn trống đồng Đông Sơn, được tạo với sự hỗ trợ của công cụ AI sinh ảnh.',
    drumTodo: 'Hình mặt trống đồng: đang xác định nguồn và giấy phép.',
  },

  guide: {
    title: 'Hướng dẫn sử dụng',
    steps: [
      { title: 'Tải bài khi có Wi-Fi', body: 'Tải một lần là học được cả khi không có mạng.' },
      { title: 'Mỗi ngày ôn tập trước', body: 'Bấm "Ôn tập hôm nay" ở trang chính để ôn lại các mục cũ.' },
      { title: 'Rồi học tiếp phần mới', body: 'Mỗi phần khoảng 10 phút, gồm 6 đến 8 từ hoặc câu mới.' },
      { title: 'Chạm nút loa để nghe', body: 'Nghe giọng người bản ngữ bao nhiêu lần cũng được.' },
      {
        title: 'Thẻ nhớ: nói thành tiếng',
        body: 'Tự nói câu trả lời trước, rồi bấm "Xem đáp án" để so với giọng người bản ngữ.',
      },
      { title: 'Thấy lỗi thì báo', body: 'Bấm "Báo lỗi nội dung" dưới mỗi mục. Không có mạng app vẫn ghi lại.' },
    ],
  },

  about: {
    title: 'Giới thiệu app',
    body: 'VN-EML giúp cán bộ xã, công an, giáo viên và nhân viên y tế học tiếng dân tộc thiểu số để trò chuyện với bà con. Bài học theo tình huống công việc thật, giọng người bản ngữ đọc từng câu.',
    current: (lang: LanguageWords) => `Hiện có: ${lang.withVariety}.`,
  },
};

// Chữ chỉ dùng trên màn hình kiểm tra của lập trình viên (app/dev-check.tsx), không đến tay người học.
export const devStrings = {
  title: 'Kiểm tra giao diện',
  note: 'Màn hình này chỉ để kiểm tra màu, font và các trạng thái mẫu khi dựng app.',
  fontsUi: 'Font giao diện (Be Vietnam Pro)',
  fontsTarget: 'Font chữ Khmer (Noto Sans Khmer)',
  sampleVi: 'Chào anh/chị! Hôm nay mình ôn lại 12 mục cũ nhé.',
  weightRegular: 'Thường',
  weightSemiBold: 'Hơi đậm',
  weightBold: 'Đậm',
  weightExtraBold: 'Rất đậm',
  colors: 'Màu chính',
  segmenter: 'Cắt chữ theo cụm (Intl.Segmenter)',
  yes: 'có',
  no: 'không',
  demoTitle: 'Trạng thái mẫu',
  showWelcome: 'Xem lại màn hình chào',
  showOffline: 'Xem màn hình chưa có mạng',
  vocabEmptyOn: 'Sổ từ: xem khi trống',
  vocabEmptyOff: 'Sổ từ: xem khi có mục',
  reviewDoneOn: 'Trang chính: đã ôn xong',
  reviewDoneOff: 'Trang chính: còn mục cần ôn',
  openTest: 'Làm bài kiểm tra cuối bài 1',
  resetProgress: 'Đặt lại tiến độ mẫu',
};
