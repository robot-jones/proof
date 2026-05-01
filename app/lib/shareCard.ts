import type { ScheduledPuzzle } from "@/pipeline/scheduler";
import type { GameState } from "./gameState";
import type { ScoreBreakdown } from "./scoring";

const TIER_LABELS: Record<1 | 2 | 3, string> = {
  1: "Tier 1",
  2: "Tier 2",
  3: "Tier 3",
};

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function witnessBar(
  cluesUsed: number,
  cluesAvailable: number,
  revealed: boolean
): string {
  const BAR_WIDTH = 8;
  const efficiency =
    cluesAvailable > 1
      ? Math.max(0, Math.min(1, (cluesAvailable - cluesUsed) / (cluesAvailable - 1)))
      : 0;
  const filled = Math.round(efficiency * BAR_WIDTH);
  const empty = BAR_WIDTH - filled;

  if (revealed) {
    // 🟥 = clues used, ⬜ = saved
    return "🟥".repeat(BAR_WIDTH - filled) + "⬜".repeat(filled);
  } else {
    // 🟩 = saved, ⬜ = used
    return "🟩".repeat(filled) + "⬜".repeat(empty);
  }
}

export function generateShareCard(
  puzzle: ScheduledPuzzle,
  state: GameState,
  score: ScoreBreakdown | null
): string {
  const lines: string[] = [];

  const dateLabel = formatDate(puzzle.scheduledDate);
  const tierLabel = TIER_LABELS[puzzle.tier];
  lines.push(`Proof — ${dateLabel} · ${tierLabel}`);
  lines.push(score !== null ? `${score.total} pts` : "—");
  lines.push("");

  const solvedCount = state.currentWitnessIndex;

  puzzle.witnesses.forEach((w, i) => {
    const ws = state.witnesses[i];
    if (i < solvedCount) {
      lines.push(witnessBar(ws.cluesRevealed, w.clues.length, false));
    }
    // Skipped witnesses are handled below as ⭐
  });

  const skippedCount = puzzle.witnesses.length - solvedCount;
  if (skippedCount > 0 && state.ruleSolved) {
    const bonus = skippedCount * 5;
    lines.push("⭐".repeat(skippedCount) + `  (+${bonus} early)`);
  }

  // For revealed: show remaining witnesses with 🟥 bars
  if (state.revealed) {
    for (let i = solvedCount; i < puzzle.witnesses.length; i++) {
      const ws = state.witnesses[i];
      const w = puzzle.witnesses[i];
      lines.push(witnessBar(ws.cluesRevealed, w.clues.length, true));
    }
  }

  return lines.join("\n");
}
