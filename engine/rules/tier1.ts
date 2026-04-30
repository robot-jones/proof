import { registry } from "../numberRegistry";
import type { Rule } from "./index";

export const tier1Rules: Rule[] = [
  // Divisibility
  {
    id: "divisible-by-3",
    description: "numbers divisible by 3",
    tier: 1,
    validate: (n) => n % 3 === 0,
  },
  {
    id: "divisible-by-4",
    description: "numbers divisible by 4",
    tier: 1,
    validate: (n) => n % 4 === 0,
  },
  {
    id: "divisible-by-6",
    description: "numbers divisible by 6",
    tier: 1,
    validate: (n) => n % 6 === 0,
  },
  {
    id: "divisible-by-7",
    description: "numbers divisible by 7",
    tier: 1,
    validate: (n) => n % 7 === 0,
  },
  {
    id: "divisible-by-9",
    description: "numbers divisible by 9",
    tier: 1,
    validate: (n) => n % 9 === 0,
  },
  {
    id: "divisible-by-11",
    description: "numbers divisible by 11",
    tier: 1,
    validate: (n) => n % 11 === 0,
  },

  // Factor count
  {
    id: "prime",
    description: "prime numbers",
    tier: 1,
    validate: (n) => registry.get(n)!.isPrime,
  },
  {
    id: "exactly-3-factors",
    description: "numbers with exactly 3 factors",
    tier: 1,
    validate: (n) => registry.get(n)!.factorCount === 3,
  },
  {
    id: "exactly-4-factors",
    description: "numbers with exactly 4 factors",
    tier: 1,
    validate: (n) => registry.get(n)!.factorCount === 4,
  },
  {
    id: "factor-count-prime",
    description: "numbers whose factor count is prime",
    tier: 1,
    validate: (n) => registry.get(registry.get(n)!.factorCount)?.isPrime ?? false,
  },

  // Digit sum
  {
    id: "digit-sum-prime",
    description: "numbers whose digit sum is prime",
    tier: 1,
    validate: (n) => registry.get(registry.get(n)!.digitSum)?.isPrime ?? false,
  },
  {
    id: "digit-sum-even",
    description: "numbers whose digit sum is even",
    tier: 1,
    validate: (n) => registry.get(n)!.digitSum % 2 === 0,
  },
  {
    id: "digit-sum-single-digit",
    description: "numbers whose digit sum is a single digit",
    tier: 1,
    validate: (n) => registry.get(n)!.digitSum <= 9,
  },
  {
    id: "digit-sum-greater-than-10",
    description: "numbers whose digit sum is greater than 10",
    tier: 1,
    validate: (n) => registry.get(n)!.digitSum > 10,
  },

  // Perfect powers
  {
    id: "perfect-square",
    description: "perfect squares",
    tier: 1,
    validate: (n) => registry.get(n)!.isPerfectSquare,
  },
  {
    id: "perfect-cube",
    description: "perfect cubes",
    tier: 1,
    validate: (n) => registry.get(n)!.isPerfectCube,
  },

  // Digit composition
  {
    id: "all-odd-digits",
    description: "numbers whose digits are all odd",
    tier: 1,
    validate: (n) => registry.get(n)!.digits.every((d) => d % 2 === 1),
  },
  {
    id: "all-even-digits",
    description: "numbers whose digits are all even",
    tier: 1,
    validate: (n) => registry.get(n)!.digits.every((d) => d % 2 === 0),
  },
  {
    id: "palindrome",
    description: "palindromic numbers",
    tier: 1,
    validate: (n) => registry.get(n)!.isPalindrome,
  },
  {
    id: "no-repeated-digits",
    description: "numbers with no repeated digits",
    tier: 1,
    validate: (n) => {
      const { digits } = registry.get(n)!;
      return digits.length === new Set(digits).size;
    },
  },
  {
    id: "contains-digit-7",
    description: "numbers containing the digit 7",
    tier: 1,
    validate: (n) => registry.get(n)!.digits.includes(7),
  },
  {
    id: "digit-product-prime",
    description: "numbers whose digit product is prime",
    tier: 1,
    validate: (n) => registry.get(registry.get(n)!.digitProduct)?.isPrime ?? false,
  },
];
