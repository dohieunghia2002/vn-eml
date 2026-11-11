import { Redirect, Tabs } from 'expo-router';

import { TabBar } from '../../src/components/TabBar';
import { useDemoState } from '../../src/demo/store';
import { strings as s } from '../../src/strings';
import { useThemeColors } from '../../src/theme/useThemeColors';

// Ba tab: Học, Sổ từ, Thêm. Lần đầu mở app thì đưa sang màn hình chào.
export default function TabsLayout() {
  const { welcomeSeen } = useDemoState();
  const c = useThemeColors();

  if (!welcomeSeen) return <Redirect href="/welcome" />;

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: c.bg } }}
    >
      <Tabs.Screen name="index" options={{ title: s.tabs.learn }} />
      <Tabs.Screen name="vocabulary" options={{ title: s.tabs.vocabulary }} />
      <Tabs.Screen name="more" options={{ title: s.tabs.more }} />
    </Tabs>
  );
}
