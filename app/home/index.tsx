import Ionicons from '@expo/vector-icons/Ionicons';
import { type Href, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeGnb, HomeTask, HomeTaskList, TaskDetailBottomSheet, type Difficulty } from '../../components/home';
import { AssetIcon } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { useHome } from '../../hooks/useHome';
import type { TodayReflection, TodoDetail } from '../../services/home/homeService';

const INITIAL_TASKS: HomeTask[] = [
  { id: 'textbook', subject: '확률과통계', title: '교과서 63-100쪽 개념 정독', completed: false, difficulty: null },
  { id: 'language', subject: '언어와매체', title: '수능특강 언론예술 08~10장 정리', completed: false, difficulty: null },
  { id: 'suneung-4-7', subject: '확률과통계', title: '수능특강 4강-7강 문제풀이', completed: false, difficulty: null, strategyAvailable: true },
  { id: 'society', subject: '언어와매체', title: '수능특강 언론예술 11~13강 + 사회문화 08~13강', completed: false, difficulty: null },
  { id: 'french', subject: '프랑스어문화', title: '수능특강 7~9강 정리', completed: false, difficulty: null },
  { id: 'history', subject: '한국사', title: '교과서 178~210쪽 흐름 정리', completed: false, difficulty: null },
];

const STAGE_THREE_TASKS: HomeTask[] = [
  { id: 'stage-three-review', subject: '확률과통계', title: '수능특강 4~7강 문제풀이 오답 정리', completed: true, difficulty: null, showDifficultyPrompt: false },
  { id: 'stage-three-language', subject: '언어와매체', title: '기출 인문예술 지문 5세트 풀이', completed: false, difficulty: null },
  { id: 'stage-three-society', subject: '언어와매체', title: '11~13강 + 사회문화 08~13강 통합 문제풀이', completed: false, difficulty: null },
  { id: 'stage-three-probability', subject: '확률과통계', title: '조합·이항정리 유형별 기출 20문제', completed: false, difficulty: null },
  { id: 'stage-three-french', subject: '프랑스어문화', title: '7~9강 개념 확인 문제 풀이', completed: false, difficulty: null },
  { id: 'stage-three-history', subject: '한국사', title: '178~210쪽 흐름 관련 기출문제 풀이', completed: false, difficulty: null },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const { home, toggleTodo, getTodoDetail, getTodayReflection, createReflection } = useHome();
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [stageThreeTasks, setStageThreeTasks] = useState(STAGE_THREE_TASKS);
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const [todoDetail, setTodoDetail] = useState<TodoDetail | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmittingReflection, setIsSubmittingReflection] = useState(false);
  const [todayReflection, setTodayReflection] = useState<TodayReflection | null>(null);
  const [stageAdvanced, setStageAdvanced] = useState(false);
  const selectedTask = useMemo(() => [...tasks, ...stageThreeTasks].find(task => task.id === detailTaskId) ?? null, [detailTaskId, tasks, stageThreeTasks]);
  const allTasksCompleted = tasks.length > 0 && tasks.every(task => task.completed);

  useEffect(() => {
    if (!home || home.home_state !== 'ACTIVE') return;
    setTasks(home.subject_todos.flatMap(subject => subject.todos.map(todo => ({
      id: String(todo.todo_id),
      subject: subject.custom_subject_name ?? subject.subject_category,
      title: todo.content,
      completed: todo.is_completed,
      difficulty: null,
      strategyAvailable: true,
    }))));
  }, [home]);

  useEffect(() => {
    if (!home?.reflection_submitted_today) {
      setTodayReflection(null);
      return;
    }
    void getTodayReflection().then(setTodayReflection);
  }, [getTodayReflection, home?.reflection_submitted_today]);

  const toggleTask = (taskId: string) => {
    const task = tasks.find(item => item.id === taskId);
    if (home && task) {
      void toggleTodo(Number(taskId), !task.completed);
      return;
    }
    setTasks(current => current.map(item => item.id === taskId ? { ...item, completed: !item.completed, difficulty: item.completed ? null : item.difficulty, showDifficultyPrompt: !item.completed } : item));
  };
  const selectDifficulty = (taskId: string, difficulty: Difficulty) => setTasks(current => current.map(task => task.id === taskId ? { ...task, difficulty } : task));
  const toggleStageThreeTask = (taskId: string) => setStageThreeTasks(current => current.map(task => task.id === taskId ? { ...task, completed: !task.completed, difficulty: task.completed ? null : task.difficulty, showDifficultyPrompt: !task.completed } : task));
  const selectStageThreeDifficulty = (taskId: string, difficulty: Difficulty) => setStageThreeTasks(current => current.map(task => task.id === taskId ? { ...task, difficulty } : task));
  const openStrategy = (task: HomeTask) => {
    setDetailTaskId(task.id);
    if (!home) return;
    void getTodoDetail(Number(task.id)).then(setTodoDetail);
  };
  const submitReflection = async () => {
    if (isSubmittingReflection || message.trim().length === 0) return;
    setIsSubmittingReflection(true);
    try {
      await createReflection(message);
      setMessage('');
      setTodayReflection(await getTodayReflection());
    } finally {
      setIsSubmittingReflection(false);
    }
  };

  if (home?.home_state === 'EMPTY') {
    return <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={[styles.viewport, { paddingHorizontal: 20, justifyContent: 'center', gap: 16 }]}>
        <Text style={styles.sectionTitle}>AI 튜터를 만들어볼까요?</Text>
        <Text style={styles.tutorBody}>시험과 과목 정보를 입력하면 오늘의 학습 계획을 만들어드려요.</Text>
        <Pressable accessibilityRole="button" onPress={() => router.push('/tutor' as Href)} style={styles.nextStage}>
          <View style={styles.nextStageCopy}>
            <Text style={styles.nextStageTitle}>AI 튜터 만들기</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#56585A" />
        </Pressable>
      </View>
      <HomeGnb bottomInset={insets.bottom} onReportPress={() => router.replace('/report')} onMyPagePress={() => router.replace('/MyPage' as Href)} />
    </SafeAreaView>;
  }

  if (home?.home_state === 'ACTIVE') {
    const stage = home.current_stage;
    const nextStage = home.next_stage;
    const progressPercent = home.stage_progress?.progress_percent ?? 0;
    return <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.viewport}>
        <ScrollView ref={scrollRef} contentContainerStyle={[styles.content, { paddingBottom: 94 + insets.bottom }]} showsVerticalScrollIndicator={false}>
          <View style={styles.topBar}>
            <View style={styles.dateInfo}>
              <View style={styles.calendarIcon}><AssetIcon name="calendar" width={20} height={20} /></View>
              <Text style={styles.dateText}>{home.today.date} · {home.today.day_of_week}</Text>
            </View>
            <Pressable accessibilityLabel="알림" style={{ opacity: home.has_unread_notification ? 1 : 0.45 }}><AssetIcon name="notificationActive" width={24} height={24} /></Pressable>
          </View>

          <View style={styles.dashboard}>
            <View style={styles.examCard}>
              <View style={styles.ddayBadge}><Text style={styles.ddayText}>{home.dday ? `D-${home.dday.days_left}` : 'D-day'}</Text></View>
              <Text style={styles.examTitle}>{home.dday?.exam_name ?? '시험 정보 없음'}</Text>
              <Text style={styles.examBody}>{home.dday?.exam_date ?? ''}</Text>
            </View>
            <View style={styles.stageCard}>
              <Text style={styles.stageLabel}>현재 스테이지</Text>
              <Text style={styles.stageBody}>Stage {home.stage_progress?.current_stage_number ?? '-'}</Text>
              <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progressPercent}%` }]} /></View>
              <Text style={styles.progressLabel}>{progressPercent}%</Text>
            </View>
          </View>

          {home.tutor_message && <View style={styles.tutorCard}>
            <View style={styles.tutorTitleRow}><View style={styles.tutorIcon}><Ionicons name="sparkles" size={17} color="#FFFFFF" /></View><Text style={styles.tutorTitle}>{home.tutor_message.tutor_name} 튜터</Text></View>
            <Text style={styles.tutorBody}>{home.tutor_message.content}</Text>
          </View>}

          {stage && <View style={styles.section}>
            <View style={styles.stageChip}><Text style={styles.stageChipText}>STAGE {stage.stage_number}</Text></View>
            <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{stage.stage_name}</Text><Text style={styles.sectionPeriod}>{stage.start_date} ~ {stage.end_date}</Text></View>
            <View style={styles.stageProgress}><View style={styles.stageSegment}><View style={[styles.stageSegmentFill, { width: `${progressPercent}%` }]} /></View></View>
            <HomeTaskList tasks={tasks} onToggle={toggleTask} onSelectDifficulty={selectDifficulty} onOpenStrategy={openStrategy} />
          </View>}

          {nextStage && <View style={styles.nextStage}>
            <View style={styles.nextStageCopy}><Text style={styles.nextStageTitle}>다음 스테이지</Text><Text style={styles.nextStageBody}>Stage {nextStage.stage_number} · {nextStage.stage_name}</Text></View>
          </View>}

          <View style={styles.chatSection}>
            <View style={styles.chatHeader}><View style={styles.chatTitleRow}><View style={styles.chatIcon}><Ionicons name="chatbubble-ellipses" size={15} color="#FFFFFF" /></View><Text style={styles.chatTitle}>{home.tutor_message?.tutor_name ?? 'AI'} 튜터</Text></View><Text style={styles.chatStatus}>{home.reflection_submitted_today ? '오늘 회고 제출 완료' : '오늘 아직 보고 안 함'}</Text></View>
            {home.reflection_submitted_today ? <Text style={styles.chatPrompt}>{todayReflection?.content ?? '오늘의 회고가 다음 튜터 한마디에 반영됩니다.'}</Text> : <><View style={styles.chatBox}><TextInput value={message} onChangeText={setMessage} multiline maxLength={400} placeholder="오늘 공부하면서 어땠어?" placeholderTextColor="#A1A3A5" style={styles.chatInput} /><Pressable disabled={isSubmittingReflection || message.trim().length === 0} onPress={() => void submitReflection()} style={styles.sendButton}><Text style={styles.sendText}>{isSubmittingReflection ? '제출 중...' : '보내기'}</Text></Pressable></View><Text style={styles.wordCount}>{message.length}/400</Text></>}
          </View>
        </ScrollView>
        <TaskDetailBottomSheet visible={!!selectedTask} difficulty={selectedTask?.difficulty ?? null} detail={todoDetail} onClose={() => { setDetailTaskId(null); setTodoDetail(null); }} />
        <HomeGnb bottomInset={insets.bottom} onReportPress={() => router.replace('/report')} onMyPagePress={() => router.replace('/MyPage' as Href)} />
      </View>
    </SafeAreaView>;
  }

  return <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
    <View style={styles.viewport}>
      <ScrollView ref={scrollRef} contentContainerStyle={[styles.content, { paddingBottom: 94 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}><View style={styles.dateInfo}><View style={styles.calendarIcon}><AssetIcon name="calendar" width={20} height={20} /></View><Text style={styles.dateText}>2026년 6월 23일 화요일</Text></View><Pressable accessibilityLabel="알림"><AssetIcon name="notificationActive" width={24} height={24} /></Pressable></View>
        <View style={styles.dashboard}><View style={styles.examCard}><View style={[styles.ddayBadge, stageAdvanced && styles.ddayBadgeStageThree]}><Text style={styles.ddayText}>{stageAdvanced ? 'D-7' : 'D-14'}</Text></View><Text style={styles.examTitle}>기말고사</Text><Text style={styles.examBody}>7/2(목) 확률과통계 ·{`\n`}언어와매체 · 한국사</Text></View><View style={styles.stageCard}><Text style={styles.stageLabel}>현재 스테이지</Text><Text style={styles.stageBody}>Stage {stageAdvanced ? '3' : '2'}</Text><View style={styles.progressTrack}><View style={[styles.progressFill, stageAdvanced && styles.progressFillStageThree]} /></View><Text style={styles.progressLabel}>{stageAdvanced ? '20%' : '55%'}</Text></View></View>
        <View style={styles.tutorCard}><View style={styles.tutorTitleRow}><View style={[styles.tutorIcon, stageAdvanced && styles.tutorIconStageThree]}><Ionicons name={stageAdvanced ? 'checkmark' : 'sparkles'} size={17} color="#FFFFFF" /></View><Text style={[styles.tutorTitle, stageAdvanced && styles.tutorTitleStageThree]}>루미 튜터</Text></View><Text style={styles.tutorBody}>{stageAdvanced ? '문제풀이 단계에 들어왔어! 이제 개념을 실전 감각으로 바꾸는 게 핵심이야. 오답은 바로바로 정리하고, 틀린 유형은 다음 스테이지 전에 한 번 더 짚고 넘어가자.' : '사회문화 1회독 완료 대박이야! D-14부터가 진짜 승부인데 지금 페이스 완벽해. 오늘은 확통 수특 4-7강 집중해봐. 조합 · 이항정리 유형이 이번 시험 핵심이야.'}</Text></View>
        <View style={styles.section}><View style={[styles.stageChip, stageAdvanced && styles.stageChipStageThree]}><Text style={[styles.stageChipText, stageAdvanced && styles.stageChipTextStageThree]}>STAGE {stageAdvanced ? '3' : '2'}</Text></View><View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{stageAdvanced ? '문제풀이 집중' : '심화 개념 정리'}</Text><Text style={styles.sectionPeriod}>{stageAdvanced ? 'D-13 ~ D-7' : 'D-21 ~ D-14'}</Text></View><View style={styles.stageProgress}><View style={styles.stageSegment}><View style={[styles.stageSegmentFill, stageAdvanced && styles.stageSegmentFillStageThree, { width: stageAdvanced ? '20%' : '100%' }]} /></View><View style={styles.stageSegment}>{!stageAdvanced && <View style={[styles.stageSegmentFill, { width: '45%' }]} />}</View><View style={styles.stageSegment} /><View style={styles.stageSegment} /></View><View style={styles.stageLabels}><Text>S1</Text><Text>S2</Text><Text>S3</Text><Text>S4</Text></View><HomeTaskList tasks={stageAdvanced ? stageThreeTasks : tasks} onToggle={stageAdvanced ? toggleStageThreeTask : toggleTask} onSelectDifficulty={stageAdvanced ? selectStageThreeDifficulty : selectDifficulty} onOpenStrategy={openStrategy} /></View>
        <Pressable disabled={!allTasksCompleted || stageAdvanced} onPress={() => setStageAdvanced(true)} style={[styles.nextStage, (!allTasksCompleted || stageAdvanced) && !stageAdvanced && styles.nextStageInactive]}><View style={[styles.nextStageIcon, stageAdvanced && styles.nextStageIconStageThree, allTasksCompleted && !stageAdvanced && styles.nextStageIconActive]}><Ionicons name="ellipse" size={10} color={stageAdvanced ? '#5E50B6' : allTasksCompleted ? '#FFFFFF' : '#5299A4'} /></View><View style={styles.nextStageCopy}><Text style={[styles.nextStageTitle, (!allTasksCompleted || stageAdvanced) && !stageAdvanced && styles.nextStageTextInactive]}>다음 스테이지 보러 가기</Text><Text style={styles.nextStageBody}>{stageAdvanced ? 'Stage 4 · 실전 마무리(D-6 ~ D-0)' : 'Stage 3 · 문제풀이 집중(D-13 ~ D-7)'}</Text></View><Ionicons name="chevron-forward" size={20} color={allTasksCompleted || stageAdvanced ? '#56585A' : '#A1A3A5'} /></Pressable>
        <View style={styles.chatSection}><View style={styles.chatHeader}><View style={styles.chatTitleRow}><View style={styles.chatIcon}><Ionicons name="chatbubble-ellipses" size={15} color="#FFFFFF" /></View><Text style={styles.chatTitle}>루미 튜터</Text></View><Text style={styles.chatStatus}>오늘 아직 보고 안 함</Text></View><Text style={styles.chatPrompt}>자주 입력할수록 정확한 전략 리포트를 생성해요!</Text><View style={styles.chatBox}><TextInput value={message} onChangeText={setMessage} multiline maxLength={400} placeholder="오늘 공부하면서 어땠어? 막힌 거나 고민 있으면 말해줘!" placeholderTextColor="#A1A3A5" style={styles.chatInput} /><Pressable onPress={() => setMessage('')} style={styles.sendButton}><Text style={styles.sendText}>보내기</Text></Pressable></View><Text style={styles.wordCount}>{message.length}/400</Text></View>
      </ScrollView>
      <Pressable accessibilityLabel="맨 위로 이동" onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })} style={[styles.topButton, { bottom: 68 + insets.bottom }]}><AssetIcon name="up" width={40} height={40} /></Pressable>
      <HomeGnb bottomInset={insets.bottom} onReportPress={() => router.replace('/report')} onMyPagePress={() => router.replace('/MyPage' as Href)} />
      <TaskDetailBottomSheet visible={!!selectedTask} difficulty={selectedTask?.difficulty ?? null} detail={todoDetail} onClose={() => { setDetailTaskId(null); setTodoDetail(null); }} />
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' }, viewport: { flex: 1, backgroundColor: '#FFFFFF' }, content: { gap: 20, paddingHorizontal: 20, paddingTop: 8 },
  topBar: { height: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, dateInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 }, calendarIcon: { width: 28, height: 28, borderWidth: 1, borderRadius: 8, borderColor: Colors['Line.Normal.Normal'], alignItems: 'center', justifyContent: 'center' }, dateText: { color: '#3B3D3F', fontFamily: 'Pretendard-Medium', fontSize: 14, lineHeight: 20 },
  dashboard: { flexDirection: 'row', gap: 6 }, examCard: { flex: 1, minHeight: 112, gap: 4, padding: 12, borderWidth: 1, borderRadius: 16, borderColor: Colors['Line.Normal.Strong'] }, ddayBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 3, borderRadius: 8, backgroundColor: '#66BFCD' }, ddayBadgeStageThree: { backgroundColor: '#5E50B6' }, ddayText: { color: '#FFFFFF', fontFamily: 'Pretendard-SemiBold', fontSize: 12, lineHeight: 16 }, examTitle: { color: '#242628', fontFamily: 'Pretendard-SemiBold', fontSize: 16, lineHeight: 22 }, examBody: { color: '#707275', fontFamily: 'Pretendard-Regular', fontSize: 11, lineHeight: 16 },
  stageCard: { flex: 1, minHeight: 112, justifyContent: 'center', gap: 3, padding: 12, borderWidth: 1, borderRadius: 16, borderColor: Colors['Line.Normal.Normal'], backgroundColor: '#F6F8FA' }, stageLabel: { color: '#56585A', fontFamily: 'Pretendard-SemiBold', fontSize: 13, lineHeight: 18 }, stageBody: { color: '#242628', fontFamily: 'Pretendard-SemiBold', fontSize: 18, lineHeight: 24 }, progressTrack: { height: 6, overflow: 'hidden', borderRadius: 3, backgroundColor: '#ECEEF0' }, progressFill: { width: '55%', height: '100%', borderRadius: 3, backgroundColor: '#66BFCD' }, progressFillStageThree: { width: '20%', backgroundColor: '#5E50B6' }, progressLabel: { alignSelf: 'flex-end', color: '#56585A', fontFamily: 'Pretendard-Medium', fontSize: 14 },
  tutorCard: { gap: 8, padding: 14, borderWidth: 1, borderRadius: 16, borderColor: Colors['Line.Normal.Strong'], backgroundColor: '#F6F8FA' }, tutorTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 }, tutorIcon: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#66BFCD' }, tutorIconStageThree: { backgroundColor: '#5E50B6' }, tutorTitle: { color: '#3B3D3F', fontFamily: 'Pretendard-SemiBold', fontSize: 15, lineHeight: 22 }, tutorTitleStageThree: { color: '#5E50B6' }, tutorBody: { color: '#56585A', fontFamily: 'Pretendard-Regular', fontSize: 13, lineHeight: 20 },
  section: { gap: 10 }, stageChip: { alignSelf: 'stretch', alignItems: 'center', paddingVertical: 4, borderWidth: 1, borderRadius: 16, borderColor: Colors['Line.Primary.Normal'], backgroundColor: Colors['Fill.Primary.Assistive'] }, stageChipStageThree: { borderColor: '#5E50B6', backgroundColor: '#EFECFF' }, stageChipText: { color: '#5299A4', fontFamily: 'Pretendard-SemiBold', fontSize: 11, lineHeight: 16 }, stageChipTextStageThree: { color: '#5E50B6' }, sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, sectionTitle: { color: '#242628', fontFamily: 'Pretendard-SemiBold', fontSize: 17, lineHeight: 24 }, sectionPeriod: { color: '#56585A', fontFamily: 'Pretendard-Regular', fontSize: 14, lineHeight: 20 }, stageProgress: { flexDirection: 'row', gap: 4 }, stageSegment: { flex: 1, height: 6, overflow: 'hidden', borderRadius: 3, backgroundColor: '#ECEEF0' }, stageSegmentFill: { height: '100%', borderRadius: 3, backgroundColor: '#3385FF' }, stageSegmentFillStageThree: { backgroundColor: '#5E50B6' }, stageLabels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 2 },
  nextStage: { minHeight: 70, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, backgroundColor: '#F6F8FA' }, nextStageInactive: { opacity: 0.58 }, nextStageIcon: { width: 16, height: 28, alignItems: 'center', justifyContent: 'center' }, nextStageIconActive: { backgroundColor: '#5299A4' }, nextStageIconStageThree: { backgroundColor: 'transparent' }, nextStageCopy: { flex: 1 }, nextStageTitle: { color: '#3B3D3F', fontFamily: 'Pretendard-SemiBold', fontSize: 16, lineHeight: 24 }, nextStageTextInactive: { color: '#707275' }, nextStageBody: { color: '#8B8D8F', fontFamily: 'Pretendard-Regular', fontSize: 11, lineHeight: 16 },
  chatSection: { gap: 6 }, chatHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, chatTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 }, chatIcon: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#5299A4' }, chatTitle: { color: '#3B3D3F', fontFamily: 'Pretendard-SemiBold', fontSize: 15, lineHeight: 22 }, chatStatus: { color: '#A1A3A5', fontFamily: 'Pretendard-Regular', fontSize: 10, lineHeight: 14 }, chatPrompt: { color: '#5299A4', fontFamily: 'Pretendard-Medium', fontSize: 12, lineHeight: 18 }, chatBox: { minHeight: 142, padding: 12, borderWidth: 1, borderRadius: 14, borderColor: Colors['Line.Normal.Strong'], backgroundColor: '#FFFFFF' }, chatInput: { minHeight: 82, padding: 0, color: '#3B3D3F', fontFamily: 'Pretendard-Regular', fontSize: 14, lineHeight: 20, textAlignVertical: 'top' }, sendButton: { alignSelf: 'flex-end', paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderRadius: 14, borderColor: Colors['Line.Primary.Normal'], backgroundColor: Colors['Fill.Primary.Assistive'] }, sendText: { color: '#5299A4', fontFamily: 'Pretendard-Medium', fontSize: 12, lineHeight: 18 }, wordCount: { alignSelf: 'flex-end', color: '#A1A3A5', fontFamily: 'Pretendard-Regular', fontSize: 11, lineHeight: 16 },
  topButton: { position: 'absolute', right: 16, width: 48, height: 48, borderWidth: 1, borderRadius: 16, borderColor: Colors['Line.Primary.Normal'], alignItems: 'center', justifyContent: 'center', backgroundColor: '#5299A4', elevation: 3 },
});
