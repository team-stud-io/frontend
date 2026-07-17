import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

export interface ReportStatItemProps {
  body: string;
  title: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ReportStatItem({ body, title, style, testID }: ReportStatItemProps) {
  return (
    <View testID={testID ?? 'report-stat-item'} style={[styles.root, style]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  title: {
    alignSelf: 'stretch',
    color: Colors['Text.Normal.Normal'],
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    lineHeight: 16,
  },
  body: {
    alignSelf: 'stretch',
    color: Colors['Text.Normal.Normal'],
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    lineHeight: 24,
  },
});
