import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

export interface ReportCardFeedbackProps {
  body: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ReportCardFeedback({ body, style, testID }: ReportCardFeedbackProps) {
  return (
    <View testID={testID ?? 'report-card-feedback'} style={[styles.root, style]}>
      <View style={styles.dot} />
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors['Fill.Primary.Normal'],
  },
  body: {
    flex: 1,
    fontFamily: 'Pretendard-Regular',
    fontSize: 13,
    lineHeight: 20,
    color: Colors['Text.Normal.Normal'],
  },
});
