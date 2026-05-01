export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday

export type TierMix = [1] | [1, 2] | [2] | [2, 3] | [3];

export const tierMixByDay: Record<DayOfWeek, TierMix> = {
  1: [1],       // Monday
  2: [1],       // Tuesday
  3: [1, 2],    // Wednesday
  4: [2],       // Thursday
  5: [2],       // Friday
  6: [2, 3],    // Saturday
  0: [3],       // Sunday
};

export function tierForDate(date: Date): 1 | 2 | 3 {
  const day = date.getUTCDay() as DayOfWeek;
  const mix = tierMixByDay[day];
  return mix[Math.floor(Math.random() * mix.length)] as 1 | 2 | 3;
}

export function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export function scheduleDates(start: Date, count: number): Date[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + i);
    return d;
  });
}

export interface ScheduledPuzzle {
  id: string;
  scheduledDate: string;
  tier: 1 | 2 | 3;
  rule: { id: string; description: string };
  witnesses: { value: number; inSet: boolean; clues: string[] }[];
}

export function assignPuzzles(
  dates: Date[],
  puzzlesByTier: Record<1 | 2 | 3, ScheduledPuzzle[]>
): ScheduledPuzzle[] {
  const indices: Record<1 | 2 | 3, number> = { 1: 0, 2: 0, 3: 0 };
  const scheduled: ScheduledPuzzle[] = [];

  for (const date of dates) {
    const tier = tierForDate(date);
    const pool = puzzlesByTier[tier];
    if (pool.length === 0) continue;

    const key = dateKey(date);
    const base = pool[indices[tier] % pool.length];
    scheduled.push({ ...base, id: key, scheduledDate: key });
    indices[tier]++;
  }

  return scheduled;
}
