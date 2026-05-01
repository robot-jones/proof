import { describe, it, expect } from "vitest";
import { generatePuzzle } from "./puzzleGenerator";
import { tier1Rules } from "./rules/tier1";
import { tier3Rules } from "./rules/tier3";

const prime = tier1Rules.find((r) => r.id === "prime")!;
const perfectSquare = tier1Rules.find((r) => r.id === "perfect-square")!;
const kaprekar = tier3Rules.find((r) => r.id === "kaprekar")!;

describe("generatePuzzle", () => {
  it("returns a puzzle or a failure reason — never both null", () => {
    const result = generatePuzzle(prime);
    expect(result.puzzle !== null || result.failureReason !== undefined).toBe(true);
  });

  it("puzzle tier matches the rule tier", () => {
    const result = generatePuzzle(prime);
    if (result.puzzle) {
      expect(result.puzzle.tier).toBe(prime.tier);
    }
  });

  it("puzzle rule id and description match the rule", () => {
    const result = generatePuzzle(prime);
    if (result.puzzle) {
      expect(result.puzzle.rule.id).toBe(prime.id);
      expect(result.puzzle.rule.description).toBe(prime.description);
    }
  });

  it("all witnesses have non-empty clue arrays", () => {
    const result = generatePuzzle(prime);
    if (result.puzzle) {
      for (const w of result.puzzle.witnesses) {
        expect(w.clues.length).toBeGreaterThan(0);
      }
    }
  });

  it("witness inSet flags match the rule", () => {
    const result = generatePuzzle(prime);
    if (result.puzzle) {
      for (const w of result.puzzle.witnesses) {
        expect(w.inSet).toBe(prime.validate(w.value));
      }
    }
  });

  it("witness mix includes both in-set and out-of-set members", () => {
    const result = generatePuzzle(prime);
    if (result.puzzle) {
      const inSet = result.puzzle.witnesses.filter((w) => w.inSet);
      const outSet = result.puzzle.witnesses.filter((w) => !w.inSet);
      expect(inSet.length).toBeGreaterThan(0);
      expect(outSet.length).toBeGreaterThan(0);
    }
  });

  it("works for perfect-square rule", () => {
    const result = generatePuzzle(perfectSquare);
    expect(result.puzzle !== null || result.failureReason !== undefined).toBe(true);
  });

  it("handles sparse rules gracefully (kaprekar)", () => {
    const result = generatePuzzle(kaprekar);
    // May succeed or fail — either is valid; should not throw
    expect(result.puzzle !== null || result.failureReason !== undefined).toBe(true);
  });

  it("failure result includes a reason", () => {
    // We can't force a failure reliably, but if one occurs it must have a reason
    const result = generatePuzzle(prime);
    if (!result.puzzle) {
      expect(result.failureReason).toBeDefined();
    }
  });
});
