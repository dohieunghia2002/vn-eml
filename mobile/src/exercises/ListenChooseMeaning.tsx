import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { usePlayback } from '../audio/usePlayback';
import { AnswerFooter } from '../components/AnswerFooter';
import { OptionTile, type TileState } from '../components/OptionTile';
import { SpeakerButton } from '../components/SpeakerButton';
import { strings as s } from '../strings';
import type { ExerciseProps } from './types';

// Dạng 1: nghe âm thanh, chọn nghĩa tiếng Việt (4 lựa chọn).
// Bản mẫu: 06-nghe-chon-nghia, 07 (đúng), 08 (sai).
export function ListenChooseMeaning({ step, lang, willRetry, onDone }: ExerciseProps<'listen_choose_meaning'>) {
  const { item, options } = step;
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const { playingId, play } = usePlayback();

  useEffect(() => {
    play(item.id);
  }, [item.id, play]);

  const correct = selected === item.id;
  const stateOf = (id: string): TileState => {
    if (checked && id === item.id) return 'correct';
    if (checked && id === selected) return 'wrong';
    if (!checked && id === selected) return 'selected';
    return 'idle';
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" contentContainerClassName="gap-4 px-5 pb-6 pt-2">
        <Text accessibilityRole="header" className="font-ui-extrabold text-[22px] leading-[30px] text-ink">
          {s.listen.title}
        </Text>
        <View className="items-center pb-3 pt-1.5">
          <SpeakerButton
            variant="hero"
            playing={playingId === item.id}
            onPress={() => play(item.id)}
            accessibilityLabel={s.listen.play(lang)}
          />
        </View>
        <View className="gap-3.5" accessibilityRole="radiogroup" accessibilityLabel={s.listen.optionsLabel}>
          {options.map((o) => (
            <OptionTile
              key={o.id}
              state={stateOf(o.id)}
              disabled={checked}
              onPress={() => setSelected(o.id)}
              accessibilityLabel={o.vi}
              layoutClassName="min-h-[60px] justify-center px-4 py-2.5"
            >
              {({ textClassName }) => <Text className={`font-ui-bold text-[18px] leading-[25px] ${textClassName}`}>{o.vi}</Text>}
            </OptionTile>
          ))}
        </View>
        {checked && <View className="h-44" />}
      </ScrollView>

      <AnswerFooter
        checked={checked}
        correct={correct}
        canCheck={selected !== null}
        onCheck={() => setChecked(true)}
        onContinue={() => onDone({ correct })}
        wrongDetail={
          <Text className="font-ui text-[17px] leading-[25px] text-bad-ink">
            {s.listen.answerIs}
            <Text className="font-ui-extrabold">{item.vi}</Text>
            {willRetry ? `\n${s.feedback.retryLater}` : ''}
          </Text>
        }
      />
    </View>
  );
}
