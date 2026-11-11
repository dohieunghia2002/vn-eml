import { useCallback, useEffect, useRef, useState } from 'react';

import { learningConfig } from '../config/learning';

// Phát âm thanh của một mục.
// TODO(audio): hiện chỉ GIẢ LẬP (hiện hiệu ứng "Đang phát" trong 1,4 giây) vì chưa có file
// âm thanh. Khi bước tải bài xong, thay phần thân bằng expo-audio (đã duyệt), phát file
// đã tải về máy theo id của mục.
export function usePlayback() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const play = useCallback((id: string) => {
    setPlayingId(id);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPlayingId(null), learningConfig.fakeAudioMs);
  }, []);

  const stop = useCallback(() => {
    clearTimeout(timer.current);
    setPlayingId(null);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return { playingId, play, stop };
}
