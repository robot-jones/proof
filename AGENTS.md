<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project overview

Proof is a two-layer daily deduction game. Players deduce hidden witness numbers from logical clue sequences (layer 1), then use revealed membership patterns to identify the hidden mathematical rule that defines the set (layer 2).

**Tech stack:** Next.js (TypeScript), Vercel hosting, Amazon DynamoDB (via Vercel Marketplace), Vercel OIDC Federation for auth (no hardcoded credentials).

## Development commands

```bash
npm run dev        # start dev server
npm run build      # production build
npm run test       # run test suite
npm run lint       # lint
```

The puzzle engine (`engine/`) is fully testable headlessly — build and test it before any frontend work.

## Architecture

### Directory structure

```
engine/               # Headless puzzle generation — no UI or framework dependency
  numberRegistry.ts   # Precomputed properties for all integers 1–MAX
  rules/              # Rule definitions, tiers, validate() functions
  clueEngine.ts       # Clue generation and sequencing per witness
  witnessGenerator.ts # Witness selection and ordering given a rule
  validator.ts        # Two-pass uniqueness validation
pipeline/             # Puzzle scheduling and storage
  scheduler.ts        # Weekly difficulty schedule and date assignment
  puzzleBank/         # Validated puzzle JSON documents
web/                  # Next.js frontend
  components/         # Game UI
scripts/              # CLI tools for bulk generation, admin, testing
```

### Engine development order

1. `numberRegistry.ts` — precomputed property map for 1–MAX
2. `rules/` — rule schema and tier 1/2/3 rule sets
3. `clueEngine.ts` — clue type library and sequencer
4. `witnessGenerator.ts` — witness selection and ordering
5. `validator.ts` — two-pass validation

### Key constant

```ts
const MAX = 999; // single source of truth for number space — all engine logic must reference this
```

Never hardcode numeric bounds. Changing MAX + revalidating should be the only work required to expand the number space.

## Core interfaces

```ts
interface Rule {
  id: string;
  description: string;
  tier: 1 | 2 | 3;
  validate: (n: number) => boolean;
}

interface ClueType {
  generate: (n: number) => string;
  matches: (n: number) => boolean;
  eliminationPower: (candidates: number[]) => number;
}
```

## Two-pass validation — non-negotiable

Every puzzle must pass both checks before entering the puzzle bank:

1. **Witness-level:** Full clue set for each witness must resolve to exactly one integer in 1–MAX.
2. **Rule-level:** The complete witness set (with in/out labels) must match exactly one rule in the rule space.

The validator should suggest additional witnesses when rule-level ambiguity is detected rather than simply failing.

## Puzzle JSON format

```json
{
  "id": "2026-04-28",
  "scheduledDate": "2026-04-28",
  "tier": 1,
  "rule": { "id": "digit-sum-prime", "description": "numbers whose digit sum is prime" },
  "witnesses": [
    { "value": 83, "inSet": true, "clues": ["this number is greater than 50", "..."] }
  ]
}
```

Puzzles are pre-generated and stored; the frontend fetches by date key — no server-side generation at request time.

## Difficulty schedule

| Day | Tier |
|---|---|
| Monday–Tuesday | Tier 1 |
| Wednesday | Tier 1/2 |
| Thursday–Friday | Tier 2 |
| Saturday | Tier 2/3 |
| Sunday | Tier 3 |

## Tier definitions

- **Tier 1** — divisibility, factor count, digit sum, perfect powers, digit composition
- **Tier 2** — modular arithmetic, named sequences, prime relationships, digit operations
- **Tier 3** — self-referential, cross-base, composite relationships

## Number registry properties (minimum)

Factors (full list), factor count, prime factors (unique), primality, digit sum, individual digits, perfect square/cube flags, membership in named sequences (Fibonacci, triangular, etc.).
