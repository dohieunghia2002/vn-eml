import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { BlockButton } from '../src/components/BlockButton';
import { Icon } from '../src/components/Icon';
import { MascotHero } from '../src/components/Mascot';
import { ProgressBar } from '../src/components/ProgressBar';
import { Screen } from '../src/components/Screen';
import { Toast } from '../src/components/Toast';
import { demoDownloadableLessons } from '../src/demo/sampleContent';
import { demoActions, useDemoState } from '../src/demo/store';
import { strings as s } from '../src/strings';
import { neutral } from '../src/theme/palette';

// Tải bài học lần đầu: đang tải, tải xong, hoặc chưa có mạng.
// Bản mẫu: 20-tai-bai-dang-tai, 21-tai-bai-xong, 22-chua-co-mang.
// TODO: bước 6 thay phần giả lập bằng tải thật (chữ vào SQLite, âm thanh vào bộ nhớ app),
// và nhận biết có mạng hay không bằng expo-network (đã duyệt).
const OFFLINE_DEMO_LESSONS = 3;

export default function DownloadScreen() {
  const { offlineDemo } = useDemoState();
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const total = demoDownloadableLessons;

  useEffect(() => {
    if (offlineDemo) return;
    const timer = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 7);
        if (next >= 100) clearInterval(timer);
        return next;
      });
    }, 300);
    return () => clearInterval(timer);
  }, [offlineDemo]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const done = !offlineDemo && progress >= 100;
  const loading = !offlineDemo && !done;
  const lessonsDone = Math.min(total, Math.floor((progress / 100) * total));

  return (
    <Screen bottom>
      <ScrollView contentContainerClassName="flex-grow items-center gap-3.5 px-6 pb-2 pt-14">
        <MascotHero label={s.mascotLabel} mascotHeight={210} boxHeight={225} drumTop={-37} />

        {loading && (
          <>
            <Text className="mt-2 text-center font-ui-extrabold text-[26px] leading-[34px] text-ink">{s.download.loadingTitle}</Text>
            <Text className="text-center font-ui text-[17px] leading-[25px] text-muted">{s.download.loadingBody}</Text>
            <View className="mt-2 w-full flex-row">
              <ProgressBar value={progress / 100} heightClassName="h-[18px]" accessibilityLabel={s.download.progressLabel} />
            </View>
            <View className="w-full flex-row justify-between">
              <Text className="font-ui-bold text-[16px] text-ink">{progress}%</Text>
              <Text className="font-ui-bold text-[16px] text-muted">{s.download.lessons(lessonsDone, total)}</Text>
            </View>
            <Text className="mt-1 font-ui text-[15px] text-muted">{s.download.wifiTip}</Text>
          </>
        )}

        {done && (
          <>
            <Text className="mt-2 text-center font-ui-extrabold text-[26px] leading-[34px] text-ink">{s.download.doneTitle}</Text>
            <Text className="text-center font-ui text-[17px] leading-[25px] text-muted">{s.download.doneBody(total)}</Text>
            <View className="mt-1 flex-row items-center gap-2.5 rounded-[14px] bg-ok-bg px-4 py-3">
              <View className="h-[30px] w-[30px] items-center justify-center rounded-full bg-ok">
                <Icon name="check" color={neutral.white} size={18} />
              </View>
              <Text className="font-ui-bold text-[16px] text-ok-ink">{s.download.doneBadge}</Text>
            </View>
          </>
        )}

        {offlineDemo && (
          <>
            <Text className="mt-2 text-center font-ui-extrabold text-[26px] leading-[34px] text-ink">{s.download.offlineTitle}</Text>
            <Text className="text-center font-ui text-[17px] leading-[25px] text-muted">
              {s.download.offlineBody(OFFLINE_DEMO_LESSONS)}
            </Text>
            <View className="mt-1 w-full rounded-[14px] bg-accent-soft px-4 py-3">
              <Text className="font-ui-semibold text-[16px] leading-[23px] text-accent-ink">{s.download.offlineSafe}</Text>
            </View>
            {toast && <Toast message={s.download.stillOffline} />}
          </>
        )}
      </ScrollView>

      <View className="gap-3.5 px-6 pb-7 pt-2">
        {loading && <BlockButton label={s.download.loadingButton} disabled />}
        {done && (
          <BlockButton
            label={s.download.enter}
            onPress={() => {
              demoActions.finishDownload(total);
              router.replace('/');
            }}
          />
        )}
        {offlineDemo && (
          <>
            <BlockButton
              label={s.download.offlineLearn}
              onPress={() => {
                demoActions.finishDownload(OFFLINE_DEMO_LESSONS);
                router.replace('/');
              }}
            />
            <BlockButton
              label={s.download.retry}
              variant="outlineSecondary"
              onPress={() => {
                setToast(true);
                clearTimeout(toastTimer.current);
                toastTimer.current = setTimeout(() => setToast(false), 2500);
              }}
            />
          </>
        )}
      </View>
    </Screen>
  );
}
