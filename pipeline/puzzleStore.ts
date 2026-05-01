import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import type { ScheduledPuzzle } from "./scheduler";

export function loadPuzzleBank(
  bankDir: string
): Record<1 | 2 | 3, ScheduledPuzzle[]> {
  const result: Record<1 | 2 | 3, ScheduledPuzzle[]> = { 1: [], 2: [], 3: [] };

  for (const tier of [1, 2, 3] as const) {
    const tierDir = join(bankDir, `tier${tier}`);
    let files: string[];
    try {
      files = readdirSync(tierDir).filter((f) => f.endsWith(".json"));
    } catch {
      continue; // tier directory doesn't exist yet
    }

    for (const file of files) {
      const raw = readFileSync(join(tierDir, file), "utf-8");
      result[tier].push(JSON.parse(raw) as ScheduledPuzzle);
    }
  }

  return result;
}

export function saveScheduledPuzzles(
  puzzles: ScheduledPuzzle[],
  outputDir: string
): void {
  mkdirSync(outputDir, { recursive: true });
  for (const puzzle of puzzles) {
    const path = join(outputDir, `${puzzle.id}.json`);
    writeFileSync(path, JSON.stringify(puzzle, null, 2));
  }
}

export function loadScheduledPuzzle(
  dateKey: string,
  scheduledDir: string
): ScheduledPuzzle | null {
  const path = join(scheduledDir, `${dateKey}.json`);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf-8")) as ScheduledPuzzle;
}

export function listScheduledDates(scheduledDir: string): string[] {
  if (!existsSync(scheduledDir)) return [];
  return readdirSync(scheduledDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""))
    .sort();
}
