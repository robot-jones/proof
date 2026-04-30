import { describe, it, expect } from "vitest";
import {
  validateWitness,
  assertValidWitness,
  validateRule,
  assertValidRule,
  enumerateConsistentRules,
} from "./validator";
import { generateClueSequence, clueCountByTier, cluesFor } from "./clueEngine";
import { selectWitnesses, orderWitnesses } from "./witnessGenerator";
import { rules } from "./rules";
import { tier1Rules } from "./rules/tier1";

const prime = tier1Rules.find((r) => r.id === "prime")!;

describe("validateWitness", () => {
  it("is valid when the full sequence resolves to exactly the target", () => {
    const clues = generateClueSequence(83, { min: 1, max: 30 });
    const result = validateWitness(83, clues);
    expect(result.valid).toBe(true);
    expect(result.candidates).toEqual([83]);
  });

  it("is invalid with no clues — all candidates remain", () => {
    const result = validateWitness(83, []);
    expect(result.valid).toBe(false);
    expect(result.candidates.length).toBe(999);
  });

  it("is invalid when multiple candidates remain", () => {
    // A single broad clue leaves many candidates
    const clue = cluesFor(83).find((c) => c.id === "is-odd")!;
    const result = validateWitness(83, [clue]);
    expect(result.valid).toBe(false);
    expect(result.candidates.length).toBeGreaterThan(1);
    expect(result.candidates).toContain(83);
  });

  it("target is always present in candidates when clues are truthful", () => {
    const clues = generateClueSequence(83, clueCountByTier[1]);
    const result = validateWitness(83, clues);
    expect(result.candidates).toContain(83);
  });

  it("works correctly for a variety of targets", () => {
    for (const target of [1, 7, 100, 360, 997]) {
      const clues = generateClueSequence(target, { min: 1, max: 30 });
      const result = validateWitness(target, clues);
      expect(result.valid).toBe(true);
      expect(result.candidates).toEqual([target]);
    }
  });

  it("sets reason to 'ambiguous' when multiple candidates remain", () => {
    const clue = cluesFor(83).find((c) => c.id === "is-odd")!;
    const result = validateWitness(83, [clue]);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("ambiguous");
  });

  it("sets no reason when valid", () => {
    const clues = generateClueSequence(83, { min: 1, max: 30 });
    const result = validateWitness(83, clues);
    expect(result.reason).toBeUndefined();
  });
});

describe("assertValidWitness", () => {
  it("does not throw for a valid witness", () => {
    const clues = generateClueSequence(83, { min: 1, max: 30 });
    expect(() => assertValidWitness(83, clues)).not.toThrow();
  });

  it("throws for an ambiguous witness", () => {
    const clue = cluesFor(83).find((c) => c.id === "is-odd")!;
    expect(() => assertValidWitness(83, [clue])).toThrow(/ambiguous/);
  });

  it("throws for an empty clue set", () => {
    expect(() => assertValidWitness(83, [])).toThrow(/ambiguous/);
  });

  it("error message includes the target and candidate count", () => {
    const clue = cluesFor(83).find((c) => c.id === "is-odd")!;
    expect(() => assertValidWitness(83, [clue])).toThrow(/83/);
  });
});

describe("validateRule", () => {
  it("is ambiguous with no witnesses — all rules match", () => {
    const result = validateRule([], prime);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("ambiguous");
    expect(result.matchingRules.length).toBe(rules.length);
  });

  it("matchingRules always contains the target rule when witnesses are truthful", () => {
    const values = selectWitnesses(prime);
    const witnesses = orderWitnesses(prime, values).map((v) => ({
      value: v,
      inSet: prime.validate(v),
    }));
    const result = validateRule(witnesses, prime);
    expect(result.matchingRules.some((r) => r.id === prime.id)).toBe(true);
  });

  it("sets reason to 'ambiguous' when multiple rules match", () => {
    // A single witness is rarely enough to uniquely identify a rule
    const result = validateRule([{ value: 83, inSet: true }], prime);
    if (!result.valid) {
      expect(result.reason).toBe("ambiguous");
    }
  });

  it("sets reason to 'no-matching-rule' for contradictory witnesses", () => {
    // Same value marked both in-set and out-of-set — no rule can satisfy both
    const witnesses = [
      { value: 83, inSet: true },
      { value: 83, inSet: false },
    ];
    const result = validateRule(witnesses, prime);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("no-matching-rule");
    expect(result.matchingRules.length).toBe(0);
  });

  it("sets no reason when valid", () => {
    const values = selectWitnesses(prime);
    const witnesses = orderWitnesses(prime, values).map((v) => ({
      value: v,
      inSet: prime.validate(v),
    }));
    const result = validateRule(witnesses, prime);
    if (result.valid) {
      expect(result.reason).toBeUndefined();
    }
  });
});

describe("enumerateConsistentRules", () => {
  it("returns all rules for an empty witness set", () => {
    const consistent = enumerateConsistentRules([]);
    expect(consistent.length).toBe(rules.length);
  });

  it("always includes the target rule when witnesses are truthful", () => {
    const witnesses = [{ value: 83, inSet: prime.validate(83) }];
    const consistent = enumerateConsistentRules(witnesses);
    expect(consistent.some((r) => r.id === prime.id)).toBe(true);
  });

  it("returns an empty array for contradictory witnesses", () => {
    const witnesses = [
      { value: 83, inSet: true },
      { value: 83, inSet: false },
    ];
    expect(enumerateConsistentRules(witnesses)).toHaveLength(0);
  });

  it("count is non-increasing as more witnesses are added", () => {
    const values = selectWitnesses(prime);
    const witnesses = orderWitnesses(prime, values).map((v) => ({
      value: v,
      inSet: prime.validate(v),
    }));
    let prev = rules.length;
    for (let k = 1; k <= witnesses.length; k++) {
      const count = enumerateConsistentRules(witnesses.slice(0, k)).length;
      expect(count).toBeLessThanOrEqual(prev);
      prev = count;
    }
  });

  it("every returned rule correctly predicts all witness memberships", () => {
    const witnesses = [
      { value: 83, inSet: true },
      { value: 84, inSet: false },
    ];
    for (const rule of enumerateConsistentRules(witnesses)) {
      expect(rule.validate(83)).toBe(true);
      expect(rule.validate(84)).toBe(false);
    }
  });
});

describe("assertValidRule", () => {
  it("throws for contradictory witnesses", () => {
    const witnesses = [
      { value: 83, inSet: true },
      { value: 83, inSet: false },
    ];
    expect(() => assertValidRule(witnesses, prime)).toThrow(/no-matching-rule/);
  });

  it("throws for an empty witness set", () => {
    expect(() => assertValidRule([], prime)).toThrow(/ambiguous/);
  });

  it("does not throw when exactly one rule matches", () => {
    const values = selectWitnesses(prime);
    const witnesses = orderWitnesses(prime, values).map((v) => ({
      value: v,
      inSet: prime.validate(v),
    }));
    const result = validateRule(witnesses, prime);
    if (result.valid) {
      expect(() => assertValidRule(witnesses, prime)).not.toThrow();
    }
  });
});
