import { apiRequest, isBackendConfigured } from '../apiClient';

export type HomeTodo = {
  todo_id: number;
  content: string;
  is_completed: boolean;
  display_order: number;
  carried_over: boolean;
};

export type HomeData = {
  home_state: 'ACTIVE' | 'EMPTY';
  today: { date: string; day_of_week: string };
  has_unread_notification: boolean;
  dday: {
    exam_type: string;
    exam_name: string;
    exam_date: string;
    days_left: number;
  } | null;
  stage_progress: { current_stage_number: number; progress_percent: number } | null;
  tutor_message: { tutor_name: string; content: string } | null;
  current_stage: HomeStage | null;
  stages: HomeStage[];
  next_stage: HomeStage | null;
  subject_todos: Array<{
    subject_tutor_id: number;
    subject_category: string;
    custom_subject_name: string | null;
    todos: HomeTodo[];
  }>;
  reflection_submitted_today: boolean;
};

export type HomeStage = {
  stage_id: number;
  stage_number: number;
  stage_name: string;
  start_date: string;
  end_date: string;
};

export type TodoDetail = {
  todo_id: number;
  subject_category: string;
  todo_content: string;
  stage_number: number;
  stage_name: string;
  tutor_name: string;
  recommended_time_min: number;
  recommended_time_max: number;
  study_tips: Array<{ display_order: number; title: string; content: string }>;
};

export type TodayReflection = {
  reflection_id: number | null;
  reflection_date: string;
  content: string | null;
  created_at: string | null;
};

class HomeService {
  getHome() {
    return apiRequest<HomeData>('/home');
  }

  toggleTodo(todoId: number, isCompleted: boolean) {
    return apiRequest<HomeTodo>(`/todos/${todoId}`, {
      method: 'PATCH',
      body: JSON.stringify({ is_completed: isCompleted }),
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
