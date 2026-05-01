"use client";

import { useState, useEffect } from "react";
import type { ScheduledPuzzle } from "@/pipeline/scheduler";
import type { RuleInfo } from "@/app/lib/ruleList";
import { type GameState, initGameState } from "@/app/lib/gameState";
import { GameHeader } from "./GameHeader";
import { WitnessHistory } from "./WitnessHistory";
import { WitnessView } from "./WitnessView";
import { RulePicker } from "./RulePicker";
import { CompletedView } from "./CompletedView";
import { HowToPlay } from "./HowToPlay";

const HOW_TO_PLAY_KEY = "proof-howtoplay-seen";

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
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Load saved state and check first-visit on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey(puzzle.id));
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch {}
    }
    if (!localStorage.getItem(HOW_TO_PLAY_KEY)) {
      setShowHowToPlay(true);
    }
    setHydrated(true);
  }, [puzzle.id]);

  function dismissHowToPlay() {
    localStorage.setItem(HOW_TO_PLAY_KEY, "1");
    setShowHowToPlay(false);
  }

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
      {showHowToPlay && <HowToPlay onDismiss={dismissHowToPlay} />}
      <GameHeader puzzle={puzzle} state={state} onHowToPlay={() => setShowHowToPlay(true)} />

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

