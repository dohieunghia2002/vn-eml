import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { usePlayback } from '../../src/audio/usePlayback';
import { Badge } from '../../src/components/Badge';
import { BlockButton } from '../../src/components/BlockButton';
import { Icon } from '../../src/components/Icon';
import { MascotHero } from '../../src/components/Mascot';
import { ReportForm } from '../../src/components/ReportForm';
import { Screen } from '../../src/components/Screen';
import { SheetModal } from '../../src/components/SheetModal';
import { SpeakerButton } from '../../src/components/SpeakerButton';
import { TargetText } from '../../src/components/TargetText';
import { Toast } from '../../src/components/Toast';
import { demoLanguage, demoTotalApprovedItems, findItem } from '../../src/demo/sampleContent';
import { demoActions, useDemoState } from '../../src/demo/store';
import { MAX_LEVEL } from '../../src/learning/leitner';
import type { Item } from '../../src/learning/types';
import { languageWords, strings as s } from '../../src/strings';
import { useThemeColors } from '../../src/theme/useThemeColors';

// Sổ từ: biểu đồ 5 cột theo cấp độ nhớ, lọc theo cấp, danh sách mục đã học.
// Bấm vào một mục để xem lại, nghe lại và báo lỗi (docs/lo-trinh-hoc-tap.md, mục 9).
// Bản mẫu: 16-so-tu, 16b-so-tu-chua-co-muc.
type Learned = { item: Item; level: number };

const BAR_MAX_HEIGHT = 104;

