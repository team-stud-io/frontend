import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DifficultyScore } from '../figma';
import { Colors } from '../../constants/colors';
import { Difficulty } from './types';

interface TaskDetailBottomSheetProps { difficulty: Difficulty | null; visible: boolean; onClose: () => void; }
const STRATEGIES = [
  ['유형 분류부터 해', '문제 풀기 전에 이게 순열이야, 조합이야, 이항정리야? 딱 분류만 먼저 해봐. 틀려도 괜찮아. 분류 감 잡는 게 먼저야.'],
  ['풀고 바로 채점, 오답은 표시만', '한 강씩 풀고 바로 채점해. 틀린 문제는 X 표시만 하고 넘어가. 지금은 전체 유형을 한 번 보는 게 중요해.'],
  ['이항정리 공식 먼저 확인', '풀기 전에 (a + b)^n 전개식 공식 한 번 쓰고 시작해. 이 습관 하나가 실수를 줄여줘.'],
];

export function TaskDetailBottomSheet({ difficulty, visible, onClose }: TaskDetailBottomSheetProps) {
  return <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}><View style={styles.scrim}><View style={styles.sheet}>
    <View style={styles.header}><View style={styles.headerTop}><View style={styles.subjectBadge}><Text style={styles.subjectBadgeText}>확률과통계</Text></View><Pressable accessibilityLabel="닫기" hitSlop={8} onPress={onClose}><Ionicons name="close" size={26} color="#242628" /></Pressable></View><View style={styles.titleRow}><View style={styles.titleCopy}><Text style={styles.title}>수능특강 4강-7강 문제풀이</Text><Text style={styles.subtitle}>Stage 2 · 심화 개념 정리</Text></View>{difficulty && <DifficultyScore score={difficulty} />}</View></View>
    <View style={styles.dividerBlock} /><View style={styles.recommendation}><View style={styles.recommendationTag}><Ionicons name="volume-high-outline" size={18} color="#5299A4" /><Text style={styles.recommendationText}>루미 튜터의 추천 공부법</Text></View><Text style={styles.duration}>권장 시간 · 60~80분</Text></View>
    <ScrollView style={styles.strategyList} contentContainerStyle={styles.strategyContent} showsVerticalScrollIndicator={false}>{STRATEGIES.map(([title, body], index) => <View key={title} style={styles.strategyItem}><View style={styles.strategyNumber}><Text style={styles.strategyNumberText}>{index + 1}</Text></View><View style={styles.strategyCopy}><Text style={styles.strategyTitle}>{title}</Text><Text style={styles.strategyBody}>{body}</Text></View>{index === 1 && <View style={styles.note}><Text style={styles.noteText}>오답 정리는 Stage 3단계에서 깊게 할 거야!</Text></View>}</View>)}</ScrollView>
    <Pressable accessibilityRole="button" onPress={onClose} style={styles.closeButton}><Text style={styles.closeButtonText}>닫기</Text></Pressable>
  </View></View></Modal>;
}

const styles = StyleSheet.create({
  scrim: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.36)' }, sheet: { maxHeight: '92%', borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: '#FFFFFF', overflow: 'hidden' },
  header: { gap: 8, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 }, headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, subjectBadge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 14, backgroundColor: '#66BFCD' }, subjectBadgeText: { color: '#FFFFFF', fontFamily: 'Pretendard-SemiBold', fontSize: 13, lineHeight: 18 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }, titleCopy: { flex: 1 }, title: { color: '#242628', fontFamily: 'Pretendard-SemiBold', fontSize: 18, lineHeight: 28 }, subtitle: { color: '#8B8D8F', fontFamily: 'Pretendard-Regular', fontSize: 12, lineHeight: 18 },
  dividerBlock: { height: 8, marginHorizontal: 20, borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors['Line.Normal.Normal'] }, recommendation: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingHorizontal: 20, paddingVertical: 16 }, recommendationTag: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderRadius: 8, borderColor: Colors['Line.Normal.Normal'] }, recommendationText: { color: '#5299A4', fontFamily: 'Pretendard-Medium', fontSize: 12, lineHeight: 18 }, duration: { color: '#8B8D8F', fontFamily: 'Pretendard-Regular', fontSize: 12, lineHeight: 18 },
  strategyList: { maxHeight: 360 }, strategyContent: { paddingBottom: 8 }, strategyItem: { position: 'relative', flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderColor: Colors['Line.Normal.Normal'] }, strategyNumber: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: Colors['Line.Primary.Normal'], backgroundColor: Colors['Fill.Primary.Assistive'], alignItems: 'center', justifyContent: 'center' }, strategyNumberText: { color: '#5299A4', fontFamily: 'Pretendard-SemiBold', fontSize: 14 }, strategyCopy: { flex: 1, gap: 3 }, strategyTitle: { color: '#3B3D3F', fontFamily: 'Pretendard-SemiBold', fontSize: 16, lineHeight: 24 }, strategyBody: { color: '#707275', fontFamily: 'Pretendard-Regular', fontSize: 14, lineHeight: 21 },
  note: { position: 'absolute', right: 16, bottom: 10, left: 16, alignItems: 'center', paddingVertical: 4, borderWidth: 1, borderRadius: 6, borderColor: Colors['Line.Primary.Normal'], backgroundColor: Colors['Fill.Primary.Assistive'] }, noteText: { color: '#5299A4', fontFamily: 'Pretendard-Medium', fontSize: 12, lineHeight: 18 }, closeButton: { height: 52, alignItems: 'center', justifyContent: 'center', margin: 10, borderWidth: 1, borderRadius: 16, borderColor: Colors['Line.Normal.Strong'], backgroundColor: '#F6F8FA' }, closeButtonText: { color: '#242628', fontFamily: 'Pretendard-SemiBold', fontSize: 17, lineHeight: 24 },
});
