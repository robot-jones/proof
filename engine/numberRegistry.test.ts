import { describe, it, expect } from "vitest";
import { MAX, registry } from "./numberRegistry";

describe("MAX", () => {
  it("is 999", () => expect(MAX).toBe(999));
});

describe("registry", () => {
  it("contains every integer from 1 to MAX", () => {
    for (let n = 1; n <= MAX; n++) expect(registry.has(n)).toBe(true);
  });

  it("contains no integers outside 1 to MAX", () => {
    expect(registry.has(0)).toBe(false);
    expect(registry.has(MAX + 1)).toBe(false);
  });
});

describe("factors", () => {
  it("computes factors correctly", () => {
    expect(registry.get(1)!.factors).toEqual([1]);
    expect(registry.get(12)!.factors).toEqual([1, 2, 3, 4, 6, 12]);
    expect(registry.get(36)!.factors).toEqual([1, 2, 3, 4, 6, 9, 12, 18, 36]);
  });

  it("factorCount matches factors length", () => {
    for (const [, props] of registry) {
      expect(props.factorCount).toBe(props.factors.length);
    }
  });
});

describe("primeFactors", () => {
  it("computes prime factors correctly", () => {
    expect(registry.get(1)!.primeFactors).toEqual([]);
    expect(registry.get(12)!.primeFactors).toEqual([2, 3]);
    expect(registry.get(30)!.primeFactors).toEqual([2, 3, 5]);
  });
});

describe("isPrime", () => {
  it("correctly identifies primes", () => {
    expect(registry.get(1)!.isPrime).toBe(false);
    expect(registry.get(2)!.isPrime).toBe(true);
    expect(registry.get(3)!.isPrime).toBe(true);
    expect(registry.get(4)!.isPrime).toBe(false);
    expect(registry.get(997)!.isPrime).toBe(true);
  });
});

describe("digits and digitSum", () => {
  it("computes digits correctly", () => {
    expect(registry.get(1)!.digits).toEqual([1]);
    expect(registry.get(83)!.digits).toEqual([8, 3]);
    expect(registry.get(999)!.digits).toEqual([9, 9, 9]);
  });

  it("computes digit sum correctly", () => {
    expect(registry.get(83)!.digitSum).toBe(11);
    expect(registry.get(999)!.digitSum).toBe(27);
  });
});

describe("isPerfectSquare", () => {
  it("identifies perfect squares", () => {
    expect(registry.get(1)!.isPerfectSquare).toBe(true);
    expect(registry.get(4)!.isPerfectSquare).toBe(true);
    expect(registry.get(9)!.isPerfectSquare).toBe(true);
    expect(registry.get(961)!.isPerfectSquare).toBe(true); // 31^2
    expect(registry.get(2)!.isPerfectSquare).toBe(false);
    expect(registry.get(998)!.isPerfectSquare).toBe(false);
  });
});

describe("isPerfectCube", () => {
  it("identifies perfect cubes", () => {
    expect(registry.get(1)!.isPerfectCube).toBe(true);
    expect(registry.get(8)!.isPerfectCube).toBe(true);
    expect(registry.get(27)!.isPerfectCube).toBe(true);
    expect(registry.get(729)!.isPerfectCube).toBe(true); // 9^3
    expect(registry.get(2)!.isPerfectCube).toBe(false);
    expect(registry.get(730)!.isPerfectCube).toBe(false);
  });
});

describe("isFibonacci", () => {
  it("identifies Fibonacci numbers", () => {
    for (const n of [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987]) {
      expect(registry.get(n)!.isFibonacci).toBe(true);
    }
    expect(registry.get(4)!.isFibonacci).toBe(false);
    expect(registry.get(10)!.isFibonacci).toBe(false);
  });
});

describe("isTriangular", () => {
  it("identifies triangular numbers", () => {
    for (const n of [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78, 91, 105]) {
      expect(registry.get(n)!.isTriangular).toBe(true);
    }
    expect(registry.get(2)!.isTriangular).toBe(false);
    expect(registry.get(4)!.isTriangular).toBe(false);
  });
});

describe("primeFactorCount", () => {
  it("counts prime factors with multiplicity", () => {
    expect(registry.get(1)!.primeFactorCount).toBe(0);
    expect(registry.get(2)!.primeFactorCount).toBe(1);
    expect(registry.get(4)!.primeFactorCount).toBe(2);  // 2²
    expect(registry.get(12)!.primeFactorCount).toBe(3); // 2² × 3
    expect(registry.get(30)!.primeFactorCount).toBe(3); // 2 × 3 × 5
    expect(registry.get(8)!.primeFactorCount).toBe(3);  // 2³
  });
});

describe("digitProduct", () => {
  it("computes digit product correctly", () => {
    expect(registry.get(1)!.digitProduct).toBe(1);
    expect(registry.get(83)!.digitProduct).toBe(24);
    expect(registry.get(10)!.digitProduct).toBe(0);
    expect(registry.get(999)!.digitProduct).toBe(729);
  });
});

describe("aliquotSum", () => {
  it("sums proper divisors correctly", () => {
    expect(registry.get(1)!.aliquotSum).toBe(0);
    expect(registry.get(6)!.aliquotSum).toBe(6);   // perfect: 1+2+3
    expect(registry.get(12)!.aliquotSum).toBe(16); // abundant: 1+2+3+4+6
    expect(registry.get(4)!.aliquotSum).toBe(3);   // deficient: 1+2
  });
});

describe("isPalindrome", () => {
  it("identifies palindromes", () => {
    expect(registry.get(1)!.isPalindrome).toBe(true);
    expect(registry.get(11)!.isPalindrome).toBe(true);
    expect(registry.get(121)!.isPalindrome).toBe(true);
    expect(registry.get(999)!.isPalindrome).toBe(true);
    expect(registry.get(12)!.isPalindrome).toBe(false);
    expect(registry.get(123)!.isPalindrome).toBe(false);
  });
});

describe("isHarshad", () => {
  it("identifies Harshad numbers", () => {
    expect(registry.get(1)!.isHarshad).toBe(true);   // 1 % 1 === 0
    expect(registry.get(18)!.isHarshad).toBe(true);  // 18 % 9 === 0
    expect(registry.get(21)!.isHarshad).toBe(true);  // 21 % 3 === 0
    expect(registry.get(100)!.isHarshad).toBe(true); // 100 % 1 === 0
    expect(registry.get(19)!.isHarshad).toBe(false); // 19 % 10 !== 0
    expect(registry.get(23)!.isHarshad).toBe(false); // 23 % 5 !== 0
  });
});
