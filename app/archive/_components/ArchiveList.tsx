"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ScheduledPuzzle } from "@/pipeline/scheduler";

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
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

type Props = {
  puzzles: ScheduledPuzzle[];
};

export function ArchiveList({ puzzles }: Props) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const completed = new Set<string>();
    for (const puzzle of puzzles) {
      try {
        const raw = localStorage.getItem(`proof-game-${puzzle.id}`);
        if (raw) {
          const state = JSON.parse(raw);
          if (state.completedAt) completed.add(puzzle.id);
        }
      } catch {}
    }
    setCompletedIds(completed);
  }, [puzzles]);

  if (puzzles.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No puzzles scheduled yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {puzzles.map((puzzle) => (
        <Link
          key={puzzle.id}
          href={`/puzzle/${puzzle.id}`}
          className="flex items-center justify-between px-4 py-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors group"
        >
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-700 dark:group-hover:text-zinc-300">
            {formatDate(puzzle.scheduledDate)}
          </span>
          <div className="flex items-center gap-2">
            {completedIds.has(puzzle.id) && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                Completed
              </span>
            )}
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${TIER_COLORS[puzzle.tier]}`}
            >
              {TIER_LABELS[puzzle.tier]}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
