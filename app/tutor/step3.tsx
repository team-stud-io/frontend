// app/tutor/step3.tsx
// AI 튜터 생성 화면3 - 시험 과목 추가

import { type Href, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Modal as RNModal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { InfoCard } from '../../components/InfoCard';
import { InputField } from '../../components/InputField';
import { Modal } from '../../components/Modal';
import { SwipeActions } from '../../components/SwipeActions';
import { Colors } from '../../constants/colors';

type SubjectStatus = 'done' | 'anxious' | 'empty';

type ExamSubject = {
  id: string;
  name: string;
  detail: string;
  status: SubjectStatus;
  progress?: string;
};

const SUBJECT_OPTIONS = ['국어', '수학', '영어', '사회(탐구)', '과학(탐구)', '한국사'];
const SWIPE_ACTION_WIDTH = 153;
const SWIPE_ACTION_GAP = 16;
const SWIPE_REVEAL_WIDTH = SWIPE_ACTION_WIDTH + SWIPE_ACTION_GAP;

const INITIAL_SUBJECTS: ExamSubject[] = [
  {
    id: 'korean',
    name: '국어',
    detail: '문학 1단원, 독서 2단원 · 교과서 + 프린트',
    status: 'done',
    progress: '진도 40%',
  },
  {
    id: 'math',
    name: '수학',
    detail: '수열, 극한 · 교과서 + 프린트',
    status: 'anxious',
    progress: '매우 불안',
  },
  {
    id: 'english',
    name: '영어',
    detail: '탭해서 상세 입력하기',
    status: 'empty',
  },
];

function makeSubject(name: string): ExamSubject {
  return {
    id: `${name}-${Date.now()}`,
    name,
    detail: '탭해서 상세 입력하기',
    status: 'empty',
  };
}

export default function Step3Screen() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<ExamSubject[]>(INITIAL_SUBJECTS);
  const [actionSubjectId, setActionSubjectId] = useState<string | null>(null);
  const [deleteSubjectId, setDeleteSubjectId] = useState<string | null>(null);
  const [showSubjectSheet, setShowSubjectSheet] = useState(false);
  const [showDirectInput, setShowDirectInput] = useState(false);

  const usedNames = subjects.map(subject => subject.name);
  const deleteSubject = subjects.find(subject => subject.id === deleteSubjectId);

  const handleAddSubject = (name: string) => {
    if (usedNames.includes(name)) return;
    setSubjects(prev => [...prev, makeSubject(name)]);
    setShowSubjectSheet(false);
  };

  const handleDirectSubmit = (name: string) => {
    if (!usedNames.includes(name)) {
      setSubjects(prev => [...prev, makeSubject(name)]);
    }
    setShowDirectInput(false);
  };

  const handleDelete = () => {
    if (!deleteSubjectId) return;
    setSubjects(prev => prev.filter(subject => subject.id !== deleteSubjectId));
    setDeleteSubjectId(null);
    setActionSubjectId(null);
  };

  const openSubjectDetail = (subject: ExamSubject) => {
    router.push(({
      pathname: '/tutor/subject-detail',
      params: { subject: subject.name },
    } as unknown) as Href);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>

        <Text style={styles.title}>시험 과목 추가</Text>
        <Text style={styles.subtitle}>각 과목을 탭해서 상세 정보를 입력하세요</Text>

        <View style={styles.subjectList}>
          {subjects.map(subject => {
            return (
              <SubjectSwipeRow
                key={subject.id}
                subject={subject}
                isOpen={actionSubjectId === subject.id}
                onOpen={() => setActionSubjectId(subject.id)}
                onClose={() => setActionSubjectId(null)}
                onPress={() => openSubjectDetail(subject)}
                onEditPress={() => openSubjectDetail(subject)}
                onDeletePress={() => setDeleteSubjectId(subject.id)}
              />
            );
          })}
        </View>

        <Pressable style={styles.addButton} onPress={() => setShowSubjectSheet(true)}>
          <Text style={styles.addButtonText}>＋</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.buttonSection}>
        <Button label="다음" state="Default" onPress={() => {}} />
      </View>

      <RNModal visible={showSubjectSheet} transparent animationType="slide">
        <Pressable style={styles.sheetBackdrop} onPress={() => setShowSubjectSheet(false)}>
          <Pressable style={styles.subjectSheet}>
            <Text style={styles.sheetTitle}>과목 선택</Text>
            <View style={styles.optionGrid}>
              {SUBJECT_OPTIONS.map(option => {
                const isUsed = usedNames.includes(option);
                return (
                  <Pressable
                    key={option}
                    disabled={isUsed}
                    style={[styles.optionChip, isUsed && styles.optionChipDisabled]}
                    onPress={() => handleAddSubject(option)}
                  >
                    <Text style={[styles.optionChipText, isUsed && styles.optionChipTextDisabled]}>
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
              <Pressable
                style={[styles.optionChip, styles.optionChipSelected]}
                onPress={() => {
                  setShowSubjectSheet(false);
                  setShowDirectInput(true);
                }}
              >
                <Text style={styles.optionChipSelectedText}>직접 입력</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </RNModal>

      <RNModal visible={showDirectInput} transparent animationType="slide">
        <View style={styles.directInputBackdrop}>
          <InputField
            onSubmit={handleDirectSubmit}
            onCancel={() => setShowDirectInput(false)}
          />
        </View>
      </RNModal>

      <Modal
        visible={!!deleteSubject}
        title="정말 삭제하시겠습니까?"
        leftButton="취소"
        rightButton="삭제"
        onLeftPress={() => setDeleteSubjectId(null)}
        onRightPress={handleDelete}
        showDescription={false}
        showIconError={false}
        rightButtonTone="danger"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },
  backButton: { marginBottom: 28 },
  backArrow: { fontSize: 24, color: Colors['Text.Normal.Normal'] },
  title: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 24,
    color: Colors['Text.Normal.Strong'],
    marginBottom: 28,
  },
  subtitle: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: Colors['Text.Normal.Normal'],
    marginBottom: 16,
  },
  subjectList: { gap: 12 },
  cardRow: {
    height: 78,
    width: '100%',
  },
  cardPressable: {
    width: '100%',
    height: 78,
  },
  rightActionsWrapper: {
    width: SWIPE_REVEAL_WIDTH,
    height: 78,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  actionGap: {
    width: SWIPE_ACTION_GAP,
  },
  actionPanel: {
    width: SWIPE_ACTION_WIDTH,
    height: 78,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C9E6EA',
    backgroundColor: Colors['Fill.Primary.Assistive'],
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  addButtonText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 34,
    lineHeight: 38,
    color: Colors['Text.Normal.Strong'],
  },
  buttonSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
  sheetBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  subjectSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 36,
  },
  sheetTitle: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 18,
    color: Colors['Text.Normal.Strong'],
    marginBottom: 28,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Strong'],
    backgroundColor: '#FFFFFF',
  },
  optionChipDisabled: {
    opacity: 0.32,
  },
  optionChipSelected: {
    borderColor: Colors['Line.Primary.Normal'],
    backgroundColor: Colors['Fill.Primary.Assistive'],
  },
  optionChipText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: Colors['Text.Normal.Normal'],
  },
  optionChipTextDisabled: {
    color: Colors['Text.Normal.Assistive'],
  },
  optionChipSelectedText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: Colors['Text.Normal.Normal'],
  },
  directInputBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});

