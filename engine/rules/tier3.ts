import { registry } from "../numberRegistry";
import type { Rule } from "./index";

function sumSquaredDigits(n: number): number {
  return String(n)
    .split("")
    .map(Number)
    .reduce((sum, d) => sum + d * d, 0);
}

export const tier3Rules: Rule[] = [
  // Self-referential
  {
    id: "narcissistic",
    description:
      "numbers equal to the sum of their digits each raised to the power of the digit count",
    tier: 3,
    validate: (n) => {
      const { digits } = registry.get(n)!;
      return digits.reduce((sum, d) => sum + Math.pow(d, digits.length), 0) === n;
    },
  },
  {
    id: "happy",
    description:
      "numbers that eventually reach 1 when repeatedly replaced by the sum of the squares of their digits",
    tier: 3,
    validate: (n) => {
      const seen = new Set<number>();
      let current = n;
      while (current !== 1 && !seen.has(current)) {
        seen.add(current);
        current = sumSquaredDigits(current);
      }
      return current === 1;
    },
  },
  {
    id: "kaprekar",
    description:
      "numbers whose square can be split into two parts that sum to the original number",
    tier: 3,
    validate: (n) => {
      if (n === 1) return true;
      const sqStr = String(n * n);
      for (let split = 1; split < sqStr.length; split++) {
        const right = parseInt(sqStr.slice(split), 10);
        if (right === 0) continue;
        const left = parseInt(sqStr.slice(0, split), 10);
        if (left + right === n) return true;
      }
      return false;
    },
  },

  // Cross-base
  {
    id: "palindrome-in-binary",
    description: "numbers whose binary representation is a palindrome",
    tier: 3,
    validate: (n) => {
      const bin = n.toString(2);
      return bin === bin.split("").reverse().join("");
    },
  },
  {
    id: "power-of-2",
    description: "powers of 2",
    tier: 3,
    validate: (n) => (n & (n - 1)) === 0,
  },

  // Composite relationships
  {
    id: "sum-of-two-squares",
    description: "numbers expressible as the sum of two perfect squares",
    tier: 3,
    validate: (n) => {
      for (let a = 0; a * a <= n; a++) {
        const b2 = n - a * a;
        const b = Math.round(Math.sqrt(b2));
        if (b * b === b2) return true;
      }
      return false;
    },
  },
  {
    id: "emirp",
    description:
      "prime numbers that form a different prime when their digits are reversed",
    tier: 3,
    validate: (n) => {
      if (!registry.get(n)!.isPrime) return false;
      const reversed = parseInt(String(n).split("").reverse().join(""), 10);
      if (reversed === n) return false;
      return registry.get(reversed)?.isPrime ?? false;
    },
  },
  {
    id: "sophie-germain-prime",
    description: "prime numbers p where 2p + 1 is also prime",
    tier: 3,
    validate: (n) => {
      if (!registry.get(n)!.isPrime) return false;
      return registry.get(2 * n + 1)?.isPrime ?? false;
    },
  },
];
