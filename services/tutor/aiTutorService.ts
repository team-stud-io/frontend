import { apiRequest, isBackendConfigured } from '../apiClient';
import type { GenerateTutorResultRequest, TutorResultResponse } from '../../types/tutorResult';

type SubjectDto = {
  subject_tutor_id: number;
  subject_category: string;
  custom_subject_name?: string | null;
  exam_date?: string | null;
};

type GenerationJob = {
  job_id: number;
  status: string;
  strategy_id?: number;
  polling_interval_ms?: number;
  error_message?: string | null;
};

type StrategyDto = {
  strategy_id: number;
  title?: string;
  saved?: boolean;
  exam_badges?: string[];
  summary_metrics?: { label: string; value: string }[];
  stats?: { total_study_minutes?: number };
  ai_diagnosis?: string;
  insights?: string[];
  strategy_directions?: string[];
  subject_cards?: Array<{
    subject_tutor_id: number;
    subject_name: string;
    status_color?: 'red' | 'orange' | 'green';
    urgency_level?: string;
    progress_percent?: number;
    description?: string;
  }>;
};

type DdayPlanDto = {
  week_number: number;
  week_title: string;
  period_text: string;
  status_badge_text: string;
  weekly_goal: string;
  exam_ddays?: Array<{ d_day: string; date_text: string; subject_name: string }>;
  subject_plans?: Array<{
    subject_tutor_id: number;
    subject_name: string;
    status_color?: 'red' | 'orange' | 'green';
    tasks?: Array<{ label: string; content: string }>;
  }>;
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
      day_of_week: dayOfWeek,
      start_time: `${String(hour % 24).padStart(2, '0')}:00`,
      end_time: `${String((hour + 1) % 24).padStart(2, '0')}:00`,
    }];
  });
}

type DraftSubject = GenerateTutorResultRequest['subjects'][number] & {
  subjectCategory?: string;
  customSubjectName?: string | null;
};

function toApiSubjectName(subject: DraftSubject) {
  return {
    subject_category: subject.subjectCategory ?? subject.name,
    custom_subject_name: subject.customSubjectName ?? null,
  };
}

