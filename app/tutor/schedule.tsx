import { type Href, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomActionBar,
  BOTTOM_ACTION_CONTENT_HEIGHT,
  Button,
  TimeCell,
} from '../../components/ui';
import { useTutorDraft } from '../../components/tutor/TutorDraftContext';
import { Colors } from '../../constants/colors';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const HOURS = Array.from({ length: 24 }, (_, index) => index + 7);
const DEFAULT_SLOTS = HOURS.filter(hour => hour >= 11).map(hour => `토-${hour}`);

function formatHour(hour: number) {
  return `${String(hour % 24).padStart(2, '0')}:00`;
}

export default function TutorScheduleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { draft, setSubjects } = useTutorDraft();
  const [selectedSubjectId, setSelectedSubjectId] = useState(draft.subjects[0]?.id ?? '');
  const [scheduleBySubject, setScheduleBySubject] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(
      draft.subjects.map((subject, index) => [
        subject.id,
        subject.scheduleSlots ?? (index === 0 ? DEFAULT_SLOTS : []),
      ])
    )
  );

  const selectedSlots = useMemo(
    () => scheduleBySubject[selectedSubjectId] ?? [],
    [scheduleBySubject, selectedSubjectId]
  );

  const toggleSlot = (day: string, hour: number) => {
    const slot = `${day}-${hour}`;
    setScheduleBySubject(prev => {
      const current = prev[selectedSubjectId] ?? [];
      return {
        ...prev,
        [selectedSubjectId]: current.includes(slot)
          ? current.filter(item => item !== slot)
          : [...current, slot],
      };
    });
  };

  const handleComplete = () => {
    setSubjects(
      draft.subjects.map(subject => ({
        ...subject,
        scheduleSlots: scheduleBySubject[subject.id] ?? [],
      }))
    );
    router.push('/result' as Href);
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.subjectTabsScroll}
        contentContainerStyle={styles.subjectTabs}
      >
        {draft.subjects.map(subject => {
          const isSelected = subject.id === selectedSubjectId;
          return (
            <Pressable
              key={subject.id}
              style={[styles.subjectTab, isSelected && styles.subjectTabSelected]}
              onPress={() => setSelectedSubjectId(subject.id)}
            >
              <Text style={[styles.subjectTabText, isSelected && styles.subjectTabTextSelected]}>
                {subject.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: BOTTOM_ACTION_CONTENT_HEIGHT + insets.bottom + 24 },
        ]}
      >
        <View style={styles.noticeRow}>
          <Text style={styles.noticeIcon}>⚡</Text>
          <View style={styles.noticeCopy}>
            <Text style={styles.noticeTitle}>매주 정해진 학원이나 공부 시간이 있나요?</Text>
            <Text style={styles.noticeText}>해당하는 시간대를 모두 선택해 주세요.</Text>
          </View>
        </View>

        <View style={styles.timetableCard}>
          <View style={styles.timetableHeader}>
            <View style={styles.timeColumnSpacer} />
            {DAYS.map(day => (
              <Text key={day} style={styles.dayLabel}>{day}</Text>
            ))}
          </View>

          <View style={styles.timetableBody}>
            {HOURS.map(hour => (
              <View key={hour} style={styles.timetableRow}>
                <Text style={styles.timeLabel}>{formatHour(hour)}</Text>
                <View style={styles.cellRow}>
                  {DAYS.map(day => (
                    <TimeCell
                      key={`${day}-${hour}`}
                      selected={selectedSlots.includes(`${day}-${hour}`)}
                      style={styles.timeCell}
                      onPress={() => toggleSlot(day, hour)}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomActionBar style={styles.buttonSection}>
        <Button label="결과 생성하기" state="Default" onPress={handleComplete} />
      </BottomActionBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 52,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 24,
    color: Colors['Text.Normal.Strong'],
  },
  subjectTabsScroll: {
    flexGrow: 0,
  },
  subjectTabs: {
    gap: 6,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  subjectTab: {
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Strong'],
    backgroundColor: Colors['Fill.Normal.Normal'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectTabSelected: {
    borderColor: Colors['Line.Primary.Normal'],
    backgroundColor: Colors['Fill.Primary.Assistive'],
  },
  subjectTabText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    lineHeight: 24,
    color: Colors['Text.Normal.Assistive'],
  },
  subjectTabTextSelected: {
    color: Colors['Text.Normal.Normal'],
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    gap: 16,
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  noticeIcon: {
    width: 32,
    fontSize: 28,
  },
  noticeCopy: {
    flex: 1,
    gap: 4,
  },
  noticeTitle: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: Colors['Text.Normal.Strong'],
  },
  noticeText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    lineHeight: 20,
    color: Colors['Text.Normal.Normal'],
  },
  timetableCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Strong'],
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 4,
  },
  timetableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeColumnSpacer: {
    width: 34,
    marginRight: 8,
  },
  dayLabel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    lineHeight: 22,
    color: Colors['Text.Normal.Strong'],
  },
  timetableBody: {
    gap: 2,
  },
  timetableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeLabel: {
    width: 34,
    textAlign: 'right',
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: Colors['Text.Normal.Strong'],
  },
  cellRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 2,
  },
  timeCell: {
    flex: 1,
  },
  buttonSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
