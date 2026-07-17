import {
  type GenerateTutorResultRequest,
  type TutorResultPriority,
  type TutorResultResponse,
} from '../../types/tutorResult';
import { aiTutorService } from './aiTutorService';

export interface TutorResultService {
  generate(
    request: GenerateTutorResultRequest,
    signal?: AbortSignal
  ): Promise<TutorResultResponse | null>;
  applyToPlanner(resultId: string, signal?: AbortSignal): Promise<{ applied: boolean }>;
}

const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
const resultPath = process.env.EXPO_PUBLIC_TUTOR_RESULT_PATH ?? '/api/v1/tutor/results/generate';

class HttpTutorResultService implements TutorResultService {
  async generate(request: GenerateTutorResultRequest, signal?: AbortSignal) {
    const response = await fetch(`${apiBaseUrl}${resultPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal,
    });

    if (!response.ok) {
      throw new Error(`AI 튜터 결과 생성에 실패했습니다. (${response.status})`);
    }

    if (response.status === 204) return null;
    return (await response.json()) as TutorResultResponse;
  }

  async applyToPlanner(resultId: string, signal?: AbortSignal) {
    const response = await fetch(`${apiBaseUrl}/api/v1/tutor/results/${resultId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': `tutor-result-${resultId}`,
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`플래너 반영에 실패했습니다. (${response.status})`);
    }

    if (response.status === 204) return { applied: true };
    return (await response.json()) as { applied: boolean };
  }
}

class MockTutorResultService implements TutorResultService {
  private appliedResultIds = new Set<string>();

  async generate(request: GenerateTutorResultRequest, signal?: AbortSignal) {
    await delay(900, signal);

    const mockState = process.env.EXPO_PUBLIC_TUTOR_RESULT_MOCK_STATE;
    if (mockState === 'error') throw new Error('AI 분석 결과를 불러오지 못했습니다.');
    if (mockState === 'empty') return null;

    return createMockResponse(request);
  }

  async applyToPlanner(resultId: string, signal?: AbortSignal) {
    await delay(350, signal);
    if (this.appliedResultIds.has(resultId)) return { applied: false };
    this.appliedResultIds.add(resultId);
    return { applied: true };
  }
}

export const tutorResultService: TutorResultService = aiTutorService
  ? {
      generate: (request, signal) => aiTutorService.generate(request, signal),
      applyToPlanner: async resultId => {
        await aiTutorService.applyToPlanner(resultId);
        return { applied: true };
      },
    }
  : new MockTutorResultService();

