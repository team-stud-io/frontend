import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Button } from '../ui/Button';
import { Colors } from '../../constants/colors';
import { IconFlashM } from './IconFlashM';

export type ReportTextCardVariant = 'Stroke' | 'Fill';

export interface ReportTextCardProps {
  body: string;
  title: string;
  variant?: ReportTextCardVariant;
  showButton?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ReportTextCard({
  body,
  title,
  variant = 'Stroke',
  showButton = true,
  style,
  testID,
}: ReportTextCardProps) {
  const isFill = variant === 'Fill';

  return (
    <View testID={testID ?? 'report-text-card'} style={[styles.root, isFill && styles.fillRoot, style]}>
      <View style={styles.labelIcon}>
        <IconFlashM />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.body}>{body}</Text>
      {showButton && (
        <Button
          label="전략 업데이트 받기"
          state="Default"
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors['Line.Primary.Normal'],
    backgroundColor: Colors['Fill.Normal.Normal'],
  },
  fillRoot: {
    gap: 8,
    borderColor: Colors['Line.Normal.Strong'],
    backgroundColor: Colors['Fill.Normal.Assistive'],
  },
  labelIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'stretch',
  },
  title: {
    flex: 1,
    color: Colors['Text.Normal.Strong'],
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    lineHeight: 24,
  },
  body: {
    alignSelf: 'stretch',
    color: Colors['Text.Normal.Normal'],
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    height: 44,
    borderRadius: 16,
    alignSelf: 'stretch',
  },
});
