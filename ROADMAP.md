# Proof — Product Roadmap

## Overview

This roadmap is organized into epics, each broken into features and user stories. Development is intended to proceed roughly in order, with the puzzle engine (epics 1–4) fully buildable and testable headlessly before any UI work begins.

---

## Epic 1 — Number Space & Rule Taxonomy

Define the foundational data model: the fixed number space and the full enumerated rule set across all difficulty tiers.

### Feature 1.1 — Number space definition
- **US-01** As a developer, I want a configurable `MAX` constant (default 999) so that the number space can be expanded later without refactoring.
- **US-02** As a developer, I want a precomputed number registry (factors, digit sum, primality, etc.) for all integers 1–MAX so that clue evaluation is fast and consistent.

### Feature 1.2 — Rule taxonomy
- **US-03** As a developer, I want a structured rule schema (id, description, tier, validator function) so that rules are consistently defined and enumerable.
- **US-04** As a developer, I want a Tier 1 rule set (divisibility, factor count, digit sum, perfect powers, digit composition) covering at least 20 rules so that early-week puzzles have a deep pool.
- **US-05** As a developer, I want a Tier 2 rule set (modular arithmetic, named sequences, prime relationships, digit operations) covering at least 15 rules so that mid-week puzzles have sufficient variety.
- **US-06** As a developer, I want a Tier 3 rule set (self-referential, cross-base, composite relationships) covering at least 8 rules so that end-of-week puzzles have genuine nerd-bait potential.
- **US-07** As a developer, I want each rule to expose a `validate(n) -> boolean` function so that membership can be tested for any number in the space.

---

## Epic 2 — Clue Engine

Given a target number and the full number space, generate a sequence of explicit logical statements that progressively narrow the solution to exactly one number.

### Feature 2.1 — Clue type library
- **US-08** As a developer, I want a library of clue templates (e.g. "this number is divisible by N", "this number has exactly N factors", "the digit sum of this number is N") so that clues are generated from a consistent, extensible vocabulary.
- **US-09** As a developer, I want each clue type to expose a `matches(n) -> boolean` function so that the candidate set can be filtered clue by clue.
- **US-10** As a developer, I want each clue type to expose an `eliminationPower(candidateSet) -> number` function so that clues can be ranked by how much they narrow the space.

### Feature 2.2 — Clue sequence generation
- **US-11** As a developer, I want a clue sequencer that, given a target number and current candidate set, selects the next most informative clue so that each clue meaningfully advances the player's deduction.
- **US-12** As a developer, I want clues ordered from least to most specific so that early clues set broad context and later clues close in on the answer.
- **US-13** As a developer, I want a configurable minimum and maximum clue count per witness so that puzzle difficulty can be tuned by tier.

### Feature 2.3 — Uniqueness validation (witness level)
- **US-14** As a developer, I want a validator that confirms the full clue set for a witness resolves to exactly one number in the space so that no witness puzzle is ambiguous.
- **US-15** As a developer, I want the validator to flag and reject any witness whose clue set leaves more than one candidate after all clues are revealed so that broken puzzles never reach the pipeline.

---

## Epic 3 — Witness Generator

Given a rule, generate an ordered sequence of witnesses (in/out members) that are collectively sufficient to deduce the rule without giving it away too early.

### Feature 3.1 — Witness selection
- **US-16** As a developer, I want a witness selector that, given a rule, produces a set of 4–6 numbers (mix of rule members and non-members) so that each puzzle has a coherent evidence set.
- **US-17** As a developer, I want witnesses ordered so that early witnesses are ambiguous across multiple plausible rules and later witnesses are maximally discriminating so that the meta-deduction has a satisfying arc.
- **US-18** As a developer, I want witness selection to avoid trivially obvious members (e.g. for "perfect squares", not leading with 1, 4, 9) so that the rule isn't immediately obvious from witness 1.

### Feature 3.2 — Witness difficulty tuning
- **US-19** As a developer, I want a difficulty parameter that controls average clues-needed per witness so that witness hardness can be adjusted by day of week.
- **US-20** As a developer, I want a difficulty parameter that controls how many witnesses are revealed before the rule becomes uniquely identifiable so that meta-deduction timing can be tuned.

---

## Epic 4 — Puzzle Validator

Two-pass validation ensuring every generated puzzle is unambiguous at both the witness level and the rule level.

### Feature 4.1 — Rule-level uniqueness validation
- **US-21** As a developer, I want a validator that, given a complete witness set (with in/out labels), confirms that exactly one rule in the rule space fits the pattern so that no puzzle is accidentally ambiguous at the meta level.
- **US-22** As a developer, I want the validator to enumerate all rules that are consistent with the witness set and reject any puzzle where more than one rule matches so that players can always be confident there is one correct answer.
- **US-23** As a developer, I want the validator to suggest additional witnesses when ambiguity is detected so that the generator can self-correct rather than simply failing.

