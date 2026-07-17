import { type Href, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { AuthDescription, AuthPasswordField, AuthScreen, isValidPassword } from '../../components/auth';

export default function ResetPasswordScreen() {
  const router = useRouter(); const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState('');
  const [passwordError, setPasswordError] = useState(''); const [confirmError, setConfirmError] = useState('');
  const submit = () => {
    const pError = isValidPassword(password) ? '' : '영문과 숫자를 포함해 8자 이상 입력해주세요.';
    const cError = password === confirm ? '' : '비밀번호가 일치하지 않습니다.';
    setPasswordError(pError); setConfirmError(cError); if (!pError && !cError) router.replace('/auth/login' as Href);
  };
  return <AuthScreen title="비밀번호 재설정" actionLabel="비밀번호 재설정하기" actionEnabled={!!password && !!confirm} onAction={submit}>
    <AuthDescription title="새 비밀번호를 설정해주세요" subtitle="이전에 사용한 비밀번호와 다르게 설정해주세요." />
    <View style={{ gap: 20 }}>
      <AuthPasswordField label="새 비밀번호" value={password} helperText="영문, 숫자를 포함하여 8자 이상 입력해 주세요."
        errorMessage={passwordError || undefined} onChangeText={(v) => { setPassword(v); setPasswordError(''); }} />
      <AuthPasswordField label="비밀번호 확인" value={confirm} errorMessage={confirmError || undefined}
        onChangeText={(v) => { setConfirm(v); setConfirmError(''); }} placeholder="비밀번호 확인" />
    </View>
  </AuthScreen>;
}
