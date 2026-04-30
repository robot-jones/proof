import { registry, MAX } from "./numberRegistry";

interface ClueBase {
  id: string;
  text: string;
  matches: (candidate: number) => boolean;
}

export interface Clue extends ClueBase {
  eliminationPower: (candidates: number[]) => number;
}

type ClueTemplate = (target: number) => ClueBase | null;

// --- Single templates ---

const digitCount: ClueTemplate = (n) => {
  const count = registry.get(n)!.digits.length;
  return {
    id: `digit-count-${count}`,
    text: `this number has ${count === 1 ? "1 digit" : `${count} digits`}`,
    matches: (c) => registry.get(c)!.digits.length === count,
  };
};

const parity: ClueTemplate = (n) => {
  const even = n % 2 === 0;
  return {
    id: even ? "is-even" : "is-odd",
    text: even ? "this number is even" : "this number is odd",
    matches: (c) => (c % 2 === 0) === even,
  };
};

const primality: ClueTemplate = (n) => {
  const prime = registry.get(n)!.isPrime;
  return {
    id: prime ? "is-prime" : "is-not-prime",
    text: prime ? "this number is prime" : "this number is not prime",
    matches: (c) => registry.get(c)!.isPrime === prime,
  };
};

const factorCount: ClueTemplate = (n) => {
  const count = registry.get(n)!.factorCount;
  return {
    id: `factor-count-${count}`,
    text: `this number has exactly ${count} factor${count === 1 ? "" : "s"}`,
    matches: (c) => registry.get(c)!.factorCount === count,
  };
};

const distinctPrimeFactorCount: ClueTemplate = (n) => {
  const count = registry.get(n)!.primeFactors.length;
  if (count === 0) return null;
  return {
    id: `distinct-prime-factor-count-${count}`,
    text: `this number has exactly ${count} distinct prime factor${count === 1 ? "" : "s"}`,
    matches: (c) => registry.get(c)!.primeFactors.length === count,
  };
};

const digitSumValue: ClueTemplate = (n) => {
  const sum = registry.get(n)!.digitSum;
  return {
    id: `digit-sum-${sum}`,
    text: `the digit sum of this number is ${sum}`,
    matches: (c) => registry.get(c)!.digitSum === sum,
  };
};

const digitSumParity: ClueTemplate = (n) => {
  const even = registry.get(n)!.digitSum % 2 === 0;
  return {
    id: even ? "digit-sum-is-even" : "digit-sum-is-odd",
    text: `the digit sum of this number is ${even ? "even" : "odd"}`,
    matches: (c) => (registry.get(c)!.digitSum % 2 === 0) === even,
  };
};

const digitSumPrimality: ClueTemplate = (n) => {
  const ds = registry.get(n)!.digitSum;
  const prime = registry.get(ds)?.isPrime ?? false;
  return {
    id: prime ? "digit-sum-is-prime" : "digit-sum-is-not-prime",
    text: `the digit sum of this number is ${prime ? "" : "not "}prime`,
    matches: (c) => {
      const cds = registry.get(c)!.digitSum;
      return (registry.get(cds)?.isPrime ?? false) === prime;
    },
  };
};

const lastDigit: ClueTemplate = (n) => {
  const digit = registry.get(n)!.digits.at(-1)!;
  return {
    id: `last-digit-${digit}`,
    text: `the last digit of this number is ${digit}`,
    matches: (c) => registry.get(c)!.digits.at(-1) === digit,
  };
};

const firstDigit: ClueTemplate = (n) => {
  const { digits } = registry.get(n)!;
  if (digits.length === 1) return null;
  const digit = digits[0];
  return {
    id: `first-digit-${digit}`,
    text: `the first digit of this number is ${digit}`,
    matches: (c) => registry.get(c)!.digits[0] === digit,
  };
};

const perfectSquare: ClueTemplate = (n) => {
  const sq = registry.get(n)!.isPerfectSquare;
  return {
    id: sq ? "is-perfect-square" : "is-not-perfect-square",
    text: `this number is ${sq ? "" : "not "}a perfect square`,
    matches: (c) => registry.get(c)!.isPerfectSquare === sq,
  };
};

