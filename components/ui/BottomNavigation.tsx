import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { AssetIcon, type AssetIconName } from './AssetIcon';

export type BottomNavigationSection = 'home' | 'aiReport' | 'studyRoom' | 'myPage';

const ITEMS: { id: BottomNavigationSection; label: string; defaultIcon: AssetIconName; selectedIcon: AssetIconName }[] = [
  { id: 'home', label: '홈', defaultIcon: 'homeDefault', selectedIcon: 'homeSelected' },
  { id: 'aiReport', label: 'AI 리포트', defaultIcon: 'aiReportDefault', selectedIcon: 'aiReportSelected' },
  { id: 'studyRoom', label: '스터디룸', defaultIcon: 'studyRoomDefault', selectedIcon: 'studyRoomSelected' },
  { id: 'myPage', label: '마이', defaultIcon: 'myPageDefault', selectedIcon: 'myPageSelected' },
];

export function BottomNavigation({ activeSection, bottomInset, onHomePress, onAiReportPress, onMyPagePress }: { activeSection: BottomNavigationSection; bottomInset: number; onHomePress?: () => void; onAiReportPress?: () => void; onMyPagePress?: () => void }) {
  return <View style={[styles.root, { paddingBottom: bottomInset }]}>{ITEMS.map(item => {
    const selected = activeSection === item.id;
    const onPress = item.id === 'home' ? onHomePress : item.id === 'aiReport' ? onAiReportPress : item.id === 'myPage' ? onMyPagePress : undefined;
    return <Pressable key={item.id} accessibilityRole="tab" accessibilityState={{ selected }} onPress={onPress} style={styles.item}>
      <AssetIcon name={selected ? item.selectedIcon : item.defaultIcon} width={24} height={24} />
      <Text style={[styles.label, selected && styles.labelSelected]}>{item.label}</Text>
    </Pressable>;
  })}</View>;
}

const styles = StyleSheet.create({
  root: { minHeight: 58, paddingTop: 7, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F6F8FA', borderTopWidth: 1, borderColor: Colors['Line.Normal.Normal'] },
  item: { width: 48, height: 44, alignItems: 'center', justifyContent: 'center', gap: 2 },
  label: { color: '#A1A3A5', fontFamily: 'Pretendard-Regular', fontSize: 10, lineHeight: 14 },
  labelSelected: { color: '#242628' },
});
