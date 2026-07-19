


import Ionicons from '@expo/vector-icons/Ionicons';
import { type Href, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomActionBar, Button, InputField } from '../../components/ui';
import { useTutorDraft } from '../../components/tutor/TutorDraftContext';
import { Colors } from '../../constants/colors';

const SUBJECTS = [
  { id: 'korean',   label: '국어',      category: '국어', color: '#F04588' },
  { id: 'english',  label: '영어',      category: '영어', color: '#3385FF' },
  { id: 'math',     label: '수학',      category: '수학', color: '#48AD00' },
  { id: 'social',   label: '사회탐구',  category: '사회탐구', color: '#F68D00', requiresCustomName: true },
  { id: 'science',  label: '과학탐구',  category: '과학탐구', color: '#00BDDE', requiresCustomName: true },
  { id: 'custom',   label: '직접 입력', category: '직접입력', color: '#A1A3A5', requiresCustomName: true },
];

const MAX_SUBJECTS = 4;
const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function toIsoDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getDaysInMonth(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const days: { date: number; currentMonth: boolean }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ date: prevDays - i, currentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ date: i, currentMonth: true });
  }
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: i, currentMonth: false });
  }
  return days;
}

type SubjectMap = Record<string, string[]>;
type CustomSubjectMap = Record<string, { name: string; category: string }>;

