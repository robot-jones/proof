import { tier1Rules } from "./tier1";

export interface Rule {
  id: string;
  description: string;
  tier: 1 | 2 | 3;
  validate: (n: number) => boolean;
}

export const rules: Rule[] = [...tier1Rules];
