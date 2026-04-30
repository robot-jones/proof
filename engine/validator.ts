import { MAX } from "./numberRegistry";
import { rules } from "./rules";
import type { Rule } from "./rules";
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

// --- Pass 2: rule-level uniqueness ---

export type RuleValidationFailureReason =
  | "ambiguous"        // multiple rules are consistent with the witness set
  | "no-matching-rule" // no rule fits — witnesses are contradictory
  | "wrong-rule";      // exactly one rule fits but it isn't the target

export interface RuleValidationResult {
  valid: boolean;
  matchingRules: Rule[];
  reason?: RuleValidationFailureReason;
}

export function validateRule(
  witnesses: Array<{ value: number; inSet: boolean }>,
  targetRule: Rule
): RuleValidationResult {
  const matchingRules = rules.filter((r) =>
    witnesses.every((w) => r.validate(w.value) === w.inSet)
  );

  if (matchingRules.length === 1 && matchingRules[0].id === targetRule.id) {
    return { valid: true, matchingRules };
  }

  let reason: RuleValidationFailureReason;
  if (matchingRules.length === 0) {
    reason = "no-matching-rule";
  } else if (matchingRules.length === 1) {
    reason = "wrong-rule";
  } else {
    reason = "ambiguous";
  }

  return { valid: false, matchingRules, reason };
}

export function assertValidRule(
  witnesses: Array<{ value: number; inSet: boolean }>,
  targetRule: Rule
): void {
  const result = validateRule(witnesses, targetRule);
  if (!result.valid) {
    throw new Error(
      `Rule validation failed: ${result.reason} — ${result.matchingRules.length} matching rule(s)`
    );
  }
}
