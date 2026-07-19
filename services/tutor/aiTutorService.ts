import { apiRequest, isBackendConfigured } from '../apiClient';
import type { GenerateTutorResultRequest, TutorResultResponse } from '../../types/tutorResult';
import { tutorGenerationStore, type PendingTutorGeneration } from './tutorGenerationStore';
import { tutorSessionStore } from './tutorSessionStore';

type SubjectDto = {
  subjectTutorId: number;
  subjectCategory: string;
  customSubjectName?: string | null;
  examDate?: string | null;
};

type GenerationJob = {
  jobId: number;
  status: string;
  strategyId?: number;
  pollingIntervalMs?: number;
  errorMessage?: string | null;
};

type StrategyDto = {
  strategyId: number;
  title?: string;
  saved?: boolean;
  examBadges?: string[];
  summaryMetrics?: { label: string; value: string }[];
  stats?: { totalStudyMinutes?: number };
  aiDiagnosis?: string;
  insights?: string[];
  strategyDirections?: string[];
  subjectCards?: Array<{
    subjectTutorId: number;
    subjectName: string;
    statusColor?: 'red' | 'orange' | 'green';
    urgencyLevel?: string;
    progressPercent?: number;
    description?: string;
  }>;
};

type DdayPlanDto = {
  weekNumber: number;
  weekTitle: string;
  periodText: string;
  statusBadgeText: string;
  weeklyGoal: string;
  examDdays?: Array<{ dDay: string; dateText: string; subjectName: string }>;
  subjectPlans?: Array<{
    subjectTutorId: number;
    subjectName: string;
    statusColor?: 'red' | 'orange' | 'green';
    tasks?: Array<{ label: string; content: string }>;
  }>;
};

type SubjectStrategyDto = {
  subjectTutorId: number;
  faqs?: Array<{ question: string; answer: string }>;
  weeklyReviewInsights?: string[];
  nextWeekActions?: string[];
  shortageAnalysis?: {
    title?: string;
    detail?: string;
    improvementDirection?: string;
  };
};

// 백엔드는 WAITING/ANALYZING/COMPLETED/FAILED 또는 한글 상태값을 반환한다.
const COMPLETE_STATUSES = new Set(['COMPLETED', 'COMPLETE', 'SUCCEEDED', 'SUCCESS', '완료']);
const FAILED_STATUSES = new Set(['FAILED', 'FAILURE', 'ERROR', '실패']);
const MAX_POLLING_MS = 90_000;

function dateForSubject(examDates: Record<string, string[]>, name: string) {
  return Object.entries(examDates).find(([, subjects]) => subjects.includes(name))?.[0] ?? null;
}

function toScheduleBlocks(slots: string[]) {
  return slots.flatMap(slot => {
    const separator = slot.lastIndexOf('-');
    if (separator < 1) return [];
    const dayOfWeek = slot.slice(0, separator);
    const hour = Number(slot.slice(separator + 1));
    if (!Number.isFinite(hour)) return [];
    return [{
      dayOfWeek,
      startTime: `${String(hour % 24).padStart(2, '0')}:00`,
      endTime: `${String((hour + 1) % 24).padStart(2, '0')}:00`,
    }];
  });
}

function toContentStyle(subject: DraftSubject) {
  const style = subject.contentStyle;
  return {
    examFocus: style?.examFocus ?? [],
    essayRatioPercent: style?.essayRatioPercent ?? null,
    difficultyLevel: style?.difficultyLevel ?? null,
    teacherMemo: style?.teacherMemo ?? null,
    mockExamSimilarity: style?.mockExamSimilarity ?? null,
    priorityMaterial: style?.priorityMaterial ?? null,
    textbookMemorizationImportance: style?.textbookMemorizationImportance ?? null,
    supplementaryVariation: style?.supplementaryVariation ?? null,
    externalPassageFrequency: style?.externalPassageFrequency ?? null,
    memorizationVsApplication: style?.memorizationVsApplication ?? null,
    graphProblemFrequency: style?.graphProblemFrequency ?? null,
    calculationProblemRatio: style?.calculationProblemRatio ?? null,
    conceptVsPrinciple: style?.conceptVsPrinciple ?? null,
  };
}

async function uploadImages(
  subjectId: number,
  imageType: '프린트사진' | '기출_족보',
  images: DraftSubject['printImages'],
  signal?: AbortSignal,
) {
  for (const image of images ?? []) {
    const formData = new FormData();
    formData.append('file', {
      uri: image.uri,
      name: image.name,
      type: image.mimeType,
    } as unknown as Blob);
    formData.append('image_type', imageType);
    await apiRequest(`/subjects/${subjectId}/materials/images`, {
      method: 'POST', body: formData, signal,
    });
  }
}

