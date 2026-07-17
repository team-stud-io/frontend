import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { ReportCardFeedback } from './ReportCardFeedback';
import { ReportStatItem } from './ReportStatItem';

export type ReportDataGridCardVariant = 'ActivityTracker' | 'TextFeedback' | 'StrategySummary';

export interface ReportDataGridCardProps {
  progressLabel: string;
  subtitle: string;
  title: string;
  stats?: { title: string; body: string }[];
  variant?: ReportDataGridCardVariant;
  showFeedback2?: boolean;
  showFeedback3?: boolean;
  showFeedback4?: boolean;
  showFeedback5?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ReportDataGridCard({
  subtitle,
  title,
  stats = [
    { title: '1순위 과목', body: '사회·문화' },
    { title: '하루 목표', body: '5시간' },
    { title: '단계 플랜', body: '3주' },
  ],
  variant = 'ActivityTracker',
  showFeedback2,
  showFeedback3,
  showFeedback4,
  showFeedback5,
  style,
  testID,
}: ReportDataGridCardProps) {
  const isStrategySummary = variant === 'StrategySummary';

  return (
    <View
      testID={testID ?? 'report-data-grid-card'}
      style={[styles.root, isStrategySummary && styles.strategyRoot, style]}
    >
      <View style={styles.labelSection}>
        <Text style={[styles.title, isStrategySummary && styles.strategyTitle]}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.itemSection}>
        {stats.map(stat => (
          <ReportStatItem key={stat.title} title={stat.title} body={stat.body} />
        ))}
      </View>

      <View style={styles.divider} />

      <View style={styles.feedbackSection}>
        <ReportCardFeedback body="본문 내용입니다." />
        {showFeedback2 && <ReportCardFeedback body="본문 내용입니다." />}
        {showFeedback3 && <ReportCardFeedback body="본문 내용입니다." />}
        {showFeedback4 && <ReportCardFeedback body="본문 내용입니다." />}
        {showFeedback5 && <ReportCardFeedback body="본문 내용입니다." />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    padding: 16,
    gap: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Normal'],
    backgroundColor: Colors['Fill.Normal.Assistive'],
  },
  strategyRoot: {
    gap: 12,
    borderColor: Colors['Line.Primary.Normal'],
    backgroundColor: Colors['Fill.Normal.Normal'],
  },
  labelSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    flex: 1,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: Colors['Text.Normal.Strong'],
  },
  strategyTitle: {
    fontSize: 22,
    lineHeight: 30,
    color: Colors['Text.Normal.Normal'],
  },
  subtitle: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    lineHeight: 16,
    color: Colors['Text.Normal.Subtle'],
  },
  itemSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  divider: {
    height: 1,
    alignSelf: 'stretch',
    backgroundColor: Colors['Line.Normal.Normal'],
  },
  feedbackSection: {
    gap: 12,
  },
});
