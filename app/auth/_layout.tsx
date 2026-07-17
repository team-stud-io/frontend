import { Stack } from 'expo-router';
import { AuthSignupProvider } from '../../components/auth';

export default function AuthLayout() {
  return <AuthSignupProvider><Stack screenOptions={{ headerShown: false }} /></AuthSignupProvider>;
}
