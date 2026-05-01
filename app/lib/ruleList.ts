export type RuleInfo = {
  id: string;
  description: string;
  tier: 1 | 2 | 3;
};

export const RULES: RuleInfo[] = [
  // Tier 1 — Divisibility
  { id: "divisible-by-3", description: "numbers divisible by 3", tier: 1 },
  { id: "divisible-by-4", description: "numbers divisible by 4", tier: 1 },
  { id: "divisible-by-6", description: "numbers divisible by 6", tier: 1 },
  { id: "divisible-by-7", description: "numbers divisible by 7", tier: 1 },
  { id: "divisible-by-9", description: "numbers divisible by 9", tier: 1 },
  { id: "divisible-by-11", description: "numbers divisible by 11", tier: 1 },
  // Tier 1 — Factor count
  { id: "prime", description: "prime numbers", tier: 1 },
  { id: "exactly-3-factors", description: "numbers with exactly 3 factors", tier: 1 },
  { id: "exactly-4-factors", description: "numbers with exactly 4 factors", tier: 1 },
  { id: "factor-count-prime", description: "numbers whose factor count is prime", tier: 1 },
  // Tier 1 — Digit sum
  { id: "digit-sum-prime", description: "numbers whose digit sum is prime", tier: 1 },
  { id: "digit-sum-even", description: "numbers whose digit sum is even", tier: 1 },
  { id: "digit-sum-single-digit", description: "numbers whose digit sum is a single digit", tier: 1 },
  { id: "digit-sum-greater-than-10", description: "numbers whose digit sum is greater than 10", tier: 1 },
  // Tier 1 — Perfect powers
  { id: "perfect-square", description: "perfect squares", tier: 1 },
  { id: "perfect-cube", description: "perfect cubes", tier: 1 },
  // Tier 1 — Digit composition
  { id: "all-odd-digits", description: "numbers whose digits are all odd", tier: 1 },
  { id: "all-even-digits", description: "numbers whose digits are all even", tier: 1 },
  { id: "palindrome", description: "palindromic numbers", tier: 1 },
  { id: "no-repeated-digits", description: "numbers with no repeated digits", tier: 1 },
  { id: "contains-digit-7", description: "numbers containing the digit 7", tier: 1 },
  { id: "digit-product-prime", description: "numbers whose digit product is prime", tier: 1 },
  // Tier 2 — Modular arithmetic
  { id: "congruent-1-mod-4", description: "numbers that are 1 more than a multiple of 4", tier: 2 },
  { id: "congruent-3-mod-4", description: "numbers that are 3 more than a multiple of 4", tier: 2 },
  { id: "congruent-1-mod-6", description: "numbers that are 1 more than a multiple of 6", tier: 2 },
  { id: "congruent-5-mod-6", description: "numbers that are 5 more than a multiple of 6", tier: 2 },
  { id: "congruent-2-mod-5", description: "numbers that are 2 more than a multiple of 5", tier: 2 },
  // Tier 2 — Named sequences
  { id: "fibonacci", description: "Fibonacci numbers", tier: 2 },
  { id: "triangular", description: "triangular numbers", tier: 2 },
  { id: "harshad", description: "numbers divisible by their digit sum", tier: 2 },
  { id: "abundant", description: "numbers whose proper divisors sum to more than the number itself", tier: 2 },
  { id: "square-free", description: "numbers with no repeated prime factors", tier: 2 },
  // Tier 2 — Prime relationships
  { id: "semiprime", description: "numbers that are the product of exactly two primes", tier: 2 },
  { id: "twin-prime", description: "prime numbers that differ from another prime by 2", tier: 2 },
  { id: "one-less-than-prime", description: "numbers that are one less than a prime", tier: 2 },
  // Tier 2 — Digit operations
  { id: "digit-sum-equals-digit-product", description: "numbers whose digit sum equals their digit product", tier: 2 },
  { id: "digit-sum-perfect-square", description: "numbers whose digit sum is a perfect square", tier: 2 },
  { id: "reverse-is-prime", description: "numbers whose digits in reverse form a prime", tier: 2 },
  // Tier 3 — Self-referential
  { id: "narcissistic", description: "numbers equal to the sum of their digits each raised to the power of the digit count", tier: 3 },
  { id: "happy", description: "numbers that eventually reach 1 when repeatedly replaced by the sum of the squares of their digits", tier: 3 },
  { id: "kaprekar", description: "numbers whose square can be split into two parts that sum to the original number", tier: 3 },
  // Tier 3 — Cross-base
  { id: "palindrome-in-binary", description: "numbers whose binary representation is a palindrome", tier: 3 },
  { id: "power-of-2", description: "powers of 2", tier: 3 },
  // Tier 3 — Composite relationships
  { id: "sum-of-two-squares", description: "numbers expressible as the sum of two perfect squares", tier: 3 },
  { id: "emirp", description: "prime numbers that form a different prime when their digits are reversed", tier: 3 },
  { id: "sophie-germain-prime", description: "prime numbers p where 2p + 1 is also prime", tier: 3 },
];
