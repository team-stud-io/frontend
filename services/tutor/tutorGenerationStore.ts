import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GenerateTutorResultRequest } from '../../types/tutorResult';

const STORAGE_KEY = 'stud.io.aiTutor.pendingGeneration';

export type PendingTutorGeneration = {
  sessionId: number;
  jobId: number;
  request: GenerateTutorResultRequest;
};

async function safely<T>(action: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await action();
  } catch {
    return fallback;
  }
}

export const tutorGenerationStore = {
  load: () => safely(async () => {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as PendingTutorGeneration;
    return Number.isFinite(parsed.sessionId) && Number.isFinite(parsed.jobId) && parsed.request
      ? parsed
      : null;
  }, null as PendingTutorGeneration | null),

  save: (pending: PendingTutorGeneration) => safely(
    () => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pending)),
    undefined,
  ),

  clear: () => safely(() => AsyncStorage.removeItem(STORAGE_KEY), undefined),
};
