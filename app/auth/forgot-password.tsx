import { type Href, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AuthDescription, AuthScreen, isValidEmail } from '../../components/auth';
import { TextField } from '../../components/ui';
import { Colors } from '../../constants/colors';

export default function ForgotPasswordScreen() {
  const router = useRouter(); const [email, setEmail] = useState(''); const [error, setError] = useState(''); const [sent, setSent] = useState(false);
  const submit = () => { if (!isValidEmail(email)) return setError('유효한 이메일을 입력해주세요.'); setError(''); setSent(true); };
  if (sent) return <AuthScreen title="비밀번호 찾기" actionLabel="로그인으로 돌아가기" onAction={() => router.replace('/auth/login' as Href)}>
    <AuthDescription title="재설정 링크를 확인해주세요" subtitle="가입된 계정이라면 비밀번호 재설정 링크를 이메일로 보내드렸어요." />
    <View style={styles.notice}><Text style={styles.noticeTitle}>{email}</Text><Text style={styles.noticeBody}>메일이 보이지 않으면 스팸함을 확인하거나 잠시 후 다시 시도해주세요.</Text></View>
  </AuthScreen>;
  return <AuthScreen title="비밀번호 찾기" actionLabel="재설정 링크 보내기" actionEnabled={!!email} onAction={submit}>
    <AuthDescription title="비밀번호를 잊으셨나요?" subtitle="가입할 때 사용한 이메일을 입력해주세요." />
    <TextField autoCapitalize="none" autoComplete="email" errorMessage={error || undefined} helperText="가입할 때 사용한 이메일을 입력해주세요."
      keyboardType="email-address" label="이메일" onBlur={() => email && !isValidEmail(email) && setError('유효한 이메일을 입력해주세요.')}
      onChangeText={(v) => { setEmail(v); setError(''); }} placeholder="이메일을 입력해주세요" value={email} />
    <View style={styles.help}><View style={styles.dividerRow}><View style={styles.divider} /><Text style={styles.or}>또는</Text><View style={styles.divider} /></View>
      <Pressable><Text style={styles.helpText}>이메일이 기억나지 않나요? <Text style={styles.link}>고객센터 문의하기 ›</Text></Text></Pressable></View>
  </AuthScreen>;
}
const styles = StyleSheet.create({
  help: { marginTop: 'auto', gap: 16 }, dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 }, divider: { flex: 1, height: 1, backgroundColor: Colors['Line.Normal.Normal'] },
  or: { color: Colors['Text.Normal.Assistive'], fontFamily: 'Pretendard-Medium', fontSize: 12 }, helpText: { textAlign: 'center', color: Colors['Text.Normal.Normal'], fontFamily: 'Pretendard-Medium', fontSize: 14 }, link: { color: '#5299A4' },
  notice: { gap: 8, padding: 16, borderRadius: 12, backgroundColor: Colors['Fill.Primary.Assistive'] }, noticeTitle: { color: '#242628', fontFamily: 'Pretendard-SemiBold', fontSize: 16 },
  noticeBody: { color: Colors['Text.Normal.Normal'], fontFamily: 'Pretendard-Medium', fontSize: 14, lineHeight: 20 },
});
