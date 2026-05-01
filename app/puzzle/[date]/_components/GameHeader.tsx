"use client";

import type { ScheduledPuzzle } from "@/pipeline/scheduler";
import type { GameState } from "@/app/lib/gameState";

const TIER_LABELS: Record<1 | 2 | 3, string> = {
  1: "Tier 1",
  2: "Tier 2",
  3: "Tier 3",
};

const TIER_COLORS: Record<1 | 2 | 3, string> = {
  1: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  2: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  3: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

type Props = {
  puzzle: ScheduledPuzzle;
  state: GameState;
};

export function GameHeader({ puzzle, state }: Props) {
  const solvedCount = state.witnesses.filter((w) => w.solved).length;
  const totalCount = puzzle.witnesses.length;
  const isCompleted = !!state.completedAt;

  return (
    <header className="flex items-center justify-between py-4 border-b border-zinc-200 dark:border-zinc-800">
      <div>
        <span className="text-xs font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
          Proof
        </span>
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
          {formatDate(puzzle.scheduledDate)}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        {isCompleted && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
            Completed
          </span>
        )}
        {!isCompleted && totalCount > 0 && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {solvedCount}/{totalCount} witnesses
          </span>
        )}
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${TIER_COLORS[puzzle.tier]}`}
        >
          {TIER_LABELS[puzzle.tier]}
        </span>
      </div>
    </header>
  );
}
