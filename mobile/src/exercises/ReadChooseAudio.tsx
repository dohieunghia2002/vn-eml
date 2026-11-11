import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { usePlayback } from '../audio/usePlayback';
import { AnswerFooter } from '../components/AnswerFooter';
import { Block } from '../components/Block';
import { EqBars } from '../components/EqBars';
import { Icon } from '../components/Icon';
import { OptionTile, type TileState } from '../components/OptionTile';
import { TargetText } from '../components/TargetText';
import { strings as s } from '../strings';
import type { ExerciseProps } from './types';

// Dạng 2: xem chữ, chọn đúng âm thanh. Chạm ô nào thì nghe ô đó.
// Bản mẫu: 09-xem-chu-chon-am.
export function ReadChooseAudio({ step, willRetry, onDone }: ExerciseProps<'read_choose_audio'>) {
  const { item, options } = step;
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const { playingId, play } = usePlayback();

  const correct = selected === item.id;
  const answerNo = options.findIndex((o) => o.id === item.id) + 1;
  const stateOf = (id: string): TileState => {
    if (checked && id === item.id) return 'correct';
    if (checked && id === selected) return 'wrong';
    if (!checked && id === selected) return 'selected';
    return 'idle';
  };
  const rows = [options.slice(0, 2), options.slice(2, 4)];

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" contentContainerClassName="gap-3.5 px-5 pb-6 pt-2">
        <Text accessibilityRole="header" className="font-ui-extrabold text-[22px] leading-[30px] text-ink">
          {s.read.title}
        </Text>

        <Block
          faceClassName="items-center gap-2.5 border-2 border-line bg-surface p-5"
          shadowClassName="bg-line"
          roundedClassName="rounded-[20px]"
        >
          <TargetText text={item.target} size="xl" framed />
          <Text className="text-center font-ui-bold text-[18px] leading-[25px] text-ink">{item.romanization}</Text>
        </Block>

        <Text className="font-ui text-[16px] leading-[23px] text-muted">{s.read.hint}</Text>

        <View className="gap-3.5" accessibilityRole="radiogroup" accessibilityLabel={s.read.optionsLabel}>
          {rows.map((row, r) => (
            <View key={r} className="flex-row gap-3.5">
              {row.map((o, k) => {
                const no = r * 2 + k + 1;
                return (
                  <OptionTile
                    key={o.id}
                    className="flex-1"
                    state={stateOf(o.id)}
                    onPress={() => {
                      // Sau khi chấm vẫn chạm được để nghe lại, nhưng không đổi lựa chọn.
                      if (!checked) setSelected(o.id);
                      play(o.id);
                    }}
                    accessibilityLabel={s.read.option(no)}
                    layoutClassName="min-h-[88px] items-center justify-center gap-1.5 py-2"
                  >
                    {({ textClassName, iconColor }) => (
                      <>
                        {playingId === o.id ? <EqBars color={iconColor} size="md" /> : <Icon name="speaker" color={iconColor} size={28} />}
                        <Text className={`font-ui-bold text-[17px] ${textClassName}`}>{s.read.option(no)}</Text>
                      </>
                    )}
                  </OptionTile>
                );
              })}
            </View>
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
            {s.read.answerIs(answerNo)}
            {willRetry ? `\n${s.feedback.retryLater}` : ''}
          </Text>
        }
      />
    </View>
  );
}
