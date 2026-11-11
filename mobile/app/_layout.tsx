import '../global.css';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, vars } from 'nativewind';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { fontAssets } from '../src/theme/fonts';
import { cssVarsFor, palette } from '../src/theme/palette';

// Biến màu của hai chế độ, tính một lần. Mọi class màu (bg-primary, text-ink...) đọc từ đây.
const themeVars = {
  light: vars(cssVarsFor('light')),
  dark: vars(cssVarsFor('dark')),
};

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  // Chờ nạp font xong mới hiện giao diện, để chữ không bị nhảy từ font máy sang font app.
  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <View style={[{ flex: 1 }, themeVars[scheme]]}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            // Nền phía sau màn hình khi chuyển trang, tránh loé trắng ở chế độ tối.
            contentStyle: { backgroundColor: palette[scheme].bg },
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}
