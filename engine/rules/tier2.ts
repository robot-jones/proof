import { registry } from "../numberRegistry";
import type { Rule } from "./index";

export const tier2Rules: Rule[] = [
  // Modular arithmetic
  {
    id: "congruent-1-mod-4",
    description: "numbers that are 1 more than a multiple of 4",
    tier: 2,
    validate: (n) => n % 4 === 1,
  },
  {
    id: "congruent-3-mod-4",
    description: "numbers that are 3 more than a multiple of 4",
    tier: 2,
    validate: (n) => n % 4 === 3,
  },
  {
    id: "congruent-1-mod-6",
    description: "numbers that are 1 more than a multiple of 6",
    tier: 2,
    validate: (n) => n % 6 === 1,
  },
  {
    id: "congruent-5-mod-6",
    description: "numbers that are 5 more than a multiple of 6",
    tier: 2,
    validate: (n) => n % 6 === 5,
  },
  {
    id: "congruent-2-mod-5",
    description: "numbers that are 2 more than a multiple of 5",
    tier: 2,
    validate: (n) => n % 5 === 2,
  },

  // Named sequences
  {
    id: "fibonacci",
    description: "Fibonacci numbers",
    tier: 2,
    validate: (n) => registry.get(n)!.isFibonacci,
  },
  {
    id: "triangular",
    description: "triangular numbers",
    tier: 2,
    validate: (n) => registry.get(n)!.isTriangular,
  },
  {
    id: "harshad",
    description: "numbers divisible by their digit sum",
    tier: 2,
    validate: (n) => registry.get(n)!.isHarshad,
  },
  {
    id: "abundant",
    description: "numbers whose proper divisors sum to more than the number itself",
    tier: 2,
    validate: (n) => registry.get(n)!.aliquotSum > n,
  },
  {
    id: "square-free",
    description: "numbers with no repeated prime factors",
    tier: 2,
    validate: (n) => {
      const { primeFactorCount, primeFactors } = registry.get(n)!;
      return primeFactorCount === primeFactors.length;
    },
  },

  // Prime relationships
  {
    id: "semiprime",
    description: "numbers that are the product of exactly two primes",
    tier: 2,
    validate: (n) => registry.get(n)!.primeFactorCount === 2,
  },
  {
    id: "twin-prime",
    description: "prime numbers that differ from another prime by 2",
    tier: 2,
    validate: (n) => {
      if (!registry.get(n)!.isPrime) return false;
      return (registry.get(n - 2)?.isPrime ?? false) || (registry.get(n + 2)?.isPrime ?? false);
    },
  },
  {
    id: "one-less-than-prime",
    description: "numbers that are one less than a prime",
    tier: 2,
    validate: (n) => registry.get(n + 1)?.isPrime ?? false,
  },

  // Digit operations
  {
    id: "digit-sum-equals-digit-product",
    description: "numbers whose digit sum equals their digit product",
    tier: 2,
    validate: (n) => {
      const { digitSum, digitProduct } = registry.get(n)!;
      return digitSum === digitProduct;
    },
  },
  {
    id: "digit-sum-perfect-square",
    description: "numbers whose digit sum is a perfect square",
    tier: 2,
    validate: (n) => {
      const ds = registry.get(n)!.digitSum;
      return registry.get(ds)?.isPerfectSquare ?? false;
    },
  },
  {
    id: "reverse-is-prime",
    description: "numbers whose digits in reverse form a prime",
    tier: 2,
    validate: (n) => {
      const reversed = parseInt(String(n).split("").reverse().join(""), 10);
      return registry.get(reversed)?.isPrime ?? false;
    },
  },
];
