import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Tag } from '../ui';
import { getProgressToneStyle, getTagVariant, type PriorityTone, type RankedSubject } from './resultModel';
import { resultStyles } from './resultStyles';
import { UnderbarTabs } from './ResultNavigationComponents';
import { type TutorResultViewModel, type TutorResultWeekView } from '../../types/tutorResult';

const styles = resultStyles;

export function ResultPlanScreen({
  data,
  onOpenStrategy,
  selectedWeekIndex,
}: {
  data: TutorResultViewModel;
  onOpenStrategy: () => void;
  selectedWeekIndex: number;
}) {
  const week = data.weeks[selectedWeekIndex] ?? data.weeks[0];
  if (!week) return null;

  return (
    <View style={styles.screenStack}>
      <PlanWeekSummaryCard week={week} />

      <TextCard
        showButton
        title="이번 주 목표"
        body={week.goal}
        onPress={onOpenStrategy}
      />

      <View style={styles.sectionStack}>
        <Text style={styles.sectionTitle}>시험 D-day</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ddayRow}>
          {week.exams.map(item => (
            <DdayCard key={`${item.date}-${item.subject}`} item={item} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.sectionStack}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>과목별 전략</Text>
          <Pressable accessibilityRole="button" hitSlop={8} onPress={onOpenStrategy} style={styles.listActionButton}>
            <Text style={styles.listAction}>더보기</Text>
            <Text style={styles.listActionIcon}>›</Text>
          </Pressable>
        </View>
        {data.subjects.slice(0, 5).map(subject => (
          <TodoStrategyCard
            key={`plan-${subject.number}`}
            subject={subject}
            tasks={week.subjectTasks[subject.id] ?? subject.tasks}
          />
        ))}
      </View>
    </View>
  );
}

export function WeekTabs({ tabs, selectedIndex, onSelect }: { tabs: string[]; selectedIndex: number; onSelect: (index: number) => void }) {
  return <UnderbarTabs tabs={tabs} selectedIndex={selectedIndex} onSelect={onSelect} />;
}

function PlanWeekSummaryCard({ week }: { week: TutorResultWeekView }) {
  return (
    <View style={styles.planSummaryCard}>
      <View style={styles.planSummaryCopy}>
        <Text style={styles.planSummaryTitle}>{week.title}</Text>
        <Text style={styles.planSummaryBody}>{week.dateRange}</Text>
      </View>
      <Tag label={week.badge} size="M" variant="PrimaryDark" />
    </View>
  );
}

function TextCard({
  body,
  onPress,
  showButton,
  title,
}: {
  body: string;
  onPress?: () => void;
  showButton?: boolean;
  title: string;
}) {
  return (
    <View style={styles.textCard}>
      <View style={styles.textCardTitleRow}>
        <Text style={styles.flashIcon}>⚡</Text>
        <Text style={styles.textCardTitle}>{title}</Text>
      </View>
      <Text style={styles.textCardBody}>{body}</Text>
      {showButton && (
        <Pressable accessibilityRole="button" onPress={onPress} style={styles.inlineButton}>
          <Text style={styles.inlineButtonText}>과목별 전략 보러가기</Text>
        </Pressable>
      )}
    </View>
  );
}

function DdayCard({
  item,
}: {
  item: { date: string; dDay: string; subject: string; tone: PriorityTone };
}) {
  return (
    <View style={styles.ddayCard}>
      <Tag label={item.dDay} size="M" variant={getTagVariant(item.tone)} />
      <Text style={styles.ddayDate}>{item.date}</Text>
      <Text style={styles.ddaySubject}>{item.subject}</Text>
    </View>
  );
}

function TodoStrategyCard({
  subject,
  tasks,
}: {
  subject: RankedSubject;
  tasks: { label: string; body: string }[];
}) {
  return (
    <View style={styles.todoCard}>
      <View style={styles.priorityHeader}>
        <View style={styles.bulletTitleRow}>
          <View style={[styles.bullet, getProgressToneStyle(subject.tone)]} />
          <Text style={styles.priorityTitle}>{subject.title}</Text>
        </View>
        <Tag label={subject.tagLabel} size="S" variant={getTagVariant(subject.tone)} />
      </View>
      <View style={styles.todoList}>
        {tasks.map(task => (
          <View key={task.label} style={styles.todoItem}>
            <View style={styles.smallWhiteTag}>
              <Text style={styles.smallWhiteTagText}>{task.label}</Text>
            </View>
            <Text style={styles.todoBody}>{task.body}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
