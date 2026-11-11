import type { ReactNode } from 'react';
import { Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { strings as s } from '../strings';
import { neutral } from '../theme/palette';
import { BlockButton } from './BlockButton';
import { Icon } from './Icon';
import { useSlideUp } from './useSlideUp';

// Phần dưới cùng của khuôn câu hỏi chung (docs/lo-trinh-hoc-tap.md, mục 6):
// trước khi chấm là nút lớn "Kiểm tra"; sau khi chấm, dải phản hồi trượt lên từ đáy,
// xanh "Đúng rồi!" hoặc đỏ "Chưa đúng" kèm đáp án đúng, và nút "Tiếp tục".
// TODO: phát âm báo ngắn khi chấm (tắt được ở mục Thêm) khi có file âm báo.

type Props = {
  checked: boolean;
  correct: boolean;
  canCheck: boolean;
  onCheck: () => void;
  onContinue: () => void;
  wrongTitle?: string;
  correctTitle?: string;
  /** Hiện thêm trong dải phản hồi khi trả lời chưa đúng (đáp án đúng...). */
  wrongDetail?: ReactNode;
  /** Thay nút "Kiểm tra" bằng một dòng chữ (dạng ghép cặp tự chấm từng cặp). */
  noteInsteadOfCheck?: string;
};

export function AnswerFooter({
  checked,
  correct,
  canCheck,
  onCheck,
  onContinue,
  wrongTitle = s.feedback.wrong,
  correctTitle = s.feedback.correct,
  wrongDetail,
  noteInsteadOfCheck,
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <>
      <View className="px-5 pt-4" style={{ paddingBottom: 28 + insets.bottom }}>
        {noteInsteadOfCheck !== undefined ? (
          <Text className="py-3 text-center font-ui-semibold text-[16px] text-muted">{noteInsteadOfCheck}</Text>
        ) : (
          <BlockButton label={s.common.check} disabled={!canCheck || checked} onPress={onCheck} />
        )}
      </View>
      {checked && (
        <FeedbackSheet
          correct={correct}
          title={correct ? correctTitle : wrongTitle}
          detail={correct ? undefined : wrongDetail}
          onContinue={onContinue}
        />
      )}
    </>
  );
}

function FeedbackSheet({
  correct,
  title,
  detail,
  onContinue,
}: {
  correct: boolean;
  title: string;
  detail?: ReactNode;
  onContinue: () => void;
}) {
  const insets = useSafeAreaInsets();
  const slide = useSlideUp();
  return (
    <Animated.View style={[{ position: 'absolute', left: 0, right: 0, bottom: 0 }, slide]}>
      <View
        className={`gap-3 rounded-t-[22px] px-5 pt-5 ${correct ? 'bg-ok-bg' : 'bg-bad-bg'}`}
        style={{ paddingBottom: 28 + insets.bottom }}
      >
        <View className="flex-row items-center gap-3">
          <View className={`h-11 w-11 items-center justify-center rounded-full ${correct ? 'bg-ok' : 'bg-bad'}`}>
            <Icon name={correct ? 'check' : 'close'} color={neutral.white} size={correct ? 24 : 22} strokeWidth={3} />
          </View>
          <Text
            accessibilityRole="alert"
            className={`flex-1 font-ui-extrabold text-[21px] leading-[28px] ${correct ? 'text-ok-ink' : 'text-bad-ink'}`}
          >
            {title}
          </Text>
        </View>
        {detail}
        <BlockButton label={s.common.continue} variant={correct ? 'ok' : 'bad'} onPress={onContinue} />
      </View>
    </Animated.View>
  );
}
