// app/tutor/subject-detail.tsx
// AI 튜터 생성 화면 - 과목 상세 정보 입력

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  Modal as RNModal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Colors } from '../../constants/colors';

type DetailTab = 'range' | 'style' | 'materials';
type UploadErrorType = 'format' | 'limit' | 'network';

type UploadItem = {
  id: string;
  name: string;
  kind: 'image' | 'file';
};

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

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export default function SubjectDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ subject?: string }>();
  const subjectName = getFirstParam(params.subject, '국어');
  const isMath = isMathSubject(subjectName);
  const isEnglish = isEnglishSubject(subjectName);
  const isSocial = isSocialSubject(subjectName);
  const isScience = isScienceSubject(subjectName);
  const [activeTab, setActiveTab] = useState<DetailTab>('range');
  const [examRange, setExamRange] = useState('');
  const [progress, setProgress] = useState(isMath || isEnglish ? 20 : 40);
  const [selectedGrade, setSelectedGrade] = useState(0);
  const [mockGrade, setMockGrade] = useState(isEnglish || isSocial ? 2 : 1);
  const [confidence, setConfidence] = useState(isMath ? 2 : isEnglish || isSocial || isScience ? 1 : 0);
  const [weakPoint, setWeakPoint] = useState('');
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
  const [materialOptions, setMaterialOptions] = useState<string[]>(['교과서', '학교 프린트', '부교재']);
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

  const goNext = () => {
    if (!isNextEnabled) return;
    if (activeTab === 'range') setActiveTab('style');
    else if (activeTab === 'style') setActiveTab('materials');
    else router.back();
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
    <SafeAreaView style={styles.safeArea}>
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

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
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

      <View style={styles.buttonRow}>
        {activeTab !== 'range' && (
          <Button label="이전" state="Default" onPress={goPrev} style={styles.prevButton} />
        )}
        <Button
          label={nextLabel}
          state={isNextEnabled ? 'Default' : 'Inactive'}
          onPress={goNext}
          style={styles.nextButton}
        />
      </View>

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

function ChipRow({
  options,
  selectedValues,
  onPress,
}: {
  options: string[];
  selectedValues: string[];
  onPress: (option: string) => void;
}) {
  return (
    <View style={styles.chipRow}>
      {options.map(option => {
        const isSelected = selectedValues.includes(option);
        return (
          <Pressable
            key={option}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => onPress(option)}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Segmented({
  options,
  selectedIndex,
  onSelect,
}: {
  options: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <View style={styles.segmented}>
      {options.map((option, index) => {
        const isSelected = selectedIndex === index;
        return (
          <Pressable
            key={option}
            style={[styles.segmentItem, isSelected && styles.segmentItemSelected]}
            onPress={() => onSelect(index)}
          >
            <Text style={[styles.segmentText, isSelected && styles.segmentTextSelected]}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function SliderField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const [trackWidth, setTrackWidth] = useState(0);
  const trackPageX = useRef(0);
  const didDrag = useRef(false);

  const updateValue = useCallback(
    (nextValue: number) => onChange(clampPercent(nextValue)),
    [onChange]
  );

  const getValueFromPageX = useCallback(
    (pageX: number) => {
      if (trackWidth === 0) return value;
      return ((pageX - trackPageX.current) / trackWidth) * 100;
    },
    [trackWidth, value]
  );

  const handleTrackLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: event => {
          didDrag.current = false;
          trackPageX.current = event.nativeEvent.pageX - event.nativeEvent.locationX;
          updateValue(getValueFromPageX(event.nativeEvent.pageX));
        },
        onPanResponderMove: (_, gestureState) => {
          if (trackWidth === 0) return;
          if (Math.abs(gestureState.dx) > 1) didDrag.current = true;
          updateValue(getValueFromPageX(gestureState.moveX));
        },
        onPanResponderRelease: (_, gestureState) => {
          if (trackWidth === 0 || didDrag.current) return;
          updateValue(getValueFromPageX(gestureState.moveX));
        },
        onPanResponderTerminate: () => {
          didDrag.current = false;
        },
      }),
    [getValueFromPageX, trackWidth, updateValue]
  );

  return (
    <Field label={label}>
      <View style={styles.sliderValueRow}>
        <View
          style={styles.sliderTouchArea}
          onLayout={handleTrackLayout}
          {...panResponder.panHandlers}
        >
          <View style={styles.sliderTrack}>
            <View style={[styles.sliderFill, { width: `${value}%` }]} />
            <View
              style={[styles.sliderThumb, { left: `${value}%` }]}
            />
          </View>
        </View>
        <Text style={styles.sliderValue}>{value}%</Text>
      </View>
    </Field>
  );
}

function UploadField({
  uploads,
  onAdd,
  onRemove,
  onFormatError,
  onNetworkError,
}: {
  uploads: UploadItem[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onFormatError: () => void;
  onNetworkError: () => void;
}) {
  return (
    <View style={styles.uploadArea}>
      {uploads.length > 0 && (
        <View style={styles.uploadList}>
          {uploads.map(item => (
            <Pressable
              key={item.id}
              style={item.kind === 'image' ? styles.uploadPreview : styles.uploadFile}
              onPress={onFormatError}
            >
              <Text style={item.kind === 'image' ? styles.uploadPreviewText : styles.uploadFileText} numberOfLines={1}>
                {item.kind === 'image' ? '사진' : `📎 ${item.name}`}
              </Text>
              <Pressable style={styles.uploadRemove} onPress={() => onRemove(item.id)}>
                <Text style={styles.uploadRemoveText}>×</Text>
              </Pressable>
            </Pressable>
          ))}
        </View>
      )}
      <Pressable style={styles.uploadButton} onPress={onAdd} onLongPress={onNetworkError}>
        <Text style={styles.uploadIcon}>＋</Text>
        <Text style={styles.uploadText}>사진 등록</Text>
      </Pressable>
    </View>
  );
}

function UploadErrorModal({
  error,
  onCancel,
  onRetry,
}: {
  error: UploadErrorType | null;
  onCancel: () => void;
  onRetry: () => void;
}) {
  if (!error) return null;

  const title =
    error === 'format'
      ? '사진을 업로드할 수 없어요'
      : error === 'limit'
        ? '업로드 개수를 초과했어요'
        : '네트워크 연결이 불안정합니다';
  const message =
    error === 'format'
      ? '10MB 이하의 JPG, PNG,\nPDF 파일만 업로드할 수 있습니다.'
      : error === 'limit'
        ? '사진은 최대 3장까지만\n업로드할 수 있습니다.'
        : '인터넷 연결 상태를 확인하고\n다시 시도해 주세요.';

  return (
    <Modal
      visible
      title={title}
      description={message}
      leftButton="취소"
      rightButton="다시 시도하기"
      onLeftPress={onCancel}
      onRightPress={onRetry}
    />
  );
}

function ReconnectModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <RNModal visible={visible} animationType="fade">
      <SafeAreaView style={styles.reconnectScreen}>
        <View style={styles.reconnectBody}>
          <Pressable style={styles.reconnectMascot} onPress={onClose}>
            <View style={styles.reconnectEyeRow}>
              <View style={styles.reconnectEye} />
              <View style={styles.reconnectEye} />
            </View>
            <View style={styles.reconnectSmile} />
          </Pressable>
          <Text style={styles.reconnectTitle}>연결중...</Text>
          <Text style={styles.reconnectText}>네트워크를 다시 연결하고 있어요</Text>
          <View style={styles.reconnectSpinner} />
        </View>
      </SafeAreaView>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    height: 88,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 28,
    color: Colors['Text.Normal.Strong'],
  },
  subjectBadge: {
    minWidth: 66,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5D5DF',
    backgroundColor: '#FFF7FB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  subjectBadgeText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#F04588',
  },
  subjectBadgeMath: {
    borderColor: '#D6E8C8',
    backgroundColor: '#FAFFF5',
  },
  subjectBadgeTextMath: {
    color: '#48AD00',
  },
  subjectBadgeEnglish: {
    borderColor: '#D5E2FF',
    backgroundColor: '#F5F8FF',
  },
  subjectBadgeTextEnglish: {
    color: '#3385FF',
  },
  subjectBadgeSocial: {
    borderColor: '#F0D9B7',
    backgroundColor: '#FFF8EF',
  },
  subjectBadgeTextSocial: {
    color: '#F68D00',
  },
  subjectBadgeScience: {
    borderColor: '#BCEAF2',
    backgroundColor: '#F0FCFE',
  },
  subjectBadgeTextScience: {
    color: '#00BDDE',
  },
  headerSpacer: { width: 40 },
  tabBar: {
    height: 58,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors['Line.Normal.Normal'],
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: Colors['Fill.Primary.Normal'],
  },
  tabText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: Colors['Text.Normal.Assistive'],
  },
  tabTextActive: {
    color: '#4C8790',
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 34,
    paddingBottom: 120,
    gap: 30,
  },
  field: {
    gap: 12,
  },
  label: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: Colors['Text.Normal.Normal'],
  },
  input: {
    height: 64,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Strong'],
    paddingHorizontal: 18,
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: Colors['Text.Normal.Strong'],
  },
  sliderValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  sliderTouchArea: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
  },
  sliderTrack: {
    width: '100%',
    height: 7,
    borderRadius: 999,
    backgroundColor: Colors['Line.Normal.Normal'],
  },
  sliderFill: {
    height: 7,
    borderRadius: 999,
    backgroundColor: Colors['Fill.Primary.Normal'],
  },
  sliderThumb: {
    position: 'absolute',
    top: -10,
    width: 30,
    height: 30,
    marginLeft: -15,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: Colors['Line.Normal.Normal'],
    backgroundColor: '#6E9CA4',
  },
  sliderValue: {
    width: 46,
    textAlign: 'right',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#5F939B',
  },
  segmented: {
    height: 64,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Strong'],
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  segmentItem: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentItemSelected: {
    borderWidth: 1,
    borderColor: Colors['Line.Primary.Normal'],
    backgroundColor: Colors['Fill.Primary.Assistive'],
  },
  segmentText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: Colors['Text.Normal.Assistive'],
  },
  segmentTextSelected: {
    color: Colors['Text.Normal.Normal'],
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    minHeight: 46,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Strong'],
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipSelected: {
    borderColor: Colors['Line.Primary.Normal'],
    backgroundColor: Colors['Fill.Primary.Assistive'],
  },
  chipText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: Colors['Text.Normal.Assistive'],
  },
  chipTextSelected: {
    color: Colors['Text.Normal.Normal'],
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  noticeIcon: {
    fontSize: 28,
  },
  noticeText: {
    flex: 1,
    fontFamily: 'Pretendard-Bold',
    fontSize: 16,
    color: Colors['Text.Normal.Strong'],
  },
  helperText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 13,
    color: Colors['Text.Normal.Assistive'],
  },
  uploadArea: {
    gap: 10,
  },
  uploadList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  uploadPreview: {
    width: 82,
    height: 56,
    borderRadius: 6,
    backgroundColor: '#EEF7F9',
    borderWidth: 1,
    borderColor: '#D8EEF2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadPreviewText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    color: Colors['Text.Normal.Assistive'],
  },
  uploadFile: {
    maxWidth: '100%',
    minHeight: 40,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Normal'],
    paddingLeft: 16,
    paddingRight: 36,
    justifyContent: 'center',
  },
  uploadFileText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 13,
    color: Colors['Text.Normal.Normal'],
  },
  uploadRemove: {
    position: 'absolute',
    right: -6,
    top: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Normal'],
  },
  uploadRemoveText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 16,
    lineHeight: 18,
    color: Colors['Text.Normal.Normal'],
  },
  uploadButton: {
    height: 64,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Strong'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors['Text.Normal.Normal'],
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Pretendard-Bold',
    fontSize: 15,
  },
  uploadText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: Colors['Text.Normal.Normal'],
  },
  reconnectScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  reconnectBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  reconnectMascot: {
    width: 112,
    height: 94,
    borderRadius: 30,
    backgroundColor: '#C9F6FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  reconnectEyeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  reconnectEye: {
    width: 18,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#111111',
  },
  reconnectSmile: {
    width: 34,
    height: 20,
    borderBottomWidth: 3,
    borderColor: '#111111',
    borderRadius: 20,
  },
  reconnectTitle: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 28,
    color: Colors['Text.Normal.Strong'],
    marginBottom: 18,
  },
  reconnectText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: Colors['Text.Normal.Strong'],
    marginBottom: 28,
  },
  reconnectSpinner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: '#D8EEF2',
    borderTopColor: Colors['Fill.Primary.Normal'],
  },
  buttonRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  prevButton: {
    flex: 1,
    backgroundColor: Colors['Fill.Normal.Assistive'],
  },
  nextButton: {
    flex: 2,
  },
});
