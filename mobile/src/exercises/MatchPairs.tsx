import { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { usePlayback } from '../audio/usePlayback';
import { AnswerFooter } from '../components/AnswerFooter';
import { EqBars } from '../components/EqBars';
import { Icon } from '../components/Icon';
import { OptionTile, type TileState } from '../components/OptionTile';
import { TargetText } from '../components/TargetText';
import { shuffle } from '../learning/plan';
import { strings as s } from '../strings';
import type { ExerciseProps } from './types';

// Dạng 3: ghép cặp chữ với nghĩa tiếng Việt. Ghép đúng thì cặp chuyển xanh, ghép sai thì
// nháy đỏ rồi bỏ chọn. Một mục bị tính là sai nếu lần ghép đầu tiên của mục đó sai
// (docs/lo-trinh-hoc-tap.md, mục 14). Bản mẫu: 04-ghep-cap, 05-ghep-cap-xong.
export function MatchPairs({ step, lang, onDone }: ExerciseProps<'match_pairs'>) {
  const left = step.items;
  const [right] = useState(() => shuffle(step.items));
  const [selL, setSelL] = useState<string | null>(null);
  const [selR, setSelR] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<[string, string] | null>(null);
  const [attempted, setAttempted] = useState<string[]>([]);
  const [missed, setMissed] = useState<string[]>([]);
  const { playingId, play } = usePlayback();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const tryMatch = (l: string | null, r: string | null) => {
    if (!l || !r) return;
    if (!attempted.includes(l)) {
      setAttempted((a) => [...a, l]);
      if (l !== r) setMissed((m) => [...m, l]);
    }
    if (l === r) {
      setMatched((m) => [...m, l]);
      setSelL(null);
      setSelR(null);
    } else {
      setWrong([l, r]);
      timer.current = setTimeout(() => {
        setWrong(null);
        setSelL(null);
        setSelR(null);
      }, 700);
    }
  };

  const tileState = (id: string, side: 'L' | 'R'): TileState => {
    if (matched.includes(id)) return 'correct';
    if (wrong && (side === 'L' ? wrong[0] === id : wrong[1] === id)) return 'wrong';
    if ((side === 'L' ? selL : selR) === id) return 'selected';
    return 'idle';
  };

  const done = matched.length === left.length;

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" contentContainerClassName="gap-3.5 px-5 pb-6 pt-2">
        <Text accessibilityRole="header" className="font-ui-extrabold text-[22px] leading-[30px] text-ink">
          {s.match.title(lang)}
        </Text>
        <Text className="font-ui text-[16px] leading-[23px] text-muted">{s.match.hint}</Text>

        <View className="mt-1 flex-row gap-3">
          <View className="flex-1 gap-3.5">
            {left.map((item) => {
              const state = tileState(item.id, 'L');
              return (
                <OptionTile
                  key={item.id}
                  state={state}
                  accessibilityRole="button"
                  accessibilityLabel={item.target}
                  disabled={state === 'correct'}
                  onPress={() => {
                    if (matched.includes(item.id) || wrong) return;
                    play(item.id);
                    setSelL(item.id);
                    tryMatch(item.id, selR);
                  }}
                  layoutClassName="min-h-[72px] flex-row items-center justify-center gap-1.5 px-2.5 py-2"
                >
                  {({ textClassName, iconColor }) => (
                    <>
                      {playingId === item.id ? <EqBars color={iconColor} /> : <Icon name="speakerSmall" color={iconColor} size={16} />}
                      <TargetText text={item.target} size="md" colorClassName={textClassName} />
                    </>
                  )}
                </OptionTile>
              );
            })}
          </View>
          <View className="flex-1 gap-3.5">
            {right.map((item) => {
              const state = tileState(item.id, 'R');
              return (
                <OptionTile
                  key={item.id}
                  state={state}
                  accessibilityRole="button"
                  accessibilityLabel={item.vi}
                  disabled={state === 'correct'}
                  onPress={() => {
                    if (matched.includes(item.id) || wrong) return;
                    setSelR(item.id);
                    tryMatch(selL, item.id);
                  }}
                  layoutClassName="min-h-[72px] items-center justify-center px-2.5 py-2"
                >
                  {({ textClassName }) => (
                    <Text className={`text-center font-ui-bold text-[18px] leading-[24px] ${textClassName}`}>{item.vi}</Text>
                  )}
                </OptionTile>
              );
            })}
          </View>
        </View>
        {done && <View className="h-40" />}
      </ScrollView>

      <AnswerFooter
        checked={done}
        correct
        canCheck={false}
        onCheck={() => {}}
        correctTitle={s.match.allDone}
        noteInsteadOfCheck={s.match.progress(matched.length, left.length)}
        onContinue={() => onDone({ correct: missed.length === 0 })}
      />
    </View>
  );
}
