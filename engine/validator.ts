import { MAX } from "./numberRegistry";
import type { Clue } from "./clueEngine";

const allNumbers = Array.from({ length: MAX }, (_, i) => i + 1);

export interface WitnessValidationResult {
  valid: boolean;
  candidates: number[];
}

export function validateWitness(
  target: number,
  clues: Clue[]
): WitnessValidationResult {
  const candidates = allNumbers.filter((n) => clues.every((clue) => clue.matches(n)));
  return {
    valid: candidates.length === 1 && candidates[0] === target,
    candidates,
  };
}
