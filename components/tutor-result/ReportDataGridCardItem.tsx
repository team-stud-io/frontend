import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

export interface ReportDataGridCardItemProps {
  value: string;
  label: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ReportDataGridCardItem({ value, label, style, testID }: ReportDataGridCardItemProps) {
  return (
    <View testID={testID ?? 'report-data-grid-card-item'} style={[styles.root, style]}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: 68,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Normal'],
    backgroundColor: Colors['Fill.Normal.Normal'],
  },
  value: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    lineHeight: 26,
    color: Colors['Text.Normal.Strong'],
  },
  label: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 11,
    lineHeight: 16,
    color: Colors['Text.Normal.Subtle'],
  },
});
