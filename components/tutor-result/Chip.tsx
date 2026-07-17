import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

export type ChipVariant = 'Primary' | 'Secondary';

export interface ChipProps {
  label: string;
  variant?: ChipVariant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Chip({ label, variant = 'Primary', style, testID }: ChipProps) {
  const isSecondary = variant === 'Secondary';

  return (
    <View
      testID={testID ?? 'chip'}
      style={[styles.root, isSecondary && styles.secondaryRoot, style]}
    >
      <Text style={[styles.label, isSecondary && styles.secondaryLabel]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    minHeight: 28,
    paddingHorizontal: 16,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors['Line.Primary.Normal'],
    backgroundColor: Colors['Fill.Primary.Normal'],
  },
  secondaryRoot: {
    backgroundColor: Colors['Fill.Primary.Assistive'],
  },
  label: {
    color: Colors['Text.Normal.Inverse'],
    textAlign: 'center',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    lineHeight: 20,
  },
  secondaryLabel: {
    color: Colors['Text.Normal.Normal'],
  },
});
