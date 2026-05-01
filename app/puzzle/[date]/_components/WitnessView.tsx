"use client";

import { useState } from "react";
import type { WitnessState } from "@/app/lib/gameState";

type Props = {
  witness: { value: number; inSet: boolean; clues: string[] };
  state: WitnessState;
  witnessIndex: number;
  totalWitnesses: number;
  onRevealClue: () => void;
  onGuess: (value: number) => void;
};

export function WitnessView({
  witness,
  state,
  witnessIndex,
  totalWitnesses,
  onRevealClue,
  onGuess,
}: Props) {
  const [inputValue, setInputValue] = useState("");
  const [lastWrongGuess, setLastWrongGuess] = useState<number | null>(null);

  const visibleClues = witness.clues.slice(0, state.cluesRevealed);
  const allCluesRevealed = state.cluesRevealed >= witness.clues.length;

  function handleGuess() {
    const n = parseInt(inputValue, 10);
    if (isNaN(n) || n < 1 || n > 999) return;
    if (n === witness.value) {
      onGuess(n);
    } else {
      setLastWrongGuess(n);
      setInputValue("");
      onGuess(n);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleGuess();
  }

  const wrongGuesses = state.guesses;
  const justWrong =
    lastWrongGuess !== null && wrongGuesses.includes(lastWrongGuess);

  return (
    <div className="rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          Witness {witnessIndex + 1}
          <span className="font-normal text-zinc-400 dark:text-zinc-600">
            {" "}of {totalWitnesses}
          </span>
        </h2>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {state.cluesRevealed}/{witness.clues.length} clues
        </span>
      </div>

      <ol className="space-y-2">
        {visibleClues.map((clue, i) => (
          <li key={i} className="flex gap-3 text-sm text-zinc-700 dark:text-zinc-300">
            <span className="text-zinc-400 dark:text-zinc-600 shrink-0 tabular-nums w-5 text-right">
              {i + 1}.
            </span>
            <span>{clue}</span>
          </li>
        ))}
      </ol>

      {!allCluesRevealed && (
        <button
          onClick={onRevealClue}
          className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline underline-offset-4 transition-colors"
        >
          Reveal next clue
        </button>
      )}
      {allCluesRevealed && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500 italic">
          All clues revealed
        </p>
      )}

      <div className="pt-1 space-y-2">
        {wrongGuesses.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {wrongGuesses.map((g) => (
              <span
                key={g}
                className="text-xs font-mono px-2 py-0.5 rounded bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400 line-through"
              >
                {g}
              </span>
            ))}
          </div>
        )}

        {justWrong && (
          <p className="text-xs text-red-500 dark:text-red-400">
            Not quite. Keep deducing.
          </p>
        )}

        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            max={999}
            value={inputValue}
            onChange={(e) => {
              setLastWrongGuess(null);
              setInputValue(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="1–999"
            className="w-28 px-3 py-2 text-sm font-mono rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            onClick={handleGuess}
            disabled={!inputValue}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Guess
          </button>
        </div>
      </div>
    </div>
  );
}
