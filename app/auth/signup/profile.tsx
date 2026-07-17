import { type Href, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { AuthDescription, AuthScreen, ChoiceChips, SearchSelectField, useAuthSignup } from '../../../components/auth';
import { TextField } from '../../../components/ui';

const GRADES = ['중1', '중2', '중3', '고1', '고2', '고3'];
const REGIONS = ['서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원특별자치도', '충청북도', '충청남도', '전북특별자치도', '전라남도', '경상북도', '경상남도', '제주특별자치도'];

export default function SignupProfileScreen() {
  const router = useRouter(); const { draft, updateDraft } = useAuthSignup();
  const enabled = !!draft.nickname.trim() && !!draft.grade && !!draft.region.trim();
  return <AuthScreen step={2} actionLabel="다음" actionEnabled={enabled} onAction={() => router.push('/auth/signup/school' as Href)}>
    <AuthDescription title="나를 알려줘!" subtitle="생활 맞춤 서비스를 받을 거야" />
    <View style={{ gap: 28 }}>
      <TextField label="닉네임" maxLength={10} onChangeText={(nickname) => updateDraft({ nickname })} placeholder="닉네임을 입력해주세요"
        helperText={`앱 안에서 사용할 이름이야. 언제든 바꿀 수 있어 · ${draft.nickname.length}/10`} value={draft.nickname} />
      <ChoiceChips label="현재 학년" options={GRADES} selected={draft.grade ? [draft.grade] : []} onChange={([grade]) => updateDraft({ grade, schoolType: '', schoolName: '' })} />
      <SearchSelectField label="사는 지역" value={draft.region} placeholder="지역 입력" options={REGIONS} onChange={(region) => updateDraft({ region })} />
    </View>
  </AuthScreen>;
}
