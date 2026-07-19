export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface HomeTask {
  id: string;
  subject: string;
  title: string;
  completed: boolean;
  difficulty: Difficulty | null;
  showDifficultyPrompt?: boolean;
  strategyAvailable?: boolean;
}