const perfectCube: ClueTemplate = (n) => {
  const cube = registry.get(n)!.isPerfectCube;
  return {
    id: cube ? "is-perfect-cube" : "is-not-perfect-cube",
    text: `this number is ${cube ? "" : "not "}a perfect cube`,
    matches: (c) => registry.get(c)!.isPerfectCube === cube,
  };
};

const palindrome: ClueTemplate = (n) => {
  const pal = registry.get(n)!.isPalindrome;
  return {
    id: pal ? "is-palindrome" : "is-not-palindrome",
    text: `this number is ${pal ? "" : "not "}a palindrome`,
    matches: (c) => registry.get(c)!.isPalindrome === pal,
  };
};

const isFibonacci: ClueTemplate = (n) => {
  const fib = registry.get(n)!.isFibonacci;
  return {
    id: fib ? "is-fibonacci" : "is-not-fibonacci",
    text: `this number is ${fib ? "" : "not "}a Fibonacci number`,
    matches: (c) => registry.get(c)!.isFibonacci === fib,
  };
};

const isTriangular: ClueTemplate = (n) => {
  const tri = registry.get(n)!.isTriangular;
  return {
    id: tri ? "is-triangular" : "is-not-triangular",
    text: `this number is ${tri ? "" : "not "}a triangular number`,
    matches: (c) => registry.get(c)!.isTriangular === tri,
  };
};

// --- Factory templates ---

function greaterThan(threshold: number): ClueTemplate {
  return (n) => {
    if (n <= threshold) return null;
    return {
      id: `greater-than-${threshold}`,
      text: `this number is greater than ${threshold}`,
      matches: (c) => c > threshold,
    };
  };
}

function lessThan(threshold: number): ClueTemplate {
  return (n) => {
    if (n >= threshold) return null;
    return {
      id: `less-than-${threshold}`,
      text: `this number is less than ${threshold}`,
      matches: (c) => c < threshold,
    };
  };
}

function divisibleBy(divisor: number): ClueTemplate {
  return (n) => {
    if (n % divisor !== 0) return null;
    return {
      id: `divisible-by-${divisor}`,
      text: `this number is divisible by ${divisor}`,
      matches: (c) => c % divisor === 0,
    };
  };
}

export const clueTemplates: ClueTemplate[] = [
  digitCount,
  parity,
  primality,
  factorCount,
  distinctPrimeFactorCount,
  digitSumValue,
  digitSumParity,
  digitSumPrimality,
  lastDigit,
  firstDigit,
  perfectSquare,
  perfectCube,
  palindrome,
  isFibonacci,
  isTriangular,
  greaterThan(100),
  greaterThan(250),
  greaterThan(500),
  lessThan(250),
  lessThan(500),
  lessThan(750),
  divisibleBy(3),
  divisibleBy(4),
  divisibleBy(5),
  divisibleBy(6),
  divisibleBy(7),
  divisibleBy(8),
  divisibleBy(9),
  divisibleBy(11),
  divisibleBy(12),
];

const allNumbers = Array.from({ length: MAX }, (_, i) => i + 1);

export function cluesFor(target: number): Clue[] {
  return clueTemplates
    .map((template) => template(target))
    .filter((clue): clue is Clue => clue !== null)
    .map((clue) => ({
      ...clue,
      eliminationPower: (candidates: number[]) =>
        candidates.filter((c) => !clue.matches(c)).length,
    }));
}

export function orderedCluesFor(target: number): Clue[] {
  return cluesFor(target).sort(
    (a, b) => a.eliminationPower(allNumbers) - b.eliminationPower(allNumbers)
  );
}

export function nextClue(
  target: number,
  candidates: number[],
  usedClueIds: Set<string>
): Clue | null {
  const available = orderedCluesFor(target).filter((c) => !usedClueIds.has(c.id));
  return available.find((c) => c.eliminationPower(candidates) > 0) ?? available[0] ?? null;
}
