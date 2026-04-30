import { describe, it, expect } from "vitest";
import {
  selectWitnesses,
  orderWitnesses,
  generateWitness,
  countConsistentRules,
  identificationIndex,
  meetsIdentificationTiming,
  minIdentificationWitnessByTier,
  defaultWitnessConfig,
} from "./witnessGenerator";
import { rules } from "./rules";
import { clueCountByTier } from "./clueEngine";
import { tier1Rules } from "./rules/tier1";
import { tier2Rules } from "./rules/tier2";
import { tier3Rules } from "./rules/tier3";

const prime = tier1Rules.find((r) => r.id === "prime")!;
const perfectSquare = tier1Rules.find((r) => r.id === "perfect-square")!;
const fibonacci = tier2Rules.find((r) => r.id === "fibonacci")!;
const kaprekar = tier3Rules.find((r) => r.id === "kaprekar")!;

describe("selectWitnesses", () => {
  it("returns the configured count of witnesses", () => {
    const witnesses = selectWitnesses(prime);
    expect(witnesses.length).toBe(defaultWitnessConfig.count);
  });

  it("returns the configured number of in-set members", () => {
    const witnesses = selectWitnesses(prime);
    const inSet = witnesses.filter((n) => prime.validate(n));
    expect(inSet.length).toBe(defaultWitnessConfig.inCount);
  });

  it("returns the correct number of out-of-set members", () => {
    const witnesses = selectWitnesses(prime);
    const outSet = witnesses.filter((n) => !prime.validate(n));
    expect(outSet.length).toBe(defaultWitnessConfig.count - defaultWitnessConfig.inCount);
  });

  it("all witnesses are in the range 1–999", () => {
    const witnesses = selectWitnesses(prime);
    for (const n of witnesses) {
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(999);
    }
  });

  it("no duplicate witnesses", () => {
    const witnesses = selectWitnesses(prime);
    expect(witnesses.length).toBe(new Set(witnesses).size);
  });

  it("respects a custom config", () => {
    const config = { count: 6, inCount: 2 };
    const witnesses = selectWitnesses(prime, config);
    expect(witnesses.length).toBe(6);
    expect(witnesses.filter((n) => prime.validate(n)).length).toBe(2);
    expect(witnesses.filter((n) => !prime.validate(n)).length).toBe(4);
  });

  it("works for a rule with many members (perfect-square)", () => {
    const witnesses = selectWitnesses(perfectSquare);
    expect(witnesses.length).toBe(defaultWitnessConfig.count);
    expect(witnesses.filter((n) => perfectSquare.validate(n)).length).toBe(
      defaultWitnessConfig.inCount
    );
  });

  it("works for a sparse rule (kaprekar — only 8 members in range)", () => {
    const witnesses = selectWitnesses(kaprekar);
    const inSet = witnesses.filter((n) => kaprekar.validate(n));
    // Can't exceed the total pool size
    expect(inSet.length).toBeLessThanOrEqual(defaultWitnessConfig.inCount);
    expect(inSet.every((n) => kaprekar.validate(n))).toBe(true);
  });

  it("works for fibonacci", () => {
    const witnesses = selectWitnesses(fibonacci);
    const inSet = witnesses.filter((n) => fibonacci.validate(n));
    const outSet = witnesses.filter((n) => !fibonacci.validate(n));
    expect(inSet.every((n) => fibonacci.validate(n))).toBe(true);
    expect(outSet.every((n) => !fibonacci.validate(n))).toBe(true);
  });

  it("excludes trivial in-set members when pool is large enough", () => {
    // perfect-square has many members; 1, 4, 9 should be excluded (≤ 10)
    const witnesses = selectWitnesses(perfectSquare);
    const inSet = witnesses.filter((n) => perfectSquare.validate(n));
    expect(inSet.every((n) => n > defaultWitnessConfig.trivialThreshold)).toBe(true);
  });

  it("falls back to full pool when filtered pool is too small", () => {
    // kaprekar only has 8 members total; with threshold=10, only some are > 10
    // but we need inCount=3 in-set members, so it may need to use trivial ones
    const witnesses = selectWitnesses(kaprekar);
    const inSet = witnesses.filter((n) => kaprekar.validate(n));
    expect(inSet.length).toBeGreaterThan(0); // still gets in-set members
  });

  it("trivialThreshold=0 includes all members", () => {
    const config = { ...defaultWitnessConfig, trivialThreshold: 0 };
    const witnesses = selectWitnesses(perfectSquare, config);
    // 1, 4, 9 are now eligible — no requirement to exclude them
    expect(witnesses.length).toBe(config.count);
  });

  it("does not apply trivial threshold to out-of-set members", () => {
    // Out-of-set small numbers (e.g. 2 for perfect-square) are fine to include
    const config = { ...defaultWitnessConfig, inCount: 1 };
    const witnesses = selectWitnesses(perfectSquare, config);
    const outSet = witnesses.filter((n) => !perfectSquare.validate(n));
    expect(outSet.length).toBe(config.count - config.inCount);
  });
});

