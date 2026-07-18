import { useCallback, useEffect, useState } from 'react';
import { adaptTutorResult } from '../services/tutor/tutorResultAdapter';
import { tutorResultService } from '../services/tutor/tutorResultService';
import { ApiError } from '../services/apiClient';
import { aiTutorService } from '../services/tutor/aiTutorService';
import {
  type GenerateTutorResultRequest,
  type TutorResultViewModel,
} from '../types/tutorResult';

type TutorResultState =
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: TutorResultViewModel; error: null }
  | { status: 'empty'; data: null; error: null }
  | { status: 'error'; data: null; error: Error };

export function useTutorResult(request: GenerateTutorResultRequest) {
  const [retryCount, setRetryCount] = useState(0);
  const [state, setState] = useState<TutorResultState>({
    status: 'loading',
    data: null,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading', data: null, error: null });

    tutorResultService
      .generate(request, controller.signal)
      .then(response => {
        if (!response || response.subjects.length === 0) {
          setState({ status: 'empty', data: null, error: null });
          return;
        }
        setState({
          status: 'success',
          data: adaptTutorResult(response.sourceRequest ?? request, response),
          error: null,
        });
      })
      .catch(error => {
        if (controller.signal.aborted) return;
        setState({
          status: 'error',
          data: null,
          error: error instanceof Error ? error : new Error('결과 생성에 실패했습니다.'),
        });
      });

    return () => controller.abort();
  }, [request, retryCount]);

  const retry = useCallback(() => setRetryCount(count => count + 1), []);

  return { ...state, retry };
}

export function useApplyTutorResult() {
  const [isApplying, setIsApplying] = useState(false);

  const applyToPlanner = useCallback(async (resultId: string) => {
    if (isApplying) return { applied: false };
    setIsApplying(true);
    try {
      return await tutorResultService.applyToPlanner(resultId);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) return { applied: false };
      throw error;
    } finally {
      setIsApplying(false);
    }
  }, [isApplying]);

  return { applyToPlanner, isApplying };
}

export function useSaveTutorResult() {
  const [isSaving, setIsSaving] = useState(false);

  const save = useCallback(async (strategyId: string) => {
    if (!aiTutorService || isSaving) return;
    setIsSaving(true);
    try {
      await aiTutorService.save(strategyId);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving]);

  return { save, isSaving };
}
