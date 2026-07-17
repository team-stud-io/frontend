import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React, { ReactNode, useRef } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AssetIcon, BottomNavigation } from '../ui';

export type AiReportTab = 'overview' | 'weakness' | 'review';

interface AiReportLayoutProps {
  activeTab: AiReportTab;
  children: ReactNode;
}

const TABS: { key: AiReportTab; label: string; href: string }[] = [
  { key: 'overview', label: '전체 현황', href: '/report' },
  { key: 'weakness', label: '약점 분석', href: '/report/weakness' },
  { key: 'review', label: '이번 주 회고', href: '/report/review' },
];

export function AiReportLayout({ activeTab, children }: AiReportLayoutProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const currentTab = TABS.find(item => item.key === activeTab) ?? TABS[0];

  const shareReport = async () => {
    await Share.share({
      title: '스터디오 AI 리포트',
      message: `스터디오 AI 리포트 - ${currentTab.label}\n수능까지 D-187`,
    });
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <View style={styles.avatarFace}>
              <View style={styles.avatarEye} />
              <View style={styles.avatarEye} />
            </View>
          </View>
          <View>
            <Text style={styles.ddayCaption}>수능까지</Text>
            <Text style={styles.dday}>D-187</Text>
          </View>
        </View>
        <Pressable accessibilityLabel="리포트 공유" hitSlop={10} onPress={shareReport}>
          <Ionicons name="share-outline" size={22} color="#56585A" />
        </Pressable>
      </View>

      <View style={styles.tabs}>
        {TABS.map(item => {
          const selected = item.key === activeTab;
          return (
            <Pressable
              key={item.key}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => router.replace(item.href as Href)}
              style={[styles.tab, selected && styles.tabSelected]}
            >
              <Text style={[styles.tabLabel, selected && styles.tabLabelSelected]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {children}
      </ScrollView>

      <Pressable
        accessibilityLabel="맨 위로 이동"
        onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
        style={[styles.topButton, { bottom: 68 + insets.bottom }]}
      >
        <AssetIcon name="up" width={40} height={40} />
      </Pressable>

      <BottomNavigation activeSection="aiReport" bottomInset={insets.bottom} onHomePress={() => router.replace('/home' as Href)} onMyPagePress={() => router.replace('/MyPage' as Href)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    height: 82,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#19B9C9',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  avatarFace: {
    width: 30,
    height: 23,
    marginBottom: 3,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  avatarEye: { width: 4, height: 6, borderRadius: 3, backgroundColor: '#242628' },
  ddayCaption: { fontFamily: 'Pretendard-Regular', fontSize: 11, lineHeight: 16, color: '#A1A3A5' },
  dday: { fontFamily: 'Pretendard-SemiBold', fontSize: 20, lineHeight: 28, color: '#242628' },
  tabs: { height: 40, paddingHorizontal: 16, flexDirection: 'row' },
  tab: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#ECEEF0',
  },
  tabSelected: { borderBottomColor: '#66BFCD' },
  tabLabel: { fontFamily: 'Pretendard-SemiBold', fontSize: 13, lineHeight: 20, color: '#A1A3A5' },
  tabLabelSelected: { color: '#5299A4' },
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 28 },
  topButton: {
    position: 'absolute',
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#66BFCD',
    backgroundColor: '#5299A4',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
});
