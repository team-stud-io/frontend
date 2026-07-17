import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

export type ReportNumberBadgeVariant = 'Primary' | 'Red' | 'Blue' | 'Orange' | 'Green';

export interface ReportNumberBadgeProps {
  number: string;
  variant?: ReportNumberBadgeVariant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ReportNumberBadge({
  number,
  variant = 'Primary',
  style,
  testID,
}: ReportNumberBadgeProps) {
  return (
    <View
      testID={testID ?? 'report-number-badge'}
      style={[styles.root, getRootTone(variant), style]}
    >
      <Text style={[styles.number, getNumberTone(variant)]}>{number}</Text>
    </View>
  );
}

function getRootTone(variant: ReportNumberBadgeVariant) {
  if (variant === 'Red') return styles.rootRed;
  if (variant === 'Blue') return styles.rootBlue;
  if (variant === 'Orange') return styles.rootOrange;
  if (variant === 'Green') return styles.rootGreen;
  return null;
}

function getNumberTone(variant: ReportNumberBadgeVariant) {
  if (variant === 'Red') return styles.numberRed;
  if (variant === 'Blue') return styles.numberBlue;
  if (variant === 'Orange') return styles.numberOrange;
  if (variant === 'Green') return styles.numberGreen;
  return null;
}

const styles = StyleSheet.create({
  root: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors['Line.Primary.Normal'],
    backgroundColor: Colors['Fill.Primary.Assistive'],
  },
  rootRed: {
    borderColor: '#E35D6A',
    backgroundColor: '#FFF1F1',
  },
  rootBlue: {
    borderColor: '#3385FF',
    backgroundColor: '#F2F7FF',
  },
  rootOrange: {
    borderColor: '#E49B32',
    backgroundColor: '#FFF8EC',
  },
  rootGreen: {
    borderColor: '#65A936',
    backgroundColor: '#F4FFE8',
  },
  number: {
    color: Colors['Text.Primary.Strong'],
    textAlign: 'center',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    lineHeight: 24,
  },
  numberRed: {
    color: '#E35D6A',
  },
  numberBlue: {
    color: '#3385FF',
  },
  numberOrange: {
    color: '#D89221',
  },
  numberGreen: {
    color: '#58A51F',
  },
});
