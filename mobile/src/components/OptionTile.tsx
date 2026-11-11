import type { ReactNode } from 'react';

import { useThemeColors, type ThemeColors } from '../theme/useThemeColors';
import { Block } from './Block';

// Ô lựa chọn trong bài tập. Bốn trạng thái: thường, đang chọn, đúng, sai.
// Báo đúng sai không chỉ bằng màu: dải phản hồi luôn kèm biểu tượng và chữ (docs/bang-mau.md).
export type TileState = 'idle' | 'selected' | 'correct' | 'wrong';

const tiles: Record<TileState, { face: string; shadow: string; text: string; icon: keyof ThemeColors }> = {
  idle: { face: 'border-2 border-line bg-surface', shadow: 'bg-line', text: 'text-ink', icon: 'ink' },
  selected: { face: 'border-2 border-secondary bg-secondary-soft', shadow: 'bg-secondary', text: 'text-ink', icon: 'secondary-text' },
  correct: { face: 'border-2 border-ok bg-ok-bg', shadow: 'bg-ok', text: 'text-ok-ink', icon: 'ok-ink' },
  wrong: { face: 'border-2 border-bad bg-bad-bg', shadow: 'bg-bad', text: 'text-bad-ink', icon: 'bad-ink' },
};

type Props = {
  state: TileState;
  onPress?: () => void;
  disabled?: boolean;
  /** Bố cục bên trong mặt ô, ví dụ 'min-h-[60px] justify-center px-4 py-2.5'. */
  layoutClassName: string;
  className?: string;
  accessibilityLabel: string;
  accessibilityRole?: 'radio' | 'button';
  children: (look: { textClassName: string; iconColor: string }) => ReactNode;
};

export function OptionTile({
  state,
  onPress,
  disabled,
  layoutClassName,
  className,
  accessibilityLabel,
  accessibilityRole = 'radio',
  children,
}: Props) {
  const c = useThemeColors();
  const t = tiles[state];
  return (
    <Block
      className={className}
      faceClassName={`${t.face} ${layoutClassName}`}
      shadowClassName={t.shadow}
      onPress={onPress ?? (() => {})}
      disabled={disabled}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityRole === 'radio' ? { checked: state !== 'idle' } : { selected: state === 'selected' }}
    >
      {children({ textClassName: t.text, iconColor: c[t.icon] })}
    </Block>
  );
}
