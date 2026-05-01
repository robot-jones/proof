"use client";

import type { ScheduledPuzzle } from "@/pipeline/scheduler";
import type { GameState } from "@/app/lib/gameState";
import { computeScore } from "@/app/lib/scoring";

type Props = {
  puzzle: ScheduledPuzzle;
  state: GameState;
};

export function CompletedView({ puzzle, state }: Props) {
  const score = computeScore(puzzle, state);

  return (
    <div className="space-y-4">
      {/* Result banner */}
      <div
        className={`rounded-lg px-5 py-4 ${
          state.ruleSolved
            ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
            : "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            {state.ruleSolved ? (
              <>
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                  You got it!
                </p>
                <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                  The rule was:{" "}
                  <span className="font-medium">{puzzle.rule.description}</span>
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  The rule was:
                </p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mt-1">
                  {puzzle.rule.description}
                </p>
              </>
            )}
          </div>
          {score !== null && (
            <div className="text-right shrink-0">
              <p className="text-2xl font-bold font-mono text-emerald-800 dark:text-emerald-300">
                {score.total}
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">pts</p>
            </div>
          )}
        </div>
      </div>

      {/* Per-witness breakdown */}
      <div className="rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {puzzle.witnesses.map((w, i) => {
          const ws = score?.perWitness[i];
          const isSkipped = ws ? !ws.solved : false;
          const saved = ws?.solved
            ? Math.max(0, ws.cluesAvailable - ws.cluesUsed)
            : null;

          return (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
            >
              {/* Left: index + number + badge */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 w-4">
                  {i + 1}
                </span>
                <span className="text-2xl font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  {w.value}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full tracking-wide ${
                    w.inSet
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                  }`}
                >
                  {w.inSet ? "IN" : "OUT"}
                </span>
              </div>

              {/* Right: clue efficiency */}
              <div className="flex items-center gap-3 text-right">
                {isSkipped ? (
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    —
                  </span>
                ) : (
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">
                    {ws?.cluesUsed ?? state.witnesses[i].cluesRevealed}/
                    {ws?.cluesAvailable ?? w.clues.length} clues
                  </span>
                )}
                {score !== null && isSkipped && (
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 tabular-nums w-12 text-right">
                    +5 skip
                  </span>
                )}
                {score !== null && !isSkipped && saved !== null && (
                  <span
                    className={`text-xs font-medium tabular-nums w-12 text-right ${
                      saved > 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-zinc-400 dark:text-zinc-500"
                    }`}
                  >
                    {saved > 0 ? `+${saved}` : "0"}
                  </span>
                )}
                {score === null && (
                  <span className="w-12" />
                )}
              </div>
            </div>
          );
        })}

        {/* Score totals */}
        {score !== null && (
          <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 space-y-1 border-t border-zinc-200 dark:border-zinc-700">
            <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>Clues saved</span>
              <span className="tabular-nums font-medium text-zinc-700 dark:text-zinc-300">
                {score.cluesSaved}
              </span>
            </div>
            {score.earlyRuleBonus > 0 && (
              <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>Early rule bonus</span>
                <span className="tabular-nums font-medium text-emerald-600 dark:text-emerald-400">
                  +{score.earlyRuleBonus}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm font-semibold text-zinc-900 dark:text-zinc-100 pt-1 border-t border-zinc-200 dark:border-zinc-700">
              <span>Total</span>
              <span className="tabular-nums">{score.total} pts</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