function matchesSubject(subject: DraftSubject, serverSubject: SubjectDto) {
  const apiSubject = toApiSubjectName(subject);
  return serverSubject.subject_category === apiSubject.subject_category
    && (serverSubject.custom_subject_name ?? null) === apiSubject.custom_subject_name;
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
    const subjectWithoutRange = request.subjects.find(subject => !subject.range?.trim());
    if (subjectWithoutRange) {
      throw new Error(`${subjectWithoutRange.name}의 시험 범위를 입력해 주세요.`);
    }
    const session = await apiRequest<{ session_id: number }>('/ai-tutor-sessions', {
      method: 'POST',
      body: JSON.stringify({
        exam_type: request.examType,
        semester: request.semester || null,
        exam_round: request.examPeriod || null,
        goal: request.goal || null,
      }),
      signal,
    });
    const assignments = request.subjects
      .map(subject => ({ subject, date: dateForSubject(request.examDates, subject.name) }))
      .filter((item): item is { subject: GenerateTutorResultRequest['subjects'][number]; date: string } => Boolean(item.date))
      .map(({ subject, date }) => ({ date, ...toApiSubjectName(subject) }));
    const subjectByDraftId = new Map<string, SubjectDto>();
    if (assignments.length) {
      const createdWithDates = await apiRequest<SubjectDto[]>(`/ai-tutor-sessions/${session.session_id}/exam-dates`, {
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
      const created = await apiRequest<SubjectDto>(`/ai-tutor-sessions/${session.session_id}/subjects`, {
        method: 'POST', body: JSON.stringify(toApiSubjectName(subject)), signal,
      });
      subjectByDraftId.set(subject.id, created);
    }

    for (const subject of request.subjects) {
      const serverSubject = subjectByDraftId.get(subject.id);
      if (!serverSubject) continue;
      await apiRequest(`/subjects/${serverSubject.subject_tutor_id}/scope`, {
        method: 'PUT',
        body: JSON.stringify({
          detail_subject: null,
          exam_range: subject.range ?? '',
          progress_percent: Number.parseInt(subject.progress ?? '0', 10) || 0,
          target_grade: null,
          prev_grade: null,
          confidence_level: null,
          weak_points: subject.weakPoint ?? null,
        }), signal,
      });
      await apiRequest(`/subjects/${serverSubject.subject_tutor_id}/content-style`, {
        method: 'PUT', body: JSON.stringify({}), signal,
      });
      await apiRequest(`/subjects/${serverSubject.subject_tutor_id}/materials`, {
        method: 'PUT', body: JSON.stringify({ material_types: subject.materials ?? [] }), signal,
      });
      await apiRequest(`/subjects/${serverSubject.subject_tutor_id}/schedule`, {
        method: 'PUT', body: JSON.stringify({ blocks: toScheduleBlocks(subject.scheduleSlots ?? []) }), signal,
      });
    }

    // main 브랜치 기준: 모든 과목 저장 후 한 번만 호출한다.
    const job = await apiRequest<GenerationJob>(`/ai-tutor-sessions/${session.session_id}/strategies/generate`, {
      method: 'POST', signal,
    });
    const completedJob = await this.pollJob(job, signal);
    const strategy = await apiRequest<StrategyDto>(`/ai-tutor-sessions/${session.session_id}/strategies/latest`, { signal });
    return this.toResult(request, strategy, subjectByDraftId, completedJob.strategy_id);
  }

  async save(strategyId: string) {
    return apiRequest<StrategyDto>(`/strategies/${strategyId}/save`, { method: 'POST' });
  }

  async applyToPlanner(strategyId: string) {
    return apiRequest(`/strategies/${strategyId}/planner-apply`, {
      method: 'POST', body: JSON.stringify({ target_type: '전체' }),
    });
  }

  private async pollJob(job: GenerationJob, signal?: AbortSignal) {
    const startedAt = Date.now();
    let current = job;
    while (Date.now() - startedAt < MAX_POLLING_MS) {
      const status = current.status.trim().toUpperCase();
      if (COMPLETE_STATUSES.has(status)) return current;
      if (FAILED_STATUSES.has(status)) throw new Error(current.error_message ?? 'AI 전략 생성에 실패했습니다.');
      await wait(current.polling_interval_ms ?? 2_000, signal);
      current = await apiRequest<GenerationJob>(`/strategy-generation-jobs/${current.job_id}`, { signal });
    }
    throw new Error('전략 생성 확인 시간이 90초를 초과했습니다. 다시 시도해 주세요.');
  }

  private async toResult(
    request: GenerateTutorResultRequest,
    strategy: StrategyDto,
    subjects: Map<string, SubjectDto>,
    strategyIdFromJob?: number,
  ): Promise<TutorResultResponse> {
    const strategyId = strategy.strategy_id ?? strategyIdFromJob;
    const weekPlans = await Promise.all([1, 2, 3].map(week =>
      apiRequest<DdayPlanDto>(`/strategies/${strategyId}/d-day-plan?week=${week}`).catch(() => null)
    ));
    const cards = strategy.subject_cards ?? [];
    const resultSubjects = cards.map(card => ({
      id: String(card.subject_tutor_id), name: card.subject_name,
      summary: card.description ?? '', progress: card.progress_percent ?? 0,
      priority: toPriority(card.status_color), tasks: [],
    }));
    const firstPlan = weekPlans.find((plan): plan is DdayPlanDto => Boolean(plan));
    const toWeek = (plan: DdayPlanDto, index: number) => ({
      id: `week-${plan.week_number ?? index + 1}`,
      label: `${plan.week_number ?? index + 1}주차`, title: plan.week_title,
      dateRange: plan.period_text, badge: plan.status_badge_text, goal: plan.weekly_goal,
      exams: (plan.exam_ddays ?? []).map(exam => ({ dDay: exam.d_day, date: exam.date_text, subject: exam.subject_name, priority: 'good' as const })),
      subjectTasks: Object.fromEntries((plan.subject_plans ?? []).map(subject => [
        String(subject.subject_tutor_id),
        (subject.tasks ?? []).map(task => ({ label: task.label, body: task.content })),
      ])),
    });
    const weeks = weekPlans.filter((plan): plan is DdayPlanDto => Boolean(plan)).map(toWeek);
    const fallBackWeek = weeks[0] ?? {
      id: 'week-1', label: '1주차', title: '학습 계획', dateRange: '', badge: '', goal: '', exams: [], subjectTasks: {},
    };
    const strategyDirections = strategy.strategy_directions ?? strategy.insights ?? [];
    return {
      id: String(strategyId), generatedAt: new Date().toISOString(),
      dDayLabel: strategy.exam_badges?.find(value => value.startsWith('D-')) ?? '',
      dailyGoalLabel: strategy.summary_metrics?.find(metric => metric.label.includes('하루'))?.value ?? '',
      planDurationLabel: strategy.title ?? '', diagnosis: strategy.ai_diagnosis ?? '',
      subjects: resultSubjects.length ? resultSubjects : Array.from(subjects.values()).map((subject, index) => ({
        id: String(subject.subject_tutor_id), name: subject.subject_category, summary: '', progress: 0,
        priority: index === 0 ? 'urgent' as const : 'good' as const, tasks: [],
      })),
      summaryStrategies: strategyDirections.map((body, index) => ({ title: `${index + 1}순위 전략`, body })),
      week: fallBackWeek, weeks: weeks.length ? weeks : [fallBackWeek], exams: firstPlan ? fallBackWeek.exams : [],
      strategy: { subjectId: resultSubjects[0]?.id ?? '', targetGradeLabel: '', feedback: [], errorProcess: [], books: [], successCase: { tags: [], body: '', profile: '', result: '' } },
      strategies: [],
    };
  }
}

export const aiTutorService = isBackendConfigured() ? new AiTutorService() : null;
