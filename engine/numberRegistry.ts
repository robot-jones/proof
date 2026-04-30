export const MAX = 999;

export interface NumberProperties {
  factors: number[];
  factorCount: number;
  primeFactors: number[];
  primeFactorCount: number;
  isPrime: boolean;
  digits: number[];
  digitSum: number;
  digitProduct: number;
  aliquotSum: number;
  isPerfectSquare: boolean;
  isPerfectCube: boolean;
  isFibonacci: boolean;
  isTriangular: boolean;
  isPalindrome: boolean;
  isHarshad: boolean;
}

export type NumberRegistry = ReadonlyMap<number, NumberProperties>;

function buildRegistry(): NumberRegistry {
  const sieve = new Uint8Array(MAX + 1).fill(1);
  sieve[0] = sieve[1] = 0;
  for (let i = 2; i * i <= MAX; i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= MAX; j += i) sieve[j] = 0;
    }
  }

  const fibs = new Set<number>();
  let [a, b] = [1, 1];
  while (a <= MAX) {
    fibs.add(a);
    [a, b] = [b, a + b];
  }

  const triangulars = new Set<number>();
  for (let k = 1; (k * (k + 1)) / 2 <= MAX; k++) {
    triangulars.add((k * (k + 1)) / 2);
  }

  const registry = new Map<number, NumberProperties>();

  for (let n = 1; n <= MAX; n++) {
    const factors: number[] = [];
    for (let i = 1; i * i <= n; i++) {
      if (n % i === 0) {
        factors.push(i);
        if (i !== n / i) factors.push(n / i);
      }
    }
    factors.sort((x, y) => x - y);

    const primeFactors = factors.filter((f) => f > 1 && sieve[f] === 1);

    let primeFactorCount = 0;
    let remaining = n;
    for (const p of primeFactors) {
      while (remaining % p === 0) {
        primeFactorCount++;
        remaining /= p;
      }
    }

    const digits = String(n).split("").map(Number);
    const digitSum = digits.reduce((s, d) => s + d, 0);
    const digitProduct = digits.reduce((p, d) => p * d, 1);
    const aliquotSum = factors.filter((f) => f < n).reduce((s, f) => s + f, 0);

    const sqrtN = Math.round(Math.sqrt(n));
    const cbrtN = Math.round(Math.cbrt(n));

    const str = String(n);
    const isPalindrome = str === str.split("").reverse().join("");

    registry.set(n, {
      factors,
      factorCount: factors.length,
      primeFactors,
      primeFactorCount,
      isPrime: sieve[n] === 1,
      digits,
      digitSum,
      digitProduct,
      aliquotSum,
      isPerfectSquare: sqrtN * sqrtN === n,
      isPerfectCube: cbrtN * cbrtN * cbrtN === n,
      isFibonacci: fibs.has(n),
      isTriangular: triangulars.has(n),
      isPalindrome,
      isHarshad: n % digitSum === 0,
    });
  }

  return registry;
}

export const registry: NumberRegistry = buildRegistry();
