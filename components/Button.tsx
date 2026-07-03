// Button.tsx
// stud.io 공통 버튼 컴포넌트
// Unity 비유: UI Button에 커스텀 스타일 입힌 것

import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors } from '../constants/colors';

export type ButtonState = 'Default' | 'Inactive';

export interface ButtonProps {
  label: string;
  state?: ButtonState;
  onPress?: () => void;
  style?: object;
  testID?: string;
}

export function Button({
  label,
  state = 'Default',
  onPress,
  style,
  testID,
}: ButtonProps) {
  return (
    <Pressable
      testID={testID}
      onPress={state === 'Default' ? onPress : undefined}
      style={[
        styles.root,
        state === 'Inactive' ? styles.inactive : styles.active,
        style,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 60,
    paddingVertical: 10,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 16,
  },
  // 활성 버튼 (청록)
  active: {
    backgroundColor: Colors['Fill.Primary.Normal'],  // #66BFCD
  },
  // 비활성 버튼 (회색)
  inactive: {
    backgroundColor: Colors['Fill.Normal.Inactive'], // #D3D5D7
  },
  label: {
    color: Colors['Text.Normal.Inverse'],            // #FFFFFF
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
  },
});