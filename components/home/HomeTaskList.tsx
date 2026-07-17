import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DifficultyScore } from '../figma';
import { AssetIcon } from '../ui';
import { Colors } from '../../constants/colors';
import { Difficulty, HomeTask } from './types';

const SUBJECT_COLORS: Record<string, string> = {
  '확률과통계': '#3385FF', '언어와매체': '#F04588', '확률통계': '#58A51F', '프랑스어문화': '#5299A4', '한국사': '#7B60C9',
};

interface HomeTaskListProps {
  tasks: HomeTask[];
  onToggle: (taskId: string) => void;
  onSelectDifficulty: (taskId: string, difficulty: Difficulty) => void;
  onOpenStrategy: (task: HomeTask) => void;
}

export function HomeTaskList({ tasks, onToggle, onSelectDifficulty, onOpenStrategy }: HomeTaskListProps) {
  return <View style={styles.list}>{tasks.map(task => {
    const canOpen = !!task.strategyAvailable;
    return <View key={task.id} style={styles.taskGroup}>
      <View style={styles.taskRow}>
        <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: task.completed }} hitSlop={8} onPress={() => onToggle(task.id)} style={[styles.checkbox, task.completed && styles.checkboxChecked]}>
          {task.completed && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
        </Pressable>
        {canOpen ? <Pressable accessibilityRole="button" accessibilityLabel={`${task.title} 상세 보기`} onPress={() => onOpenStrategy(task)} style={[styles.taskContent, styles.taskRowInteractive]}><View style={styles.taskCopy}><Text style={[styles.subject, { color: SUBJECT_COLORS[task.subject] ?? Colors['Fill.Primary.Normal'] }]}>{task.subject}</Text><Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>{task.title}</Text></View><Ionicons name="chevron-forward" size={20} color="#56585A" /></Pressable> : <View style={styles.taskContent}><View style={styles.taskCopy}><Text style={[styles.subject, { color: SUBJECT_COLORS[task.subject] ?? Colors['Fill.Primary.Normal'] }]}>{task.subject}</Text><Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>{task.title}</Text></View><Ionicons name="chevron-forward" size={20} color="#A1A3A5" /></View>}
      </View>
      {task.completed && <View style={styles.difficultyArea}>
        <View style={styles.difficultyPromptRow}><AssetIcon name="difficultyLevel" width={20} height={20} /><Text style={styles.difficultyPrompt}>맞춤 전략용 난이도를 체크해봐요</Text></View>
        <View style={styles.difficultyChoices}>{([1, 2, 3, 4, 5] as Difficulty[]).map(score => {
          const selected = task.difficulty === score;
          return <Pressable key={score} accessibilityRole="button" accessibilityLabel={`난이도 ${score}`} accessibilityState={{ selected }} onPress={() => onSelectDifficulty(task.id, score)} style={styles.difficultyChoice}><AssetIcon name={selected ? 'difficultySelected' : 'difficultyDefault'} width={28} height={28} /></Pressable>;
        })}{task.difficulty && <DifficultyScore score={task.difficulty} />}</View>
      </View>}
    </View>;
  })}</View>;
}

const styles = StyleSheet.create({
  list: { overflow: 'hidden', borderWidth: 1, borderRadius: 16, borderColor: Colors['Line.Normal.Strong'], backgroundColor: '#FFFFFF' },
  taskGroup: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors['Line.Normal.Normal'] },
  taskRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 10 },
  checkbox: { width: 24, height: 24, borderWidth: 1, borderRadius: 8, borderColor: Colors['Line.Normal.Strong'], alignItems: 'center', justifyContent: 'center' }, checkboxChecked: { borderColor: Colors['Fill.Primary.Normal'], backgroundColor: Colors['Fill.Primary.Normal'] },
  taskContent: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'stretch' }, taskRowInteractive: { justifyContent: 'center' }, taskCopy: { flex: 1, gap: 1 }, subject: { fontFamily: 'Pretendard-Medium', fontSize: 12, lineHeight: 18 }, taskTitle: { color: '#242628', fontFamily: 'Pretendard-Medium', fontSize: 14, lineHeight: 22 }, taskTitleCompleted: { color: '#8B8D8F', textDecorationLine: 'line-through' },
  difficultyArea: { gap: 8, paddingHorizontal: 46, paddingTop: 4, paddingBottom: 12, backgroundColor: '#F6F8FA' }, difficultyPromptRow: { flexDirection: 'row', alignItems: 'center', gap: 4 }, difficultyPrompt: { color: '#5299A4', fontFamily: 'Pretendard-Medium', fontSize: 12, lineHeight: 18 }, difficultyChoices: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  difficultyChoice: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
});
