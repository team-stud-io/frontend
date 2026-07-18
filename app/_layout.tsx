import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TutorDraftProvider } from '../components/tutor/TutorDraftContext';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.ttf'),
    'Pretendard-Medium': require('../assets/fonts/Pretendard-Medium.ttf'),
    'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.ttf'),
  });

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
