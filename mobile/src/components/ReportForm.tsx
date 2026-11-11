import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import type { Item } from '../learning/types';
import { strings as s, type LanguageWords } from '../strings';
import { useThemeColors } from '../theme/useThemeColors';
import { BlockButton } from './BlockButton';

// Nội dung bảng "Báo lỗi nội dung". Lý do chọn tương ứng cột `reason` trong bảng content_reports.
// TODO: bước 6 lưu báo lỗi vào hàng chờ trong SQLite, gửi lên Supabase khi có mạng.
export type ReportReason = ReturnType<typeof s.report.reasons>[number]['code'];

type Props = {
  item: Item;
  lang: LanguageWords;
  onCancel: () => void;
  onSend: (reason: ReportReason, note: string) => void;
};

export function ReportForm({ item, lang, onCancel, onSend }: Props) {
  const c = useThemeColors();
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [note, setNote] = useState('');

  return (
    <>
      <Text className="font-ui-extrabold text-[20px] text-ink" accessibilityRole="header">
        {s.report.title}
      </Text>
      <Text className="mb-1 font-ui text-[16px] leading-[22px] text-muted">{s.report.item(item.target, item.vi)}</Text>
      {s.report.reasons(lang).map((r) => {
        const on = r.code === reason;
        return (
          <Pressable
            key={r.code}
            onPress={() => setReason(r.code)}
            accessibilityRole="radio"
            accessibilityState={{ checked: on }}
            className={`min-h-[48px] justify-center rounded-xl border-2 px-4 ${on ? 'border-secondary bg-secondary-soft' : 'border-line bg-surface'}`}
          >
            <Text className="font-ui-semibold text-[17px] text-ink">{r.label}</Text>
          </Pressable>
        );
      })}
      <Text className="mt-1 font-ui text-[15px] text-muted">{s.report.noteLabel}</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        multiline
        numberOfLines={2}
        textAlignVertical="top"
        accessibilityLabel={s.report.noteLabel}
        placeholderTextColor={c.muted}
        className="min-h-[64px] rounded-xl border-2 border-line bg-bg px-3 py-2.5 font-ui text-[17px] text-ink"
      />
      <View className="mt-1 flex-row gap-3">
        <BlockButton label={s.common.cancel} variant="neutral" size="md" onPress={onCancel} className="flex-1" />
        <BlockButton
          label={s.common.send}
          size="md"
          disabled={!reason}
          onPress={() => reason && onSend(reason, note.trim())}
          className="flex-1"
        />
      </View>
    </>
  );
}
