import { join } from "path";
import { loadScheduledPuzzle, listScheduledDates } from "@/pipeline/puzzleStore";
import type { ScheduledPuzzle } from "@/pipeline/scheduler";

const SCHEDULED_DIR = join(process.cwd(), "pipeline/scheduled");

export function loadPuzzle(dateKey: string) {
  return loadScheduledPuzzle(dateKey, SCHEDULED_DIR);
}

export function listPuzzles(): ScheduledPuzzle[] {
  return listScheduledDates(SCHEDULED_DIR)
    .map((date) => loadScheduledPuzzle(date, SCHEDULED_DIR))
    .filter((p): p is ScheduledPuzzle => p !== null);
}