type DraftSubject = GenerateTutorResultRequest['subjects'][number] & {
  subjectCategory?: string;
  customSubjectName?: string | null;
};

const SUBJECT_CATEGORY_ALIASES: Record<string, string> = {
  '사회(탐구)': '사회탐구',
  '과학(탐구)': '과학탐구',
};

const SERVER_SUBJECT_CATEGORIES = new Set([
  '국어', '수학', '영어', '사회탐구', '과학탐구', '한국사', '직접입력',
]);

function toApiSubjectName(subject: DraftSubject) {
  const candidate = subject.subjectCategory ?? subject.name;
  const subjectCategory = SUBJECT_CATEGORY_ALIASES[candidate]
    ?? (SERVER_SUBJECT_CATEGORIES.has(candidate) ? candidate : '직접입력');
  return {
    subjectCategory,
    customSubjectName: subject.customSubjectName ?? (subjectCategory === '직접입력' ? subject.name : null),
  };
}

function matchesSubject(subject: DraftSubject, serverSubject: SubjectDto) {
  const apiSubject = toApiSubjectName(subject);
  return serverSubject.subjectCategory === apiSubject.subjectCategory
    && (serverSubject.customSubjectName ?? null) === apiSubject.customSubjectName;
}

function toPriority(color?: string): 'urgent' | 'caution' | 'good' {
  if (color === 'red') return 'urgent';
  if (color === 'orange') return 'caution';
  return 'good';
}

function wait(milliseconds: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, milliseconds);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Polling stopped', 'AbortError'));
    }, { once: true });
  });
}

export class AiTutorService {
  async generate(request: GenerateTutorResultRequest, signal?: AbortSignal): Promise<TutorResultResponse> {
    const pending = await tutorGenerationStore.load();
    if (pending) return this.resumeGeneration(pending, signal);

    const subjectWithoutRange = request.subjects.find(subject => !subject.range?.trim());
    if (subjectWithoutRange) {
      throw new Error(`${subjectWithoutRange.name}의 시험 범위를 입력해 주세요.`);
    }
    const session = await apiRequest<{ sessionId: number }>('/ai-tutor-sessions', {
      method: 'POST',
      body: JSON.stringify({
        examType: request.examType,
        semester: request.semester || null,
        examRound: request.examPeriod || null,
        goal: request.goal || null,
      }),
      signal,
    });
    await tutorSessionStore.save(session.sessionId);
    const assignments = request.subjects
      .map(subject => ({ subject, date: dateForSubject(request.examDates, subject.name) }))
      .filter((item): item is { subject: GenerateTutorResultRequest['subjects'][number]; date: string } => Boolean(item.date))
      .map(({ subject, date }) => ({ date, ...toApiSubjectName(subject) }));
    const subjectByDraftId = new Map<string, SubjectDto>();
    if (assignments.length) {
      const createdWithDates = await apiRequest<SubjectDto[]>(`/ai-tutor-sessions/${session.sessionId}/exam-dates`, {
        method: 'PUT', body: JSON.stringify({ assignments }), signal,
      });
      for (const subject of request.subjects) {
        if (!dateForSubject(request.examDates, subject.name)) continue;
        const serverSubject = createdWithDates.find(item => matchesSubject(subject, item));
        if (!serverSubject) {
          throw new Error(`${subject.name} 과목의 시험일 저장 결과를 확인하지 못했습니다.`);
        }
        subjectByDraftId.set(subject.id, serverSubject);
      }
    }

    // 시험일이 없는 과목만 보조 생성 API를 사용한다.
    for (const subject of request.subjects) {
      if (subjectByDraftId.has(subject.id)) continue;
      const created = await apiRequest<SubjectDto>(`/ai-tutor-sessions/${session.sessionId}/subjects`, {
        method: 'POST', body: JSON.stringify(toApiSubjectName(subject)), signal,
      });
      subjectByDraftId.set(subject.id, created);
    }

    for (const subject of request.subjects) {
      const serverSubject = subjectByDraftId.get(subject.id);
      if (!serverSubject) continue;
      await apiRequest(`/subjects/${serverSubject.subjectTutorId}/scope`, {
        method: 'PUT',
        body: JSON.stringify({
          detailSubject: subject.detailSubject ?? null,
          examRange: subject.range ?? '',
          progressPercent: Number.parseInt(subject.progress ?? '0', 10) || 0,
          targetGrade: subject.targetGrade ?? null,
          prevGrade: subject.prevGrade ?? null,
          confidenceLevel: subject.confidenceLevel ?? null,
          weakPoints: subject.weakPoint ?? null,
        }), signal,
      });
      await apiRequest(`/subjects/${serverSubject.subjectTutorId}/content-style`, {
        method: 'PUT', body: JSON.stringify(toContentStyle(subject)), signal,
      });
      await apiRequest(`/subjects/${serverSubject.subjectTutorId}/materials`, {
        method: 'PUT', body: JSON.stringify({
          materialTypes: subject.materials ?? [],
          textbookPublisher: subject.materialDetails?.textbookPublisher ?? null,
          problemBookName: subject.materialDetails?.problemBookName ?? null,
          printPageCount: subject.materialDetails?.printPageCount ?? null,
        }), signal,
      });
      await uploadImages(serverSubject.subjectTutorId, '프린트사진', subject.printImages, signal);
      await uploadImages(serverSubject.subjectTutorId, '기출_족보', subject.pastExamImages, signal);
      await apiRequest(`/subjects/${serverSubject.subjectTutorId}/schedule`, {
        method: 'PUT', body: JSON.stringify({ blocks: toScheduleBlocks(subject.scheduleSlots ?? []) }), signal,
      });
    }

    // main 브랜치 기준: 모든 과목 저장 후 한 번만 호출한다.
    const job = await apiRequest<GenerationJob>(`/ai-tutor-sessions/${session.sessionId}/strategies/generate`, {
      method: 'POST', signal,
    });
    await tutorGenerationStore.save({
      sessionId: session.sessionId,
      jobId: job.jobId,
      request,
    });
    const completedJob = await this.pollJob(job, signal);
    const strategy = await apiRequest<StrategyDto>(`/ai-tutor-sessions/${session.sessionId}/strategies/latest`, { signal });
    const result = await this.toResult(request, strategy, subjectByDraftId, completedJob.strategyId);
    await tutorGenerationStore.clear();
    return { ...result, sourceRequest: request };
  }

