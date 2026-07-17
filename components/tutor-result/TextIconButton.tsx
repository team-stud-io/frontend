import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

export interface TextIconButtonProps {
  label: string;
  showIcon?: boolean;
  showText?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  onPress?: () => void;
}

export function TextIconButton({
  label,
  showIcon = true,
  showText = true,
  style,
  testID,
  onPress,
}: TextIconButtonProps) {
  return (
    <Pressable testID={testID ?? 'text-icon-button'} style={[styles.root, style]} onPress={onPress}>
      {showText && <Text style={styles.label}>{label}</Text>}
      {showIcon && <Text style={styles.icon}>›</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    lineHeight: 18,
    color: Colors['Text.Primary.Strong'],
  },
  icon: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    lineHeight: 18,
    color: Colors['Text.Primary.Strong'],
  },
});
