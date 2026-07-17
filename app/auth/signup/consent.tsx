import { type Href, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthDescription, AuthScreen, ConsentRow, useAuthSignup } from '../../../components/auth';
import { Colors } from '../../../constants/colors';

const POLICIES = [
  { key: 'service', label: '(필수) 서비스 이용약관 동의', required: true },
  { key: 'privacy', label: '(필수) 개인정보 수집·이용 동의', required: true },
  { key: 'learning', label: '(필수) 학습 데이터 분석 및 AI 활용 동의', required: true },
  { key: 'marketing', label: '(선택) 마케팅 정보 수신 동의', required: false },
];

export default function SignupConsentScreen() {
  const router = useRouter(); const { draft, updateDraft } = useAuthSignup(); const [loading, setLoading] = useState(false);
  const requiredDone = POLICIES.filter((p) => p.required).every((p) => draft.consents[p.key]);
  const allSelected = POLICIES.every((p) => draft.consents[p.key]);
  const toggle = (key: string) => updateDraft({ consents: { ...draft.consents, [key]: !draft.consents[key] } });
  const submit = () => { if (!requiredDone) return; setLoading(true); setTimeout(() => { setLoading(false); router.replace('/auth/signup/complete' as Href); }, 450); };
  return <AuthScreen step={5} actionLabel="가입 완료!" actionEnabled={requiredDone} loading={loading} onAction={submit}>
    <AuthDescription title="마지막으로 약관 동의가 필요해요!" subtitle="필수 항목에 동의해야 서비스를 이용할 수 있어요" />
    <View style={styles.policyBox}>
      <ConsentRow label="전체 동의하기" selected={allSelected} showChevron={false}
        onPress={() => updateDraft({ consents: Object.fromEntries(POLICIES.map((p) => [p.key, !allSelected])) })} />
    </View>
    <View style={styles.list}>{POLICIES.map((policy) => <ConsentRow key={policy.key} label={policy.label} selected={!!draft.consents[policy.key]} onPress={() => toggle(policy.key)} />)}</View>
    <View style={styles.notice}>
      <Text style={styles.noticeText}>• 학습 데이터 동의는 AI 튜터 전략 생성에 활용되며 제3자에게 제공되지 않아요.</Text>
      <Text style={styles.noticeText}>• 선택 항목에 동의하지 않아도 서비스 이용에 제한이 없어요.</Text>
      <Text style={styles.noticeText}>• 동의는 언제든지 마이페이지에서 철회할 수 있어요.</Text>
    </View>
  </AuthScreen>;
}
const styles = StyleSheet.create({
  policyBox: { minHeight: 54, justifyContent: 'center', paddingHorizontal: 16, borderWidth: 1, borderRadius: 16, borderColor: Colors['Line.Normal.Strong'] },
  list: { gap: 8, paddingHorizontal: 12 }, notice: { marginTop: 'auto', gap: 8, padding: 16, borderWidth: 1, borderRadius: 16, borderColor: Colors['Line.Normal.Normal'], backgroundColor: '#F6F8FA' },
  noticeText: { color: Colors['Text.Normal.Normal'], fontFamily: 'Pretendard-Regular', fontSize: 12, lineHeight: 18 },
});
