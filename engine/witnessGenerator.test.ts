import { describe, it, expect } from "vitest";
import { selectWitnesses, defaultWitnessConfig } from "./witnessGenerator";
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
});
