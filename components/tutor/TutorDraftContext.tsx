import React, { createContext, useContext, useMemo, useState } from 'react';

export type SubjectStatus = 'done' | 'anxious' | 'empty';

export type TutorSubjectDraft = {
  id: string;
  name: string;
  // category와 표시 이름을 분리해, 같은 카테고리의 세부 과목도 보존한다.
  subjectCategory?: string;
  customSubjectName?: string | null;
  detail: string;
  status: SubjectStatus;
  progress?: string;
  range?: string;
  weakPoint?: string;
  materials?: string[];
  scheduleSlots?: string[];
};

export type TutorDraft = {
  examType: string;
  semester: string;
  examPeriod: string;
  goal: string;
  examDates: Record<string, string[]>;
  subjects: TutorSubjectDraft[];
};

type TutorDraftContextValue = {
  draft: TutorDraft;
  updateBasicInfo: (basicInfo: Partial<Pick<TutorDraft, 'examType' | 'semester' | 'examPeriod' | 'goal'>>) => void;
  updateExamDates: (examDates: Record<string, string[]>) => void;
  setSubjects: (subjects: TutorSubjectDraft[]) => void;
  upsertSubject: (subject: TutorSubjectDraft) => void;
};

const INITIAL_SUBJECTS: TutorSubjectDraft[] = [
  {
    id: 'korean',
    name: '국어',
    detail: '문학 1단원, 독서 2단원 · 교과서 + 프린트',
    status: 'done',
    progress: '진도 40%',
  },
  {
    id: 'math',
    name: '수학',
    detail: '수열, 극한 · 교과서 + 프린트',
    status: 'anxious',
    progress: '매우 불안',
  },
  {
    id: 'english',
    name: '영어',
    detail: '탭해서 상세 입력하기',
    status: 'empty',
  },
];

const INITIAL_DRAFT: TutorDraft = {
  examType: '내신',
  semester: '1학기',
  examPeriod: '중간고사',
  goal: '',
  examDates: {},
  subjects: INITIAL_SUBJECTS,
};

const TutorDraftContext = createContext<TutorDraftContextValue | null>(null);

export function TutorDraftProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<TutorDraft>(INITIAL_DRAFT);

  const value = useMemo<TutorDraftContextValue>(
    () => ({
      draft,
      updateBasicInfo: basicInfo => {
        setDraft(prev => ({ ...prev, ...basicInfo }));
      },
      updateExamDates: examDates => {
        setDraft(prev => ({ ...prev, examDates }));
      },
      setSubjects: subjects => {
        setDraft(prev => ({ ...prev, subjects }));
      },
      upsertSubject: subject => {
        setDraft(prev => {
          const exists = prev.subjects.some(item => item.id === subject.id || item.name === subject.name);
          const subjects = exists
            ? prev.subjects.map(item => (item.id === subject.id || item.name === subject.name ? subject : item))
            : [...prev.subjects, subject];
          return { ...prev, subjects };
        });
      },
    }),
    [draft]
  );

  return (
    <TutorDraftContext.Provider value={value}>
      {children}
    </TutorDraftContext.Provider>
  );
}

export function useTutorDraft() {
  const value = useContext(TutorDraftContext);
  if (!value) {
    throw new Error('useTutorDraft must be used inside TutorDraftProvider');
  }
  return value;
}