function SubjectSwipeRow({
  subject,
  isOpen,
  onOpen,
  onClose,
  onPress,
  onEditPress,
  onDeletePress,
}: {
  subject: ExamSubject;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onPress: () => void;
  onEditPress: () => void;
  onDeletePress: () => void;
}) {
  const swipeableRef = useRef<React.ElementRef<typeof Swipeable>>(null);

  useEffect(() => {
    if (!isOpen) {
      swipeableRef.current?.close();
    }
  }, [isOpen]);

  const handlePress = () => {
    if (isOpen) {
      swipeableRef.current?.close();
      onClose();
      return;
    }
    onPress();
  };

  const handleEditPress = () => {
    swipeableRef.current?.close();
    onEditPress();
  };

  const handleDeletePress = () => {
    swipeableRef.current?.close();
    onDeletePress();
  };

  const renderRightActions = () => (
    <View style={styles.rightActionsWrapper}>
      <View style={styles.actionGap} />
      <SwipeActions
        style={styles.actionPanel}
        onEditPress={handleEditPress}
        onDeletePress={handleDeletePress}
      />
    </View>
  );

  return (
    <Swipeable
      ref={swipeableRef}
      containerStyle={styles.cardRow}
      friction={1.6}
      rightThreshold={42}
      overshootRight={false}
      renderRightActions={renderRightActions}
      onSwipeableOpen={onOpen}
      onSwipeableClose={onClose}
    >
      <InfoCard
        title={subject.name}
        description={subject.detail}
        state={subject.status === 'empty' ? 'Selected' : 'Default'}
        variant={subject.status === 'empty' ? 'Default' : 'Tag'}
        showLeadingIcon={false}
        showTextIconButton={subject.status === 'empty'}
        textButtonLabel=""
        showTag={subject.status !== 'empty'}
        tagLabel="완료"
        progressLabel={subject.progress}
        progressTone={subject.status === 'anxious' ? 'danger' : 'progress'}
        style={styles.cardPressable}
        onPress={handlePress}
      />
    </Swipeable>
  );
}
