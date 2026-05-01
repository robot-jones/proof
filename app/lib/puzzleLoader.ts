import { join } from "path";
import { loadScheduledPuzzle } from "@/pipeline/puzzleStore";

export function loadPuzzle(dateKey: string) {
  return loadScheduledPuzzle(dateKey, join(process.cwd(), "pipeline/scheduled"));
}
