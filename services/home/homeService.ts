import { apiRequest, isBackendConfigured } from '../apiClient';

export type HomeTodo = {
  todoId: number;
  content: string;
  isCompleted: boolean;
  displayOrder: number;
  carriedOver: boolean;
};

export type HomeData = {
  homeState: 'ACTIVE' | 'EMPTY';
  today: { date: string; dayOfWeek: string };
  hasUnreadNotification: boolean;
  dday: {
    examType: string;
    examName: string;
    examDate: string;
    daysLeft: number;
  } | null;
  stageProgress: { currentStageNumber: number; progressPercent: number } | null;
  tutorMessage: { tutorName: string; content: string } | null;
  currentStage: HomeStage | null;
  stages: HomeStage[];
  nextStage: HomeStage | null;
  subjectTodos: Array<{
    subjectTutorId: number;
    subjectCategory: string;
    customSubjectName: string | null;
    todos: HomeTodo[];
  }>;
  reflectionSubmittedToday: boolean;
};

export type HomeStage = {
  stageId: number;
  stageNumber: number;
  stageName: string;
  startDate: string;
  endDate: string;
};

export type TodoDetail = {
  todoId: number;
  subjectCategory: string;
  todoContent: string;
  stageNumber: number;
  stageName: string;
  tutorName: string;
  recommendedTimeMin: number;
  recommendedTimeMax: number;
  studyTips: Array<{ displayOrder: number; title: string; content: string }>;
};

export type TodayReflection = {
  reflectionId: number | null;
  reflectionDate: string;
  content: string | null;
  createdAt: string | null;
};

class HomeService {
  getHome() {
    return apiRequest<HomeData>('/home');
  }

  toggleTodo(todoId: number, isCompleted: boolean) {
    return apiRequest<HomeTodo>(`/todos/${todoId}`, {
      method: 'PATCH',
      body: JSON.stringify({ isCompleted }),
    });
  }

  getTodoDetail(todoId: number) {
    return apiRequest<TodoDetail>(`/todos/${todoId}/detail`);
  }

  getTodayReflection(sessionId: number) {
    return apiRequest<TodayReflection>(`/ai-tutor-sessions/${sessionId}/reflections/today`);
  }

  createReflection(sessionId: number, content: string) {
    return apiRequest<TodayReflection>(`/ai-tutor-sessions/${sessionId}/reflections`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }
}

export const homeService = isBackendConfigured() ? new HomeService() : null;
