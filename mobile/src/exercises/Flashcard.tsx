import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePlayback } from '../audio/usePlayback';
import { Badge } from '../components/Badge';
import { Block } from '../components/Block';
import { BlockButton } from '../components/BlockButton';
import { Icon } from '../components/Icon';
import { SpeakerButton } from '../components/SpeakerButton';
import { TargetText } from '../components/TargetText';
import { intervalDays, nextLevel } from '../learning/leitner';
import { strings as s } from '../strings';
import { useThemeColors } from '../theme/useThemeColors';
import type { ExerciseProps } from './types';

// Dạng 5: thẻ nhớ chủ động, người học tự đánh giá. App không chấm phát âm.
// - Cấp 2 (recall_meaning): nghe câu, tự nhớ nghĩa.
// - Cấp 3 đến 5 (recall_speak): xem nghĩa, tự nói thành tiếng.
// Bản mẫu: 13-the-nho-mat-truoc, 14-the-nho-mat-sau, 15-the-nho-cap-2.
export function Flashcard({ step, lang, mode, onDone }: ExerciseProps<'recall_meaning' | 'recall_speak'>) {
  const { item, level } = step;
  const meaningMode = step.kind === 'recall_meaning';
  const c = useThemeColors();
  const insets = useSafeAreaInsets();
  const [flipped, setFlipped] = useState(false);
  const { playingId, play } = usePlayback();
  const daysIfRemembered = intervalDays(nextLevel(level, true));

  useEffect(() => {
    if (meaningMode) play(item.id);
  }, [meaningMode, item.id, play]);

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" contentContainerClassName="gap-3.5 px-5 pb-4 pt-2">
        <View className="flex-row items-center justify-between">
          <Badge label={mode === 'review' ? s.flashcard.review : s.flashcard.practice} />
          <Badge label={s.common.memoryLevel(level)} tone="secondary" size="sm" />
        </View>

        {!flipped ? (
          <Block
            faceClassName="min-h-[360px] items-center justify-center gap-[18px] border-2 border-line bg-surface px-5 py-6"
            shadowClassName="bg-line"
            roundedClassName="rounded-[22px]"
            depth={5}
          >
            <Text className="text-center font-ui-bold text-[17px] text-muted">
              {meaningMode ? s.flashcard.promptMeaning : s.flashcard.promptSpeak(lang)}
            </Text>
            {meaningMode ? (
              <SpeakerButton
                variant="hero"
                size={104}
                playing={playingId === item.id}
                onPress={() => play(item.id)}
                accessibilityLabel={s.flashcard.play(lang)}
              />
            ) : (
              <Text className="text-center font-ui-extrabold text-[26px] leading-[35px] text-ink">{item.vi}</Text>
            )}
            <View className="flex-row items-start gap-2.5 rounded-[14px] bg-bg px-3.5 py-3">
              <Icon name="message" color={c.muted} size={22} />
              <Text className="flex-1 font-ui text-[16px] leading-[23px] text-muted">
                {meaningMode ? s.flashcard.hintMeaning : s.flashcard.hintSpeak}
              </Text>
            </View>
          </Block>
        ) : (
          <Block
            faceClassName="min-h-[360px] items-center justify-center gap-3 border-2 border-secondary bg-surface px-5 py-6"
            shadowClassName="bg-secondary"
            roundedClassName="rounded-[22px]"
            depth={5}
          >
            <TargetText text={item.target} size="xl" framed />
            <Text className="text-center font-ui-bold text-[19px] leading-[26px] text-ink">{item.romanization}</Text>
            <View className="h-0.5 self-stretch bg-line" />
            <Text className="text-center font-ui-extrabold text-[24px] leading-[32px] text-ink">{item.vi}</Text>
            <SpeakerButton
              variant="pill"
              playing={playingId === item.id}
              onPress={() => play(item.id)}
              label={s.flashcard.listenNative}
              accessibilityLabel={s.flashcard.listenNative}
            />
          </Block>
        )}
      </ScrollView>

      <View className="px-5 pt-4" style={{ paddingBottom: 28 + insets.bottom }}>
        {!flipped ? (
          <BlockButton
            label={s.flashcard.showAnswer}
            variant="outlineSecondary"
            onPress={() => {
              setFlipped(true);
              play(item.id);
            }}
          />
        ) : (
          <View className="flex-row gap-3">
            <BlockButton
              className="flex-1"
              label={s.flashcard.forgot}
              sublabel={mode === 'review' ? s.flashcard.forgotSub : undefined}
              variant="outlineBad"
              onPress={() => onDone({ correct: false, selfAssessed: true })}
            />
            <BlockButton
              className="flex-1"
              label={s.flashcard.remembered}
              sublabel={mode === 'review' ? s.flashcard.rememberedSub(daysIfRemembered) : undefined}
              variant="ok"
              onPress={() => onDone({ correct: true, selfAssessed: true })}
            />
          </View>
        )}
      </View>
    </View>
  );
}
