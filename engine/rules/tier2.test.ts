import { describe, it, expect } from "vitest";
import { tier2Rules } from "./tier2";

describe("tier2Rules", () => {
  it("contains at least 15 rules", () => {
    expect(tier2Rules.length).toBeGreaterThanOrEqual(15);
  });

  it("every rule has tier 2", () => {
    for (const rule of tier2Rules) expect(rule.tier).toBe(2);
  });

  it("every rule id is unique", () => {
    const ids = tier2Rules.map((r) => r.id);
    expect(ids.length).toBe(new Set(ids).size);
  });
});

const rule = (id: string) => tier2Rules.find((r) => r.id === id)!;

describe("modular arithmetic rules", () => {
  it("congruent-1-mod-4", () => {
    const { validate } = rule("congruent-1-mod-4");
    expect(validate(1)).toBe(true);
    expect(validate(5)).toBe(true);
    expect(validate(97)).toBe(true);
    expect(validate(4)).toBe(false);
    expect(validate(3)).toBe(false);
  });

  it("congruent-5-mod-6", () => {
    const { validate } = rule("congruent-5-mod-6");
    expect(validate(5)).toBe(true);
    expect(validate(11)).toBe(true);
    expect(validate(17)).toBe(true);
    expect(validate(6)).toBe(false);
    expect(validate(7)).toBe(false);
  });
});

describe("named sequence rules", () => {
  it("fibonacci", () => {
    const { validate } = rule("fibonacci");
    expect(validate(1)).toBe(true);
    expect(validate(8)).toBe(true);
    expect(validate(89)).toBe(true);
    expect(validate(10)).toBe(false);
  });

  it("triangular", () => {
    const { validate } = rule("triangular");
    expect(validate(1)).toBe(true);
    expect(validate(6)).toBe(true);
    expect(validate(28)).toBe(true);
    expect(validate(7)).toBe(false);
  });

  it("harshad", () => {
    const { validate } = rule("harshad");
    expect(validate(18)).toBe(true);  // 18 % 9 === 0
    expect(validate(21)).toBe(true);  // 21 % 3 === 0
    expect(validate(19)).toBe(false); // 19 % 10 !== 0
  });

  it("abundant", () => {
    const { validate } = rule("abundant");
    expect(validate(12)).toBe(true);  // aliquotSum 16 > 12
    expect(validate(18)).toBe(true);  // aliquotSum 21 > 18
    expect(validate(7)).toBe(false);  // prime, aliquotSum 1
    expect(validate(9)).toBe(false);  // aliquotSum 4 < 9
  });

  it("square-free", () => {
    const { validate } = rule("square-free");
    expect(validate(1)).toBe(true);
    expect(validate(6)).toBe(true);   // 2 × 3
    expect(validate(10)).toBe(true);  // 2 × 5
    expect(validate(4)).toBe(false);  // 2²
    expect(validate(12)).toBe(false); // 2² × 3
  });
});

describe("prime relationship rules", () => {
  it("semiprime", () => {
    const { validate } = rule("semiprime");
    expect(validate(4)).toBe(true);   // 2²
    expect(validate(6)).toBe(true);   // 2 × 3
    expect(validate(15)).toBe(true);  // 3 × 5
    expect(validate(1)).toBe(false);
    expect(validate(2)).toBe(false);  // prime
    expect(validate(8)).toBe(false);  // 2³ — 3 prime factors
  });

  it("twin-prime", () => {
    const { validate } = rule("twin-prime");
    expect(validate(3)).toBe(true);   // (3, 5)
    expect(validate(5)).toBe(true);   // (3, 5) and (5, 7)
    expect(validate(11)).toBe(true);  // (11, 13)
    expect(validate(2)).toBe(false);  // nearest prime gap is 1
    expect(validate(4)).toBe(false);  // not prime
    expect(validate(29)).toBe(true);  // (29, 31)
  });

  it("one-less-than-prime", () => {
    const { validate } = rule("one-less-than-prime");
    expect(validate(1)).toBe(true);   // 2 is prime
    expect(validate(4)).toBe(true);   // 5 is prime
    expect(validate(6)).toBe(true);   // 7 is prime
    expect(validate(3)).toBe(false);  // 4 is not prime
    expect(validate(8)).toBe(false);  // 9 is not prime
  });
});

describe("digit operation rules", () => {
  it("digit-sum-equals-digit-product", () => {
    const { validate } = rule("digit-sum-equals-digit-product");
    expect(validate(5)).toBe(true);   // 5 === 5
    expect(validate(22)).toBe(true);  // 4 === 4
    expect(validate(123)).toBe(true); // 6 === 6
    expect(validate(24)).toBe(false); // 6 !== 8
    expect(validate(11)).toBe(false); // 2 !== 1
  });

  it("digit-sum-perfect-square", () => {
    const { validate } = rule("digit-sum-perfect-square");
    expect(validate(1)).toBe(true);   // digitSum 1
    expect(validate(13)).toBe(true);  // digitSum 4
    expect(validate(9)).toBe(true);   // digitSum 9
    expect(validate(79)).toBe(true);  // digitSum 16
    expect(validate(2)).toBe(false);  // digitSum 2
    expect(validate(12)).toBe(false); // digitSum 3
  });

  it("reverse-is-prime", () => {
    const { validate } = rule("reverse-is-prime");
    expect(validate(13)).toBe(true);  // reverse 31, prime
    expect(validate(32)).toBe(true);  // reverse 23, prime
    expect(validate(2)).toBe(true);   // reverse 2, prime
    expect(validate(10)).toBe(false); // reverse 01 = 1, not prime
    expect(validate(15)).toBe(false); // reverse 51 = 3×17, not prime
  });
});
