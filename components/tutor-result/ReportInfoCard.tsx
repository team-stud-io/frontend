import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

export type ReportInfoCardColor = 'Default' | 'Assistive' | 'Green' | 'Red';
export type ReportInfoCardVariant = 'Icon' | 'Feedback' | 'Tag' | 'Progress';

export interface ReportInfoCardProps {
  body: string;
  title: string;
  color?: ReportInfoCardColor;
  variant?: ReportInfoCardVariant;
  leading?: ReactNode;
  tagSlot?: ReactNode;
  footer?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ReportInfoCard({
  body,
  title,
  color = 'Default',
  variant = 'Icon',
  leading,
  tagSlot,
  footer,
  style,
  testID,
}: ReportInfoCardProps) {
  const isTag = variant === 'Tag';
  const isFeedback = variant === 'Feedback';
  const isProgress = variant === 'Progress';

  return (
    <View
      testID={testID ?? 'report-info-card'}
      style={[
        styles.root,
        isTag && styles.tagRoot,
        isFeedback && color === 'Red' && styles.redFeedbackRoot,
        isFeedback && color === 'Green' && styles.greenFeedbackRoot,
        isProgress && styles.progressRoot,
        style,
      ]}
    >
      {variant === 'Icon' && !leading && (
        <View style={styles.iconSection}>
          <Text style={styles.iconText}>□</Text>
        </View>
      )}
      <View style={styles.cardRow}>
        {leading}
        <View style={[styles.labelSection, isProgress && styles.progressLabelSection]}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, (isTag || isProgress) && styles.largeTitle]}>{title}</Text>
            {tagSlot}
          </View>
          <Text style={[styles.body, (isTag || isProgress) && styles.largeBody]}>{body}</Text>
        </View>
      </View>
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minWidth: 0,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Normal'],
    backgroundColor: Colors['Fill.Normal.Assistive'],
  },
  tagRoot: {
    paddingBottom: 12,
    borderColor: Colors['Line.Normal.Strong'],
    backgroundColor: Colors['Fill.Normal.Normal'],
  },
  redFeedbackRoot: {
    paddingBottom: 12,
    backgroundColor: '#FFF1F1',
  },
  greenFeedbackRoot: {
    paddingBottom: 12,
    backgroundColor: '#F4FFE8',
  },
  progressRoot: {
    minHeight: 124,
    justifyContent: 'center',
    gap: 12,
  },
  iconSection: {
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Strong'],
    backgroundColor: Colors['Fill.Normal.Normal'],
  },
  iconText: {
    fontSize: 14,
    color: Colors['Text.Primary.Strong'],
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    alignSelf: 'stretch',
  },
  labelSection: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressLabelSection: {
    gap: 0,
  },
  title: {
    flex: 1,
    color: Colors['Text.Normal.Strong'],
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    lineHeight: 24,
  },
  largeTitle: {
    fontSize: 16,
  },
  body: {
    color: Colors['Text.Normal.Subtle'],
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  largeBody: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    lineHeight: 20,
  },
});
