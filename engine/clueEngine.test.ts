import { describe, it, expect } from "vitest";
import {
  cluesFor,
  clueTemplates,
  nextClue,
  orderedCluesFor,
  generateClueSequence,
  clueCountByTier,
} from "./clueEngine";

describe("clueTemplates", () => {
  it("is a non-empty array", () => {
    expect(clueTemplates.length).toBeGreaterThan(0);
  });
});

describe("cluesFor", () => {
  it("returns at least one clue for any target", () => {
    for (const n of [1, 7, 83, 100, 360, 997]) {
      expect(cluesFor(n).length).toBeGreaterThan(0);
    }
  });

  it("every clue matches its own target", () => {
    for (const n of [1, 7, 12, 83, 100, 360, 500, 997]) {
      for (const clue of cluesFor(n)) {
        expect(clue.matches(n), `clue "${clue.text}" failed for target ${n}`).toBe(true);
      }
    }
  });

  it("every clue has a non-empty id and text", () => {
    for (const clue of cluesFor(83)) {
      expect(clue.id.length).toBeGreaterThan(0);
      expect(clue.text.length).toBeGreaterThan(0);
    }
  });
});

describe("specific clue text", () => {
  it("digit count", () => {
    const clues = cluesFor(83);
    expect(clues.find((c) => c.id === "digit-count-2")?.text).toBe(
      "this number has 2 digits"
    );
  });

  it("parity — even", () => {
    const clues = cluesFor(12);
    expect(clues.find((c) => c.id === "is-even")?.text).toBe("this number is even");
  });

  it("parity — odd", () => {
    const clues = cluesFor(83);
    expect(clues.find((c) => c.id === "is-odd")?.text).toBe("this number is odd");
  });

  it("primality — prime", () => {
    const clues = cluesFor(83);
    expect(clues.find((c) => c.id === "is-prime")?.text).toBe("this number is prime");
  });

  it("primality — not prime", () => {
    const clues = cluesFor(12);
    expect(clues.find((c) => c.id === "is-not-prime")?.text).toBe(
      "this number is not prime"
    );
  });

  it("digit sum value", () => {
    const clues = cluesFor(83); // digitSum = 11
    expect(clues.find((c) => c.id === "digit-sum-11")?.text).toBe(
      "the digit sum of this number is 11"
    );
  });

  it("last digit", () => {
    const clues = cluesFor(83);
    expect(clues.find((c) => c.id === "last-digit-3")?.text).toBe(
      "the last digit of this number is 3"
    );
  });

  it("first digit — not present for 1-digit numbers", () => {
    const clues = cluesFor(7);
    expect(clues.find((c) => c.id.startsWith("first-digit"))).toBeUndefined();
  });

  it("first digit — present for multi-digit numbers", () => {
    const clues = cluesFor(83);
    expect(clues.find((c) => c.id === "first-digit-8")?.text).toBe(
      "the first digit of this number is 8"
    );
  });

  it("greater-than threshold — present when target exceeds it", () => {
    const clues = cluesFor(360);
    expect(clues.find((c) => c.id === "greater-than-250")).toBeDefined();
    expect(clues.find((c) => c.id === "greater-than-500")).toBeUndefined();
  });

  it("less-than threshold — present when target is below it", () => {
    const clues = cluesFor(83);
    expect(clues.find((c) => c.id === "less-than-250")).toBeDefined();
    expect(clues.find((c) => c.id === "less-than-500")).toBeDefined();
    expect(clues.find((c) => c.id === "greater-than-100")).toBeUndefined();
  });

  it("divisible-by — present for actual divisors only", () => {
    const clues = cluesFor(12);
    expect(clues.find((c) => c.id === "divisible-by-3")).toBeDefined();
    expect(clues.find((c) => c.id === "divisible-by-4")).toBeDefined();
    expect(clues.find((c) => c.id === "divisible-by-6")).toBeDefined();
    expect(clues.find((c) => c.id === "divisible-by-7")).toBeUndefined();
  });
});

