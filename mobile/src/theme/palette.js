// Bảng màu VN-EML theo tên vai trò. Nguồn: docs/bang-mau.md (chốt ngày 7/11/2026).
//
// ĐÂY LÀ CHỖ DUY NHẤT ghi mã màu. tailwind.config.js và app/_layout.tsx đều đọc từ file này.
// Trong code chỉ dùng tên vai trò qua class, ví dụ `bg-primary`, `text-ink`, `border-line`.
// Một class tự đổi màu theo chế độ sáng/tối, không cần viết thêm `dark:`.
//
// File viết bằng CommonJS vì tailwind.config.js (chạy bằng Node) cũng phải đọc được.

const palette = {
  light: {
    bg: '#FBF4EA',
    surface: '#FFFFFF',
    ink: '#1E1B2E',
    muted: '#5A5468',
    line: '#EBDCC8',
    primary: '#E8590C',
    'primary-shadow': '#B4440A',
    'primary-soft': '#FFE8D6',
    'primary-text': '#B4440A',
    secondary: '#2B4ACB',
    'secondary-shadow': '#1F3596',
    'secondary-soft': '#E5EAFF',
    'secondary-text': '#2B4ACB',
    accent: '#F2B230',
    'accent-soft': '#FDEBC4',
    'accent-ink': '#6E4600',
    ok: '#2B8A3E',
    'ok-bg': '#E3F7E8',
    'ok-ink': '#1E6B30',
    'ok-btn': '#2B8A3E',
    'ok-btn-shadow': '#1E6B30',
    bad: '#C92A2A',
    'bad-bg': '#FFE5E5',
    'bad-ink': '#A12020',
    'bad-btn': '#C92A2A',
    'bad-btn-shadow': '#8F1D1D',
    'disabled-bg': '#EDE6DB',
    'disabled-ink': '#5A5468',
    'toast-bg': '#1E1B2E',
    'toast-ink': '#FFFFFF',
    pattern: '#D9822B',
  },
  dark: {
    bg: '#14121C',
    surface: '#1E1B2A',
    ink: '#F1EEF8',
    muted: '#B3ADC6',
    line: '#34304A',
    primary: '#E8590C',
    'primary-shadow': '#8A3508',
    'primary-soft': '#3A2014',
    'primary-text': '#FF8A3D',
    secondary: '#4263EB',
    'secondary-shadow': '#2B4ACB',
    'secondary-soft': '#232A4D',
    'secondary-text': '#91A7FF',
    accent: '#F2B230',
    'accent-soft': '#3A2C0B',
    'accent-ink': '#FFD480',
    ok: '#37B24D',
    'ok-bg': '#12301B',
    'ok-ink': '#8CE99A',
    'ok-btn': '#2B8A3E',
    'ok-btn-shadow': '#1B5E27',
    bad: '#F03E3E',
    'bad-bg': '#3B1414',
    'bad-ink': '#FFA8A8',
    'bad-btn': '#E03131',
    'bad-btn-shadow': '#A12020',
    'disabled-bg': '#2A2738',
    'disabled-ink': '#9A94AD',
    'toast-bg': '#F1EEF8',
    'toast-ink': '#14121C',
    pattern: '#F2B230',
  },
};

// Hai màu trung tính, giống nhau ở cả hai chế độ: chữ và biểu tượng trắng trên nút màu,
// lớp phủ tối phía sau bảng trượt.
const neutral = { white: '#FFFFFF', black: '#000000' };

const roleNames = Object.keys(palette.light);

// '#E8590C' -> '232 89 12' (dạng NativeWind cần để dùng được độ mờ, ví dụ bg-primary/50)
function hexToRgbChannels(hex) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

// Biến CSS của một chế độ: { '--color-bg': '251 244 234', ... }
/** @param {'light' | 'dark'} scheme */
function cssVarsFor(scheme) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const name of roleNames) out[`--color-${name}`] = hexToRgbChannels(palette[scheme][name]);
  return out;
}

module.exports = { palette, neutral, roleNames, cssVarsFor };
