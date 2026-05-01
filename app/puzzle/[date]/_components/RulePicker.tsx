"use client";

import { useState } from "react";
import type { RuleInfo } from "@/app/lib/ruleList";

const TIER_LABELS: Record<1 | 2 | 3, string> = {
  1: "Tier 1 — Basic",
  2: "Tier 2 — Intermediate",
  3: "Tier 3 — Advanced",
};

type Props = {
  rules: RuleInfo[];
  wrongGuesses: string[];
  allWitnessesSolved: boolean;
  onGuess: (ruleId: string) => void;
  onReveal: () => void;
};

export function RulePicker({
  rules,
  wrongGuesses,
  allWitnessesSolved,
  onGuess,
  onReveal,
}: Props) {
  const [selected, setSelected] = useState("");
  const [justWrong, setJustWrong] = useState(false);

  const byTier = [1, 2, 3] as const;

  function handleGuess() {
    if (!selected) return;
    if (wrongGuesses.includes(selected)) return;
    if (selected) {
      onGuess(selected);
      // If guess was correct, parent unmounts this component via CompletedView.
      // If wrong, show feedback until user selects again.
      setJustWrong(true);
      setSelected("");
    }
  }

  return (
    <div className="rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
      <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
        Name the rule
      </h2>

      {wrongGuesses.length > 0 && (
        <div className="space-y-1">
          {wrongGuesses.map((id) => {
            const rule = rules.find((r) => r.id === id);
            return (
              <div
                key={id}
                className="flex items-center gap-2 text-xs text-red-500 dark:text-red-400"
              >
                <span>✗</span>
                <span className="line-through">{rule?.description ?? id}</span>
              </div>
            );
          })}
        </div>
      )}

      {justWrong && (
        <p className="text-xs text-red-500 dark:text-red-400">
          That&apos;s not the rule. Keep deducing.
        </p>
      )}

      <select
        value={selected}
        onChange={(e) => {
          setSelected(e.target.value);
          setJustWrong(false);
        }}
        className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
      >
        <option value="">Select a rule…</option>
        {byTier.map((tier) => (
          <optgroup key={tier} label={TIER_LABELS[tier]}>
            {rules
              .filter((r) => r.tier === tier)
              .map((r) => (
                <option
                  key={r.id}
                  value={r.id}
                  disabled={wrongGuesses.includes(r.id)}
                >
                  {r.description}
                </option>
              ))}
          </optgroup>
        ))}
      </select>

      <div className="flex items-center gap-3">
        <button
          onClick={handleGuess}
          disabled={!selected || wrongGuesses.includes(selected)}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Guess rule
        </button>

        {allWitnessesSolved && (
          <button
            onClick={onReveal}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Reveal answer
          </button>
        )}
      </div>
    </div>
  );
}
