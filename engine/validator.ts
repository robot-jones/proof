import { MAX } from "./numberRegistry";
import type { Clue } from "./clueEngine";

const allNumbers = Array.from({ length: MAX }, (_, i) => i + 1);

export type ValidationFailureReason =
  | "ambiguous"     // multiple candidates remain
  | "no-candidates" // clues are contradictory — target eliminated itself
  | "wrong-target"; // one candidate remains but it isn't the target

export interface WitnessValidationResult {
  valid: boolean;
  candidates: number[];
  reason?: ValidationFailureReason;
}

export function validateWitness(
  target: number,
  clues: Clue[]
): WitnessValidationResult {
  const candidates = allNumbers.filter((n) => clues.every((clue) => clue.matches(n)));

  if (candidates.length === 1 && candidates[0] === target) {
    return { valid: true, candidates };
  }

  let reason: ValidationFailureReason;
  if (candidates.length === 0) {
    reason = "no-candidates";
  } else if (candidates.length === 1) {
    reason = "wrong-target";
  } else {
    reason = "ambiguous";
  }

  return { valid: false, candidates, reason };
}

export function assertValidWitness(target: number, clues: Clue[]): void {
  const result = validateWitness(target, clues);
  if (!result.valid) {
    throw new Error(
      `Witness ${target} failed validation: ${result.reason} — ${result.candidates.length} candidate(s) remain`
    );
  }
}