describe("clue matches function", () => {
  it("digit-count clue correctly filters candidates", () => {
    const clue = cluesFor(83).find((c) => c.id === "digit-count-2")!;
    expect(clue.matches(11)).toBe(true);
    expect(clue.matches(99)).toBe(true);
    expect(clue.matches(5)).toBe(false);
    expect(clue.matches(100)).toBe(false);
  });

  it("is-prime clue correctly filters candidates", () => {
    const clue = cluesFor(83).find((c) => c.id === "is-prime")!;
    expect(clue.matches(7)).toBe(true);
    expect(clue.matches(97)).toBe(true);
    expect(clue.matches(4)).toBe(false);
    expect(clue.matches(12)).toBe(false);
  });

  it("divisible-by clue correctly filters candidates", () => {
    const clue = cluesFor(12).find((c) => c.id === "divisible-by-4")!;
    expect(clue.matches(4)).toBe(true);
    expect(clue.matches(100)).toBe(true);
    expect(clue.matches(6)).toBe(false);
    expect(clue.matches(9)).toBe(false);
  });

  it("greater-than clue correctly filters candidates", () => {
    const clue = cluesFor(360).find((c) => c.id === "greater-than-250")!;
    expect(clue.matches(300)).toBe(true);
    expect(clue.matches(999)).toBe(true);
    expect(clue.matches(100)).toBe(false);
    expect(clue.matches(250)).toBe(false);
  });
});

describe("eliminationPower", () => {
  it("returns 0 for empty candidate set", () => {
    const clue = cluesFor(83).find((c) => c.id === "is-prime")!;
    expect(clue.eliminationPower([])).toBe(0);
  });

  it("counts candidates ruled out by is-prime", () => {
    const clue = cluesFor(83).find((c) => c.id === "is-prime")!;
    const candidates = [2, 3, 4, 6, 7]; // primes: 2, 3, 7 — eliminates 4, 6
    expect(clue.eliminationPower(candidates)).toBe(2);
  });

  it("counts candidates ruled out by is-even", () => {
    const clue = cluesFor(12).find((c) => c.id === "is-even")!;
    const candidates = [1, 2, 3, 4, 5]; // even: 2, 4 — eliminates 1, 3, 5
    expect(clue.eliminationPower(candidates)).toBe(3);
  });

  it("counts candidates ruled out by divisible-by-3", () => {
    const clue = cluesFor(12).find((c) => c.id === "divisible-by-3")!;
    const candidates = [3, 6, 7, 9, 10]; // divisible: 3, 6, 9 — eliminates 7, 10
    expect(clue.eliminationPower(candidates)).toBe(2);
  });

  it("returns candidates.length when no candidate matches", () => {
    const clue = cluesFor(83).find((c) => c.id === "is-prime")!;
    const candidates = [4, 6, 8, 9]; // no primes
    expect(clue.eliminationPower(candidates)).toBe(4);
  });

  it("returns 0 when all candidates match", () => {
    const clue = cluesFor(83).find((c) => c.id === "is-prime")!;
    const candidates = [2, 3, 5, 7, 11]; // all prime
    expect(clue.eliminationPower(candidates)).toBe(0);
  });
});

describe("orderedCluesFor", () => {
  it("returns the same clues as cluesFor", () => {
    const unordered = cluesFor(83).map((c) => c.id).sort();
    const ordered = orderedCluesFor(83).map((c) => c.id).sort();
    expect(ordered).toEqual(unordered);
  });

  it("orders clues from least to most specific", () => {
    const allCandidates = Array.from({ length: 999 }, (_, i) => i + 1);
    const clues = orderedCluesFor(83);
    for (let i = 0; i < clues.length - 1; i++) {
      expect(clues[i].eliminationPower(allCandidates)).toBeLessThanOrEqual(
        clues[i + 1].eliminationPower(allCandidates)
      );
    }
  });

  it("first clue is less specific than last clue", () => {
    const allCandidates = Array.from({ length: 999 }, (_, i) => i + 1);
    const clues = orderedCluesFor(83);
    expect(clues[0].eliminationPower(allCandidates)).toBeLessThan(
      clues[clues.length - 1].eliminationPower(allCandidates)
    );
  });
});

