import { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePlayback } from '../audio/usePlayback';
import { Badge } from '../components/Badge';
import { Block } from '../components/Block';
import { BlockButton } from '../components/BlockButton';
import { Icon } from '../components/Icon';
import { SpeakerButton } from '../components/SpeakerButton';
import { TargetText } from '../components/TargetText';
import { strings as s } from '../strings';
import { useThemeColors } from '../theme/useThemeColors';
import type { ExerciseProps } from './types';

// Bước 1 của một phần mới: thẻ làm quen. Âm thanh tự phát một lần, không chấm điểm.
// Bản mẫu: 02-the-lam-quen.
export function IntroCard({ step, onDone, onReport }: ExerciseProps<'intro'>) {
  const { item } = step;
  const c = useThemeColors();
  const insets = useSafeAreaInsets();
  const { playingId, play } = usePlayback();

  useEffect(() => {
    play(item.id);
  }, [item.id, play]);

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" contentContainerClassName="gap-3.5 px-5 pb-4 pt-2">
        <Badge label={s.intro.label[item.type]} className="self-start" />

        <Block
          faceClassName="items-center gap-3.5 border-2 border-line bg-surface px-5 py-6"
          shadowClassName="bg-line"
          roundedClassName="rounded-[20px]"
        >
          <TargetText text={item.target} size="xl" framed />
          <View className="items-center gap-0.5">
            <Text className="font-ui text-[14px] text-muted">{s.common.romanization}</Text>
            <Text className="text-center font-ui-bold text-[20px] leading-[28px] text-ink">{item.romanization}</Text>
          </View>
          <View className="h-0.5 self-stretch bg-line" />
          <View className="items-center gap-0.5">
            <Text className="font-ui text-[14px] text-muted">{s.common.meaning}</Text>
            <Text className="text-center font-ui-extrabold text-[26px] leading-[34px] text-ink">{item.vi}</Text>
          </View>
          <SpeakerButton
            variant="pill"
            playing={playingId === item.id}
            onPress={() => play(item.id)}
            accessibilityLabel={s.common.listenAgain}
          />
        </Block>

        <Pressable
          onPress={() => onReport(item)}
          accessibilityRole="button"
          className="min-h-[44px] flex-row items-center gap-2 self-center px-3"
        >
          <Icon name="flag" color={c.muted} size={18} />
          <Text className="font-ui text-[16px] text-muted underline">{s.report.link}</Text>
        </Pressable>
      </ScrollView>

      <View className="px-5 pt-4" style={{ paddingBottom: 28 + insets.bottom }}>
        <BlockButton label={s.common.continue} onPress={() => onDone({})} />
      </View>
    </View>
  );
}
