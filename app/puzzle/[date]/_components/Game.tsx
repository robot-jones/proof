"use client";

import { useState, useEffect } from "react";
import type { ScheduledPuzzle } from "@/pipeline/scheduler";
import type { RuleInfo } from "@/app/lib/ruleList";
import { type GameState, initGameState } from "@/app/lib/gameState";
import { GameHeader } from "./GameHeader";
import { WitnessHistory } from "./WitnessHistory";
import { WitnessView } from "./WitnessView";
import { RulePicker } from "./RulePicker";

function storageKey(puzzleId: string) {
  return `proof-game-${puzzleId}`;
}

type Props = {
  puzzle: ScheduledPuzzle;
  rules: RuleInfo[];
};

export function Game({ puzzle, rules }: Props) {
  const [state, setState] = useState<GameState>(() =>
    initGameState(puzzle.id, puzzle.witnesses.length)
  );
  const [hydrated, setHydrated] = useState(false);

  // Load saved state from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    const saved = localStorage.getItem(storageKey(puzzle.id));
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch {}
    }
    setHydrated(true);
  }, [puzzle.id]);

  // Persist state on every change
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(storageKey(state.puzzleId), JSON.stringify(state));
  }, [state, hydrated]);

  const currentIdx = state.currentWitnessIndex;
  const allWitnessesSolved = currentIdx >= puzzle.witnesses.length;

  function revealNextClue() {
    setState((prev) => {
      const witnesses = [...prev.witnesses];
      const w = { ...witnesses[currentIdx] };
      const maxClues = puzzle.witnesses[currentIdx].clues.length;
      w.cluesRevealed = Math.min(w.cluesRevealed + 1, maxClues);
      witnesses[currentIdx] = w;
      return { ...prev, witnesses };
    });
  }

  function submitWitnessGuess(guess: number) {
    const correctValue = puzzle.witnesses[currentIdx].value;
    if (guess === correctValue) {
      setState((prev) => {
        const witnesses = [...prev.witnesses];
        witnesses[currentIdx] = { ...witnesses[currentIdx], solved: true };
        return {
          ...prev,
          witnesses,
          currentWitnessIndex: prev.currentWitnessIndex + 1,
        };
      });
    } else {
      setState((prev) => {
        const witnesses = [...prev.witnesses];
        const w = { ...witnesses[currentIdx] };
        if (!w.guesses.includes(guess)) {
          w.guesses = [...w.guesses, guess];
        }
        witnesses[currentIdx] = w;
        return { ...prev, witnesses };
      });
    }
  }

  function submitRuleGuess(ruleId: string) {
    if (ruleId === puzzle.rule.id) {
      setState((prev) => ({
        ...prev,
        ruleSolved: true,
        completedAt: new Date().toISOString(),
      }));
    } else {
      setState((prev) => {
        if (prev.ruleGuesses.includes(ruleId)) return prev;
        return { ...prev, ruleGuesses: [...prev.ruleGuesses, ruleId] };
      });
    }
  }

  function revealAnswer() {
    setState((prev) => ({
      ...prev,
      revealed: true,
      completedAt: new Date().toISOString(),
    }));
  }

  // Solved witnesses for history (sliced to currentIdx)
  const solvedWitnesses = puzzle.witnesses
    .slice(0, currentIdx)
    .map((w, i) => ({
      value: w.value,
      inSet: w.inSet,
      cluesUsed: state.witnesses[i].cluesRevealed,
    }));

  if (!hydrated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <GameHeader puzzle={puzzle} state={state} />

      {state.completedAt ? (
        <CompletedView puzzle={puzzle} state={state} />
      ) : (
        <>
          <WitnessHistory witnesses={solvedWitnesses} />

          {!allWitnessesSolved && (
            <WitnessView
              key={currentIdx}
              witness={puzzle.witnesses[currentIdx]}
              state={state.witnesses[currentIdx]}
              witnessIndex={currentIdx}
              totalWitnesses={puzzle.witnesses.length}
              onRevealClue={revealNextClue}
              onGuess={submitWitnessGuess}
            />
          )}

          <RulePicker
            rules={rules}
            wrongGuesses={state.ruleGuesses}
            allWitnessesSolved={allWitnessesSolved}
            onGuess={submitRuleGuess}
            onReveal={revealAnswer}
          />
        </>
      )}
    </div>
  );
}

function CompletedView({
  puzzle,
  state,
}: {
  puzzle: ScheduledPuzzle;
  state: GameState;
}) {
  const allWitnesses = puzzle.witnesses.map((w, i) => ({
    value: w.value,
    inSet: w.inSet,
    cluesUsed: state.witnesses[i]?.cluesRevealed ?? w.clues.length,
  }));

  return (
    <div className="space-y-4">
      <div
        className={`rounded-lg px-5 py-4 ${
          state.ruleSolved
            ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
            : "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
        }`}
      >
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

      <div className="space-y-2">
        {allWitnesses.map((w, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-4 py-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 dark:text-zinc-500 w-4">
                {i + 1}
              </span>
              <span className="text-2xl font-mono font-bold text-zinc-900 dark:text-zinc-100">
                {w.value}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                {w.cluesUsed} {w.cluesUsed === 1 ? "clue" : "clues"}
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
          </div>
        ))}
      </div>
    </div>
  );
}
