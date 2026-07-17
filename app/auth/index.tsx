import Ionicons from '@expo/vector-icons/Ionicons';
import { type Href, useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthActionButton, useAuthSignup } from '../../components/auth';
import { Colors } from '../../constants/colors';

const CHARACTER = require('../../assets/additional/character-hello.png');
const KAKAO_ICON = require('../../assets/additional/kakao-icon.png');

export default function AuthIntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { resetDraft } = useAuthSignup();
  const startEmail = () => { resetDraft('email'); router.push('/auth/signup/account' as Href); };
  return <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
    <View style={styles.header}><Pressable accessibilityLabel="홈으로 이동" hitSlop={10} onPress={() => router.replace('/')} style={styles.closeButton}>
      <Ionicons name="close" size={24} color="#242628" />
    </Pressable></View>
    <View style={styles.hero}>
      <Image source={CHARACTER} resizeMode="contain" style={styles.character} />
      <View style={styles.heroCopy}><Text style={styles.title}>안녕!</Text><Text style={styles.description}>시험 관리 AI 튜터{`\n`}지금 바로 시작해봐</Text></View>
    </View>
    <View style={[styles.actions, { paddingBottom: insets.bottom }]}>
      <View style={styles.startSection}>
        <AuthActionButton icon={KAKAO_ICON} label="카카오로 시작하기" variant="kakao" testID="auth-kakao" />
        <AuthActionButton label="이메일로 시작하기" onPress={startEmail} variant="secondary" testID="auth-email" />
      </View>
      <View style={styles.dividerSection}><View style={styles.divider} /><Text style={styles.dividerLabel}>이미 계정이 있다면</Text><View style={styles.divider} /></View>
      <View style={styles.loginSection}>
        <AuthActionButton label="로그인" onPress={() => router.push('/auth/login' as Href)} variant="outline" testID="auth-login" />
        <Text style={styles.policyText}>가입하면 <Text style={styles.policyLink}>이용약관</Text>과 <Text style={styles.policyLink}>개인정보처리방침</Text>에{`\n`}동의하는 것으로 간주해요</Text>
      </View>
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' }, header: { height: 36, justifyContent: 'center', paddingHorizontal: 20 },
  closeButton: { width: 40, height: 36, alignItems: 'flex-start', justifyContent: 'center' },
  hero: { flex: 1, minHeight: 220, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 40 },
  character: { width: 123, height: 130 }, heroCopy: { width: '100%', alignItems: 'center', gap: 8 },
  title: { color: '#242628', fontFamily: 'Pretendard-SemiBold', fontSize: 28, lineHeight: 40, textAlign: 'center' },
  description: { color: '#242628', fontFamily: 'Pretendard-Medium', fontSize: 16, lineHeight: 24, textAlign: 'center' },
  actions: { width: '100%', gap: 28, paddingHorizontal: 20 }, startSection: { gap: 8 },
  dividerSection: { flexDirection: 'row', alignItems: 'center', gap: 12 }, divider: { flex: 1, height: 1, backgroundColor: Colors['Line.Normal.Strong'] },
  dividerLabel: { color: Colors['Text.Normal.Normal'], fontFamily: 'Pretendard-Medium', fontSize: 14, lineHeight: 20 },
  loginSection: { alignItems: 'center', gap: 8 }, policyText: { color: Colors['Text.Normal.Normal'], fontFamily: 'Pretendard-Medium', fontSize: 14, lineHeight: 20, textAlign: 'center' },
  policyLink: { color: '#5299A4' },
});
