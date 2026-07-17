import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ResultLoadingScreen,
  ResultStateScreen,
  ResultPlanScreen,
  ResultStrategyScreen,
  ResultSummaryScreen,
  SubjectTabs,
  WeekTabs,
  getButtonLabel,
  getTitle,
  resultStyles,
  type ResultStep,
} from '../../components/tutor-result';
import { useTutorDraft } from '../../components/tutor';
import { useApplyTutorResult, useSaveTutorResult, useTutorResult } from '../../hooks/useTutorResult';
import {
  BottomActionBar,
  BOTTOM_ACTION_CONTENT_HEIGHT,
  Button,
  AssetIcon,
} from '../../components/ui';

const styles = resultStyles;

export default function TutorResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { draft } = useTutorDraft();
  const scrollRef = useRef<ScrollView>(null);
  const [step, setStep] = useState<ResultStep>('summary');
  const previousStep = useRef<ResultStep>('summary');
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [errorProcessExpanded, setErrorProcessExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const request = useMemo(() => ({ ...draft }), [draft]);
  const result = useTutorResult(request);
  const { applyToPlanner, isApplying } = useApplyTutorResult();
  const { save, isSaving } = useSaveTutorResult();
  const resultData = result.status === 'success' ? result.data : null;

  useEffect(() => {
    if (!resultData?.subjects.length) return;
    if (!resultData.subjects.some(subject => subject.id === selectedSubjectId)) {
      setSelectedSubjectId(resultData.subjects[0].id);
    }
  }, [resultData, selectedSubjectId]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => scrollRef.current?.scrollTo({ y: 0, animated: false }));
    return () => cancelAnimationFrame(frame);
  }, [step, selectedSubjectId, selectedWeekIndex]);

  const openStep = useCallback((nextStep: ResultStep) => {
    previousStep.current = step;
    setStep(nextStep);
  }, [step]);

  const applyResult = async () => {
    if (result.status === 'success') {
      try {
        await applyToPlanner(result.data.id);
        router.replace('/home');
      } catch (error) {
        Alert.alert(
          '플래너 반영 실패',
          error instanceof Error ? error.message : '잠시 후 다시 시도해 주세요.'
        );
      }
    }
  };

  const saveResult = async () => {
    if (!resultData || isSaved || isSaving) return;
    try {
      await save(resultData.id);
      setIsSaved(true);
    } catch (error) {
      Alert.alert(
        '저장 실패',
        error instanceof Error ? error.message : '잠시 후 다시 시도해 주세요.'
      );
    }
  };

  const handlePrimaryAction = async () => {
    if (step === 'summary') {
      openStep('strategy');
      return;
    }
    await applyResult();
  };

  const handleBack = () => {
    if (step === 'summary') {
      router.back();
      return;
    }
    const target = previousStep.current;
    previousStep.current = 'summary';
    setStep(target);
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.resultViewport}>
        {result.status === 'loading' ? (
          <ResultLoadingScreen />
        ) : result.status === 'error' ? (
          <ResultStateScreen
            title="결과를 불러오지 못했어요"
            body={result.error.message}
            actionLabel="다시 시도하기"
            onAction={result.retry}
          />
        ) : result.status === 'empty' ? (
          <ResultStateScreen
            title="분석할 과목 정보가 없어요"
            body="과목별 시험 범위와 학습 상태를 입력한 뒤 다시 생성해 주세요."
            actionLabel="과목 정보 입력하기"
            onAction={() => router.replace('/tutor')}
          />
        ) : (
          <>
          <View style={styles.header}>
            <Pressable accessibilityLabel="뒤로가기" style={styles.headerButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="#242628" />
            </Pressable>
            <Text style={styles.headerTitle}>{getTitle(step)}</Text>
            <Pressable accessibilityRole="button" onPress={saveResult} disabled={isSaved || isSaving} style={styles.saveButton}>
              <Text style={styles.saveText}>{isSaved ? '저장됨' : '저장'}</Text>
            </Pressable>
          </View>

          {step === 'plan' && (
            <WeekTabs
              tabs={result.data.weeks.map(week => week.label)}
              selectedIndex={selectedWeekIndex}
              onSelect={setSelectedWeekIndex}
            />
          )}
          {step === 'strategy' && (
            <SubjectTabs
              subjects={result.data.subjects}
              selectedSubjectId={selectedSubjectId}
              onSelect={subjectId => {
                setSelectedSubjectId(subjectId);
                setErrorProcessExpanded(false);
              }}
            />
          )}

          <ScrollView
            key={step}
            ref={scrollRef}
            style={styles.scroll}
            contentContainerStyle={[
              styles.content,
              { paddingBottom: BOTTOM_ACTION_CONTENT_HEIGHT + insets.bottom + 28 },
            ]}
          >
            {step === 'summary' && (
              <ResultSummaryScreen data={result.data} onOpenPlan={() => openStep('plan')} />
            )}
            {step === 'plan' && (
              <ResultPlanScreen
                data={result.data}
                selectedWeekIndex={selectedWeekIndex}
                onOpenStrategy={() => openStep('strategy')}
              />
            )}
            {step === 'strategy' && (
              <ResultStrategyScreen
                data={result.data}
                selectedSubjectId={selectedSubjectId}
                errorProcessExpanded={errorProcessExpanded}
                onToggleErrorProcess={() => setErrorProcessExpanded(value => !value)}
              />
            )}
          </ScrollView>

          <Pressable
            style={[
              styles.floatingTopButton,
              { bottom: BOTTOM_ACTION_CONTENT_HEIGHT + insets.bottom + 20 },
            ]}
            onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
          >
            <AssetIcon name="up" width={40} height={40} />
          </Pressable>

          <BottomActionBar style={styles.buttonSection}>
            <Button
              label={isApplying ? '반영 중...' : getButtonLabel(step)}
              state={isApplying ? 'Inactive' : 'Default'}
              onPress={handlePrimaryAction}
            />
          </BottomActionBar>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
