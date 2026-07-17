


import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomActionBar,
  BOTTOM_ACTION_CONTENT_HEIGHT,
  Button,
} from '../../components/ui';
import {
  ChipRow,
  Field,
  ReconnectModal,
  Segmented,
  SliderField,
  UploadErrorModal,
  UploadField,
  type UploadErrorType,
  type UploadItem,
} from '../../components/tutor/subject-detail';
import { subjectDetailStyles as styles } from '../../components/tutor/subject-detail/styles';
import { useTutorDraft } from '../../components/tutor/TutorDraftContext';
import { Colors } from '../../constants/colors';
import { useSaveTutorSubject } from '../../hooks/useSaveTutorSubject';

type DetailTab = 'range' | 'style' | 'materials';
const TABS: { id: DetailTab; label: string }[] = [
  { id: 'range', label: '범위' },
  { id: 'style', label: '출제스타일' },
  { id: 'materials', label: '보유 자료' },
];

const GRADES = ['1등급', '2등급', '3등급', '4등급 +'];
const MOCK_GRADES = ['1', '2', '3', '4', '5'];
const CONFIDENCE = ['자신 있음', '보통', '매우 불안함'];
const FOCUS_OPTIONS = ['교과서 본문', '프린트 · 필기', '외부 지문'];
const MATH_FOCUS_OPTIONS = ['교과서 본문', '프린트', '부교재'];
const OUTSIDE_OPTIONS = ['나옴', '안 나옴', '모름'];
const SIMILARITY_OPTIONS = ['유사함', '조금 다름', '많이 다름', '모름'];
const PRIORITY_OPTIONS = ['교과서', '프린트', '부교재'];
const SOCIAL_TYPES = [
  '한국지리',
  '세계지리',
  '생활과 윤리',
  '윤리와 사상',
  '한국사',
  '동아시아사',
  '세계사',
  '경제',
  '정치와 법',
  '사회 문화',
];
const SOCIAL_MEMORY_OPTIONS = ['암기 중심', '이해·적용 중심', '반반'];
const SOCIAL_CHART_OPTIONS = ['자주 나옴', '가끔 나옴', '모름'];
const SCIENCE_TYPES = [
  '물리학',
  '물리학Ⅱ',
  '화학',
  '화학Ⅱ',
  '생명과학Ⅰ',
  '생명과학Ⅱ',
  '지구과학Ⅰ',
  '지구과학Ⅱ',
  '통합과학',
];
const CALCULATION_OPTIONS = ['많음', '가끔 나옴', '거의 없음'];
const SCIENCE_CONCEPT_OPTIONS = ['암기 중심', '원리 이해', '반반'];
const DIFFICULTIES = ['하', '중하', '중', '중상', '상'];
const MATERIALS = ['교과서', '학교 프린트', '부교재', 'EBS', '학원 교재', '문제집'];

function isMathSubject(subjectName: string) {
  return subjectName.includes('수학');
}

function isEnglishSubject(subjectName: string) {
  return subjectName.includes('영어');
}

function isSocialSubject(subjectName: string) {
  return subjectName.includes('사회');
}

function isScienceSubject(subjectName: string) {
  return subjectName.includes('과학');
}

