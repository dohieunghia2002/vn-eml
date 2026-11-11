import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { usePlayback } from '../audio/usePlayback';
import { AnswerFooter } from '../components/AnswerFooter';
import { OptionTile } from '../components/OptionTile';
import { SpeakerButton } from '../components/SpeakerButton';
import { TargetText } from '../components/TargetText';
import { strings as s } from '../strings';
import type { ExerciseProps } from './types';

// Dạng 4: sắp xếp các phần thành câu, dùng câu đã tách sẵn bằng '|' (cột km_segmented).
// Chạm phần ở dưới để đưa lên câu, chạm phần ở trên để bỏ ra.
// Bản mẫu: 10-sap-xep-cau, 11-sap-xep-cau-dung.
export function OrderWords({ step, lang, willRetry, onDone }: ExerciseProps<'order_words'>) {
  const { item, parts, startOrder } = step;
  const [answer, setAnswer] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [widths, setWidths] = useState<Record<number, number>>({});
  const { playingId, play } = usePlayback();

  // So theo chữ, không theo vị trí: hai phần giống hệt nhau đổi chỗ vẫn là đúng.
  const correct = answer.map((i) => parts[i]).join('|') === parts.join('|');

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" contentContainerClassName="gap-4 px-5 pb-6 pt-2">
        <Text accessibilityRole="header" className="font-ui-extrabold text-[22px] leading-[30px] text-ink">
          {s.order.title(lang)}
        </Text>

        <View className="flex-row items-center gap-3">
          <SpeakerButton
            variant="round"
            size={52}
            playing={playingId === item.id}
            onPress={() => play(item.id)}
            accessibilityLabel={s.order.playSample}
          />
          <View className="flex-1 rounded-2xl border-2 border-line bg-surface px-3.5 py-3">
            <Text className="font-ui-bold text-[19px] leading-[26px] text-ink">{item.vi}</Text>
          </View>
        </View>

        <View className="min-h-[140px]" accessibilityLabel={s.order.answerArea}>
          <View className="absolute left-0 right-0 top-[64px] h-0.5 bg-line" />
          <View className="absolute left-0 right-0 top-[130px] h-0.5 bg-line" />
          <View className="flex-row flex-wrap content-start gap-2.5 py-2.5">
            {answer.map((partIndex, pos) => (
              <OptionTile
                key={partIndex}
                state={checked ? (parts[partIndex] === parts[pos] ? 'correct' : 'wrong') : 'idle'}
                accessibilityRole="button"
                accessibilityLabel={s.order.remove(parts[partIndex])}
                disabled={checked}
                onPress={() => setAnswer((a) => a.filter((x) => x !== partIndex))}
                layoutClassName="min-h-[52px] items-center justify-center px-3.5"
              >
                {({ textClassName }) => <TargetText text={parts[partIndex]} size="md" colorClassName={textClassName} />}
              </OptionTile>
            ))}
          </View>
        </View>

        <View className="flex-row flex-wrap justify-center gap-2.5 pt-2" accessibilityLabel={s.order.bank}>
          {startOrder.map((partIndex) =>
            answer.includes(partIndex) ? (
              <View
                key={partIndex}
                className="h-[56px] rounded-[14px] bg-line"
                style={{ width: widths[partIndex] ?? 96 }}
                accessibilityElementsHidden
                importantForAccessibility="no"
              />
            ) : (
              <View
                key={partIndex}
                onLayout={(e) => {
                  const w = Math.round(e.nativeEvent.layout.width);
                  setWidths((prev) => (prev[partIndex] === w ? prev : { ...prev, [partIndex]: w }));
                }}
              >
                <OptionTile
                  state="idle"
                  accessibilityRole="button"
                  accessibilityLabel={parts[partIndex]}
                  disabled={checked}
                  onPress={() => setAnswer((a) => [...a, partIndex])}
                  layoutClassName="min-h-[52px] min-w-[96px] items-center justify-center px-3.5"
                >
                  {({ textClassName }) => <TargetText text={parts[partIndex]} size="md" colorClassName={textClassName} />}
                </OptionTile>
              </View>
            ),
          )}
        </View>
        {checked && <View className="h-44" />}
      </ScrollView>

      <AnswerFooter
        checked={checked}
        correct={correct}
        canCheck={answer.length === parts.length}
        onCheck={() => setChecked(true)}
        onContinue={() => onDone({ correct })}
        wrongTitle={s.order.wrongTitle}
        wrongDetail={
          <View className="gap-1">
            <View className="flex-row flex-wrap items-center gap-x-2">
              <Text className="font-ui text-[17px] leading-[25px] text-bad-ink">{s.order.answerIs}</Text>
              {parts.map((p, i) => (
                <TargetText key={i} text={p} size="sm" colorClassName="text-bad-ink" />
              ))}
            </View>
            {willRetry && <Text className="font-ui text-[17px] leading-[25px] text-bad-ink">{s.feedback.retryLater}</Text>}
          </View>
        }
      />
    </View>
  );
}
