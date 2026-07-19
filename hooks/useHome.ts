import { useCallback, useEffect, useState } from 'react';
import { type HomeData, homeService, type TodoDetail } from '../services/home/homeService';
import { tutorSessionStore } from '../services/tutor/tutorSessionStore';

export function useHome() {
  const [home, setHome] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(homeService));
  const [error, setError] = useState<unknown>(null);

  const refresh = useCallback(async () => {
    if (!homeService) {
      setIsLoading(false);
      return null;
    }
    setIsLoading(true);
    try {
      const nextHome = await homeService.getHome();
      setHome(nextHome);
      setError(null);
      return nextHome;
    } catch (nextError) {
      setError(nextError);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const toggleTodo = useCallback(async (todoId: number, isCompleted: boolean) => {
    if (!homeService) return null;
    await homeService.toggleTodo(todoId, isCompleted);
    return refresh();
  }, [refresh]);

  const getTodoDetail = useCallback((todoId: number): Promise<TodoDetail | null> => {
    if (!homeService) return Promise.resolve(null);
    return homeService.getTodoDetail(todoId);
  }, []);

  const getTodayReflection = useCallback(async () => {
    if (!homeService) return null;
    const sessionId = await tutorSessionStore.load();
    return sessionId ? homeService.getTodayReflection(sessionId) : null;
  }, []);

  const createReflection = useCallback(async (content: string) => {
    if (!homeService) return null;
    if (content.trim().length === 0 || content.length > 400) throw new Error('회고는 1~400자로 입력하세요.');
    const sessionId = await tutorSessionStore.load();
    if (!sessionId) throw new Error('활성 AI 튜터 세션을 찾을 수 없습니다.');
    const reflection = await homeService.createReflection(sessionId, content.trim());
    await refresh();
    return reflection;
  }, [refresh]);

  return { home, isLoading, error, refresh, toggleTodo, getTodoDetail, getTodayReflection, createReflection };
}
