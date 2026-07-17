import { useCallback, useState } from 'react';
import { tutorSubjectService } from '../services/tutor/tutorSubjectService';
import { type SaveTutorSubjectRequest } from '../types/tutorSubject';

export function useSaveTutorSubject() {
  const [isSaving, setIsSaving] = useState(false);

  const saveSubject = useCallback(async (request: SaveTutorSubjectRequest) => {
    setIsSaving(true);
    try {
      return await tutorSubjectService.save(request);
    } finally {
      setIsSaving(false);
    }
  }, []);

  return { isSaving, saveSubject };
}
