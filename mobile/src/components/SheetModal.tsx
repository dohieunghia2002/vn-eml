import type { ReactNode } from 'react';
import { Animated, KeyboardAvoidingView, Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { strings as s } from '../strings';
import { useSlideUp } from './useSlideUp';

// Bảng trượt từ đáy màn hình, có lớp phủ tối phía sau. Bấm ra ngoài hoặc nút Back để đóng.
type Props = { visible: boolean; onClose: () => void; children: ReactNode; accessibilityLabel: string };

export function SheetModal({ visible, onClose, children, accessibilityLabel }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      {visible && <SheetBody onClose={onClose} accessibilityLabel={accessibilityLabel}>{children}</SheetBody>}
    </Modal>
  );
}

function SheetBody({ onClose, children, accessibilityLabel }: Omit<Props, 'visible'>) {
  const insets = useSafeAreaInsets();
  const slide = useSlideUp(400);
  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View className="flex-1 justify-end bg-black/50">
        <Pressable className="flex-1" onPress={onClose} accessibilityRole="button" accessibilityLabel={s.common.back} />
        <Animated.View style={slide}>
          <View
            className="gap-2.5 rounded-t-[22px] bg-surface px-5 pt-5"
            style={{ paddingBottom: 24 + insets.bottom }}
            accessibilityViewIsModal
            accessibilityLabel={accessibilityLabel}
          >
            {children}
          </View>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}
