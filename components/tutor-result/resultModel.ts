import { type TagVariant } from '../ui';
import { type ResultSubjectTone, type TutorResultSubjectView } from '../../types/tutorResult';
import { type ReportNumberBadgeVariant } from './ReportNumberBadge';
import { resultStyles } from './resultStyles';

const styles = resultStyles;

export type ResultStep = 'summary' | 'plan' | 'strategy';
export type PriorityTone = ResultSubjectTone;
export type RankedSubject = TutorResultSubjectView;

export function getBadgeVariant(tone: PriorityTone): ReportNumberBadgeVariant {
  if (tone === 'red') return 'Red';
  if (tone === 'orange') return 'Orange';
  return 'Green';
}

export function getTagVariant(tone: PriorityTone): TagVariant {
  if (tone === 'red') return 'Red';
  if (tone === 'orange') return 'Orange';
  return 'Green';
}

export function getProgressToneStyle(tone: PriorityTone) {
  if (tone === 'red') return styles.progressFillRed;
  if (tone === 'orange') return styles.progressFillOrange;
  return styles.progressFillGreen;
}

export function getTitle(step: ResultStep) {
  if (step === 'summary') return 'AI 학습 전략';
  if (step === 'plan') return 'D-day 플랜';
  return '과목별 전략';
}

export function getButtonLabel(step: ResultStep) {
  if (step === 'summary') return '과목별 전략 보러가기';
  if (step === 'plan') return '플래너에 반영하기';
  return '플래너에 반영하기';
}
