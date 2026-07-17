import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNavigation } from '../../components/ui';
import { Colors } from '../../constants/colors';

const AVATAR = require('../../assets/additional/character-hello-small.png');

const SECTIONS = [
  {
    title: '내 정보',
    items: [
      ['프로필 수정', '닉네임 · 학년 · 지역'],
      ['학교 · 입시 정보 수정', '학교 · 계열 · 전형'],
      ['학습 유형 재검사', '현재 PIMT', '재검사', 'cyan'],
      ['AI 튜터 설정 수정', '시험 과목 · 범위 · 일정'],
    ],
  },
  {
    title: '계정',
    items: [
      ['계정 관리', ''],
      ['결제 정보 · 관리', 'Pro 플랜 이용 중', 'Pro', 'blue'],
    ],
  },
  {
    title: '지원',
    items: [
      ['문의하기', ''],
      ['공지사항', '', 'NEW', 'pink'],
      ['이용약관 · 개인정보처리방침', ''],
    ],
  },
] as const;

export default function MyPageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
    <View style={styles.viewport}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 84 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.typeChip}><Text style={styles.typeChipText}>PIMT · 루틴 몰입형</Text></View>
          <View style={styles.userInfo}><View style={styles.avatar}><Image source={AVATAR} resizeMode="contain" style={styles.avatarImage} /></View><View><Text style={styles.nickname}>공부왕짱아</Text><Text style={styles.school}>대치고등학교 · 고1</Text></View></View>
        </View>
        {SECTIONS.map(section => <View key={section.title} style={styles.section}><Text style={styles.sectionTitle}>{section.title}</Text><View style={styles.menuList}>{section.items.map(([title, detail, badge, tone], index) => <Pressable key={title} accessibilityRole="button" style={[styles.menuItem, index === section.items.length - 1 && styles.menuItemLast]}><View style={styles.menuCopy}><Text style={styles.menuTitle}>{title}</Text>{!!detail && <Text style={styles.menuDetail}>{detail}</Text>}</View>{badge && <Text style={[styles.badge, tone === 'pink' ? styles.badgePink : tone === 'blue' ? styles.badgeBlue : styles.badgeCyan]}>{badge}</Text>}<Ionicons name="chevron-forward" size={20} color="#242628" /></Pressable>)}</View></View>)}
      </ScrollView>
      <BottomNavigation activeSection="myPage" bottomInset={insets.bottom} onHomePress={() => router.replace('/home')} onAiReportPress={() => router.replace('/report')} />
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' }, viewport: { flex: 1, backgroundColor: '#FFFFFF' }, content: { gap: 28, paddingHorizontal: 20, paddingTop: 12 },
  profileSection: { alignItems: 'center', gap: 24, paddingTop: 4 }, typeChip: { alignItems: 'center', justifyContent: 'center', minHeight: 28, paddingHorizontal: 16, borderWidth: 1, borderRadius: 8, borderColor: '#F0B6CC', backgroundColor: '#FFF4F8' }, typeChipText: { color: '#E65A91', fontFamily: 'Pretendard-Medium', fontSize: 13, lineHeight: 18 },
  userInfo: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 }, avatar: { width: 50, height: 50, overflow: 'hidden', borderRadius: 25, backgroundColor: '#18BDCD' }, avatarImage: { width: 50, height: 50 }, nickname: { color: '#242628', fontFamily: 'Pretendard-SemiBold', fontSize: 18, lineHeight: 28 }, school: { color: '#8B8D8F', fontFamily: 'Pretendard-Regular', fontSize: 12, lineHeight: 16 },
  section: { gap: 8 }, sectionTitle: { color: '#8B8D8F', fontFamily: 'Pretendard-Medium', fontSize: 13, lineHeight: 20 }, menuList: { overflow: 'hidden', borderWidth: 1, borderRadius: 16, borderColor: Colors['Line.Normal.Strong'], backgroundColor: '#FFFFFF' }, menuItem: { minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors['Line.Normal.Normal'] }, menuItemLast: { borderBottomWidth: 0 }, menuCopy: { flex: 1, gap: 2 }, menuTitle: { color: '#3B3D3F', fontFamily: 'Pretendard-Medium', fontSize: 15, lineHeight: 24 }, menuDetail: { color: '#8B8D8F', fontFamily: 'Pretendard-Regular', fontSize: 13, lineHeight: 20 }, badge: { fontFamily: 'Pretendard-Medium', fontSize: 13, lineHeight: 20 }, badgeCyan: { color: '#3385FF' }, badgeBlue: { color: '#5299A4' }, badgePink: { color: '#FF6363' },
});
