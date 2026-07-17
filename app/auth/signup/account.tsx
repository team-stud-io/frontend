import { type Href, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { AuthDescription, AuthPasswordField, AuthScreen, isValidEmail, isValidPassword, useAuthSignup } from '../../../components/auth';
import { TextField } from '../../../components/ui';

export default function SignupAccountScreen() {
  const router = useRouter(); const { draft, updateDraft } = useAuthSignup(); const [confirm, setConfirm] = useState(draft.password);
  const [emailError, setEmailError] = useState(''); const [passwordError, setPasswordError] = useState(''); const [confirmError, setConfirmError] = useState('');
  const submit = () => {
    const e = isValidEmail(draft.email) ? '' : '유효한 이메일을 입력해주세요.';
    const p = isValidPassword(draft.password) ? '' : '영문과 숫자를 포함해 8자 이상 입력해주세요.';
    const c = draft.password === confirm ? '' : '비밀번호가 일치하지 않습니다.';
    setEmailError(e); setPasswordError(p); setConfirmError(c); if (!e && !p && !c) router.push('/auth/signup/profile' as Href);
  };
  return <AuthScreen step={1} actionLabel="다음" actionEnabled={!!draft.email && !!draft.password && !!confirm} onAction={submit}>
    <AuthDescription title="계정을 만들어봐" subtitle="이메일과 비밀번호를 설정해줘" />
    <View style={{ gap: 20 }}>
      <TextField autoCapitalize="none" autoComplete="email" errorMessage={emailError || undefined} keyboardType="email-address" label="이메일"
        onBlur={() => draft.email && !isValidEmail(draft.email) && setEmailError('유효한 이메일을 입력해주세요.')}
        onChangeText={(v) => { updateDraft({ email: v }); setEmailError(''); }} placeholder="example@email.com" value={draft.email} />
      <AuthPasswordField label="비밀번호" value={draft.password} helperText="영문, 숫자를 포함하여 8자 이상 입력해 주세요."
        errorMessage={passwordError || undefined} onChangeText={(v) => { updateDraft({ password: v }); setPasswordError(''); }} />
      <AuthPasswordField label="비밀번호 확인" value={confirm} errorMessage={confirmError || undefined}
        onChangeText={(v) => { setConfirm(v); setConfirmError(''); }} placeholder="비밀번호 확인" />
    </View>
  </AuthScreen>;
}
