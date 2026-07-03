// TabSection.tsx
// 탭들을 하나의 행으로 묶어주는 컴포넌트
// Unity 비유: 여러 Tab Prefab을 담는 HorizontalLayoutGroup

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../constants/colors';
import { Tab } from './Tab';

export interface TabSectionProps {
  tabs: string[];           // 탭 라벨 목록
  selectedIndex: number;    // 현재 선택된 탭 인덱스
  onTabPress: (index: number) => void;
  style?: object;
  testID?: string;
}

export function TabSection({
  tabs,
  selectedIndex,
  onTabPress,
  style,
  testID,
}: TabSectionProps) {
  return (
    <View testID={testID} style={[styles.root, style]}>
      {tabs.map((label, index) => (
        <Tab
          key={index}
          label={label}
          state={selectedIndex === index ? 'Selected' : 'Default'}
          onPress={() => onTabPress(index)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    width: '100%',
    height: 54,
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Strong'],    // #D3D5D7
    backgroundColor: Colors['Fill.Normal.Normal'], // #FFFFFF
  },
});