export default function Step2Screen() {
  const router = useRouter();
  const { draft, updateExamDates, setSubjects } = useTutorDraft();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [subjectMap, setSubjectMap] = useState<SubjectMap>({});
  const [customSubjects, setCustomSubjects] = useState<CustomSubjectMap>({});
  const [showDirectInput, setShowDirectInput] = useState(false);
  const [pendingSubjectCategory, setPendingSubjectCategory] = useState<string | null>(null);

  const days = getDaysInMonth(year, month);
  const selectedKey = selectedDate ? toIsoDate(year, month, selectedDate) : null;
  const selectedSubjects = selectedKey ? (subjectMap[selectedKey] ?? []) : [];
  const selectedDayLabel = selectedDate
    ? DAY_LABELS[new Date(year, month, selectedDate).getDay()]
    : null;

  const goToPrevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDate(null);
  };
  const goToNextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDate(null);
  };

  const handleDatePress = (date: number, currentMonth: boolean) => {
    if (!currentMonth) return;
    setSelectedDate(date);
  };

  const handleSubjectPress = (subjectId: string) => {
    const subject = SUBJECTS.find(item => item.id === subjectId);
    if (subject?.requiresCustomName) {
      if (!selectedKey) return;
      setPendingSubjectCategory(subject.category);
      setShowDirectInput(true);
      return;
    }
    if (!selectedKey) return;
    const current = subjectMap[selectedKey] ?? [];
    if (current.includes(subjectId)) {
      setSubjectMap(prev => ({ ...prev, [selectedKey]: current.filter(id => id !== subjectId) }));
    } else {
      if (current.length >= MAX_SUBJECTS) return;
      setSubjectMap(prev => ({ ...prev, [selectedKey]: [...current, subjectId] }));
    }
  };

  const getDotsForDate = (date: number) => {
    const key = toIsoDate(year, month, date);
    return (subjectMap[key] ?? []).slice(0, 4).map(id => {
      const category = customSubjects[id]?.category;
      return SUBJECTS.find(subject => subject.category === category)?.color
        ?? SUBJECTS.find(subject => subject.id === id)?.color
        ?? '#ccc';
    });
  };

  const handleCustomSubmit = (subjectName: string) => {
    if (!selectedKey) return;
    const current = subjectMap[selectedKey] ?? [];
    if (current.length >= MAX_SUBJECTS) {
      setShowDirectInput(false);
      return;
    }

    const category = pendingSubjectCategory ?? '직접입력';
    const prefix = category === '사회탐구' ? 'social' : category === '과학탐구' ? 'science' : 'custom';
    const customId = `${prefix}-${Date.now()}`;
    setCustomSubjects(prev => ({ ...prev, [customId]: { name: subjectName, category } }));
    setSubjectMap(prev => ({ ...prev, [selectedKey]: [...current, customId] }));
    setPendingSubjectCategory(null);
    setShowDirectInput(false);
  };

  const hasAnySelection = Object.values(subjectMap).some(v => v.length > 0);
  const handleNext = () => {
    const examDates = Object.fromEntries(
      Object.entries(subjectMap).map(([date, subjects]) => [
        date,
        subjects.map(subjectId => customSubjects[subjectId]?.name ?? SUBJECTS.find(subject => subject.id === subjectId)?.label ?? subjectId),
      ])
    );
    const dateSubjects = Array.from(
      new Map(
        Object.values(subjectMap)
          .flatMap(subjectIds => subjectIds.map(subjectId => {
            const customSubject = customSubjects[subjectId];
            const subject = SUBJECTS.find(item => item.id === subjectId);
            const name = customSubject?.name ?? subject?.label ?? subjectId;
            const subjectCategory = customSubject?.category ?? subject?.category ?? name;
            return {
              id: `exam-${subjectId}`,
              name,
              subjectCategory,
              customSubjectName: customSubject ? name : null,
              detail: '과목 상세 정보를 입력하세요',
              status: 'empty' as const,
            };
          }))
          .map(subject => [subject.id, subject] as const)
      ).values()
    );
    const additions = dateSubjects.filter(subject => !draft.subjects.some(existing =>
      (existing.subjectCategory ?? existing.name) === subject.subjectCategory
      && (existing.customSubjectName ?? null) === subject.customSubjectName
    ));
    if (additions.length) setSubjects([...draft.subjects, ...additions]);
    updateExamDates(examDates);
    router.push('/tutor/step3' as Href);
  };

  return (

      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Pressable accessibilityLabel="뒤로가기" hitSlop={10} style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors['Text.Normal.Strong']} />
        </Pressable>

        <Text style={styles.title}>시험 날짜 설정</Text>
        <Text style={styles.subtitle}>날짜를 탭해서 과목을 추가하세요</Text>


        <View style={styles.calendarBox}>

          <View style={styles.yearMonthRow}>
            <Pressable onPress={goToPrevMonth} style={styles.chevronBtn}>
              <Text style={styles.chevronText}>‹</Text>
            </Pressable>
            <Text style={styles.yearMonthLabel}>{year}년 {month + 1}월</Text>
            <Pressable onPress={goToNextMonth} style={styles.chevronBtn}>
              <Text style={styles.chevronText}>›</Text>
            </Pressable>
          </View>


          <View style={styles.dayHeaderRow}>
            {DAY_LABELS.map(day => (
              <Text key={day} style={styles.dayHeaderText}>{day}</Text>
            ))}
          </View>


          {Array.from({ length: 6 }, (_, weekIdx) => (
            <View key={weekIdx} style={styles.weekRow}>
              {days.slice(weekIdx * 7, weekIdx * 7 + 7).map((day, dayIdx) => {
                const isToday =
                  day.currentMonth &&
                  day.date === today.getDate() &&
                  month === today.getMonth() &&
                  year === today.getFullYear();
                const isSelected = day.currentMonth && day.date === selectedDate;
                const dots = day.currentMonth ? getDotsForDate(day.date) : [];

                return (
                  <Pressable
                    key={dayIdx}
                    style={styles.dateCell}
                    onPress={() => handleDatePress(day.date, day.currentMonth)}
                  >
                    <View style={[
                      styles.dateCircle,
                      isSelected && styles.dateCircleSelected,
                      isToday && !isSelected && styles.dateCircleToday,
                    ]}>
                      <Text style={[
                        styles.dateText,
                        !day.currentMonth && styles.dateTextOtherMonth,
                        isSelected && styles.dateTextSelected,
                      ]}>
                        {day.date}
                      </Text>
                    </View>
                    {dots.length > 0 && (
                      <View style={styles.dotsRow}>
                        {dots.map((color, i) => (
                          <View key={i} style={[styles.dot, { backgroundColor: color }]} />
                        ))}
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>


        {selectedDate && (
          <View style={styles.subjectSection}>
            <Text style={styles.selectedDateLabel}>
              {month + 1}/{selectedDate} · {selectedDayLabel}
            </Text>
            <View style={styles.subjectGrid}>
              {SUBJECTS.map(subject => {
                const isSelected = selectedSubjects.includes(subject.id);
                const isDisabled = !isSelected && selectedSubjects.length >= MAX_SUBJECTS;
                return (
                  <Pressable
                    key={subject.id}
                    disabled={isDisabled}
                    onPress={() => handleSubjectPress(subject.id)}
                    style={[
                      styles.subjectTag,
                      isSelected && styles.subjectTagSelected,
                      isDisabled && styles.subjectTagDisabled,
                    ]}
                  >
                    <Text style={[
                      styles.subjectTagText,
                      isSelected && styles.subjectTagTextSelected,
                    ]}>
                      {subject.label}
                    </Text>
                  </Pressable>
                );
              })}
              {selectedSubjects
                .filter(subjectId => !SUBJECTS.some(subject => subject.id === subjectId))
                .map(subjectId => (
                  <Pressable
                    key={subjectId}
                    onPress={() => {
                      if (!selectedKey) return;
                      setSubjectMap(prev => ({
                        ...prev,
                        [selectedKey]: (prev[selectedKey] ?? []).filter(id => id !== subjectId),
                      }));
                    }}
                    style={[styles.subjectTag, styles.subjectTagSelected]}
                  >
                    <Text style={[styles.subjectTagText, styles.subjectTagTextSelected]}>
                      {customSubjects[subjectId]?.name}
                    </Text>
                  </Pressable>
                ))}
            </View>
          </View>
        )}
      </ScrollView>


      <BottomActionBar style={styles.buttonSection}>
        <Button
          label={hasAnySelection ? '다음' : '건너뛰기'}
          state="Default"
          onPress={handleNext}
        />
      </BottomActionBar>
      <Modal
        visible={showDirectInput}
        transparent
        animationType="slide"
      >
        <View style={styles.directInputBackdrop}>
          <InputField
            onSubmit={handleCustomSubmit}
            onCancel={() => {
              setPendingSubjectCategory(null);
              setShowDirectInput(false);
            }}
            placeholder={pendingSubjectCategory === '사회탐구'
              ? '사회탐구 과목명을 입력하세요'
              : pendingSubjectCategory === '과학탐구'
                ? '과학탐구 과목명을 입력하세요'
                : '과목명을 입력하세요'}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 },

  backButton: { marginBottom: 16 },
  title: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 24,
    color: Colors['Text.Normal.Strong'],
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: Colors['Text.Normal.Assistive'],
    marginBottom: 16,
  },

  calendarBox: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Strong'],
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 24,
  },
  yearMonthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chevronBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  chevronText: { fontSize: 22, color: Colors['Text.Normal.Normal'], fontWeight: '400' },
  yearMonthLabel: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#242628',
    lineHeight: 28,
  },
  dayHeaderRow: { flexDirection: 'row', marginBottom: 4 },
  dayHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: Colors['Text.Normal.Assistive'],
  },
  weekRow: { flexDirection: 'row' },
  dateCell: { flex: 1, alignItems: 'center', paddingVertical: 4, gap: 2 },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateCircleSelected: { backgroundColor: Colors['Fill.Primary.Normal'], borderRadius: 12 },
  dateCircleToday: { backgroundColor: '#ECEEF0', borderRadius: 12 },
  dateText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: Colors['Text.Normal.Normal'],
    textAlign: 'center',
  },
  dateTextOtherMonth: { color: Colors['Text.Normal.Assistive'] },
  dateTextSelected: { color: '#FFFFFF' },
  dotsRow: { flexDirection: 'row', gap: 2, justifyContent: 'center' },
  dot: { width: 4, height: 4, borderRadius: 2 },

  subjectSection: { gap: 12 },
  selectedDateLabel: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#242628',
  },
  subjectGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  subjectTag: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Strong'],
    backgroundColor: '#FFFFFF',
  },
  subjectTagSelected: {
    borderColor: Colors['Line.Primary.Normal'],
    backgroundColor: Colors['Fill.Primary.Assistive'],
  },
  subjectTagDisabled: { opacity: 0.4 },
  subjectTagText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: Colors['Text.Normal.Assistive'],
    letterSpacing: -0.2,
  },
  subjectTagTextSelected: { color: Colors['Text.Normal.Normal'] },

  buttonSection: {
    flexShrink: 0,
  },
  directInputBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
