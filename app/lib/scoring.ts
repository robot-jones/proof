import type { ScheduledPuzzle } from "@/pipeline/scheduler";
import type { GameState } from "./gameState";

export type ScoreBreakdown = {
  perWitness: Array<{
    cluesAvailable: number;
    cluesUsed: number;
    solved: boolean;
  }>;
  cluesSaved: number;
  earlyRuleBonus: number;
  total: number;
};

export function computeScore(
  puzzle: ScheduledPuzzle,
  state: GameState
): ScoreBreakdown | null {
  if (!state.ruleSolved) return null;

  const solvedCount = state.currentWitnessIndex;

  const perWitness = puzzle.witnesses.map((w, i) => ({
    cluesAvailable: w.clues.length,
    cluesUsed: state.witnesses[i].cluesRevealed,
    solved: i < solvedCount,
  }));

  let cluesSaved = 0;
  for (let i = 0; i < solvedCount; i++) {
    cluesSaved += Math.max(0, perWitness[i].cluesAvailable - perWitness[i].cluesUsed);
  }

  const earlyRuleBonus = (puzzle.witnesses.length - solvedCount) * 5;
  const total = cluesSaved + earlyRuleBonus;

  return { perWitness, cluesSaved, earlyRuleBonus, total };
}
