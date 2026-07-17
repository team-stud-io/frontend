import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TutorDraftProvider } from '../components/tutor/TutorDraftContext';

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
      <TutorDraftProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="home/index" />
          <Stack.Screen name="MyPage/index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="tutor/index" />
          <Stack.Screen name="tutor/step2" />
          <Stack.Screen name="tutor/step3" />
          <Stack.Screen name="tutor/schedule" />
          <Stack.Screen name="result/index" />
          <Stack.Screen name="report/index" />
          <Stack.Screen name="report/weakness" />
          <Stack.Screen name="report/review" />
          <Stack.Screen name="tutor/subject-detail" />
        </Stack>
      </TutorDraftProvider>
    </GestureHandlerRootView>
  );
}
