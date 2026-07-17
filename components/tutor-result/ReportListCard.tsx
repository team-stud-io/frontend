import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { ReportListNumberedItem } from './ReportListNumberedItem';
import { TextIconButton } from './TextIconButton';

export type ReportListCardVariant = 'Box' | 'Numbered' | 'Progress';

export interface ReportListCardProps {
  body: string;
  title: string;
  variant?: ReportListCardVariant;
  showBody?: boolean;
  showItem10?: boolean;
  showItem2?: boolean;
  showItem3?: boolean;
  showItem4?: boolean;
  showItem5?: boolean;
  showItem6?: boolean;
  showItem7?: boolean;
  showItem8?: boolean;
  showItem9?: boolean;
  showLabelSection?: boolean;
  showTextIconButton?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const ITEMS = [
  {
    title: '수학: 합성함수 미분 집중 3회 블록',
    body: '이번 주 월·목·금 실전 첫 블록에 배치할게요.',
  },
  {
    title: '국어 비문학 추론: 유형별 정리',
    body: '주 2회 지문 3개씩 집중 훈련 권장',
  },
  {
    title: '영어 어법 노트 정리',
    body: '복습 ON 항목으로 이번 오답 힌트 만들기',
  },
  {
    title: '확통: 조건부확률 개념 재정리',
    body: '완료율 0~30% 이상 지연 중. 이번 주 안에 시작 필요',
  },
  {
    title: '영어 어법 힌트 정리',
    body: '복습 ON 항목으로 이번 오답 힌트 만들기',
  },
];

export function ReportListCard({
  body,
  title,
  variant = 'Numbered',
  showBody,
  showItem2,
  showItem3,
  showItem4,
  showItem5,
  showLabelSection = true,
  showTextIconButton = true,
  style,
  testID,
}: ReportListCardProps) {
  const visibleItems = [
    true,
    showItem2,
    showItem3,
    showItem4,
    showItem5,
  ];
  const isBox = variant === 'Box';
  const isProgress = variant === 'Progress';

  return (
    <View
      testID={testID ?? 'report-list-card'}
      style={[
        styles.root,
        isBox && styles.boxRoot,
        isProgress && styles.progressRoot,
        style,
      ]}
    >
      {showLabelSection && (
        <View style={[styles.labelSection, (isBox || isProgress) && styles.compactLabelSection]}>
          <View style={styles.label}>
            <Text style={styles.title}>{title}</Text>
            {showBody && <Text style={[styles.body, isBox && styles.boxBody]}>{body}</Text>}
          </View>
          {showTextIconButton && <TextIconButton label="더보기" />}
        </View>
      )}

      <View style={styles.numberedItemSection}>
        {ITEMS.map((item, index) => {
          if (!visibleItems[index]) return null;

          return (
            <ReportListNumberedItem
              key={item.title}
              index={index + 1}
              title={item.title}
              body={item.body}
              showTag={index === 0}
              style={index === ITEMS.length - 1 && styles.lastItem}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Strong'],
    backgroundColor: Colors['Fill.Normal.Normal'],
    overflow: 'hidden',
  },
  boxRoot: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderColor: Colors['Line.Primary.Normal'],
  },
  progressRoot: {
    padding: 16,
    gap: 12,
    borderColor: Colors['Line.Normal.Normal'],
    backgroundColor: Colors['Fill.Normal.Assistive'],
  },
  labelSection: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors['Line.Normal.Normal'],
  },
  compactLabelSection: {
    padding: 0,
    borderBottomWidth: 0,
  },
  label: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: Colors['Text.Normal.Strong'],
  },
  body: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    lineHeight: 16,
    color: Colors['Text.Normal.Normal'],
  },
  boxBody: {
    color: Colors['Text.Normal.Subtle'],
  },
  numberedItemSection: {
    alignSelf: 'stretch',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
});
