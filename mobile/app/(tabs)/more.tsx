import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { BlockButton } from '../../src/components/BlockButton';
import { Icon } from '../../src/components/Icon';
import { Screen } from '../../src/components/Screen';
import { demoDownloadableLessons, demoDownloadSize } from '../../src/demo/sampleContent';
import { demoActions, useDemoState, type TextSize, type ThemeChoice } from '../../src/demo/store';
import { strings as s } from '../../src/strings';
import { useThemeColors } from '../../src/theme/useThemeColors';

// Mục Thêm: tải bài, giao diện sáng/tối, cỡ chữ, âm báo, báo lỗi chờ gửi, các trang thông tin.
// Bản mẫu: 17-them.
export default function MoreScreen() {
  const st = useDemoState();
  const c = useThemeColors();
  const { setColorScheme } = useColorScheme();
  const [downloading, setDownloading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const total = demoDownloadableLessons;
  const allDownloaded = st.downloadedLessons >= total;
  const version = Constants.expoConfig?.version ?? '1.0.0';

  const downloadText = allDownloaded
    ? s.more.downloadedAll(total)
    : downloading
      ? s.more.downloading
      : s.more.downloadedSome(st.downloadedLessons, total, demoDownloadSize);
  const downloadLabel = allDownloaded ? s.more.downloadedButton : downloading ? s.more.downloadingButton : s.more.downloadButton;

  const links = [
    { label: s.more.credits, href: '/credits' as const },
    { label: s.more.guide, href: '/guide' as const },
    { label: s.more.about, href: '/about' as const },
  ];

  return (
    <Screen>
      <Text accessibilityRole="header" className="px-4 pb-2 pt-4 font-ui-extrabold text-[24px] text-ink">
        {s.more.title}
      </Text>

      <ScrollView contentContainerClassName="gap-4 px-4 pb-6 pt-1">
        <View className="gap-3 rounded-[18px] border-2 border-line bg-surface p-4">
          <Text className="font-ui-extrabold text-[18px] text-ink">{s.more.offlineTitle}</Text>
          <Text className="font-ui text-[16px] leading-[23px] text-muted">{downloadText}</Text>
          <BlockButton
            label={downloadLabel}
            icon="download"
            size="md"
            disabled={allDownloaded || downloading}
            onPress={() => {
              // TODO: bước 6 thay bằng tải thật.
              setDownloading(true);
              timer.current = setTimeout(() => {
                demoActions.setDownloadedAll();
                setDownloading(false);
              }, 1800);
            }}
          />
        </View>

        <View className="rounded-[18px] border-2 border-line bg-surface px-4 py-1">
          <View className="gap-2.5 border-b-2 border-line py-3.5">
            <Text className="font-ui-bold text-[17px] text-ink">{s.more.theme}</Text>
            <Segmented<ThemeChoice>
              stretch
              value={st.themeChoice}
              options={[
                { value: 'system', label: s.more.themeSystem },
                { value: 'light', label: s.more.themeLight },
                { value: 'dark', label: s.more.themeDark },
              ]}
              onChange={(v) => {
                demoActions.setThemeChoice(v);
                setColorScheme(v);
              }}
            />
          </View>

          <View className="min-h-[68px] flex-row items-center justify-between gap-3 border-b-2 border-line">
            <Text className="font-ui-bold text-[17px] text-ink">{s.more.textSize}</Text>
            {/* TODO: lựa chọn đã được ghi nhận nhưng chưa phóng to chữ trong toàn app. */}
            <Segmented<TextSize>
              value={st.textSize}
              options={[
                { value: 'large', label: s.more.textLarge, textClassName: 'text-[16px]' },
                { value: 'xlarge', label: s.more.textXLarge, textClassName: 'text-[19px]' },
              ]}
              onChange={(v) => demoActions.setTextSize(v)}
            />
          </View>

          <View className="min-h-[68px] flex-row items-center justify-between gap-3">
            <Text className="flex-1 font-ui-bold text-[17px] leading-[23px] text-ink">{s.more.sound}</Text>
            <Pressable
              onPress={() => demoActions.toggleFeedbackSound()}
              accessibilityRole="switch"
              accessibilityLabel={s.more.sound}
              accessibilityState={{ checked: st.feedbackSound }}
              hitSlop={8}
              className={`h-9 w-[60px] justify-center rounded-full p-1 ${st.feedbackSound ? 'bg-secondary' : 'bg-disabled-ink'}`}
            >
              <View
                className="h-7 w-7 rounded-full bg-white"
                style={{ transform: [{ translateX: st.feedbackSound ? 24 : 0 }] }}
              />
            </Pressable>
          </View>
        </View>

        {st.pendingReports > 0 && (
          <View className="flex-row items-start gap-3 rounded-[18px] bg-accent-soft px-4 py-3.5">
            <Icon name="flag" color={c['accent-ink']} size={22} />
            <Text className="flex-1 font-ui text-[16px] leading-[23px] text-accent-ink">
              <Text className="font-ui-extrabold">{s.more.pendingReports(st.pendingReports)}</Text>
              {`\n${s.more.pendingReportsNote}`}
            </Text>
          </View>
        )}

        <View className="rounded-[18px] border-2 border-line bg-surface px-4 py-1">
          {links.map((l, i) => (
            <Pressable
              key={l.href}
              onPress={() => router.push(l.href)}
              accessibilityRole="button"
              className={`min-h-[60px] flex-row items-center justify-between active:opacity-70 ${i < links.length - 1 ? 'border-b-2 border-line' : ''}`}
            >
              <Text className="font-ui-bold text-[17px] text-ink">{l.label}</Text>
              <Icon name="chevronRight" color={c.muted} size={20} />
            </Pressable>
          ))}
        </View>

        {__DEV__ && (
          <Pressable onPress={() => router.push('/dev-check')} accessibilityRole="button" className="min-h-[44px] items-center justify-center">
            <Text className="font-ui text-[15px] text-muted underline">{s.more.devCheck}</Text>
          </Pressable>
        )}

        <Text className="text-center font-ui text-[14px] leading-[21px] text-muted">
          {s.more.version(version)}
          {`\n${s.disclaimer}`}
        </Text>
      </ScrollView>
    </Screen>
  );
}

type SegmentedProps<T extends string> = {
  value: T;
  options: { value: T; label: string; textClassName?: string }[];
  onChange: (v: T) => void;
  stretch?: boolean;
};

function Segmented<T extends string>({ value, options, onChange, stretch }: SegmentedProps<T>) {
  return (
    <View className="flex-row rounded-xl bg-bg p-[3px]" accessibilityRole="radiogroup">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: on }}
            className={`min-h-[44px] items-center justify-center rounded-[10px] px-3.5 ${stretch ? 'flex-1' : ''} ${on ? 'bg-surface' : ''}`}
          >
            <Text className={`font-ui-bold ${o.textClassName ?? 'text-[16px]'} ${on ? 'text-secondary-text' : 'text-muted'}`}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
