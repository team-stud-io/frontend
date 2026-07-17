import { type TutorSubjectDraft } from '../components/tutor/TutorDraftContext';

export interface TutorSubjectAttachmentInput {
  id: string;
  name: string;
  kind: 'image' | 'file';
}

export interface SaveTutorSubjectRequest {
  subjectId: string;
  subjectName: string;
  examRange: string;
  progress: number;
  selectedGradeIndex: number;
  mockGradeIndex: number;
  confidenceIndex: number;
  weakPoint: string;
  socialTypes: string[];
  scienceTypes: string[];
  focusOptions: string[];
  outsideOption: string;
  similarityOption: string;
  priorityIndex: number;
  memoryRatio: number;
  socialMemory: string;
  socialChart: string;
  calculationRatio: string;
  scienceConcept: string;
  essayRatio: number;
  difficultyIndex: number;
  teacherMemo: string;
  materials: string[];
  publisher: string;
  workbook: string;
  printCount: string;
  printAttachments: TutorSubjectAttachmentInput[];
  examAttachments: TutorSubjectAttachmentInput[];
  scheduleSlots?: string[];
}

export interface SaveTutorSubjectResponse {
  subject: TutorSubjectDraft;
  savedAt: string;
}