### Feature 4.2 — End-to-end puzzle testing
- **US-24** As a developer, I want a headless puzzle runner that simulates an optimal player solving a puzzle so that I can measure minimum clues needed and validate solve paths.
- **US-25** As a developer, I want a bulk generation script that produces and validates N puzzles per tier so that I can build a puzzle bank before launch.

---

## Epic 5 — Puzzle Pipeline

Scheduling, difficulty assignment, and storage for the daily puzzle queue.

### Feature 5.1 — Difficulty scheduling
- **US-26** As a developer, I want a weekly difficulty schedule (Mon = Tier 1, Tue/Wed = Tier 1/2, Thu/Fri = Tier 2, Sat = Tier 2/3, Sun = Tier 3) so that puzzle difficulty ramps across the week predictably.
- **US-27** As a developer, I want the scheduler to pull from the validated puzzle bank and assign puzzles to calendar dates so that the daily puzzle queue can be managed ahead of time.

### Feature 5.2 — Puzzle storage
- **US-28** As a developer, I want each puzzle stored as a JSON document (rule, witnesses, clue sequences, difficulty tier, scheduled date) so that the frontend can fetch and render any day's puzzle.
- **US-29** As a developer, I want a puzzle admin interface (even if minimal/CLI) so that I can review, swap, or manually tune puzzles before they go live.

---

## Epic 6 — Frontend: Core Game

The daily game UI — witness deduction, rule naming, and progression flow.

### Feature 6.1 — Witness deduction view
- **US-30** As a player, I want to see the current witness number revealed after I've cracked it so that I get satisfying confirmation of my deduction.
- **US-31** As a player, I want clues to appear one at a time so that I can reason through each one before requesting the next.
- **US-32** As a player, I want to submit a guess for the witness value at any time so that I can attempt to crack it early without waiting for all clues.
- **US-33** As a player, I want feedback when my witness guess is wrong (but no penalty clue reveal) so that incorrect guesses feel consequential without being catastrophic.
- **US-34** As a player, I want to see in/out membership revealed for each cracked witness so that I can start building my theory of the rule.

### Feature 6.2 — Rule naming
- **US-35** As a player, I want to be able to name the rule at any point during the game so that I can attempt an early solve for a better score.
- **US-36** As a player, I want a structured rule input (select rule components from menus rather than free text) so that rule naming is unambiguous and typo-proof.
- **US-37** As a player, I want clear feedback when my rule guess is wrong so that I know to keep deducing without being told what the rule is.
- **US-38** As a player, I want a "reveal" option after exhausting all witnesses so that I can always see the answer and learn, even if I couldn't solve it.

### Feature 6.3 — Game state & persistence
- **US-39** As a player, I want my in-progress game saved to local storage so that I can close the tab and resume later.
- **US-40** As a player, I want to see which day's puzzle I'm playing and whether I've already played today so that I don't accidentally replay a completed puzzle.

---

## Epic 7 — Scoring & Share Card

Calculate a meaningful score and generate a shareable summary.

### Feature 7.1 — Scoring model
- **US-41** As a player, I want a score that reflects total clues used across all witnesses so that efficient deduction is rewarded.
- **US-42** As a player, I want a bonus reflected in my score for naming the rule before all witnesses are cracked so that early rule-guessing feels rewarding.
- **US-43** As a player, I want a score breakdown showing per-witness clue efficiency so that I can see where I was sharp and where I struggled.

### Feature 7.2 — Share card
- **US-44** As a player, I want a one-tap share card generated at the end of each game so that I can post my result without spoiling the puzzle.
- **US-45** As a player, I want the share card to convey my score, difficulty tier, and rule-guess timing in a compact and clever text format so that it reads interestingly even to non-players.
- **US-46** As a player, I want the share card to be copyable to clipboard so that I can paste it anywhere.

---

## Epic 8 — Polish & Launch Prep

- **US-47** As a player, I want a clean onboarding flow (how to play) so that first-time players understand the two-layer deduction mechanic.
- **US-48** As a developer, I want a puzzle archive so that new players can play back-catalog puzzles.
- **US-49** As a developer, I want basic analytics (solve rate, average clues used, rule guess timing distribution) so that I can tune difficulty and identify broken puzzles post-launch.
- **US-50** As a developer, I want the number space bound (`MAX`) to be trivially updatable so that expanding from 999 to 9999 requires no refactoring.