function createMockResponse(request: GenerateTutorResultRequest): TutorResultResponse {
  const subjects = request.subjects.map((subject, index) => {
    const progress = getProgress(subject.progress, subject.status === 'anxious' ? 25 : 60);
    const priority: TutorResultPriority =
      subject.status === 'empty' || subject.status === 'anxious'
        ? 'urgent'
        : progress < 60
          ? 'caution'
          : 'good';

    return {
      id: subject.id,
      name: subject.name,
      summary: subject.detail || '상세 입력을 바탕으로 우선순위를 계산합니다.',
      progress,
      priority,
      tasks: makeTasks(subject.name, index),
    };
  });

  const topSubject = subjects[0]?.name ?? '사회 · 문화';

  return {
    id: `mock-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    dDayLabel: 'D-17',
    dailyGoalLabel: '5시간',
    planDurationLabel: '3주',
    diagnosis: `${topSubject}의 우선순위가 가장 높아요. 1-2주차는 취약 과목 집중, 3주차에는 전 과목 마무리로 가는 게 최선이에요.`,
    subjects,
    summaryStrategies: [
      {
        title: '사탐을 시험 순서 역순으로 공략하기',
        body: '암기 비중이 높은 과목은 먼저 개념을 잡아야 단기 유지가 돼요.',
      },
      {
        title: '확통은 기본 유형 반복으로 최소 점수 확보',
        body: '개념이 흔들리는 상태에서는 교과서 예제와 기본 유형부터 안정화해요.',
      },
      {
        title: '언어 · 영어는 이미 쌓인 자산 최대 활용',
        body: '추가 자료보다 가진 자료의 마무리 회독에 집중해요.',
      },
    ],
    week: {
      tabs: ['1주차', '2주차', '3주차'],
      selectedIndex: 0,
      title: '개념 정복 주간',
      dateRange: '6/8 - 6/15 · 8일',
      badge: '개념 완성',
      goal: '사탐 2과목 전 범위 1회독 완성 + 확통 핵심 개념 정리 + 언어 · 영어 마무리 정리',
    },
    weeks: createMockWeeks(subjects),
    exams: subjects.slice(0, 3).map((subject, index) => ({
      dDay: index === 0 ? 'D-17' : 'D-18',
      date: ['6/25(목)', '6/26(금)', '6/29(월)'][index],
      subject: subject.name,
      priority: subject.priority,
    })),
    strategy: {
      subjectId: subjects[0]?.id ?? '',
      targetGradeLabel: '목표 1등급',
      feedback: [
        {
          label: '자료해석형',
          body: '표의 가로·세로 기준을 먼저 확인하고 상대적 비교인지 절대적 수치인지 구분하세요.',
        },
        {
          label: '개념대입형',
          body: '핵심 단어를 빠르게 파악해 해당 이론에 대입하는 연습을 해요.',
        },
        {
          label: '서술형',
          body: '관점 차이를 서술하고 선생님이 강조한 핵심 개념어를 포함시켜요.',
        },
      ],
      errorProcess: [
        { title: '원인 분류하기', body: '개념 부족 / 자료 해석 실수 / 선지 혼동으로 나눠요.' },
        { title: '개념이 부족했다면', body: '교과서에서 찾아 노트에 옮기고 다음날 말로 설명해봐요.' },
        { title: '자료 해석 실수라면', body: '같은 자료 유형을 모아 3번 이상 반복 풀이해요.' },
        { title: '선지 혼동이라면', body: '헷갈린 선지를 비교표로 정리하고 핵심어를 암기카드로 만들어요.' },
      ],
      books: [
        { rank: '1순위', title: '1등급 만들기', body: '해당 범위 전체 1회독', priority: 'good' },
        { rank: '2순위', title: '마더텅', body: '기출 문제 유형별 실전 연습', priority: 'caution' },
        { rank: '여유 시', title: 'EBSi 기출', body: '문제량 보충 필요시 활용', priority: 'urgent' },
      ],
      successCase: {
        tags: ['내신 4등급', '3주 등급 올리기'],
        body: '사탐 두 과목을 거의 손도 못 대다가 3주 전에 핵심 주장 정리부터 시작했어요.',
        profile: 'ㅇㅇ고등학교 2학년',
        result: '생활과 윤리 4등급 → 2등급 · 확통 3등급 달성',
      },
    },
    strategies: createMockStrategies(subjects),
  };
}

function createMockWeeks(subjects: TutorResultResponse['subjects']): NonNullable<TutorResultResponse['weeks']> {
  const definitions = [
    { label: '1주차', title: '개념 정복 주간', dateRange: '6/8 - 6/15 · 8일', badge: '개념 완성', goal: '취약 과목의 핵심 개념을 정리하고 전 범위 1회독을 완료해요.' },
    { label: '2주차', title: '유형 반복 주간', dateRange: '6/16 - 6/22 · 7일', badge: '유형 훈련', goal: '과목별 빈출 유형을 반복하고 오답 원인을 유형별로 분류해요.' },
    { label: '3주차', title: '실전 마무리 주간', dateRange: '6/23 - 6/29 · 7일', badge: '실전 완성', goal: '실전 문제 풀이와 오답 회독으로 시험 직전 전략을 완성해요.' },
  ];

  return definitions.map((definition, weekIndex) => ({
    id: `week-${weekIndex + 1}`,
    ...definition,
    exams: subjects.slice(0, 3).map((subject, index) => ({
      dDay: `D-${Math.max(1, 17 - weekIndex * 7 + index)}`,
      date: ['6/25(목)', '6/26(금)', '6/29(월)'][index],
      subject: subject.name,
      priority: subject.priority,
    })),
    subjectTasks: Object.fromEntries(subjects.map((subject, subjectIndex) => [
      subject.id,
      makeWeekTasks(subject.name, weekIndex, subjectIndex),
    ])),
  }));
}

function createMockStrategies(subjects: TutorResultResponse['subjects']): NonNullable<TutorResultResponse['strategies']> {
  return subjects.map((subject, index) => ({
    subjectId: subject.id,
    targetGradeLabel: index === 0 ? '목표 1등급' : '목표 2등급',
    feedback: [
      { label: '자료해석형', body: `${subject.name} 자료의 기준을 먼저 확인하고 상대적 비교와 절대적 수치를 구분하세요.` },
      { label: '개념대입형', body: '핵심 단어를 빠르게 파악해 해당 개념에 대입하는 연습을 해요.' },
      { label: '서술형', body: '선생님이 강조한 핵심 개념어를 포함해 답안을 구성해요.' },
    ],
    errorProcess: [
      { title: '원인 분류하기', body: '개념 부족 / 자료 해석 실수 / 선지 혼동으로 나눠요.' },
      { title: '개념이 부족했다면', body: '교과서에서 찾아 노트에 옮기고 다음날 말로 설명해봐요.' },
      { title: '자료 해석 실수라면', body: '같은 자료 유형을 모아 3번 이상 반복 풀이해요.' },
      { title: '선지 혼동이라면', body: '헷갈린 선지를 비교표로 정리하고 핵심어를 암기카드로 만들어요.' },
    ],
    books: [
      { rank: '1순위', title: '1등급 만들기', body: `${subject.name} 범위 전체 1회독`, priority: 'good' },
      { rank: '2순위', title: '마더텅', body: '기출 문제 유형별 실전 연습', priority: 'caution' },
      { rank: '여유 시', title: 'EBSi 기출', body: '문제량 보충 필요시 활용', priority: 'urgent' },
    ],
    successCase: {
      tags: ['내신 4등급', '3주 등급 올리기'],
      body: `${subject.name} 공부를 시험 3주 전부터 핵심 개념 정리와 오답 반복으로 시작했어요.`,
      profile: 'ㅇㅇ고등학교 2학년',
      result: `${subject.name} 4등급 → 2등급 달성`,
    },
  }));
}

function makeWeekTasks(subjectName: string, weekIndex: number, subjectIndex: number) {
  const actions = [
    ['1회독', `${subjectName} 해당 범위 1회독`],
    ['유형', `${subjectName} 빈출 유형 ${subjectIndex + 3}개 반복`],
    ['실전', `${subjectName} 실전 문제와 오답 최종 점검`],
  ];
  const action = actions[weekIndex] ?? actions[0];
  return [
    { label: action[0], body: action[1] },
    { label: weekIndex === 2 ? '암기' : '정리', body: weekIndex === 2 ? '시험 직전 암기 항목 확인' : '핵심 개념 노트 정리' },
  ];
}

function getProgress(label: string | undefined, fallback: number) {
  const match = label?.match(/\d+/);
  return match ? Math.min(100, Math.max(5, Number(match[0]))) : fallback;
}

function makeTasks(subjectName: string, index: number) {
  if (index === 0) {
    return [
      { label: '1회독', body: `${subjectName} 해당 범위 1회독` },
      { label: '정리', body: '핵심 개념 노트 정리' },
    ];
  }
  return [
    { label: '풀이', body: `${subjectName} 기본 유형 풀이` },
    { label: '확인', body: '취약 부분 다시 확인하기' },
  ];
}

function delay(milliseconds: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, milliseconds);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new Error('aborted'));
    });
  });
}
