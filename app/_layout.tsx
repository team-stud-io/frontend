import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded,fontError] = useFonts({
    'Pretendard-Thin':       require('../assets/fonts/Pretendard-Thin.ttf'),
    'Pretendard-ExtraLight': require('../assets/fonts/Pretendard-ExtraLight.ttf'),
    'Pretendard-Light':      require('../assets/fonts/Pretendard-Light.ttf'),
    'Pretendard-Regular':    require('../assets/fonts/Pretendard-Regular.ttf'),
    'Pretendard-Medium':     require('../assets/fonts/Pretendard-Medium.ttf'),
    'Pretendard-SemiBold':   require('../assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Bold':       require('../assets/fonts/Pretendard-Bold.ttf'),
    'Pretendard-ExtraBold':  require('../assets/fonts/Pretendard-ExtraBold.ttf'),
    'Pretendard-Black':      require('../assets/fonts/Pretendard-Black.ttf'),
  });

  useEffect(() => {
    if (fontError) {
      console.log('폰트에러', fontError);
    }
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/index" />
        <Stack.Screen name="tutor/index" />
        <Stack.Screen name="tutor/step2" />
        <Stack.Screen name="tutor/step3" />
        <Stack.Screen name="tutor/subject-detail" />
      </Stack>
    </GestureHandlerRootView>
  );
}