function getFirstParam(value: string | string[] | undefined, fallback: string) {
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

export default function SubjectDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ subject?: string }>();
  const { draft, upsertSubject } = useTutorDraft();
  const subjectName = getFirstParam(params.subject, '국어');
  const savedSubject = draft.subjects.find(subject => subject.name === subjectName);
  const subjectId = useMemo(
    () => savedSubject?.id ?? `${subjectName}-${Date.now()}`,
    [savedSubject?.id, subjectName]
  );
  const { isSaving, saveSubject } = useSaveTutorSubject();
  const isMath = isMathSubject(subjectName);
  const isEnglish = isEnglishSubject(subjectName);
  const isSocial = isSocialSubject(subjectName);
  const isScience = isScienceSubject(subjectName);
  const [activeTab, setActiveTab] = useState<DetailTab>('range');
  const [examRange, setExamRange] = useState(savedSubject?.range ?? '');
  const [progress, setProgress] = useState(isMath || isEnglish ? 20 : 40);
  const [selectedGrade, setSelectedGrade] = useState(0);
  const [mockGrade, setMockGrade] = useState(isEnglish || isSocial ? 2 : 1);
  const [confidence, setConfidence] = useState(isMath ? 2 : isEnglish || isSocial || isScience ? 1 : 0);
  const [weakPoint, setWeakPoint] = useState(savedSubject?.weakPoint ?? '');
  const [socialTypes, setSocialTypes] = useState<string[]>(['한국지리']);
  const [scienceTypes, setScienceTypes] = useState<string[]>(['물리학']);
  const [focusOptions, setFocusOptions] = useState<string[]>(
    isMath ? ['교과서 본문', '프린트'] : ['교과서 본문']
  );
  const [outsideOption, setOutsideOption] = useState('나옴');
  const [similarityOption, setSimilarityOption] = useState('조금 다름');
  const [priority, setPriority] = useState(2);
  const [memoryRatio, setMemoryRatio] = useState(70);
  const [socialMemory, setSocialMemory] = useState('이해·적용 중심');
  const [socialChart, setSocialChart] = useState('자주 나옴');
  const [calculationRatio, setCalculationRatio] = useState('가끔 나옴');
  const [scienceConcept, setScienceConcept] = useState('원리 이해');
  const [essayRatio, setEssayRatio] = useState(isScience ? 30 : isSocial ? 20 : isMath || isEnglish ? 40 : 25);
  const [difficulty, setDifficulty] = useState(isScience ? 3 : 2);
  const [teacherMemo, setTeacherMemo] = useState('');
  const [materialOptions, setMaterialOptions] = useState<string[]>(savedSubject?.materials ?? ['교과서', '학교 프린트', '부교재']);
  const [publisher, setPublisher] = useState('');
  const [workbook, setWorkbook] = useState('');
  const [printCount, setPrintCount] = useState('');
  const [printUploads, setPrintUploads] = useState<UploadItem[]>([]);
  const [examUploads, setExamUploads] = useState<UploadItem[]>([]);
  const [uploadError, setUploadError] = useState<UploadErrorType | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const nextLabel = activeTab === 'materials' ? '완료' : '다음';
  const isNextEnabled = useMemo(() => {
    if (activeTab === 'range') return examRange.trim().length > 0;
    return true;
  }, [activeTab, examRange]);

  const goNext = async () => {
    if (!isNextEnabled || isSaving) return;
    if (activeTab === 'range') setActiveTab('style');
    else if (activeTab === 'style') setActiveTab('materials');
    else {
      try {
        const response = await saveSubject({
          subjectId,
          subjectName,
          examRange: examRange.trim(),
          progress,
          selectedGradeIndex: selectedGrade,
          mockGradeIndex: mockGrade,
          confidenceIndex: confidence,
          weakPoint: weakPoint.trim(),
          socialTypes,
          scienceTypes,
          focusOptions,
          outsideOption,
          similarityOption,
          priorityIndex: priority,
          memoryRatio,
          socialMemory,
          socialChart,
          calculationRatio,
          scienceConcept,
          essayRatio,
          difficultyIndex: difficulty,
          teacherMemo: teacherMemo.trim(),
          materials: materialOptions,
          publisher: publisher.trim(),
          workbook: workbook.trim(),
          printCount: printCount.trim(),
          printAttachments: printUploads,
          examAttachments: examUploads,
          scheduleSlots: savedSubject?.scheduleSlots,
        });
        upsertSubject(response.subject);
        router.push('/tutor/step3' as Href);
      } catch (error) {
        Alert.alert(
          '저장 실패',
          error instanceof Error ? error.message : '잠시 후 다시 시도해 주세요.'
        );
      }
    }
  };

  const goPrev = () => {
    if (activeTab === 'materials') setActiveTab('style');
    else if (activeTab === 'style') setActiveTab('range');
    else router.back();
  };

  const toggleFocus = (option: string) => {
    setFocusOptions(prev =>
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    );
  };

  const toggleMaterial = (option: string) => {
    setMaterialOptions(prev =>
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    );
  };

  const toggleSocialType = (option: string) => {
    setSocialTypes(prev =>
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    );
  };

  const toggleScienceType = (option: string) => {
    setScienceTypes(prev =>
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    );
  };

  const getRangePlaceholder = () => {
    if (isMath) return '예) 수열, 극한, 미분';
    if (isEnglish) return '예) Lesson 1~3, 부교재 Unit 2';
    if (isSocial) return '예) 한국지리 1~3단원, 생윤 1단원';
    if (isScience) return '예) 물리 역학, 화학 반응식';
    return '예) 문학 1단원, 독서 2~3단원';
  };

  const getWeakPointPlaceholder = () => {
    if (isMath) return '예) 수열 점화식, 극한 계산';
    if (isEnglish) return '예) 어휘, 본문 암기, 문법';
    if (isSocial) return '예) 위치 개념, 도표 해석';
    if (isScience) return '예) 실험 과정, 그래프 해석';
    return '예) 비문학 추론, 고전시가';
  };

  const getMemoPlaceholder = () => {
    if (isMath) return '예) 킬러문제 꼭 나옴, 풀이과정 중요';
    if (isEnglish) return '예) 본문 변형 많음, 단어 시험 포함';
    if (isSocial) return '예) 자료 해석 문제 많음, 개념 적용 중요';
    if (isScience) return '예) 실험 과정 암기 필수, 그래프 해석 중요';
    return '예) 수업 필기 위주, 고전 문법 꼭 나옴';
  };

  const handleAddUpload = (
    uploads: UploadItem[],
    setUploads: React.Dispatch<React.SetStateAction<UploadItem[]>>
  ) => {
    if (uploads.length >= 3) {
      setUploadError('limit');
      return;
    }

    const nextIndex = uploads.length + 1;
    setUploads(prev => [
      ...prev,
      {
        id: `${Date.now()}-${nextIndex}`,
        name: nextIndex === 1 ? '(2024) 정규교재 예시.pdf' : `업로드 이미지 ${nextIndex}.png`,
        kind: nextIndex === 1 ? 'file' : 'image',
      },
    ]);
  };

  const showUploadFormatError = () => setUploadError('format');
  const showUploadNetworkError = () => setUploadError('network');

  const handleRetryUpload = () => {
    if (uploadError === 'network') {
      setUploadError(null);
      setIsReconnecting(true);
      return;
    }
    setUploadError(null);
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <View style={[
          styles.subjectBadge,
          isMath && styles.subjectBadgeMath,
          isEnglish && styles.subjectBadgeEnglish,
          isSocial && styles.subjectBadgeSocial,
          isScience && styles.subjectBadgeScience,
        ]}>
          <Text style={[
            styles.subjectBadgeText,
            isMath && styles.subjectBadgeTextMath,
            isEnglish && styles.subjectBadgeTextEnglish,
            isSocial && styles.subjectBadgeTextSocial,
            isScience && styles.subjectBadgeTextScience,
          ]}>
            {subjectName}
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.tabBar}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: BOTTOM_ACTION_CONTENT_HEIGHT + insets.bottom + 24 },
        ]}
      >
        {activeTab === 'range' && (
          <>
            {isSocial && (
              <Field label="자료 종류">
                <ChipRow options={SOCIAL_TYPES} selectedValues={socialTypes} onPress={toggleSocialType} />
              </Field>
            )}

            {isScience && (
              <Field label="자료 종류">
                <ChipRow options={SCIENCE_TYPES} selectedValues={scienceTypes} onPress={toggleScienceType} />
              </Field>
            )}

            <Field label={isMath || isEnglish || isSocial || isScience ? '시험 범위 (단원명으로 작성)' : '시험 범위'}>
              <TextInput
                style={styles.input}
                placeholder={getRangePlaceholder()}
                placeholderTextColor={Colors['Text.Normal.Assistive']}
                value={examRange}
                onChangeText={setExamRange}
              />
            </Field>

            <SliderField label="현재 진행도" value={progress} onChange={setProgress} />

            <Field label="시험 선택">
              <Segmented options={GRADES} selectedIndex={selectedGrade} onSelect={setSelectedGrade} />
            </Field>

            <Field label="직전 시험 등급 (선택)">
              <Segmented options={MOCK_GRADES} selectedIndex={mockGrade} onSelect={setMockGrade} />
            </Field>

            <Field label="자신감">
              <ChipRow
                options={CONFIDENCE}
                selectedValues={[CONFIDENCE[confidence]]}
                onPress={option => setConfidence(CONFIDENCE.indexOf(option))}
              />
            </Field>

            <Field label="취약한 부분 (선택)">
              <TextInput
                style={styles.input}
                placeholder={getWeakPointPlaceholder()}
                placeholderTextColor={Colors['Text.Normal.Assistive']}
                value={weakPoint}
                onChangeText={setWeakPoint}
              />
            </Field>
          </>
        )}

        {activeTab === 'style' && (
          <>
            <View style={styles.noticeRow}>
              <Text style={styles.noticeIcon}>⚡</Text>
              <Text style={styles.noticeText}>필수는 아니지만, 입력할수록 정확도가 올라가요!</Text>
            </View>

            <Field label="출제 중심 (복수 선택)">
              <ChipRow
                options={isMath ? MATH_FOCUS_OPTIONS : FOCUS_OPTIONS}
                selectedValues={focusOptions}
                onPress={toggleFocus}
              />
            </Field>

            {isMath ? (
              <>
                <Field label="모의고사 유형 유사도">
                  <ChipRow
                    options={SIMILARITY_OPTIONS}
                    selectedValues={[similarityOption]}
                    onPress={setSimilarityOption}
                  />
                </Field>

                <Field label="시험 출제 1순위">
                  <Segmented options={PRIORITY_OPTIONS} selectedIndex={priority} onSelect={setPriority} />
                </Field>
              </>
            ) : isSocial ? (
              <>
                <Field label="암기 vs 이해 · 적용 중심">
                  <Segmented
                    options={SOCIAL_MEMORY_OPTIONS}
                    selectedIndex={SOCIAL_MEMORY_OPTIONS.indexOf(socialMemory)}
                    onSelect={index => setSocialMemory(SOCIAL_MEMORY_OPTIONS[index])}
                  />
                </Field>

                <Field label="자료 · 그래프 문제 출제 여부">
                  <ChipRow
                    options={SOCIAL_CHART_OPTIONS}
                    selectedValues={[socialChart]}
                    onPress={setSocialChart}
                  />
                </Field>
              </>
            ) : isScience ? (
              <>
                <Field label="계산 문제 비중">
                  <Segmented
                    options={CALCULATION_OPTIONS}
                    selectedIndex={CALCULATION_OPTIONS.indexOf(calculationRatio)}
                    onSelect={index => setCalculationRatio(CALCULATION_OPTIONS[index])}
                  />
                </Field>

                <Field label="개념 암기 vs 원리 이해 중심">
                  <ChipRow
                    options={SCIENCE_CONCEPT_OPTIONS}
                    selectedValues={[scienceConcept]}
                    onPress={setScienceConcept}
                  />
                </Field>
              </>
            ) : isEnglish ? (
              <>
                <SliderField label="교과서 본문 암기 중요도" value={memoryRatio} onChange={setMemoryRatio} />

                <Field label="부교재 · 모의고사 변형 출제">
                  <ChipRow
                    options={OUTSIDE_OPTIONS}
                    selectedValues={[outsideOption]}
                    onPress={setOutsideOption}
                  />
                </Field>
              </>
            ) : (
              <Field label="외부 지문 출제 여부">
                <ChipRow
                  options={OUTSIDE_OPTIONS}
                  selectedValues={[outsideOption]}
                  onPress={setOutsideOption}
                />
              </Field>
            )}

            <SliderField label={isMath ? '서술형 비중' : '서술형'} value={essayRatio} onChange={setEssayRatio} />

            <Field label="전체 난이도">
              <Segmented options={DIFFICULTIES} selectedIndex={difficulty} onSelect={setDifficulty} />
            </Field>

            <Field label="선생님 Tip / 메모">
              <TextInput
                style={styles.input}
                placeholder={getMemoPlaceholder()}
                placeholderTextColor={Colors['Text.Normal.Assistive']}
                value={teacherMemo}
                onChangeText={setTeacherMemo}
              />
            </Field>
          </>
        )}

        {activeTab === 'materials' && (
          <>
            <Field label="자료 종류 (복수 선택)">
              <ChipRow options={MATERIALS} selectedValues={materialOptions} onPress={toggleMaterial} />
            </Field>

            <Field label="교과서 출판사">
              <TextInput
                style={styles.input}
                placeholder="예) 미래앤"
                placeholderTextColor={Colors['Text.Normal.Assistive']}
                value={publisher}
                onChangeText={setPublisher}
              />
            </Field>

            <Field label="문제집 이름 (선택)">
              <TextInput
                style={styles.input}
                placeholder="예) 수학의 정석, 마더텅"
                placeholderTextColor={Colors['Text.Normal.Assistive']}
                value={workbook}
                onChangeText={setWorkbook}
              />
            </Field>

            <Field label="프린트 장 수 (선택)">
              <TextInput
                style={styles.input}
                placeholder="예) 10"
                placeholderTextColor={Colors['Text.Normal.Assistive']}
                value={printCount}
                onChangeText={setPrintCount}
                keyboardType="number-pad"
              />
            </Field>

            <Field label="프린트 사진 업로드 (선택)">
              <UploadField
                uploads={printUploads}
                onAdd={() => handleAddUpload(printUploads, setPrintUploads)}
                onRemove={id => setPrintUploads(prev => prev.filter(item => item.id !== id))}
                onFormatError={showUploadFormatError}
                onNetworkError={showUploadNetworkError}
              />
              <Text style={styles.helperText}>사진 업로드 시 더 정확한 분석이 가능해요!</Text>
            </Field>

            <Field label="이전 기출 · 족보 (선택)">
              <UploadField
                uploads={examUploads}
                onAdd={() => handleAddUpload(examUploads, setExamUploads)}
                onRemove={id => setExamUploads(prev => prev.filter(item => item.id !== id))}
                onFormatError={showUploadFormatError}
                onNetworkError={showUploadNetworkError}
              />
            </Field>
          </>
        )}

      </ScrollView>

      <BottomActionBar style={styles.buttonRow}>
        {activeTab !== 'range' && (
          <Button label="이전" state="Default" onPress={goPrev} style={styles.prevButton} />
        )}
        <Button
          label={isSaving ? '저장 중...' : nextLabel}
          state={isNextEnabled && !isSaving ? 'Default' : 'Inactive'}
          onPress={goNext}
          style={styles.nextButton}
        />
      </BottomActionBar>

      <UploadErrorModal
        error={uploadError}
        onCancel={() => setUploadError(null)}
        onRetry={handleRetryUpload}
      />

      <ReconnectModal
        visible={isReconnecting}
        onClose={() => setIsReconnecting(false)}
      />
    </SafeAreaView>
  );
}
