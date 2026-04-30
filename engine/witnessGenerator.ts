import { MAX } from "./numberRegistry";
import { rules } from "./rules";
import type { Rule } from "./rules";
import { generateClueSequence, clueCountByTier } from "./clueEngine";

const allNumbers = Array.from({ length: MAX }, (_, i) => i + 1);

export interface WitnessConfig {
  count: number;
  inCount: number;
  trivialThreshold: number; // in-set members at or below this value are excluded when possible
}

export const defaultWitnessConfig: WitnessConfig = {
  count: 5,
  inCount: 3,
  trivialThreshold: 10,
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

export interface Witness {
  value: number;
  inSet: boolean;
  clues: string[];
}

export function generateWitness(
  value: number,
  rule: Rule,
  tier: 1 | 2 | 3
): Witness {
  const clues = generateClueSequence(value, clueCountByTier[tier]).map((c) => c.text);
  return { value, inSet: rule.validate(value), clues };
}

export const minIdentificationWitnessByTier: Record<1 | 2 | 3, number> = {
  1: 2,
  2: 3,
  3: 4,
};

export function countConsistentRules(
  witnesses: Array<{ value: number; inSet: boolean }>
): number {
  return rules.filter((r) => witnesses.every((w) => r.validate(w.value) === w.inSet)).length;
}

export function identificationIndex(
  rule: Rule,
  orderedWitnesses: Witness[]
): number | null {
  for (let k = 1; k <= orderedWitnesses.length; k++) {
    const revealed = orderedWitnesses.slice(0, k);
    if (countConsistentRules(revealed) === 1) {
      const consistent = rules.find((r) =>
        revealed.every((w) => r.validate(w.value) === w.inSet)
      );
      if (consistent?.id === rule.id) return k;
    }
  }
  return null;
}

export function meetsIdentificationTiming(
  rule: Rule,
  orderedWitnesses: Witness[],
  minWitnesses: number
): boolean {
  const idx = identificationIndex(rule, orderedWitnesses);
  return idx !== null && idx >= minWitnesses;
}

export function selectWitnesses(
  rule: Rule,
  config: WitnessConfig = defaultWitnessConfig
): number[] {
  const { count, inCount, trivialThreshold } = config;
  const outCount = count - inCount;

  const fullInPool = allNumbers.filter((n) => rule.validate(n));
  const filteredInPool = fullInPool.filter((n) => n > trivialThreshold);
  const inPool = filteredInPool.length >= inCount ? filteredInPool : fullInPool;

  const outPool = allNumbers.filter((n) => !rule.validate(n));

  return [
    ...sampleEvenly(inPool, inCount),
    ...sampleEvenly(outPool, outCount),
  ];
}
