import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

const LOGO = require('../assets/images/icon.png');

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace('/auth/login'), 1200);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.screen}>
      <Image source={LOGO} resizeMode="contain" style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 126,
    height: 90,
  },
});
