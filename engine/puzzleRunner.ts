import { MAX } from "./numberRegistry";
import { enumerateConsistentRules } from "./validator";
import { generateClueSequence } from "./clueEngine";
import type { ClueCountConfig } from "./clueEngine";
import type { Rule } from "./rules";

const allNumbers = Array.from({ length: MAX }, (_, i) => i + 1);

export interface WitnessRunResult {
  value: number;
  inSet: boolean;
  cluesUsed: number;
  solved: boolean;
}

export interface PuzzleRunResult {
  witnesses: WitnessRunResult[];
  ruleIdentifiedAt: number | null; // 1-based index of witness at which rule became uniquely identifiable
  totalCluesUsed: number;
  solved: boolean;
}

export function runPuzzle(
  rule: Rule,
  orderedValues: number[],
  clueConfig: ClueCountConfig
): PuzzleRunResult {
  const witnessResults: WitnessRunResult[] = [];
  const revealedWitnesses: Array<{ value: number; inSet: boolean }> = [];
  let ruleIdentifiedAt: number | null = null;

  for (const value of orderedValues) {
    const inSet = rule.validate(value);
    const clues = generateClueSequence(value, clueConfig);

    let candidates = [...allNumbers];
    let cluesUsed = 0;
    for (const clue of clues) {
      candidates = candidates.filter((c) => clue.matches(c));
      cluesUsed++;
      if (candidates.length === 1) break;
    }

    witnessResults.push({
      value,
      inSet,
      cluesUsed,
      solved: candidates.length === 1 && candidates[0] === value,
    });

    revealedWitnesses.push({ value, inSet });

    if (ruleIdentifiedAt === null) {
      const consistent = enumerateConsistentRules(revealedWitnesses);
      if (consistent.length === 1 && consistent[0].id === rule.id) {
        ruleIdentifiedAt = witnessResults.length;
      }
    }
  }

  const totalCluesUsed = witnessResults.reduce((sum, w) => sum + w.cluesUsed, 0);
  const allWitnessesSolved = witnessResults.every((w) => w.solved);

  return {
    witnesses: witnessResults,
    ruleIdentifiedAt,
    totalCluesUsed,
    solved: allWitnessesSolved && ruleIdentifiedAt !== null,
  };
}
