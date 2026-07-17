





import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomActionBar, Button, TabSection } from '../../components/ui';
import { useTutorDraft } from '../../components/tutor/TutorDraftContext';
import { Colors } from '../../constants/colors';



const EXAM_TYPES = ['내신', '모의고사', '수능'];
const SEMESTER_TYPES = ['1학기', '2학기'];
const EXAM_PERIOD_TYPES = ['중간고사', '기말고사'];

export default function TutorCreateScreen() {


  const [selectedExam, setSelectedExam] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const [goal, setGoal] = useState('');
  const router = useRouter();
  const { updateBasicInfo } = useTutorDraft();



  const isNextEnabled = goal.trim().length > 0;



  const handleNext = () => {
  if (!isNextEnabled) return;
  updateBasicInfo({
    examType: EXAM_TYPES[selectedExam],
    semester: SEMESTER_TYPES[selectedSemester],
    examPeriod: EXAM_PERIOD_TYPES[selectedPeriod],
    goal: goal.trim(),
  });
  router.push('/tutor/step2');
};



  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>


        <Text style={styles.title}>기본 정보 입력</Text>


        <View style={styles.form}>


          <View style={styles.tabGroup}>
            <Text style={styles.tabLabel}>시험 선택</Text>
            <TabSection
              tabs={EXAM_TYPES}
              selectedIndex={selectedExam}
              onTabPress={setSelectedExam}
            />



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


          <View style={styles.textFieldGroup}>
            <Text style={styles.tabLabel}>목표</Text>
            <View style={styles.inputField}>
              <TextInput
                style={styles.input}
                placeholder="예) 평균 2등급 이상"
                placeholderTextColor={Colors['Text.Normal.Assistive']}
                value={goal}
                onChangeText={setGoal}
                multiline={false}
              />
            </View>
            <Text style={styles.helperText}>
              현실적인 목표를 작성할수록 전략의 질이 높아져요!
            </Text>
          </View>

        </View>
      </ScrollView>



      <BottomActionBar style={styles.buttonSection}>
        <Button
          label="다음"
          state={isNextEnabled ? 'Default' : 'Inactive'}
          onPress={handleNext}
        />
      </BottomActionBar>
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
    paddingBottom: 100,
  },


  backButton: {
    marginBottom: 16,
  },
  backArrow: {
    fontSize: 24,
    color: Colors['Text.Normal.Normal'],
  },


  title: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 24,
    color: Colors['Text.Normal.Strong'],
    marginBottom: 24,
  },


  form: {
    gap: 24,
  },


  tabGroup: {
    gap: 8,
  },


  tabLabel: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: Colors['Text.Normal.Assistive'],
    marginBottom: 4,
  },


  textFieldGroup: {
    gap: 4,
  },


  inputField: {
    height: 54,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Strong'],
    backgroundColor: Colors['Fill.Normal.Normal'],
  },


  input: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: Colors['Text.Normal.Normal'],
    letterSpacing: -0.2,
  },


  helperText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    color: Colors['Text.Normal.Subtle'],
    letterSpacing: -0.2,
  },


  buttonSection: {
    flexShrink: 0,
  },
});
