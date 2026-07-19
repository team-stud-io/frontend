import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Tag } from '../ui';
import { getTagVariant, type PriorityTone, type RankedSubject } from './resultModel';
import { ResultListCard, UnderbarTabs } from './ResultNavigationComponents';
import { resultStyles } from './resultStyles';
import { type TutorResultViewModel } from '../../types/tutorResult';

const styles = resultStyles;

export function ResultStrategyScreen({
  data,
  errorProcessExpanded,
  onToggleErrorProcess,
  selectedSubjectId,
}: {
  data: TutorResultViewModel;
  errorProcessExpanded: boolean;
  onToggleErrorProcess: () => void;
  selectedSubjectId: string;
}) {
  const subject = data.subjects.find(item => item.id === selectedSubjectId)
    ?? data.subjects[0];
  const strategy = data.strategies.find(item => item.subjectId === subject?.id)
    ?? data.strategies[0];

  if (!subject || !strategy) return null;
  const canExpand = strategy.errorProcess.length > 3;
  const errorProcess = errorProcessExpanded ? strategy.errorProcess : strategy.errorProcess.slice(0, 3);
  const hasSuccessCase = strategy.successCase.tags.length > 0
    || Boolean(strategy.successCase.body || strategy.successCase.profile || strategy.successCase.result);

  return (
    <View style={styles.screenStack}>
      <SubjectHeaderCard subject={subject} targetGradeLabel={strategy.targetGradeLabel} />

      {strategy.feedback.length > 0 && (
        <View style={styles.sectionStack}>
          <Text style={styles.sectionTitle}>이번 시험 과목 중요도</Text>
          {strategy.feedback.map(item => (
            <FeedbackCard key={item.label} label={item.label} body={item.body} />
          ))}
        </View>
      )}

      {strategy.errorProcess.length > 0 && (
        <ResultListCard
          title={strategy.actionTitle ?? '오답 처리 프로세스'}
          actionLabel={canExpand ? (errorProcessExpanded ? '접기' : '더보기') : undefined}
          items={errorProcess}
          onAction={canExpand ? onToggleErrorProcess : undefined}
        />
      )}

      {strategy.weeklyInsights?.length ? (
        <ResultListCard
          title="주간 인사이트"
          items={strategy.weeklyInsights.map((body, index) => ({ title: `${index + 1}`, body }))}
        />
      ) : null}

      {strategy.books.length > 0 && (
        <View style={styles.sectionStack}>
          <View style={styles.iconTitleRow}>
            <Text style={styles.iconTitle}>△</Text>
            <Text style={styles.sectionTitle}>추천 교재 순서</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ddayRow}>
            {strategy.books.map(book => (
              <BookCard key={`${book.rank}-${book.title}`} {...book} />
            ))}
          </ScrollView>
        </View>
      )}

      {hasSuccessCase && (
        <View style={styles.sectionStack}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconTitleRow}>
              <Text style={styles.iconTitle}>⌁</Text>
              <Text style={styles.sectionTitle}>비슷한 상황의 합격 선배 케이스</Text>
            </View>
            <View style={styles.miniCharacter}>
              <View style={styles.miniEye} />
              <View style={styles.miniEye} />
            </View>
          </View>
          <SuccessCaseCard data={strategy.successCase} />
        </View>
      )}
    </View>
  );
}

export function SubjectTabs({ subjects, selectedSubjectId, onSelect }: { subjects: RankedSubject[]; selectedSubjectId: string; onSelect: (subjectId: string) => void }) {
  const selectedIndex = Math.max(0, subjects.findIndex(subject => subject.id === selectedSubjectId));
  return (
    <UnderbarTabs
      tabs={subjects.map(subject => subject.title)}
      selectedIndex={selectedIndex}
      horizontal
      onSelect={index => onSelect(subjects[index]?.id ?? subjects[0]?.id ?? '')}
    />
  );
}

function SubjectHeaderCard({
  subject,
  targetGradeLabel,
}: {
  subject: RankedSubject;
  targetGradeLabel: string;
}) {
  return (
    <View style={styles.subjectHeaderCard}>
      <View style={styles.planSummaryCopy}>
        <Text style={styles.planSummaryTitle}>{subject.title}</Text>
        <Text style={styles.planSummaryBody}>{targetGradeLabel ? `${targetGradeLabel} · ` : ''}현재 진도 {subject.progress}%</Text>
      </View>
      <Tag label={subject.tagLabel} size="M" variant={getTagVariant(subject.tone)} />
    </View>
  );
}

function FeedbackCard({ body, label }: { body: string; label: string }) {
  return (
    <View style={styles.feedbackCard}>
      <Tag label={label} size="M" variant="Primary" />
      <Text style={styles.feedbackCardBody}>{body}</Text>
    </View>
  );
}

function BookCard({
  body,
  rank,
  title,
  tone,
}: {
  body: string;
  rank: string;
  title: string;
  tone: PriorityTone;
}) {
  return (
    <View style={styles.bookCard}>
      <Tag label={rank} size="S" variant={getTagVariant(tone)} />
      <Text style={styles.bookTitle}>{title}</Text>
      <Text style={styles.bookBody}>{body}</Text>
    </View>
  );
}

function SuccessCaseCard({ data }: { data: TutorResultViewModel['strategies'][number]['successCase'] }) {
  return (
    <View style={styles.successCaseCard}>
      <View style={styles.successTags}>
        {data.tags.map((tag, index) => (
          <View key={tag} style={index === 0 ? styles.smallWhiteTag : styles.smallWhiteTagWide}>
            <Text style={styles.smallWhiteTagText}>{tag}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.successBody}>{data.body}</Text>
      <Text style={styles.successProfile}>{data.profile}</Text>
      <View style={styles.successResultTag}>
        <Text style={styles.successResultText}>{data.result}</Text>
      </View>
    </View>
  );
}