export default function VocabularyScreen() {
  const st = useDemoState();
  const c = useThemeColors();
  const lang = languageWords(demoLanguage);
  const [filter, setFilter] = useState(0);
  const [openItem, setOpenItem] = useState<Learned | null>(null);
  const [reporting, setReporting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { playingId, play } = usePlayback();

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const learned: Learned[] = st.vocabularyEmptyDemo
    ? []
    : Object.entries(st.levels)
        .map(([id, level]) => ({ item: findItem(id), level }))
        .filter((x): x is Learned => x.item !== undefined)
        .sort((a, b) => b.level - a.level || a.item.itemNo - b.item.itemNo);

  const counts = [1, 2, 3, 4, 5].map((l) => learned.filter((x) => x.level === l).length);
  const maxCount = Math.max(1, ...counts);
  const shown = learned.filter((x) => filter === 0 || x.level === filter);

  const closeSheet = () => {
    setOpenItem(null);
    setReporting(false);
  };

  if (learned.length === 0) {
    return (
      <Screen>
        <Text accessibilityRole="header" className="px-4 pb-2 pt-4 font-ui-extrabold text-[24px] text-ink">
          {s.vocabulary.title}
        </Text>
        <ScrollView contentContainerClassName="flex-grow items-center justify-center gap-3 px-6 py-4">
          <MascotHero label={s.mascotLabel} />
          <Text className="text-center font-ui-extrabold text-[22px] text-ink">{s.vocabulary.emptyTitle}</Text>
          <Text className="text-center font-ui text-[17px] leading-[25px] text-muted">{s.vocabulary.emptyBody}</Text>
          <View className="mt-2 self-stretch">
            <BlockButton label={s.vocabulary.emptyCta} onPress={() => router.push('/lesson/1/1')} />
          </View>
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text accessibilityRole="header" className="px-4 pb-2 pt-4 font-ui-extrabold text-[24px] text-ink">
        {s.vocabulary.title}
      </Text>

      <ScrollView contentContainerClassName="gap-4 px-4 pb-6 pt-1">
        <View className="gap-3.5 rounded-[18px] border-2 border-line bg-surface p-4">
          <View className="flex-row items-baseline gap-2">
            <Text className="font-ui-extrabold text-[34px] leading-[42px] text-secondary-text">{counts[MAX_LEVEL - 1]}</Text>
            <Text className="font-ui text-[17px] text-muted">{s.vocabulary.learned(demoTotalApprovedItems)}</Text>
          </View>
          <View
            className="h-[150px] flex-row items-end gap-2.5 border-b-2 border-line"
            accessible
            accessibilityRole="image"
            accessibilityLabel={s.vocabulary.chartLabel(counts)}
          >
            {counts.map((n, i) => (
              <View key={i} className="h-full flex-1 items-center justify-end gap-1">
                <Text className="font-ui-extrabold text-[15px] text-ink">{n}</Text>
                {n > 0 && (
                  <View
                    className={`w-full rounded-t-lg ${i === MAX_LEVEL - 1 ? 'bg-secondary' : 'border-2 border-b-0 border-secondary bg-secondary-soft'}`}
                    style={{ height: Math.max(6, Math.round((n / maxCount) * BAR_MAX_HEIGHT)) }}
                  />
                )}
              </View>
            ))}
          </View>
          <View className="-mt-1.5 flex-row gap-2.5">
            {counts.map((_, i) => (
              <Text
                key={i}
                className={`flex-1 text-center text-[14px] ${i === MAX_LEVEL - 1 ? 'font-ui-extrabold text-ink' : 'font-ui text-muted'}`}
              >
                {i === MAX_LEVEL - 1 ? s.vocabulary.mastered : s.vocabulary.levelShort(i + 1)}
              </Text>
            ))}
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 pb-1.5"
          accessibilityLabel={s.vocabulary.filterLabel}
        >
          {[0, 1, 2, 3, 4, 5].map((v) => {
            const on = v === filter;
            return (
              <Pressable
                key={v}
                onPress={() => setFilter(v)}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                className={`min-h-[44px] justify-center rounded-full border-2 px-4 ${on ? 'border-secondary bg-secondary' : 'border-line bg-surface'}`}
              >
                <Text className={`font-ui-bold text-[16px] ${on ? 'text-white' : 'text-ink'}`}>
                  {v === 0 ? s.vocabulary.all : s.vocabulary.levelShort(v)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View className="gap-2.5">
          {shown.map(({ item, level }) => (
            <Pressable
              key={item.id}
              onPress={() => setOpenItem({ item, level })}
              accessibilityRole="button"
              accessibilityLabel={s.vocabulary.open(item.vi)}
              className="flex-row items-center gap-3 rounded-2xl border-2 border-line bg-surface py-3 pl-3.5 pr-3 active:bg-bg"
            >
              <View className="flex-1 gap-0.5">
                <TargetText text={item.target} size="sm" numberOfLines={2} />
                <Text className="font-ui-bold text-[17px] leading-[23px] text-ink">{item.vi}</Text>
              </View>
              <Badge label={s.common.level(level)} tone={level === MAX_LEVEL ? 'secondarySolid' : 'secondary'} size="sm" />
              <SpeakerButton
                variant="round"
                playing={playingId === item.id}
                onPress={() => play(item.id)}
                accessibilityLabel={s.vocabulary.listen(item.vi)}
              />
            </Pressable>
          ))}
          {shown.length === 0 && (
            <Text className="p-4 text-center font-ui text-[16px] text-muted">{s.vocabulary.emptyFilter}</Text>
          )}
        </View>

        <BlockButton label={s.vocabulary.practice} variant="outlineSecondary" onPress={() => router.push('/practice')} />
        <Text className="-mt-1.5 text-center font-ui text-[14px] leading-[20px] text-muted">{s.vocabulary.practiceNote}</Text>
      </ScrollView>

      {toast && (
        <View pointerEvents="none" className="absolute bottom-4 left-4 right-4">
          <Toast message={toast} center />
        </View>
      )}

      <SheetModal visible={openItem !== null} onClose={closeSheet} accessibilityLabel={openItem?.item.vi ?? ''}>
        {openItem && !reporting && (
          <>
            <View className="items-center gap-2.5 pb-1">
              <Badge label={s.common.memoryLevel(openItem.level)} tone="secondary" size="sm" />
              <TargetText text={openItem.item.target} size="xl" framed />
              <Text className="text-center font-ui-bold text-[19px] leading-[26px] text-ink">{openItem.item.romanization}</Text>
              <Text className="text-center font-ui-extrabold text-[22px] leading-[30px] text-ink">{openItem.item.vi}</Text>
              <SpeakerButton
                variant="pill"
                playing={playingId === openItem.item.id}
                onPress={() => play(openItem.item.id)}
                accessibilityLabel={s.common.listenAgain}
              />
            </View>
            <Pressable
              onPress={() => setReporting(true)}
              accessibilityRole="button"
              className="min-h-[44px] flex-row items-center gap-2 self-center px-3"
            >
              <Icon name="flag" color={c.muted} size={18} />
              <Text className="font-ui text-[16px] text-muted underline">{s.report.link}</Text>
            </Pressable>
          </>
        )}
        {openItem && reporting && (
          <ReportForm
            item={openItem.item}
            lang={lang}
            onCancel={() => setReporting(false)}
            onSend={() => {
              demoActions.queueReport();
              closeSheet();
              setToast(s.report.sent);
              clearTimeout(toastTimer.current);
              toastTimer.current = setTimeout(() => setToast(null), 2500);
            }}
          />
        )}
      </SheetModal>
    </Screen>
  );
}
