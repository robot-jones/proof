import { describe, it, expect } from "vitest";
import { tier3Rules } from "./tier3";

describe("tier3Rules", () => {
  it("contains at least 8 rules", () => {
    expect(tier3Rules.length).toBeGreaterThanOrEqual(8);
  });

  it("every rule has tier 3", () => {
    for (const rule of tier3Rules) expect(rule.tier).toBe(3);
  });

  it("every rule id is unique", () => {
    const ids = tier3Rules.map((r) => r.id);
    expect(ids.length).toBe(new Set(ids).size);
  });
});

const rule = (id: string) => tier3Rules.find((r) => r.id === id)!;

describe("self-referential rules", () => {
  it("narcissistic", () => {
    const { validate } = rule("narcissistic");
    expect(validate(1)).toBe(true);   // 1^1 = 1
    expect(validate(9)).toBe(true);   // 9^1 = 9
    expect(validate(153)).toBe(true); // 1³ + 5³ + 3³ = 153
    expect(validate(370)).toBe(true); // 3³ + 7³ + 0³ = 370
    expect(validate(371)).toBe(true); // 3³ + 7³ + 1³ = 371
    expect(validate(407)).toBe(true); // 4³ + 0³ + 7³ = 407
    expect(validate(10)).toBe(false);
    expect(validate(154)).toBe(false);
  });

  it("happy", () => {
    const { validate } = rule("happy");
    expect(validate(1)).toBe(true);
    expect(validate(7)).toBe(true);
    expect(validate(13)).toBe(true);
    expect(validate(19)).toBe(true);
    expect(validate(2)).toBe(false);
    expect(validate(4)).toBe(false);
    expect(validate(11)).toBe(false);
  });

  it("kaprekar", () => {
    const { validate } = rule("kaprekar");
    expect(validate(1)).toBe(true);
    expect(validate(9)).toBe(true);   // 81 → 8+1 = 9
    expect(validate(45)).toBe(true);  // 2025 → 20+25 = 45
    expect(validate(55)).toBe(true);  // 3025 → 30+25 = 55
    expect(validate(99)).toBe(true);  // 9801 → 98+01 = 99
    expect(validate(297)).toBe(true); // 88209 → 88+209 = 297
    expect(validate(703)).toBe(true); // 494209 → 494+209 = 703
    expect(validate(999)).toBe(true); // 998001 → 998+001 = 999
    expect(validate(10)).toBe(false);
    expect(validate(12)).toBe(false);
  });
});

describe("cross-base rules", () => {
  it("palindrome-in-binary", () => {
    const { validate } = rule("palindrome-in-binary");
    expect(validate(1)).toBe(true);  // 1
    expect(validate(3)).toBe(true);  // 11
    expect(validate(5)).toBe(true);  // 101
    expect(validate(7)).toBe(true);  // 111
    expect(validate(9)).toBe(true);  // 1001
    expect(validate(2)).toBe(false); // 10
    expect(validate(4)).toBe(false); // 100
    expect(validate(6)).toBe(false); // 110
  });

  it("power-of-2", () => {
    const { validate } = rule("power-of-2");
    expect(validate(1)).toBe(true);
    expect(validate(2)).toBe(true);
    expect(validate(4)).toBe(true);
    expect(validate(128)).toBe(true);
    expect(validate(512)).toBe(true);
    expect(validate(3)).toBe(false);
    expect(validate(6)).toBe(false);
    expect(validate(100)).toBe(false);
  });
});

describe("composite relationship rules", () => {
  it("sum-of-two-squares", () => {
    const { validate } = rule("sum-of-two-squares");
    expect(validate(1)).toBe(true);  // 0² + 1²
    expect(validate(2)).toBe(true);  // 1² + 1²
    expect(validate(4)).toBe(true);  // 0² + 2²
    expect(validate(5)).toBe(true);  // 1² + 2²
    expect(validate(9)).toBe(true);  // 0² + 3²
    expect(validate(10)).toBe(true); // 1² + 3²
    expect(validate(3)).toBe(false);
    expect(validate(6)).toBe(false);
    expect(validate(7)).toBe(false);
  });

  it("emirp", () => {
    const { validate } = rule("emirp");
    expect(validate(13)).toBe(true);  // reverse 31, prime
    expect(validate(17)).toBe(true);  // reverse 71, prime
    expect(validate(31)).toBe(true);  // reverse 13, prime
    expect(validate(97)).toBe(true);  // reverse 79, prime
    expect(validate(11)).toBe(false); // palindromic prime
    expect(validate(101)).toBe(false); // palindromic prime
    expect(validate(4)).toBe(false);  // not prime
  });

  it("sophie-germain-prime", () => {
    const { validate } = rule("sophie-germain-prime");
    expect(validate(2)).toBe(true);  // 2*2+1 = 5, prime
    expect(validate(3)).toBe(true);  // 2*3+1 = 7, prime
    expect(validate(5)).toBe(true);  // 2*5+1 = 11, prime
    expect(validate(11)).toBe(true); // 2*11+1 = 23, prime
    expect(validate(23)).toBe(true); // 2*23+1 = 47, prime
    expect(validate(7)).toBe(false); // 2*7+1 = 15, not prime
    expect(validate(13)).toBe(false); // 2*13+1 = 27, not prime
    expect(validate(4)).toBe(false); // not prime
  });
});
