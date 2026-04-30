import { describe, it, expect } from "vitest";
import { runPuzzle } from "./puzzleRunner";
import { selectWitnesses, orderWitnesses } from "./witnessGenerator";
import { clueCountByTier } from "./clueEngine";
import { tier1Rules } from "./rules/tier1";

const prime = tier1Rules.find((r) => r.id === "prime")!;
const perfectSquare = tier1Rules.find((r) => r.id === "perfect-square")!;

function witnessValues(rule: typeof prime) {
  return orderWitnesses(rule, selectWitnesses(rule));
}

describe("runPuzzle", () => {
  it("returns a result for each witness", () => {
    const values = witnessValues(prime);
    const result = runPuzzle(prime, values, clueCountByTier[1]);
    expect(result.witnesses.length).toBe(values.length);
  });

  it("each witness result has the correct value and inSet flag", () => {
    const values = witnessValues(prime);
    const result = runPuzzle(prime, values, clueCountByTier[1]);
    for (let i = 0; i < values.length; i++) {
      expect(result.witnesses[i].value).toBe(values[i]);
      expect(result.witnesses[i].inSet).toBe(prime.validate(values[i]));
    }
  });

  it("each witness uses at least 1 clue", () => {
    const values = witnessValues(prime);
    const result = runPuzzle(prime, values, clueCountByTier[1]);
    for (const w of result.witnesses) {
      expect(w.cluesUsed).toBeGreaterThanOrEqual(1);
    }
  });

  it("each witness uses at most max clues from the config", () => {
    const config = clueCountByTier[2];
    const values = witnessValues(prime);
    const result = runPuzzle(prime, values, config);
    for (const w of result.witnesses) {
      expect(w.cluesUsed).toBeLessThanOrEqual(config.max);
    }
  });

  it("totalCluesUsed equals sum of per-witness clues", () => {
    const values = witnessValues(prime);
    const result = runPuzzle(prime, values, clueCountByTier[1]);
    const expected = result.witnesses.reduce((sum, w) => sum + w.cluesUsed, 0);
    expect(result.totalCluesUsed).toBe(expected);
  });

  it("all witnesses are solved with a generous clue config", () => {
    const values = witnessValues(prime);
    const result = runPuzzle(prime, values, { min: 1, max: 30 });
    for (const w of result.witnesses) {
      expect(w.solved).toBe(true);
    }
  });

  it("ruleIdentifiedAt is null or a valid 1-based index", () => {
    const values = witnessValues(prime);
    const result = runPuzzle(prime, values, clueCountByTier[2]);
    if (result.ruleIdentifiedAt !== null) {
      expect(result.ruleIdentifiedAt).toBeGreaterThanOrEqual(1);
      expect(result.ruleIdentifiedAt).toBeLessThanOrEqual(values.length);
    }
  });

  it("solved is false when ruleIdentifiedAt is null", () => {
    const values = witnessValues(prime);
    const result = runPuzzle(prime, values, clueCountByTier[2]);
    if (result.ruleIdentifiedAt === null) {
      expect(result.solved).toBe(false);
    }
  });

  it("works for a different rule", () => {
    const values = witnessValues(perfectSquare);
    const result = runPuzzle(perfectSquare, values, { min: 1, max: 30 });
    expect(result.witnesses.length).toBe(values.length);
    expect(result.totalCluesUsed).toBeGreaterThan(0);
    for (const w of result.witnesses) {
      expect(w.solved).toBe(true);
    }
  });

  it("handles an empty witness list", () => {
    const result = runPuzzle(prime, [], clueCountByTier[1]);
    expect(result.witnesses).toHaveLength(0);
    expect(result.totalCluesUsed).toBe(0);
    expect(result.ruleIdentifiedAt).toBeNull();
    expect(result.solved).toBe(false);
  });
});
