export type WitnessState = {
  cluesRevealed: number;
  guesses: number[];
  solved: boolean;
};

export type GameState = {
  puzzleId: string;
  witnesses: WitnessState[];
  currentWitnessIndex: number;
  ruleGuesses: string[];
  ruleSolved: boolean;
  revealed: boolean;
  completedAt?: string;
};

export function initGameState(puzzleId: string, witnessCount: number): GameState {
  return {
    puzzleId,
    witnesses: Array.from({ length: witnessCount }, () => ({
      cluesRevealed: 1,
      guesses: [],
      solved: false,
    })),
    currentWitnessIndex: 0,
    ruleGuesses: [],
    ruleSolved: false,
    revealed: false,
  };
}
