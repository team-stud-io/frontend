import {
  type GenerateTutorResultRequest,
  type ResultSubjectTone,
  type TutorResultPriority,
  type TutorResultResponse,
  type TutorResultViewModel,
} from '../../types/tutorResult';

const PRIORITY_VIEW: Record<
  TutorResultPriority,
  { tone: ResultSubjectTone; label: string }
> = {
  urgent: { tone: 'red', label: '긴급' },
  caution: { tone: 'orange', label: '주의' },
  good: { tone: 'green', label: '양호' },
};

export function adaptTutorResult(
  request: GenerateTutorResultRequest,
  response: TutorResultResponse
): TutorResultViewModel {
  const subjects = response.subjects.map((subject, index) => ({
    id: subject.id,
    number: `${index + 1}`,
    title: subject.name,
    body: subject.summary,
    progress: subject.progress,
    tone: PRIORITY_VIEW[subject.priority].tone,
    tagLabel: PRIORITY_VIEW[subject.priority].label,
    tasks: subject.tasks,
  }));
  const fallbackExams = response.exams.map(exam => ({
    dDay: exam.dDay,
    date: exam.date,
    subject: exam.subject,
    tone: PRIORITY_VIEW[exam.priority].tone,
  }));
  const fallbackSubjectTasks = Object.fromEntries(subjects.map(subject => [subject.id, subject.tasks]));
  const responseWeeks = response.weeks?.length
    ? response.weeks
    : (response.week.tabs?.length ? response.week.tabs : ['1주차']).map((label, index) => ({
        ...response.week,
        id: `week-${index + 1}`,
        label,
      }));
  const responseStrategies = response.strategies?.length
    ? response.strategies
    : subjects.map(subject => ({ ...response.strategy, subjectId: subject.id }));

  return {
    id: response.id,
    generatedAt: response.generatedAt,
    examLabel: `${request.semester} ${request.examPeriod}`.trim(),
    goal: request.goal,
    dDayLabel: response.dDayLabel,
    dailyGoalLabel: response.dailyGoalLabel,
    planDurationLabel: response.planDurationLabel,
    diagnosis: response.diagnosis,
    subjects,
    summaryStrategies: response.summaryStrategies,
    weeks: responseWeeks.map((week, index) => ({
      id: week.id ?? `week-${index + 1}`,
      label: week.label ?? `${index + 1}주차`,
      title: week.title,
      dateRange: week.dateRange,
      badge: week.badge,
      goal: week.goal,
      exams: week.exams?.map(exam => ({
        dDay: exam.dDay,
        date: exam.date,
        subject: exam.subject,
        tone: PRIORITY_VIEW[exam.priority].tone,
      })) ?? fallbackExams,
      subjectTasks: week.subjectTasks ?? fallbackSubjectTasks,
    })),
    strategies: responseStrategies.map(strategy => ({
      ...strategy,
      books: strategy.books.map(book => ({
        rank: book.rank,
        title: book.title,
        body: book.body,
        tone: PRIORITY_VIEW[book.priority].tone,
      })),
    })),
  };
}
