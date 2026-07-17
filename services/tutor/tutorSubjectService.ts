import {
  type SaveTutorSubjectRequest,
  type SaveTutorSubjectResponse,
} from '../../types/tutorSubject';

export interface TutorSubjectService {
  save(request: SaveTutorSubjectRequest): Promise<SaveTutorSubjectResponse>;
}

const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
const subjectPath = process.env.EXPO_PUBLIC_TUTOR_SUBJECT_PATH ?? '/api/v1/tutor/subjects';

class HttpTutorSubjectService implements TutorSubjectService {
  async save(request: SaveTutorSubjectRequest) {
    const response = await fetch(`${apiBaseUrl}${subjectPath}/${request.subjectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': `tutor-subject-${request.subjectId}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`과목 정보 저장에 실패했습니다. (${response.status})`);
    }

    return (await response.json()) as SaveTutorSubjectResponse;
  }
}

class MockTutorSubjectService implements TutorSubjectService {
  async save(request: SaveTutorSubjectRequest) {
    await new Promise(resolve => setTimeout(resolve, 350));

    if (process.env.EXPO_PUBLIC_TUTOR_SUBJECT_MOCK_STATE === 'error') {
      throw new Error('과목 정보를 저장하지 못했습니다.');
    }

    return {
      savedAt: new Date().toISOString(),
      subject: {
        id: request.subjectId,
        name: request.subjectName,
        detail: `${request.examRange} · ${request.materials.join(' + ')}`,
        status: request.confidenceIndex >= 2 ? 'anxious' : 'done',
        progress: request.confidenceIndex >= 2 ? '매우 불안' : `진도 ${request.progress}%`,
        range: request.examRange,
        weakPoint: request.weakPoint,
        materials: request.materials,
        scheduleSlots: request.scheduleSlots,
      },
    } satisfies SaveTutorSubjectResponse;
  }
}

export const tutorSubjectService: TutorSubjectService = apiBaseUrl
  ? new HttpTutorSubjectService()
  : new MockTutorSubjectService();
