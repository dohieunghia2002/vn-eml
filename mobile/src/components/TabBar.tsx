import type { ComponentProps } from 'react';
import { Tabs } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { strings as s } from '../strings';
import { useThemeColors } from '../theme/useThemeColors';
import { Icon, type IconName } from './Icon';

// Thanh điều hướng dưới cùng, đúng 3 mục: Học, Sổ từ, Thêm (docs/lo-trinh-hoc-tap.md, mục 10).
type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const tabMeta: Record<string, { label: string; icon: IconName }> = {
  index: { label: s.tabs.learn, icon: 'route' },
  vocabulary: { label: s.tabs.vocabulary, icon: 'book' },
  more: { label: s.tabs.more, icon: 'dots' },
};

export function TabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const c = useThemeColors();

  return (
    <View
      className="flex-row border-t-2 border-line bg-surface"
      style={{ paddingBottom: insets.bottom }}
      accessibilityRole="tablist"
      accessibilityLabel={s.tabs.navLabel}
    >
      {state.routes.map((route, index) => {
        const meta = tabMeta[route.name];
        if (!meta) return null;
        const focused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        };
        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={meta.label}
            className="min-h-[64px] flex-1 items-center justify-center gap-0.5 active:bg-bg"
          >
            {focused && <View className="absolute left-0 right-0 top-0 h-[3px] bg-primary" />}
            <Icon name={meta.icon} color={focused ? c['primary-text'] : c.muted} strokeWidth={focused ? 2.2 : 2} />
            <Text className={`text-[15px] ${focused ? 'font-ui-extrabold text-primary-text' : 'font-ui-semibold text-muted'}`}>
              {meta.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
