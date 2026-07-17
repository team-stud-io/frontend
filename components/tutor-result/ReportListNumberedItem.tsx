import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Tag } from '../ui/Tag';
import { Colors } from '../../constants/colors';
import { ReportNumberBadge, ReportNumberBadgeVariant } from './ReportNumberBadge';

export interface ReportListNumberedItemProps {
  index?: number;
  body: string;
  title: string;
  showTag?: boolean;
  tagLabel?: string;
  tagSlot?: ReactNode;
  badgeVariant?: ReportNumberBadgeVariant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ReportListNumberedItem({
  index = 1,
  body,
  title,
  showTag = false,
  tagLabel = '오답 정리는 Stage 3단계에서 깊게 할 거야!',
  tagSlot,
  badgeVariant = 'Primary',
  style,
  testID,
}: ReportListNumberedItemProps) {
  return (
    <View testID={testID ?? 'report-list-numbered-item'} style={[styles.root, style]}>
      <ReportNumberBadge number={`${index}`} variant={badgeVariant} />
      <View style={styles.labelSection}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {showTag && (tagSlot ?? <Tag label={tagLabel} size="M" variant="Primary" />)}
        </View>
        <Text style={styles.body}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors['Line.Normal.Normal'],
  },
  labelSection: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    lineHeight: 20,
    color: Colors['Text.Normal.Strong'],
  },
  body: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    lineHeight: 18,
    color: Colors['Text.Normal.Normal'],
  },
});
