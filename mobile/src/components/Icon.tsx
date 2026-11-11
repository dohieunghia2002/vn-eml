import Svg, { Circle, Path, Rect } from 'react-native-svg';

// Biểu tượng chép từ bản mẫu giao diện (khung 24 x 24, nét tròn). Chỉ để trang trí:
// nút chứa biểu tượng phải tự có accessibilityLabel.
export type IconName =
  | 'close'
  | 'check'
  | 'speaker'
  | 'speakerSmall'
  | 'calendarCheck'
  | 'route'
  | 'book'
  | 'dots'
  | 'refresh'
  | 'chevronRight'
  | 'chevronLeft'
  | 'flag'
  | 'lock'
  | 'download'
  | 'message';

const defaultStroke: Record<IconName, number> = {
  close: 2.6,
  check: 3,
  speaker: 2.2,
  speakerSmall: 2.2,
  calendarCheck: 2,
  route: 2,
  book: 2,
  dots: 2,
  refresh: 2.4,
  chevronRight: 2.2,
  chevronLeft: 2.4,
  flag: 2.2,
  lock: 2.2,
  download: 2.4,
  message: 2,
};

type Props = {
  name: IconName;
  color: string;
  size?: number;
  strokeWidth?: number;
};

export function Icon({ name, color, size = 24, strokeWidth }: Props) {
  const p = {
    stroke: color,
    strokeWidth: strokeWidth ?? defaultStroke[name],
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'close' && <Path {...p} d="M6 6l12 12M18 6L6 18" />}
      {name === 'check' && <Path {...p} d="M5 12.5l4.5 4.5L19 7.5" />}
      {(name === 'speaker' || name === 'speakerSmall') && (
        <>
          <Path {...p} d="M4 9v6h4l5 4V5L8 9H4z" />
          <Path {...p} d="M16 9a4 4 0 0 1 0 6" />
          {name === 'speaker' && <Path {...p} d="M18.5 6.5a8 8 0 0 1 0 11" />}
        </>
      )}
      {name === 'calendarCheck' && (
        <>
          <Rect {...p} x={3} y={5} width={18} height={16} rx={2} />
          <Path {...p} d="M3 10h18M8 3v4M16 3v4" />
          <Path {...p} d="M9 15l2 2 4-4" />
        </>
      )}
      {name === 'route' && (
        <>
          <Circle {...p} cx={6} cy={19} r={2} />
          <Circle {...p} cx={18} cy={5} r={2} />
          <Path {...p} d="M8 19h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7" />
        </>
      )}
      {name === 'book' && (
        <>
          <Path {...p} d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z" />
          <Path {...p} d="M4 19v2h15" />
          <Path {...p} d="M8 7h7" />
        </>
      )}
      {name === 'dots' && (
        <>
          <Circle {...p} cx={5} cy={12} r={1.5} />
          <Circle {...p} cx={12} cy={12} r={1.5} />
          <Circle {...p} cx={19} cy={12} r={1.5} />
        </>
      )}
      {name === 'refresh' && (
        <>
          <Path {...p} d="M20 11a8 8 0 1 0-2.3 5.7" />
          <Path {...p} d="M20 5v6h-6" />
        </>
      )}
      {name === 'chevronRight' && <Path {...p} d="M9 6l6 6-6 6" />}
      {name === 'chevronLeft' && <Path {...p} d="M15 6l-6 6 6 6" />}
      {name === 'flag' && (
        <>
          <Path {...p} d="M5 21V4" />
          <Path {...p} d="M5 4h11l-2 4 2 4H5" />
        </>
      )}
      {name === 'lock' && (
        <>
          <Rect {...p} x={5} y={11} width={14} height={10} rx={2} />
          <Path {...p} d="M8 11V8a4 4 0 0 1 8 0v3" />
        </>
      )}
      {name === 'download' && (
        <>
          <Path {...p} d="M12 4v11" />
          <Path {...p} d="M7 10l5 5 5-5" />
          <Path {...p} d="M5 20h14" />
        </>
      )}
      {name === 'message' && <Path {...p} d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.6A8 8 0 1 1 21 12z" />}
    </Svg>
  );
}
