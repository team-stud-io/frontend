import { type Href, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AuthActionButton, AuthPasswordField, AuthScreen, isValidEmail } from '../../components/auth';
import { TextField } from '../../components/ui';
import { Colors } from '../../constants/colors';

const KAKAO_ICON = require('../../assets/additional/kakao-icon.png');

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(''); const [loginError, setLoginError] = useState('');
  const validateEmail = () => { const next = email && !isValidEmail(email) ? '유효하지 않은 이메일입니다.' : ''; setEmailError(next); return !next; };
  const submit = () => {
    if (!validateEmail() || !password) return;
    if (password.length < 8) return setLoginError('잘못된 이메일 또는 비밀번호입니다.');
    setLoginError(''); router.replace('/tutor');
  };
  return <AuthScreen title="로그인" actionLabel="로그인" actionEnabled={!!email && !!password} onAction={submit}>
    <View style={styles.form}>
      <TextField autoCapitalize="none" autoComplete="email" errorMessage={emailError || undefined} keyboardType="email-address" label="이메일"
        onBlur={validateEmail} onChangeText={(v) => { setEmail(v); setEmailError(''); setLoginError(''); }} placeholder="이메일을 입력해주세요" value={email} />
      <AuthPasswordField label="비밀번호" value={password} errorMessage={loginError || undefined}
        onChangeText={(v) => { setPassword(v); setLoginError(''); }} placeholder="비밀번호를 입력해주세요" />
      <Pressable onPress={() => router.push('/auth/forgot-password' as Href)} style={styles.forgot}><Text style={styles.link}>비밀번호 찾기</Text><Text style={styles.chevron}>›</Text></Pressable>
    </View>
    <View style={styles.social}>
      <View style={styles.dividerRow}><View style={styles.divider} /><Text style={styles.or}>또는</Text><View style={styles.divider} /></View>
      <AuthActionButton icon={KAKAO_ICON} label="카카오로 로그인" variant="kakao" />
      <Pressable onPress={() => router.push('/auth/signup/account' as Href)} style={styles.signupLink}><Text style={styles.muted}>아직 계정이 없어?</Text><Text style={styles.link}> 회원가입</Text><Text style={styles.chevron}> ›</Text></Pressable>
    </View>
  </AuthScreen>;
}
const styles = StyleSheet.create({
  form: { gap: 20 }, forgot: { alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center' },
  link: { color: '#5299A4', fontFamily: 'Pretendard-Medium', fontSize: 14, lineHeight: 20 }, chevron: { color: '#5299A4', fontSize: 18 },
  social: { marginTop: 'auto', gap: 16 }, dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  divider: { flex: 1, height: 1, backgroundColor: Colors['Line.Normal.Normal'] }, or: { color: Colors['Text.Normal.Assistive'], fontFamily: 'Pretendard-Medium', fontSize: 12 },
  signupLink: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }, muted: { color: Colors['Text.Normal.Normal'], fontFamily: 'Pretendard-Medium', fontSize: 14 },
});
