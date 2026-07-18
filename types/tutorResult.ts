export type TutorResultPriority = 'urgent' | 'caution' | 'good';

export interface TutorContentStyleInput {
  examFocus: string[];
  essayRatioPercent: number;
  difficultyLevel: string;
  teacherMemo?: string;
  mockExamSimilarity?: string;
  priorityMaterial?: string;
  textbookMemorizationImportance?: number;
  supplementaryVariation?: string;
  externalPassageFrequency?: string;
  memorizationVsApplication?: string;
  graphProblemFrequency?: string;
  calculationProblemRatio?: string;
  conceptVsPrinciple?: string;
}

export interface TutorMaterialsInput {
  textbookPublisher?: string;
  problemBookName?: string;
  printPageCount?: string;
}

export interface TutorImageUpload {
  id: string;
  name: string;
  uri: string;
  mimeType: 'image/jpeg' | 'image/png';
}

export interface TutorResultSubjectInput {
  id: string;
  name: string;
  detail: string;
  status: 'done' | 'anxious' | 'empty';
  progress?: string;
  range?: string;
  detailSubject?: string;
  targetGrade?: string;
  prevGrade?: string;
  confidenceLevel?: string;
  weakPoint?: string;
  materials?: string[];
  materialDetails?: TutorMaterialsInput;
  printImages?: TutorImageUpload[];
  pastExamImages?: TutorImageUpload[];
  contentStyle?: TutorContentStyleInput;
  scheduleSlots?: string[];
}

export interface GenerateTutorResultRequest {
  examType: string;
  semester: string;
  examPeriod: string;
  goal: string;
  examDates: Record<string, string[]>;
  subjects: TutorResultSubjectInput[];
}

export interface TutorResultSubjectResponse {
  id: string;
  name: string;
  summary: string;
  progress: number;
  priority: TutorResultPriority;
  tasks: { label: string; body: string }[];
}

export interface TutorResultExamResponse {
  dDay: string;
  date: string;
  subject: string;
  priority: TutorResultPriority;
}

export interface TutorResultWeekResponse {
  id?: string;
  label?: string;
  tabs?: string[];
  selectedIndex?: number;
  title: string;
  dateRange: string;
  badge: string;
  goal: string;
  exams?: TutorResultExamResponse[];
  subjectTasks?: Record<string, { label: string; body: string }[]>;
}

export interface TutorResultStrategyResponse {
  subjectId: string;
  targetGradeLabel: string;
  feedback: { label: string; body: string }[];
  weeklyInsights?: string[];
  actionTitle?: string;
  errorProcess: { title: string; body: string }[];
  books: {
    rank: string;
    title: string;
    body: string;
    priority: TutorResultPriority;
  }[];
  successCase: {
    tags: string[];
    body: string;
    profile: string;
    result: string;
  };
}

export interface TutorResultResponse {
  id: string;
  generatedAt: string;
  dDayLabel: string;
  dailyGoalLabel: string;
  planDurationLabel: string;
  diagnosis: string;
  subjects: TutorResultSubjectResponse[];
  summaryStrategies: { title: string; body: string }[];
  week: TutorResultWeekResponse;
  weeks?: TutorResultWeekResponse[];
  exams: TutorResultExamResponse[];
  strategy: TutorResultStrategyResponse;
  strategies?: TutorResultStrategyResponse[];
  sourceRequest?: GenerateTutorResultRequest;
}

export type ResultSubjectTone = 'red' | 'orange' | 'green';

export interface TutorResultSubjectView {
  id: string;
  number: string;
  title: string;
  body: string;
  progress: number;
  tone: ResultSubjectTone;
  tagLabel: string;
  tasks: { label: string; body: string }[];
}

export interface TutorResultExamView {
  dDay: string;
  date: string;
  subject: string;
  tone: ResultSubjectTone;
}

export interface TutorResultWeekView {
  id: string;
  label: string;
  title: string;
  dateRange: string;
  badge: string;
  goal: string;
  exams: TutorResultExamView[];
  subjectTasks: Record<string, { label: string; body: string }[]>;
}

export type TutorResultStrategyView = Omit<TutorResultStrategyResponse, 'books'> & {
  books: {
    rank: string;
    title: string;
    body: string;
    tone: ResultSubjectTone;
  }[];
};

export interface TutorResultViewModel {
  id: string;
  generatedAt: string;
  examLabel: string;
  goal: string;
  dDayLabel: string;
  dailyGoalLabel: string;
  planDurationLabel: string;
  diagnosis: string;
  subjects: TutorResultSubjectView[];
  summaryStrategies: { title: string; body: string }[];
  weeks: TutorResultWeekView[];
  strategies: TutorResultStrategyView[];
}