  async save(strategyId: string) {
    return apiRequest<StrategyDto>(`/strategies/${strategyId}/save`, { method: 'POST' });
  }

  async applyToPlanner(strategyId: string) {
    return apiRequest(`/strategies/${strategyId}/planner-apply`, {
      method: 'POST', body: JSON.stringify({ targetType: '전체' }),
    });
  }

  private async pollJob(job: GenerationJob, signal?: AbortSignal) {
    const startedAt = Date.now();
    let current = job;
    while (Date.now() - startedAt < MAX_POLLING_MS) {
      const status = current.status.trim().toUpperCase();
      if (COMPLETE_STATUSES.has(status)) return current;
      if (FAILED_STATUSES.has(status)) {
        await tutorGenerationStore.clear();
        throw new Error(current.errorMessage ?? 'AI 전략 생성에 실패했습니다.');
      }
      await wait(current.pollingIntervalMs ?? 2_000, signal);
      current = await apiRequest<GenerationJob>(`/strategy-generation-jobs/${current.jobId}`, { signal });
    }
    throw new Error('전략 생성 확인 시간이 90초를 초과했습니다. 다시 시도해 주세요.');
  }

  private async resumeGeneration(pending: PendingTutorGeneration, signal?: AbortSignal) {
    const job = await apiRequest<GenerationJob>(`/strategy-generation-jobs/${pending.jobId}`, { signal });
    const completedJob = await this.pollJob(job, signal);
    const [strategy, serverSubjects] = await Promise.all([
      apiRequest<StrategyDto>(`/ai-tutor-sessions/${pending.sessionId}/strategies/latest`, { signal }),
      apiRequest<SubjectDto[]>(`/ai-tutor-sessions/${pending.sessionId}/subjects`, { signal }),
    ]);
    const subjects = new Map<string, SubjectDto>();
    for (const subject of pending.request.subjects) {
      const serverSubject = serverSubjects.find(item => matchesSubject(subject, item));
      if (serverSubject) subjects.set(subject.id, serverSubject);
    }
    const result = await this.toResult(pending.request, strategy, subjects, completedJob.strategyId);
    await tutorGenerationStore.clear();
    return { ...result, sourceRequest: pending.request };
  }

