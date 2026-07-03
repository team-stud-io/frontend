// Tab.tsx
// 개별 탭 버튼 컴포넌트
// Unity 비유: state에 따라 외관이 바뀌는 Prefab

import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors } from '../constants/colors';

export type TabState = 'Default' | 'Selected' | 'LineX' | 'Inactive';

export interface TabProps {
  label: string;
  state?: TabState;
  onPress?: () => void;
  style?: object;
  testID?: string;
}

export function Tab({
  label,
  state = 'Default',
  onPress,
  style,
  testID,
}: TabProps) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={[
        styles.root,
        state === 'Selected' && styles.rootSelected,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          state === 'Selected' && styles.labelSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // 미선택 탭
  root: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    flex: 1,
    backgroundColor: Colors['Fill.Normal.Normal'],
  },
  // 선택된 탭
  rootSelected: {
    borderWidth: 1,
    borderColor: Colors['Line.Primary.Normal'],   // #66BFCD
    backgroundColor: Colors['Fill.Primary.Assistive'], // #E1F3F5
  },
  // 미선택 텍스트
  label: {
    color: Colors['Text.Normal.Assistive'],       // #A1A3A5
    textAlign: 'center',
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  // 선택된 텍스트
  labelSelected: {
    color: Colors['Text.Normal.Normal'],          // #56585A
  },
});
