import { describe, it, expect } from "vitest";
import { validateWitness, assertValidWitness } from "./validator";
import { generateClueSequence, clueCountByTier, cluesFor } from "./clueEngine";

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