describe("nextClue", () => {
  it("returns null when all clues are used", () => {
    const usedClueIds = new Set(cluesFor(83).map((c) => c.id));
    expect(nextClue(83, [83], usedClueIds)).toBeNull();
  });

  it("returns null when no clues are available for target", () => {
    // Use a target with very few clues and mark them all used
    const clues = cluesFor(1);
    const usedClueIds = new Set(clues.map((c) => c.id));
    expect(nextClue(1, [1], usedClueIds)).toBeNull();
  });

  it("skips already-used clues", () => {
    const candidates = Array.from({ length: 999 }, (_, i) => i + 1);
    const first = nextClue(83, candidates, new Set());
    const usedClueIds = new Set([first!.id]);
    const second = nextClue(83, candidates, usedClueIds);
    expect(second).not.toBeNull();
    expect(second!.id).not.toBe(first!.id);
  });

  it("selects the least specific clue with positive elimination power", () => {
    const candidates = Array.from({ length: 999 }, (_, i) => i + 1);
    const clue = nextClue(83, candidates, new Set())!;
    const expected = orderedCluesFor(83).find(
      (c) => c.eliminationPower(candidates) > 0
    )!;
    expect(clue.id).toBe(expected.id);
  });

  it("each successive call produces a valid clue sequence", () => {
    const allCandidates = Array.from({ length: 999 }, (_, i) => i + 1);
    let candidates = [...allCandidates];
    const usedClueIds = new Set<string>();
    const sequence: string[] = [];

    while (true) {
      const clue = nextClue(83, candidates, usedClueIds);
      if (!clue) break;
      expect(clue.matches(83)).toBe(true);
      usedClueIds.add(clue.id);
      candidates = candidates.filter((c) => clue.matches(c));
      sequence.push(clue.id);
      if (candidates.length <= 1) break;
    }

    expect(sequence.length).toBeGreaterThan(0);
    expect(candidates).toContain(83);
  });
});

describe("clueCountByTier", () => {
  it("defines min and max for all three tiers", () => {
    for (const tier of [1, 2, 3] as const) {
      expect(clueCountByTier[tier].min).toBeGreaterThan(0);
      expect(clueCountByTier[tier].max).toBeGreaterThanOrEqual(clueCountByTier[tier].min);
    }
  });

  it("higher tiers have higher or equal min and max", () => {
    expect(clueCountByTier[2].min).toBeGreaterThanOrEqual(clueCountByTier[1].min);
    expect(clueCountByTier[3].min).toBeGreaterThanOrEqual(clueCountByTier[2].min);
    expect(clueCountByTier[2].max).toBeGreaterThanOrEqual(clueCountByTier[1].max);
    expect(clueCountByTier[3].max).toBeGreaterThanOrEqual(clueCountByTier[2].max);
  });
});

describe("generateClueSequence", () => {
  it("returns at least min clues", () => {
    for (const tier of [1, 2, 3] as const) {
      const config = clueCountByTier[tier];
      const sequence = generateClueSequence(83, config);
      expect(sequence.length).toBeGreaterThanOrEqual(config.min);
    }
  });

  it("returns at most max clues", () => {
    for (const tier of [1, 2, 3] as const) {
      const config = clueCountByTier[tier];
      const sequence = generateClueSequence(83, config);
      expect(sequence.length).toBeLessThanOrEqual(config.max);
    }
  });

  it("every clue is true for the target", () => {
    const sequence = generateClueSequence(83, clueCountByTier[2]);
    for (const clue of sequence) {
      expect(clue.matches(83)).toBe(true);
    }
  });

  it("no duplicate clues in sequence", () => {
    const sequence = generateClueSequence(83, clueCountByTier[3]);
    const ids = sequence.map((c) => c.id);
    expect(ids.length).toBe(new Set(ids).size);
  });

  it("target remains in candidates after applying all clues", () => {
    const sequence = generateClueSequence(83, clueCountByTier[1]);
    const allCandidates = Array.from({ length: 999 }, (_, i) => i + 1);
    const remaining = allCandidates.filter((c) => sequence.every((clue) => clue.matches(c)));
    expect(remaining).toContain(83);
  });

  it("respects a custom config", () => {
    const config = { min: 1, max: 2 };
    const sequence = generateClueSequence(83, config);
    expect(sequence.length).toBeGreaterThanOrEqual(1);
    expect(sequence.length).toBeLessThanOrEqual(2);
  });
});
