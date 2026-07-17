import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';

const CHARACTER = require('../../../assets/additional/character-hello.png');
const FEATURES = [
  ['calendar-outline', '오늘의 플래너 자동 생성', '시험 일정에 맞게 매일 공부 계획을 짜줘요'],
  ['ribbon-outline', '내 유형 맞춤 전략 제공', '루틴 몰입형에 맞는 공부법을 알려줘요'],
  ['stats-chart-outline', '매일 학습 점검', '하루 마무리 후 피드백과 전략을 업데이트해요'],
  ['school-outline', '내신 시험 패턴 분석', '우리 학교 선생님 출제 스타일을 반영해요'],
] as const;

export default function SignupCompleteScreen() {
  const router = useRouter(); const insets = useSafeAreaInsets();
  return <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
    <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 12 + insets.bottom }]} showsVerticalScrollIndicator={false}>
      <View style={styles.badge}><Text style={styles.badgeText}>가입 완료!</Text></View>
      <View style={styles.bubble}><Text style={styles.bubbleText}>환영해요! AI 튜터를 만들어봐요</Text></View>
      <Image source={CHARACTER} resizeMode="contain" style={styles.character} />
      <View style={styles.intro}><Text style={styles.muted}>가입하면</Text><Text style={styles.heading}>더 자세한 분석과 맞춤 전략이!</Text></View>
      <View style={styles.featureGrid}>{FEATURES.map(([icon, title, body]) => <View key={title} style={styles.featureCard}>
        <View style={styles.iconBox}><Ionicons name={icon} size={20} color="#56585A" /></View>
        <Text style={styles.featureTitle}>{title}</Text><Text style={styles.featureBody}>{body}</Text>
      </View>)}</View>
      <Text style={styles.remaining}>시작까지 한 단계만 남았어요!</Text>
      <View style={styles.steps}>
        <Step done number="1" title="학습 유형 검사 완료" body="PIMT · 루틴 몰입형" />
        <Step done number="2" title="회원가입 완료" body="계정이 만들어졌어요" />
        <Step number="3" title="AI 튜터 생성하기" body="시험 과목과 일정을 알려주세요" />
      </View>
      <Pressable onPress={() => router.replace('/tutor')} style={styles.primaryButton}><Text style={styles.primaryLabel}>AI 튜터 만들러 가기</Text></Pressable>
      <Pressable onPress={() => router.replace('/tutor')} style={styles.laterButton}><Text style={styles.laterLabel}>나중에 할게요 ›</Text></Pressable>
    </ScrollView>
  </SafeAreaView>;
}

function Step({ done = false, number, title, body }: { done?: boolean; number: string; title: string; body: string }) {
  return <View style={styles.stepRow}>
    <View style={[styles.stepIcon, done && styles.stepDone]}>{done ? <Ionicons name="checkmark" size={18} color="#FFFFFF" /> : <Text style={styles.stepNumber}>{number}</Text>}</View>
    <View style={styles.stepCopy}><Text style={styles.stepTitle}>{title}</Text><Text style={styles.stepBody}>{body}</Text></View>
  </View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' }, content: { alignItems: 'center', gap: 14, paddingHorizontal: 18, paddingTop: 14 },
  badge: { minHeight: 28, justifyContent: 'center', paddingHorizontal: 16, borderRadius: 14, backgroundColor: Colors['Fill.Primary.Normal'] },
  badgeText: { color: '#FFFFFF', fontFamily: 'Pretendard-SemiBold', fontSize: 14, lineHeight: 24 },
  bubble: { width: '88%', minHeight: 46, justifyContent: 'center', paddingHorizontal: 16, borderWidth: 1, borderRadius: 14, borderColor: Colors['Line.Normal.Strong'] },
  bubbleText: { color: '#242628', fontFamily: 'Pretendard-Medium', fontSize: 15, lineHeight: 22, textAlign: 'center' },
  character: { width: 120, height: 122 }, intro: { alignItems: 'center', gap: 3 },
  muted: { color: Colors['Text.Normal.Normal'], fontFamily: 'Pretendard-Medium', fontSize: 14, lineHeight: 20 },
  heading: { color: '#5299A4', fontFamily: 'Pretendard-SemiBold', fontSize: 20, lineHeight: 28 },
  featureGrid: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  featureCard: { width: '49%', minHeight: 116, gap: 4, padding: 12, borderWidth: 1, borderRadius: 16, borderColor: Colors['Line.Normal.Normal'], backgroundColor: '#F6F8FA' },
  iconBox: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 10, borderColor: Colors['Line.Normal.Strong'], backgroundColor: '#FFFFFF' },
  featureTitle: { color: '#242628', fontFamily: 'Pretendard-SemiBold', fontSize: 13, lineHeight: 20 },
  featureBody: { color: Colors['Text.Normal.Assistive'], fontFamily: 'Pretendard-Regular', fontSize: 11, lineHeight: 16 },
  remaining: { marginTop: 6, color: '#242628', fontFamily: 'Pretendard-SemiBold', fontSize: 16, lineHeight: 24 },
  steps: { width: '100%', overflow: 'hidden', borderWidth: 1, borderRadius: 16, borderColor: Colors['Line.Normal.Strong'] },
  stepRow: { minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: Colors['Line.Normal.Normal'] },
  stepIcon: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 13, borderColor: Colors['Line.Primary.Normal'], backgroundColor: Colors['Fill.Primary.Assistive'] },
  stepDone: { backgroundColor: '#5299A4' }, stepNumber: { color: '#5299A4', fontFamily: 'Pretendard-Medium', fontSize: 13 },
  stepCopy: { flex: 1 }, stepTitle: { color: Colors['Text.Normal.Normal'], fontFamily: 'Pretendard-SemiBold', fontSize: 14, lineHeight: 20 },
  stepBody: { color: Colors['Text.Normal.Assistive'], fontFamily: 'Pretendard-Regular', fontSize: 12, lineHeight: 16 },
  primaryButton: { width: '100%', minHeight: 56, alignItems: 'center', justifyContent: 'center', marginTop: 2, borderRadius: 16, backgroundColor: Colors['Fill.Primary.Normal'] },
  primaryLabel: { color: '#FFFFFF', fontFamily: 'Pretendard-SemiBold', fontSize: 18, lineHeight: 28 }, laterButton: { minHeight: 30, justifyContent: 'center' },
  laterLabel: { color: Colors['Text.Normal.Normal'], fontFamily: 'Pretendard-Medium', fontSize: 14, lineHeight: 20 },
});