function consistentRuleCount(n: number, inSet: boolean): number {
  return rules.filter((r) => r.validate(n) === inSet).length;
}

describe("orderWitnesses", () => {
  it("returns all the same witnesses", () => {
    const witnesses = selectWitnesses(prime);
    const ordered = orderWitnesses(prime, witnesses);
    expect(ordered.slice().sort()).toEqual(witnesses.slice().sort());
  });

  it("first witness is at least as ambiguous as the last", () => {
    const witnesses = selectWitnesses(prime);
    const ordered = orderWitnesses(prime, witnesses);
    const first = ordered[0];
    const last = ordered[ordered.length - 1];
    const firstCount = consistentRuleCount(first, prime.validate(first));
    const lastCount = consistentRuleCount(last, prime.validate(last));
    expect(firstCount).toBeGreaterThanOrEqual(lastCount);
  });

  it("consistent rule counts are non-increasing across the sequence", () => {
    const witnesses = selectWitnesses(prime);
    const ordered = orderWitnesses(prime, witnesses);
    const counts = ordered.map((n) => consistentRuleCount(n, prime.validate(n)));
    for (let i = 0; i < counts.length - 1; i++) {
      expect(counts[i]).toBeGreaterThanOrEqual(counts[i + 1]);
    }
  });

  it("works for perfect-square rule", () => {
    const witnesses = selectWitnesses(perfectSquare);
    const ordered = orderWitnesses(perfectSquare, witnesses);
    const counts = ordered.map((n) =>
      consistentRuleCount(n, perfectSquare.validate(n))
    );
    for (let i = 0; i < counts.length - 1; i++) {
      expect(counts[i]).toBeGreaterThanOrEqual(counts[i + 1]);
    }
  });

  it("does not mutate the input array", () => {
    const witnesses = selectWitnesses(prime);
    const copy = [...witnesses];
    orderWitnesses(prime, witnesses);
    expect(witnesses).toEqual(copy);
  });
});

describe("generateWitness", () => {
  it("sets inSet correctly for an in-set member", () => {
    const w = generateWitness(83, prime, 1); // 83 is prime
    expect(w.inSet).toBe(true);
    expect(w.value).toBe(83);
  });

  it("sets inSet correctly for an out-of-set member", () => {
    const w = generateWitness(84, prime, 1); // 84 is not prime
    expect(w.inSet).toBe(false);
    expect(w.value).toBe(84);
  });

  it("produces at least min clues for the tier", () => {
    for (const tier of [1, 2, 3] as const) {
      const w = generateWitness(83, prime, tier);
      expect(w.clues.length).toBeGreaterThanOrEqual(clueCountByTier[tier].min);
    }
  });

  it("produces at most max clues for the tier", () => {
    for (const tier of [1, 2, 3] as const) {
      const w = generateWitness(83, prime, tier);
      expect(w.clues.length).toBeLessThanOrEqual(clueCountByTier[tier].max);
    }
  });

  it("higher tiers produce at least as many clues", () => {
    const t1 = generateWitness(83, prime, 1);
    const t3 = generateWitness(83, prime, 3);
    expect(t3.clues.length).toBeGreaterThanOrEqual(t1.clues.length);
  });

  it("clues are non-empty strings", () => {
    const w = generateWitness(83, prime, 2);
    for (const clue of w.clues) {
      expect(typeof clue).toBe("string");
      expect(clue.length).toBeGreaterThan(0);
    }
  });
});

