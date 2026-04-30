# Proof — Design Notes

This document captures key design decisions and intentions established during early product design. It exists to give contributors (and AI coding assistants) the reasoning behind architectural choices, not just the choices themselves.

---

## Game concept

Proof is a two-layer daily deduction game.

**Layer 1 — Witness deduction.** Each puzzle contains 4–6 witnesses. Each witness is a hidden integer that the player deduces by receiving explicit logical clue statements one at a time (e.g. *"this number has exactly 3 factors"*, *"the digit sum is prime"*). The player can guess the witness value at any point. Once cracked, the player learns whether that witness belongs to the secret set.

**Layer 2 — Rule deduction.** As witnesses are cracked and their membership revealed, the player builds a theory about the hidden mathematical rule that defines the set (e.g. *"numbers whose digit sum is prime"*). The player can name the rule at any point. Naming it earlier scores better but is riskier.

---

## Number space

All witness values are integers in the range **1 to MAX**, where `MAX` defaults to 999.

```ts
const MAX = 999;
```

This constant is the single source of truth for the number space. All engine logic — the number registry, clue engine, witness generator, and validator — must reference `MAX` rather than hardcoding any bound. Expanding the number space in the future should require changing only this constant, followed by revalidating the rule and clue sets against the new space.

---

## Engine architecture

The puzzle engine is the core of the project. It is entirely headless — no UI dependency, no framework coupling. It should be fully buildable, runnable, and testable from the terminal before any frontend work begins.

```
engine/
├── numberRegistry.ts     # Precomputed properties for all integers 1–MAX
├── rules/                # Rule definitions, tiers, and validator functions
├── clueEngine.ts         # Clue generation and sequencing per witness
├── witnessGenerator.ts   # Witness selection and ordering given a rule
└── validator.ts          # Two-pass uniqueness validation
```

Each module should be independently testable. The recommended development order is:

1. `numberRegistry.ts`
2. `rules/`
3. `clueEngine.ts`
4. `witnessGenerator.ts`
5. `validator.ts`

---

## Number registry

`numberRegistry.ts` precomputes a property map for every integer from 1 to MAX. This avoids recomputing properties at runtime and ensures consistency across the clue engine, witness generator, and validator.

Properties to precompute per number (at minimum):

- Factors (full list)
- Factor count
- Prime factors (unique)
- Primality
- Digit sum
- Individual digits
- Perfect square / perfect cube flags
- Membership in named sequences (Fibonacci, triangular, etc.)

The registry should be a plain object or Map keyed by integer, generated once at startup or build time.

---

## Rule schema

Each rule is a structured object conforming to a `Rule` interface:

```ts
interface Rule {
  id: string;               // e.g. "digit-sum-prime"
  description: string;      // e.g. "numbers whose digit sum is prime"
  tier: 1 | 2 | 3;         // difficulty tier
  validate: (n: number) => boolean; // membership test
}
```

Rules are organized into three tiers:

- **Tier 1** — clean, generative rules; straightforward to validate and generate clues for (divisibility, factor count, digit sum properties, perfect powers, digit composition)
- **Tier 2** — interesting but require careful bounding (modular arithmetic, named sequences, prime relationships, digit operations)
- **Tier 3** — spicy, nerd-bait rules with high aha potential (self-referential, cross-base, composite relationships)

The full rule set should be enumerable at runtime so the validator can check all rules against a given witness set.

---

## Clue engine

The clue engine generates an ordered sequence of explicit logical statements for a given witness value. Clues must:

- Be drawn from a defined library of clue types, each with a consistent natural language template
- Progress from least specific to most specific
- Be selected based on elimination power — how many candidates each clue removes from the current set

Each clue type exposes:

```ts
interface ClueType {
  generate: (n: number) => string;              // produce the clue statement
  matches: (n: number) => boolean;              // test a candidate against this clue
  eliminationPower: (candidates: number[]) => number; // how much this clue narrows the field
}
```

---

## Two-pass validation

Every generated puzzle must pass two independent validation checks before entering the puzzle bank. This is non-negotiable — no ambiguous puzzle should ever reach a player.

### Pass 1 — Witness-level uniqueness

For each witness, the full clue set must resolve to exactly one integer in the number space. After all clues for a witness are applied, only one candidate should remain.

```
clues(witness) → candidate set of size 1
```

Any witness whose clue set leaves more than one candidate must be rejected or have additional clues generated.

### Pass 2 — Rule-level uniqueness

The complete witness set (with in/out membership labels) must be consistent with exactly one rule in the rule space. No two rules should fit the same pattern of in/out witnesses.

```
witnesses + membership labels → exactly one matching rule
```

If multiple rules are consistent with the witness set, the validator should either suggest additional witnesses to disambiguate, or reject the puzzle entirely.

---

## Difficulty and scheduling

Puzzles follow a weekly difficulty ramp. Difficulty is assigned by day of week:

| Day | Tier mix |
|---|---|
| Monday | Tier 1 |
| Tuesday | Tier 1 |
| Wednesday | Tier 1 / 2 |
| Thursday | Tier 2 |
| Friday | Tier 2 |
| Saturday | Tier 2 / 3 |
| Sunday | Tier 3 |

Every puzzle, regardless of difficulty tier, must be theoretically solvable by a persistent player. Sunday puzzles should be long and hard — not impossible. The validator enforces this by guaranteeing that the full clue set always uniquely resolves each witness, and the full witness set always uniquely identifies the rule.

---

## Scoring

A player's score reflects two things:

1. **Witness efficiency** — total clues used across all witnesses (fewer is better)
2. **Rule guess timing** — how many witnesses were cracked before the rule was named (earlier is better, but riskier)

Scores are summarized in a shareable text card at the end of each game. The card conveys performance without spoiling the puzzle. No Wordle-style color grid — the share format should be a compact, clever text summary.

---

## Puzzle storage format

Each puzzle is stored as a JSON document with the following shape:

```json
{
  "id": "2026-04-28",
  "scheduledDate": "2026-04-28",
  "tier": 1,
  "rule": {
    "id": "digit-sum-prime",
    "description": "numbers whose digit sum is prime"
  },
  "witnesses": [
    {
      "value": 83,
      "inSet": true,
      "clues": [
        "this number is greater than 50",
        "this number is prime",
        "the digit sum of this number is prime"
      ]
    }
  ]
}
```

Puzzles are pre-generated, validated, and stored before their scheduled date. The frontend fetches today's puzzle by date key — no server-side generation at request time.
