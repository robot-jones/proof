import { generateClueSequence, clueCountByTier } from "./clueEngine";
import { validateWitness, validateRule } from "./validator";
import { selectWitnesses, orderWitnesses } from "./witnessGenerator";
import type { Rule } from "./rules";

export interface PuzzleWitness {
  value: number;
  inSet: boolean;
  clues: string[];
}

export interface Puzzle {
  tier: 1 | 2 | 3;
  rule: {
    id: string;
    description: string;
  };
  witnesses: PuzzleWitness[];
}

export interface PuzzleGenerationResult {
  puzzle: Puzzle | null;
  failureReason?: "ambiguous-witness" | "ambiguous-rule";
  failingWitness?: number; // value of the witness that failed Pass 1, if applicable
}

export function generatePuzzle(rule: Rule): PuzzleGenerationResult {
  const { tier } = rule;
  const config = clueCountByTier[tier];

  const values = selectWitnesses(rule);
  const ordered = orderWitnesses(rule, values);

  const witnesses: PuzzleWitness[] = [];

  for (const value of ordered) {
    const clues = generateClueSequence(value, config);
    const result = validateWitness(value, clues);
    if (!result.valid) {
      return { puzzle: null, failureReason: "ambiguous-witness", failingWitness: value };
    }
    witnesses.push({ value, inSet: rule.validate(value), clues: clues.map((c) => c.text) });
  }

  const witnessSet = witnesses.map((w) => ({ value: w.value, inSet: w.inSet }));
  const ruleResult = validateRule(witnessSet, rule);
  if (!ruleResult.valid) {
    return { puzzle: null, failureReason: "ambiguous-rule" };
  }

  return {
    puzzle: { tier, rule: { id: rule.id, description: rule.description }, witnesses },
  };
}
