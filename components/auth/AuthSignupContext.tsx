import React, { createContext, useContext, useMemo, useState } from 'react';

export type SignupMethod = 'email' | 'kakao';

export type SignupDraft = {
  method: SignupMethod;
  email: string;
  password: string;
  nickname: string;
  grade: string;
  region: string;
  schoolType: string;
  schoolName: string;
  goalTracks: string[];
  desiredMajor: string;
  admissionTypes: string[];
  consents: Record<string, boolean>;
};

const INITIAL_DRAFT: SignupDraft = {
  method: 'email', email: '', password: '', nickname: '', grade: '', region: '',
  schoolType: '', schoolName: '', goalTracks: [], desiredMajor: '', admissionTypes: [], consents: {},
};

type SignupContextValue = {
  draft: SignupDraft;
  updateDraft: (value: Partial<SignupDraft>) => void;
  resetDraft: (method?: SignupMethod) => void;
};

const SignupContext = createContext<SignupContextValue | null>(null);

export function AuthSignupProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<SignupDraft>(INITIAL_DRAFT);
  const value = useMemo<SignupContextValue>(() => ({
    draft,
    updateDraft: (next) => setDraft((current) => ({ ...current, ...next })),
    resetDraft: (method = 'email') => setDraft({ ...INITIAL_DRAFT, method }),
  }), [draft]);
  return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>;
}

export function useAuthSignup() {
  const value = useContext(SignupContext);
  if (!value) throw new Error('useAuthSignup must be used inside AuthSignupProvider');
  return value;
}
