import { ProgressBarTotal } from './ProgressBarTotal';

export function ProgressBar5({ state = 1 }: { state?: 1 | 2 | 3 | 4 | 5 }) {
  return <ProgressBarTotal value={state} max={5} height={6} />;
}
