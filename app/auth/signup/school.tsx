import { type Href, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { AuthDescription, AuthScreen, ChoiceChips, SearchSelectField, useAuthSignup } from '../../../components/auth';

const HIGH_TYPES = ['일반고', '자사고', '특목고', '특성화고'];
const SCHOOLS = ['서울중학교', '대치중학교', '경기중학교', '서울고등학교', '경기고등학교', '대원외국어고등학교', '한성과학고등학교', '서울디자인고등학교'];

export default function SignupSchoolScreen() {
  const router = useRouter(); const { draft, updateDraft } = useAuthSignup(); const highSchool = draft.grade.startsWith('고');
  const type = highSchool ? draft.schoolType : '중학교'; const enabled = !!type && !!draft.schoolName.trim();
  return <AuthScreen step={3} actionLabel="다음" actionEnabled={enabled} onAction={() => { updateDraft({ schoolType: type }); router.push('/auth/signup/goals' as Href); }}>
    <AuthDescription title="학교 & 입시 정보" subtitle="맞춤 전략에 꼭 필요해" />
    <View style={{ gap: 36 }}>
      {highSchool ? <ChoiceChips label="학교 유형" options={HIGH_TYPES} selected={draft.schoolType ? [draft.schoolType] : []}
        onChange={([schoolType]) => updateDraft({ schoolType })} /> : <ChoiceChips label="학교 유형" options={['중학교']} selected={['중학교']} onChange={() => undefined} />}
      <SearchSelectField label="학교 검색" value={draft.schoolName} placeholder="학교 이름" options={SCHOOLS}
        helperText="NEIS 학교 데이터 기반 · 검색 결과가 없으면 학교명을 직접 입력할 수 있어요."
        onChange={(schoolName) => updateDraft({ schoolName })} />
    </View>
  </AuthScreen>;
}
