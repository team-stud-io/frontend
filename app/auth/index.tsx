// app/index.tsx
// AI 튜터 생성 화면1 - 기본 정보 입력
// Unity 비유: 이 파일이 하나의 Scene이에요
// useState = SerializeField (값을 저장하고 화면에 반영)
// useRouter = SceneManager.LoadScene (화면 전환)

import React, { useState } from 'react';
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Button } from '../../components/Button';
import { TabSection } from '../../components/TabSection';
import { Colors } from '../../constants/colors';

// 각 탭 섹션의 선택지 데이터
// Unity의 [SerializeField] string[] examTypes 같은 것
const EXAM_TYPES = ['내신', '모의고사', '수능'];
const SEMESTER_TYPES = ['1학기', '2학기'];
const EXAM_PERIOD_TYPES = ['중간고사', '기말고사'];

export default function TutorCreateScreen() {
  // 각 탭 섹션의 선택된 인덱스 상태
  // Unity의 private int selectedExamIndex = 0; 과 동일
  const [selectedExam, setSelectedExam] = useState(0);         // 시험 선택 (기본: 내신)
  const [selectedSemester, setSelectedSemester] = useState(0); // 학기 선택 (기본: 1학기)
  const [selectedPeriod, setSelectedPeriod] = useState(0);     // 고사 선택 (기본: 중간고사)
  const [goal, setGoal] = useState('');                         // 목표 텍스트 입력값

  // 다음 버튼 활성화 여부
  // 목표를 입력했을 때만 활성화
  const isNextEnabled = goal.trim().length > 0;

  // 다음 버튼 눌렸을 때 처리
  // 여기에 나중에 router.push('/tutor/step2') 같은 네비게이션 추가
  const handleNext = () => {
    if (!isNextEnabled) return;
    console.log({
      exam: EXAM_TYPES[selectedExam],
      semester: SEMESTER_TYPES[selectedSemester],
      period: EXAM_PERIOD_TYPES[selectedPeriod],
      goal,
    });
    // TODO: 다음 화면으로 이동
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* 뒤로가기 버튼 */}
        <Pressable style={styles.backButton} onPress={() => {}}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>

        {/* 화면 제목 */}
        <Text style={styles.title}>기본 정보 입력</Text>

        {/* 폼 영역 */}
        <View style={styles.form}>

          {/* 시험 선택 탭 */}
          <View style={styles.tabGroup}>
            <Text style={styles.tabLabel}>시험 선택</Text>
            <TabSection
              tabs={EXAM_TYPES}
              selectedIndex={selectedExam}
              onTabPress={setSelectedExam}
            />

            {/* 내신 선택 시에만 학기/고사 탭 노출 */}
            {/* Unity의 gameObject.SetActive(condition) 과 동일 */}
            {selectedExam === 0 && (
              <>
                <TabSection
                  tabs={SEMESTER_TYPES}
                  selectedIndex={selectedSemester}
                  onTabPress={setSelectedSemester}
                />
                <TabSection
                  tabs={EXAM_PERIOD_TYPES}
                  selectedIndex={selectedPeriod}
                  onTabPress={setSelectedPeriod}
                />
              </>
            )}
          </View>

          {/* 목표 입력 */}
          <View style={styles.textFieldGroup}>
            <Text style={styles.tabLabel}>목표</Text>
            <View style={styles.inputField}>
              <TextInput
                style={styles.input}
                placeholder="예) 평균 2등급 이상"
                placeholderTextColor={Colors['Text.Normal.Assistive']}
                value={goal}
                onChangeText={setGoal}  // Unity의 onValueChanged와 동일
                multiline={false}
              />
            </View>
            <Text style={styles.helperText}>
              현실적인 목표를 작성할수록 전략의 질이 높아져요!
            </Text>
          </View>

        </View>
      </ScrollView>

      {/* 다음 버튼 - 하단 고정 */}
      {/* Unity의 Canvas - Screen Space Overlay와 유사 */}
      <View style={styles.buttonSection}>
        <Button
          label="다음"
          state={isNextEnabled ? 'Default' : 'Inactive'}
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,         // 버튼 영역 높이만큼 여백
  },

  // 뒤로가기
  backButton: {
    marginBottom: 16,
  },
  backArrow: {
    fontSize: 24,
    color: Colors['Text.Normal.Normal'],
  },

  // 제목
  title: {
    fontFamily: 'Pretendard',
    fontSize: 24,
    fontWeight: '700',
    color: Colors['Text.Normal.Strong'],
    marginBottom: 24,
  },

  // 폼 전체 컨테이너
  form: {
    gap: 24,                    // 탭 그룹 간 간격
  },

  // 탭 그룹 (라벨 + TabSection들)
  tabGroup: {
    gap: 8,
  },

  // 탭 라벨 ("시험 선택", "목표")
  tabLabel: {
    fontFamily: 'Pretendard',
    fontSize: 14,
    fontWeight: '500',
    color: Colors['Text.Normal.Assistive'],
    marginBottom: 4,
  },

  // 목표 입력 그룹
  textFieldGroup: {
    gap: 4,
  },

  // 입력창 외곽 박스
  inputField: {
    height: 54,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Strong'],
    backgroundColor: Colors['Fill.Normal.Normal'],
  },

  // 실제 텍스트 입력 영역
  input: {
    fontFamily: 'Pretendard',
    fontSize: 16,
    fontWeight: '500',
    color: Colors['Text.Normal.Normal'],
    letterSpacing: -0.2,
  },

  // 헬퍼 텍스트
  helperText: {
    fontFamily: 'Pretendard',
    fontSize: 12,
    fontWeight: '400',
    color: Colors['Text.Normal.Subtle'],
    letterSpacing: -0.2,
  },

  // 하단 고정 버튼 영역
  buttonSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
});