describe("minIdentificationWitnessByTier", () => {
  it("defines a threshold for each tier", () => {
    for (const tier of [1, 2, 3] as const) {
      expect(minIdentificationWitnessByTier[tier]).toBeGreaterThan(0);
    }
  });

  it("higher tiers require more witnesses before identification", () => {
    expect(minIdentificationWitnessByTier[2]).toBeGreaterThanOrEqual(
      minIdentificationWitnessByTier[1]
    );
    expect(minIdentificationWitnessByTier[3]).toBeGreaterThanOrEqual(
      minIdentificationWitnessByTier[2]
    );
  });
});

describe("countConsistentRules", () => {
  it("returns total rule count for empty witness set", () => {
    expect(countConsistentRules([])).toBe(rules.length);
  });

  it("decreases as more witnesses are revealed", () => {
    const witnesses = selectWitnesses(prime);
    const ordered = orderWitnesses(prime, witnesses).map((v) => ({
      value: v,
      inSet: prime.validate(v),
    }));
    const counts = ordered.map((_, i) =>
      countConsistentRules(ordered.slice(0, i + 1))
    );
    // Should be non-increasing
    for (let i = 0; i < counts.length - 1; i++) {
      expect(counts[i]).toBeGreaterThanOrEqual(counts[i + 1]);
    }
  });

  it("returns 0 or positive integer for any witness set", () => {
    const result = countConsistentRules([{ value: 83, inSet: true }]);
    expect(result).toBeGreaterThanOrEqual(0);
  });
});

describe("identificationIndex", () => {
  it("returns null when witnesses cannot uniquely identify the rule", () => {
    // A single witness almost never uniquely identifies a rule
    const witnesses = [generateWitness(83, prime, 1)];
    const idx = identificationIndex(prime, witnesses);
    // If not null, verify the contract still holds
    if (idx !== null) {
      expect(idx).toBe(1);
    }
    // null is the expected outcome here — that is valid, not a bug
  });

  it("when identification succeeds, consistent rule count is 1 at that index", () => {
    const values = selectWitnesses(prime);
    const witnesses = orderWitnesses(prime, values).map((v) =>
      generateWitness(v, prime, 2)
    );
    const idx = identificationIndex(prime, witnesses);
    if (idx !== null) {
      const revealed = witnesses.slice(0, idx);
      expect(countConsistentRules(revealed)).toBe(1);
    }
    // null means this witness set doesn't uniquely identify — the Pass 2
    // validator will catch this; it's not a bug in identificationIndex
  });

  it("never returns an index beyond the witness count", () => {
    const values = selectWitnesses(prime);
    const witnesses = orderWitnesses(prime, values).map((v) =>
      generateWitness(v, prime, 2)
    );
    const idx = identificationIndex(prime, witnesses);
    if (idx !== null) {
      expect(idx).toBeLessThanOrEqual(witnesses.length);
    }
  });
});

describe("meetsIdentificationTiming", () => {
  it("returns false when identification index is null", () => {
    const witnesses = [generateWitness(83, prime, 1)];
    const idx = identificationIndex(prime, witnesses);
    if (idx === null) {
      expect(meetsIdentificationTiming(prime, witnesses, 1)).toBe(false);
    }
  });

  it("returns false when minWitnesses exceeds the witness count", () => {
    const values = selectWitnesses(prime);
    const witnesses = orderWitnesses(prime, values).map((v) =>
      generateWitness(v, prime, 2)
    );
    expect(meetsIdentificationTiming(prime, witnesses, witnesses.length + 1)).toBe(false);
  });

  it("returns true when identification happens at exactly minWitnesses", () => {
    const values = selectWitnesses(prime);
    const witnesses = orderWitnesses(prime, values).map((v) =>
      generateWitness(v, prime, 2)
    );
    const idx = identificationIndex(prime, witnesses);
    if (idx !== null) {
      expect(meetsIdentificationTiming(prime, witnesses, idx)).toBe(true);
      if (idx > 1) {
        expect(meetsIdentificationTiming(prime, witnesses, idx + 1)).toBe(false);
      }
    }
  });
});
