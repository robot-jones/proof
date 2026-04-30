import { describe, it, expect } from "vitest";
import { tier1Rules } from "./tier1";

describe("tier1Rules", () => {
  it("contains at least 20 rules", () => {
    expect(tier1Rules.length).toBeGreaterThanOrEqual(20);
  });

  it("every rule has tier 1", () => {
    for (const rule of tier1Rules) expect(rule.tier).toBe(1);
  });

  it("every rule id is unique", () => {
    const ids = tier1Rules.map((r) => r.id);
    expect(ids.length).toBe(new Set(ids).size);
  });
});

const rule = (id: string) => tier1Rules.find((r) => r.id === id)!;

describe("divisibility rules", () => {
  it("divisible-by-7", () => {
    const { validate } = rule("divisible-by-7");
    expect(validate(7)).toBe(true);
    expect(validate(49)).toBe(true);
    expect(validate(8)).toBe(false);
  });

  it("divisible-by-11", () => {
    const { validate } = rule("divisible-by-11");
    expect(validate(11)).toBe(true);
    expect(validate(121)).toBe(true);
    expect(validate(12)).toBe(false);
  });
});

describe("factor count rules", () => {
  it("prime", () => {
    const { validate } = rule("prime");
    expect(validate(2)).toBe(true);
    expect(validate(97)).toBe(true);
    expect(validate(1)).toBe(false);
    expect(validate(4)).toBe(false);
  });

  it("exactly-3-factors", () => {
    // squares of primes: 4, 9, 25, 49, ...
    const { validate } = rule("exactly-3-factors");
    expect(validate(4)).toBe(true);
    expect(validate(9)).toBe(true);
    expect(validate(25)).toBe(true);
    expect(validate(6)).toBe(false);
  });

  it("factor-count-prime", () => {
    const { validate } = rule("factor-count-prime");
    expect(validate(2)).toBe(true);  // 2 factors, 2 is prime
    expect(validate(4)).toBe(true);  // 3 factors, 3 is prime
    expect(validate(1)).toBe(false); // 1 factor, 1 is not prime
    expect(validate(6)).toBe(false); // 4 factors, 4 is not prime
  });
});

describe("digit sum rules", () => {
  it("digit-sum-prime", () => {
    const { validate } = rule("digit-sum-prime");
    expect(validate(11)).toBe(true);  // digitSum 2
    expect(validate(83)).toBe(true);  // digitSum 11
    expect(validate(22)).toBe(false); // digitSum 4
    expect(validate(100)).toBe(false); // digitSum 1
  });

  it("digit-sum-even", () => {
    const { validate } = rule("digit-sum-even");
    expect(validate(22)).toBe(true);  // digitSum 4
    expect(validate(13)).toBe(true);  // digitSum 4
    expect(validate(12)).toBe(false); // digitSum 3
    expect(validate(21)).toBe(false); // digitSum 3
  });

  it("digit-sum-greater-than-10", () => {
    const { validate } = rule("digit-sum-greater-than-10");
    expect(validate(29)).toBe(true);  // digitSum 11
    expect(validate(999)).toBe(true); // digitSum 27
    expect(validate(19)).toBe(false); // digitSum 10
    expect(validate(28)).toBe(false); // digitSum 10
  });
});

describe("perfect power rules", () => {
  it("perfect-square", () => {
    const { validate } = rule("perfect-square");
    expect(validate(1)).toBe(true);
    expect(validate(9)).toBe(true);
    expect(validate(100)).toBe(true);
    expect(validate(2)).toBe(false);
  });

  it("perfect-cube", () => {
    const { validate } = rule("perfect-cube");
    expect(validate(1)).toBe(true);
    expect(validate(8)).toBe(true);
    expect(validate(27)).toBe(true);
    expect(validate(4)).toBe(false);
  });
});

describe("digit composition rules", () => {
  it("all-odd-digits", () => {
    const { validate } = rule("all-odd-digits");
    expect(validate(1)).toBe(true);
    expect(validate(13)).toBe(true);
    expect(validate(135)).toBe(true);
    expect(validate(12)).toBe(false);
    expect(validate(10)).toBe(false); // 0 is even
  });

  it("all-even-digits", () => {
    const { validate } = rule("all-even-digits");
    expect(validate(2)).toBe(true);
    expect(validate(24)).toBe(true);
    expect(validate(200)).toBe(true);
    expect(validate(13)).toBe(false);
  });

  it("palindrome", () => {
    const { validate } = rule("palindrome");
    expect(validate(1)).toBe(true);
    expect(validate(121)).toBe(true);
    expect(validate(12)).toBe(false);
  });

  it("no-repeated-digits", () => {
    const { validate } = rule("no-repeated-digits");
    expect(validate(123)).toBe(true);
    expect(validate(1)).toBe(true);
    expect(validate(121)).toBe(false);
    expect(validate(100)).toBe(false);
  });

  it("contains-digit-7", () => {
    const { validate } = rule("contains-digit-7");
    expect(validate(7)).toBe(true);
    expect(validate(17)).toBe(true);
    expect(validate(700)).toBe(true);
    expect(validate(8)).toBe(false);
    expect(validate(123)).toBe(false);
  });

  it("digit-product-prime", () => {
    const { validate } = rule("digit-product-prime");
    expect(validate(13)).toBe(true);  // 1*3=3, prime
    expect(validate(17)).toBe(true);  // 1*7=7, prime
    expect(validate(10)).toBe(false); // 1*0=0, not prime
    expect(validate(23)).toBe(false); // 2*3=6, not prime
  });
});
