import React from 'react';
import { Text, View } from 'react-native';
import { Tag } from '../ui';
import { ReportNumberBadge } from './ReportNumberBadge';
import { getBadgeVariant, getProgressToneStyle, getTagVariant, type RankedSubject } from './resultModel';
import { resultStyles } from './resultStyles';
import { ResultListCard } from './ResultNavigationComponents';
import { type TutorResultViewModel } from '../../types/tutorResult';

const styles = resultStyles;

export function ResultSummaryScreen({ data, onOpenPlan }: { data: TutorResultViewModel; onOpenPlan: () => void }) {
  const topSubject = data.subjects[0]?.title ?? '';

  return (
    <View style={styles.screenStack}>
      <SummaryHeroCard
        chips={[data.examLabel, data.dDayLabel, `${data.subjects.length}과목`]}
        title={data.goal ? `${data.goal} 목표까지\n${data.planDurationLabel} 맞춤 전략이에요` : `이번 시험까지\n${data.planDurationLabel} 맞춤 전략이에요`}
        stats={[
          { title: '1순위 과목', body: topSubject },
          { title: '하루 목표', body: data.dailyGoalLabel },
          { title: '단계 플랜', body: data.planDurationLabel },
        ]}
      />

      <InfoCallout
        label="AI 한줄 진단"
        body={data.diagnosis}
      />

      <View style={styles.sectionStack}>
        <Text style={styles.sectionTitle}>이번 시험 과목 중요도</Text>
        {data.subjects.map(subject => (
          <PriorityCard key={subject.number} subject={subject} />
        ))}
      </View>

      <StrategyDirectionCard items={data.summaryStrategies} onOpenPlan={onOpenPlan} />
    </View>
  );
}

function SummaryHeroCard({
  chips,
  stats,
  title,
}: {
  chips: string[];
  stats: { title: string; body: string }[];
  title: string;
}) {
  return (
    <View style={styles.summaryHero}>
      <View style={styles.chipRow}>
        {chips.map(chip => (
          <View key={chip} style={styles.resultChip}>
            <Text style={styles.resultChipText}>{chip}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.summaryTitle}>{title}</Text>
      <View style={styles.statBox}>
        {stats.map((stat, index) => (
          <View key={stat.title} style={styles.statItem}>
            <Text style={styles.statTitle}>{stat.title}</Text>
            <Text style={styles.statBody} numberOfLines={1}>{stat.body}</Text>
            {index < stats.length - 1 && <View style={styles.statDivider} />}
          </View>
        ))}
      </View>
      <View style={styles.feedbackRow}>
        <View style={styles.feedbackDot} />
        <Text style={styles.feedbackText}>비슷한 상황에서 목표를 달성한 합격 선배 사례를 함께 반영했어요</Text>
      </View>
    </View>
  );
}

function InfoCallout({ body, label }: { body: string; label: string }) {
  return (
    <View style={styles.callout}>
      <Tag label={label} size="S" variant="Primary" />
      <Text style={styles.calloutBody}>{body}</Text>
    </View>
  );
}

function PriorityCard({ subject }: { subject: RankedSubject }) {
  return (
    <View style={styles.priorityCard}>
      <View style={styles.priorityHeader}>
        <View style={styles.priorityTitleRow}>
          <ReportNumberBadge
            number={subject.number}
            variant={getBadgeVariant(subject.tone)}
          />
          <Text style={styles.priorityTitle} numberOfLines={1}>{subject.title}</Text>
        </View>
        <Tag label={subject.tagLabel} size="S" variant={getTagVariant(subject.tone)} />
      </View>
      <View style={styles.progressBox}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              getProgressToneStyle(subject.tone),
              { width: `${subject.progress}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{subject.progress}%</Text>
      </View>
      <Text style={styles.priorityBody}>{subject.body}</Text>
    </View>
  );
}

function StrategyDirectionCard({ items, onOpenPlan }: { items: { title: string; body: string }[]; onOpenPlan: () => void }) {
  return (
    <ResultListCard
      title="3주 전략 방향"
      actionLabel="주차별 전략 보기"
      items={items}
      onAction={onOpenPlan}
    />
  );
}
