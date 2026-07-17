import { type Href, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { AuthDescription, AuthScreen, ChoiceChips, useAuthSignup } from '../../../components/auth';
import { TextField } from '../../../components/ui';

const TRACKS = ['인문·사회', '자연·공학', '의약계열', '예체능', '교육', '아직 모름'];
const ADMISSIONS = ['수시 학생부종합', '수시 학생부교과', '수시 논술', '정시 수능', '아직 모름'];

export default function SignupGoalsScreen() {
  const router = useRouter(); const { draft, updateDraft } = useAuthSignup();
  const enabled = draft.goalTracks.length > 0 && draft.admissionTypes.length > 0;
  return <AuthScreen step={4} actionLabel="다음" actionEnabled={enabled} onAction={() => router.push('/auth/signup/consent' as Href)}>
    <AuthDescription title="입시 목표" subtitle="나중에 언제든 바꿀 수 있어" />
    <View style={{ gap: 32 }}>
      <ChoiceChips label="진학하고자 하는 계열 (복수 선택)" options={TRACKS} selected={draft.goalTracks} multiple
        onChange={(goalTracks) => updateDraft({ goalTracks })} />
      <TextField label="희망 학과/전공 (선택)" onChangeText={(desiredMajor) => updateDraft({ desiredMajor })}
        placeholder="예) 경영학과, 컴퓨터공학과.." helperText="모르면 비워도 괜찮아" value={draft.desiredMajor} />
      <ChoiceChips label="준비 중인 입시 전형 (복수 선택)" options={ADMISSIONS} selected={draft.admissionTypes} multiple
        onChange={(admissionTypes) => updateDraft({ admissionTypes })} />
    </View>
  </AuthScreen>;
}
