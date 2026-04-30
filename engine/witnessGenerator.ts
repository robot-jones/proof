import { MAX } from "./numberRegistry";
import { rules } from "./rules";
import type { Rule } from "./rules";

const allNumbers = Array.from({ length: MAX }, (_, i) => i + 1);

export interface WitnessConfig {
  count: number;
  inCount: number;
}

export const defaultWitnessConfig: WitnessConfig = {
  count: 5,
  inCount: 3,
};

function sampleEvenly(pool: number[], n: number): number[] {
  if (n <= 0) return [];
  if (pool.length <= n) return [...pool];
  const step = pool.length / n;
  return Array.from({ length: n }, (_, i) => pool[Math.floor(i * step + step / 2)]);
}

export function orderWitnesses(rule: Rule, witnesses: number[]): number[] {
  return [...witnesses].sort((a, b) => {
    const inSetA = rule.validate(a);
    const inSetB = rule.validate(b);
    const consistentA = rules.filter((r) => r.validate(a) === inSetA).length;
    const consistentB = rules.filter((r) => r.validate(b) === inSetB).length;
    return consistentB - consistentA; // descending: most ambiguous first
  });
}

export function selectWitnesses(
  rule: Rule,
  config: WitnessConfig = defaultWitnessConfig
): number[] {
  const { count, inCount } = config;
  const outCount = count - inCount;

  const inPool = allNumbers.filter((n) => rule.validate(n));
  const outPool = allNumbers.filter((n) => !rule.validate(n));

  return [
    ...sampleEvenly(inPool, inCount),
    ...sampleEvenly(outPool, outCount),
  ];
}
