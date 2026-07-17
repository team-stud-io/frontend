import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ReportNumberBadge } from '../tutor-result/ReportNumberBadge';

export type ReportTone = 'red' | 'orange' | 'blue' | 'green';

export interface SubjectProgressData {
  name: string;
  value: number;
  label: string;
  tone: ReportTone;
}

export interface NumberedAction {
  title: string;
  body: string;
}

export function ReportStack({ children }: { children: React.ReactNode }) {
  return <View style={styles.stack}>{children}</View>;
}

export function ProgressCard({ value = 34 }: { value?: number }) {
  const activeSegments = Math.round(value / 5);
  return (
    <View style={styles.progressCard}>
      <View style={styles.titleRow}>
        <Text style={styles.cardTitle}>전체 학습 진행도</Text>
        <Text style={styles.progressValue}>{value}%</Text>
      </View>
      <View style={styles.segmentRow}>
        {Array.from({ length: 20 }).map((_, index) => (
          <View key={index} style={[styles.segment, index < activeSegments && styles.segmentActive]} />
        ))}
      </View>
    </View>
  );
}

export function SubjectProgress({ name, value, label, tone }: SubjectProgressData) {
  return (
    <View style={styles.subjectRow}>
      <Text style={styles.subjectName}>{name}</Text>
      <View style={styles.progressShell}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${value}%` }, toneStyle(tone)]} />
        </View>
        <Text style={styles.percent}>{value}%</Text>
      </View>
      <ToneTag label={label} tone={tone} />
    </View>
  );
}

export function WeekSummary({
  variant,
}: {
  variant: 'overview' | 'review';
}) {
  return (
    <View style={styles.weekCard}>
      <View style={styles.titleRow}>
        <Text style={styles.cardTitle}>{variant === 'overview' ? '이번 주 요약' : '이번 주 회고 요약'}</Text>
        <Text style={styles.date}>6월 9일 - 6월 12일</Text>
      </View>
      <View style={styles.statRow}>
        <Stat value="12h" label="총 공부 시간" />
        <Stat value="18" label="완료한 항목" />
        <Stat value="4일" label="연속 학습" />
      </View>
      <View style={styles.divider} />
      {variant === 'overview' ? <ActivityTracker /> : <ReviewInsights />}
    </View>
  );
}

export function WeaknessItem({
  course,
  title,
  tag,
  tone,
  onPress,
}: {
  course: string;
  title: string;
  tag: string;
  tone: ReportTone;
  onPress?: () => void;
}) {
  return (
    <View style={styles.weaknessItem}>
      <View style={[styles.bulletDot, toneStyle(tone)]} />
      <View style={styles.weaknessCopy}>
        <Text style={[styles.course, toneTextStyle(tone)]}>{course}</Text>
        <Text style={styles.weaknessTitle}>{title}</Text>
        <ToneTag label={tag} tone={tone} onPress={onPress} />
      </View>
    </View>
  );
}

export function FeedbackCard({
  icon,
  title,
  tone,
  items,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  tone: 'green' | 'red';
  items: string[];
}) {
  return (
    <View style={[styles.feedbackCard, tone === 'green' ? styles.feedbackGreen : styles.feedbackRed]}>
      <View style={styles.iconTitleRow}>
        <View style={styles.feedbackIcon}>
          <Ionicons name={icon} size={18} color={tone === 'green' ? '#48AD00' : '#FF6363'} />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {items.map(item => <Bullet key={item} text={item} tone={tone} />)}
    </View>
  );
}

export function NumberedList({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle?: string;
  items: NumberedAction[];
}) {
  return (
    <View style={styles.numberedCard}>
      <View style={styles.numberedHeader}>
        <View>
          <Text style={styles.cardTitle}>{title}</Text>
          {subtitle && <Text style={styles.helper}>{subtitle}</Text>}
        </View>
        <Pressable style={styles.moreButton}>
          <Text style={styles.moreText}>더보기</Text>
          <Ionicons name="chevron-forward" size={16} color="#5299A4" />
        </Pressable>
      </View>
      {items.map((item, index) => (
        <View key={item.title} style={[styles.numberedItem, index === items.length - 1 && styles.lastItem]}>
          <ReportNumberBadge number={`${index + 1}`} />
          <View style={styles.numberedCopy}>
            <Text style={styles.numberedTitle}>{item.title}</Text>
            <Text style={styles.numberedBody}>{item.body}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function ActivityTracker() {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  return (
    <View>
      <Text style={styles.cardTitle}>최근 7일 학습량</Text>
      <View style={styles.dayRow}>
        {days.map((day, index) => (
          <View key={day} style={styles.dayItem}>
            <View style={[styles.dayCircle, index === 1 && styles.dayComplete]}>
              <Ionicons
                name={index === 1 ? 'checkmark' : index < 4 ? 'attach' : 'remove'}
                size={18}
                color={index === 1 ? '#FFFFFF' : '#56585A'}
              />
            </View>
            <Text style={styles.dayLabel}>{day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ReviewInsights() {
  return (
    <View style={styles.insights}>
      <Bullet text={'집중력이 가장 높은 시간대는 오전 9-11시\n(5일 중 4일)'} />
      <Bullet text="수학 공부 시간이 목표 대비 40% 부족했어요" />
      <Bullet text="영어 완료율 92% - 가장 꾸준했던 과목" />
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ToneTag({
  label,
  tone,
  onPress,
}: {
  label: string;
  tone: ReportTone;
  onPress?: () => void;
}) {
  const content = <Text style={[styles.tagText, toneTextStyle(tone)]}>{label}</Text>;
  if (onPress) {
    return <Pressable onPress={onPress} style={[styles.tag, tagStyle(tone)]}>{content}</Pressable>;
  }
  return <View style={[styles.tag, tagStyle(tone)]}>{content}</View>;
}

function Bullet({ text, tone = 'blue' }: { text: string; tone?: ReportTone }) {
  return (
    <View style={styles.bulletRow}>
      <View style={[styles.smallDot, toneStyle(tone)]} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

function toneStyle(tone: ReportTone) {
  if (tone === 'red') return styles.toneRed;
  if (tone === 'orange') return styles.toneOrange;
  if (tone === 'green') return styles.toneGreen;
  return styles.toneBlue;
}

function toneTextStyle(tone: ReportTone) {
  if (tone === 'red') return styles.textRed;
  if (tone === 'orange') return styles.textOrange;
  if (tone === 'green') return styles.textGreen;
  return styles.textBlue;
}

function tagStyle(tone: ReportTone) {
  if (tone === 'red') return styles.tagRed;
  if (tone === 'orange') return styles.tagOrange;
  if (tone === 'green') return styles.tagGreen;
  return styles.tagBlue;
}

export const reportCardStyles = StyleSheet.create({
  sectionCard: { padding: 12, gap: 2, borderRadius: 16, borderWidth: 1, borderColor: '#ECEEF0', backgroundColor: '#F6F8FA' },
  borderedCard: { padding: 12, gap: 2, borderRadius: 16, borderWidth: 1, borderColor: '#66BFCD', backgroundColor: '#FFFFFF' },
  cardTitle: { fontFamily: 'Pretendard-SemiBold', fontSize: 15, lineHeight: 24, color: '#242628' },
  helper: { fontFamily: 'Pretendard-Medium', fontSize: 10, lineHeight: 16, color: '#A1A3A5' },
  warning: { fontFamily: 'Pretendard-Medium', fontSize: 11, lineHeight: 16, color: '#E52222' },
  body: { fontFamily: 'Pretendard-Medium', fontSize: 12, lineHeight: 18, color: '#56585A' },
  subjectList: { marginTop: 6, gap: 5 },
  weaknessList: { marginTop: 6, gap: 6 },
  iconTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  primaryButton: { height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#66BFCD' },
  primaryButtonText: { fontFamily: 'Pretendard-SemiBold', fontSize: 16, lineHeight: 24, color: '#FFFFFF' },
});

const styles = StyleSheet.create({
  stack: { gap: 16 },
  progressCard: { minHeight: 105, paddingHorizontal: 16, justifyContent: 'center', gap: 12, borderRadius: 16, borderWidth: 1, borderColor: '#66BFCD', backgroundColor: '#E1F3F5' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  cardTitle: { fontFamily: 'Pretendard-SemiBold', fontSize: 15, lineHeight: 24, color: '#242628' },
  progressValue: { fontFamily: 'Pretendard-SemiBold', fontSize: 26, lineHeight: 36, color: '#242628' },
  segmentRow: { height: 12, flexDirection: 'row', gap: 3 },
  segment: { flex: 1, borderRadius: 2, backgroundColor: '#FFFFFF' },
  segmentActive: { backgroundColor: '#5CA5B0' },
  subjectRow: { height: 34, flexDirection: 'row', alignItems: 'center', gap: 8 },
  subjectName: { width: 31, fontFamily: 'Pretendard-SemiBold', fontSize: 12, lineHeight: 18, color: '#242628' },
  progressShell: { flex: 1, height: 28, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 8, borderWidth: 1, borderColor: '#ECEEF0', backgroundColor: '#FFFFFF' },
  progressTrack: { flex: 1, height: 5, borderRadius: 999, backgroundColor: '#ECEEF0', overflow: 'hidden' },
  progressFill: { height: 5, borderRadius: 999 },
  percent: { width: 28, fontFamily: 'Pretendard-Medium', fontSize: 10, lineHeight: 14, textAlign: 'right', color: '#56585A' },
  tag: { minWidth: 45, height: 26, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center', borderRadius: 8, borderWidth: 1 },
  tagText: { fontFamily: 'Pretendard-Medium', fontSize: 11, lineHeight: 16 },
  tagRed: { backgroundColor: '#FFF1F1', borderColor: '#FFC7CD' },
  tagOrange: { backgroundColor: '#FEF4E6', borderColor: '#FFD59C' },
  tagBlue: { backgroundColor: '#F2F7FF', borderColor: '#C3D9FF' },
  tagGreen: { backgroundColor: '#F4FFEE', borderColor: '#CDE8BC' },
  toneRed: { backgroundColor: '#FF6363' },
  toneOrange: { backgroundColor: '#F68D00' },
  toneBlue: { backgroundColor: '#3385FF' },
  toneGreen: { backgroundColor: '#48AD00' },
  textRed: { color: '#FF4D5E' },
  textOrange: { color: '#E98400' },
  textBlue: { color: '#3385FF' },
  textGreen: { color: '#3A9800' },
  weekCard: { padding: 12, gap: 12, borderRadius: 20, borderWidth: 1, borderColor: '#ECEEF0', backgroundColor: '#F6F8FA' },
  date: { fontFamily: 'Pretendard-Medium', fontSize: 10, lineHeight: 16, color: '#A1A3A5' },
  statRow: { flexDirection: 'row', gap: 6 },
  stat: { flex: 1, height: 78, alignItems: 'center', justifyContent: 'center', borderRadius: 20, borderWidth: 1, borderColor: '#ECEEF0', backgroundColor: '#FFFFFF' },
  statValue: { fontFamily: 'Pretendard-SemiBold', fontSize: 23, lineHeight: 32, color: '#5299A4' },
  statLabel: { fontFamily: 'Pretendard-Medium', fontSize: 10, lineHeight: 16, color: '#242628' },
  divider: { height: 1, backgroundColor: '#ECEEF0' },
  dayRow: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
  dayItem: { alignItems: 'center', gap: 3 },
  dayCircle: { width: 29, height: 29, borderRadius: 15, borderWidth: 2, borderColor: '#D3D5D7', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  dayComplete: { borderColor: '#66BFCD', backgroundColor: '#66BFCD' },
  dayLabel: { fontFamily: 'Pretendard-Regular', fontSize: 10, lineHeight: 14, color: '#56585A' },
  insights: { gap: 6 },
  weaknessItem: { minHeight: 82, paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, borderWidth: 1, borderColor: '#ECEEF0', backgroundColor: '#F6F8FA' },
  bulletDot: { width: 8, height: 8, borderRadius: 4 },
  weaknessCopy: { flex: 1, alignItems: 'flex-start', gap: 2 },
  course: { fontFamily: 'Pretendard-Medium', fontSize: 10, lineHeight: 14 },
  weaknessTitle: { fontFamily: 'Pretendard-SemiBold', fontSize: 12, lineHeight: 18, color: '#242628' },
  numberedCard: { borderRadius: 16, borderWidth: 1, borderColor: '#D3D5D7', backgroundColor: '#FFFFFF', overflow: 'hidden' },
  numberedHeader: { minHeight: 52, paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#ECEEF0' },
  helper: { fontFamily: 'Pretendard-Medium', fontSize: 10, lineHeight: 16, color: '#A1A3A5' },
  moreButton: { flexDirection: 'row', alignItems: 'center' },
  moreText: { fontFamily: 'Pretendard-Medium', fontSize: 11, lineHeight: 18, color: '#5299A4' },
  numberedItem: { minHeight: 62, paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: '#ECEEF0' },
  lastItem: { borderBottomWidth: 0 },
  numberedCopy: { flex: 1 },
  numberedTitle: { fontFamily: 'Pretendard-SemiBold', fontSize: 12, lineHeight: 18, color: '#56585A' },
  numberedBody: { fontFamily: 'Pretendard-Medium', fontSize: 10, lineHeight: 15, color: '#A1A3A5' },
  feedbackCard: { padding: 12, gap: 5, borderRadius: 14, borderWidth: 1, borderColor: '#ECEEF0' },
  feedbackGreen: { backgroundColor: '#F4FFEE' },
  feedbackRed: { backgroundColor: '#FFF1F1' },
  iconTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  feedbackIcon: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 8, borderWidth: 1, borderColor: '#D3D5D7', backgroundColor: '#FFFFFF' },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  smallDot: { width: 4, height: 4, borderRadius: 2 },
  bulletText: { flex: 1, fontFamily: 'Pretendard-Medium', fontSize: 11, lineHeight: 17, color: '#56585A' },
});