  private async toResult(
    request: GenerateTutorResultRequest,
    strategy: StrategyDto,
    subjects: Map<string, SubjectDto>,
    strategyIdFromJob?: number,
  ): Promise<TutorResultResponse> {
    const strategyId = strategy.strategyId ?? strategyIdFromJob;
    const weekPlans = await Promise.all([1, 2, 3].map(week =>
      apiRequest<DdayPlanDto>(`/strategies/${strategyId}/d-day-plan?week=${week}`).catch(() => null)
    ));
    const cards = strategy.subjectCards ?? [];
    const priorityBySubjectName = new Map(cards.map(card => [card.subjectName, toPriority(card.statusColor)]));
    const targetGradeBySubjectId = new Map<string, string>();
    for (const subject of request.subjects) {
      const serverSubject = subjects.get(subject.id);
      if (serverSubject?.subjectTutorId) {
        targetGradeBySubjectId.set(String(serverSubject.subjectTutorId), subject.targetGrade ?? '');
      }
    }
    const resultSubjects = cards.map(card => ({
      id: String(card.subjectTutorId), name: card.subjectName,
      summary: card.description ?? '', progress: card.progressPercent ?? 0,
      priority: toPriority(card.statusColor), tasks: [],
    }));
    const toWeek = (plan: DdayPlanDto, index: number) => ({
      id: `week-${plan.weekNumber ?? index + 1}`,
      label: `${plan.weekNumber ?? index + 1}주차`, title: plan.weekTitle,
      dateRange: plan.periodText, badge: plan.statusBadgeText, goal: plan.weeklyGoal,
      exams: (plan.examDdays ?? []).map(exam => ({
        dDay: exam.dDay,
        date: exam.dateText,
        subject: exam.subjectName,
        priority: priorityBySubjectName.get(exam.subjectName) ?? 'good' as const,
      })),
      subjectTasks: Object.fromEntries((plan.subjectPlans ?? []).map(subject => [
        String(subject.subjectTutorId),
        (subject.tasks ?? []).map(task => ({ label: task.label, body: task.content })),
      ])),
    });
    const weeks = weekPlans.filter((plan): plan is DdayPlanDto => Boolean(plan)).map(toWeek);
    const fallBackWeek = weeks[0] ?? {
      id: 'week-1', label: '1주차', title: '학습 계획', dateRange: '', badge: '', goal: '', exams: [], subjectTasks: {},
    };
    const strategyDirections = strategy.strategyDirections ?? strategy.insights ?? [];
    const subjectIds = cards.length
      ? cards.map(card => card.subjectTutorId)
      : Array.from(subjects.values()).map(subject => subject.subjectTutorId);
    const subjectStrategies = await Promise.all(subjectIds.map(async subjectTutorId => {
      const detail = await apiRequest<SubjectStrategyDto>(
        `/strategies/${strategyId}/subject-strategy?subject_tutor_id=${subjectTutorId}`,
      ).catch(() => null);
      const feedback = [
        ...(detail?.shortageAnalysis?.detail ? [{
          label: detail.shortageAnalysis.title ?? '보완 방향',
          body: detail.shortageAnalysis.detail,
        }] : []),
        ...(detail?.faqs ?? []).map(faq => ({ label: faq.question, body: faq.answer })),
        ...(detail?.shortageAnalysis?.improvementDirection ? [{
          label: '개선 방향',
          body: detail.shortageAnalysis.improvementDirection,
        }] : []),
      ];
      return {
        subjectId: String(subjectTutorId),
        targetGradeLabel: targetGradeBySubjectId.get(String(subjectTutorId)) ?? '',
        feedback,
        weeklyInsights: detail?.weeklyReviewInsights ?? [],
        actionTitle: '다음 주 실천',
        errorProcess: (detail?.nextWeekActions ?? []).map((body, index) => ({
          title: `${index + 1}단계`, body,
        })),
        books: [],
        successCase: { tags: [], body: '', profile: '', result: '' },
      };
    }));
    const fallbackStrategy = {
      subjectId: resultSubjects[0]?.id ?? '', targetGradeLabel: '', feedback: [], errorProcess: [], books: [],
      successCase: { tags: [], body: '', profile: '', result: '' },
    };
    return {
      id: String(strategyId), generatedAt: new Date().toISOString(),
      dDayLabel: strategy.examBadges?.find(value => value.startsWith('D-')) ?? '',
      dailyGoalLabel: strategy.summaryMetrics?.find(metric => metric.label.includes('하루'))?.value ?? '',
      planDurationLabel: strategy.title ?? '', diagnosis: strategy.aiDiagnosis ?? '',
      subjects: resultSubjects.length ? resultSubjects : Array.from(subjects.values()).map((subject, index) => ({
        id: String(subject.subjectTutorId), name: subject.customSubjectName ?? subject.subjectCategory, summary: '', progress: 0,
        priority: index === 0 ? 'urgent' as const : 'good' as const, tasks: [],
      })),
      summaryStrategies: strategyDirections.map((body, index) => ({ title: `${index + 1}순위 전략`, body })),
      week: fallBackWeek, weeks: weeks.length ? weeks : [fallBackWeek], exams: fallBackWeek.exams,
      strategy: subjectStrategies[0] ?? fallbackStrategy,
      strategies: subjectStrategies,
    };
  }
}

export const aiTutorService = isBackendConfigured() ? new AiTutorService() : null;
