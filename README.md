# Proof

A daily logic deduction game. Every day, a secret mathematical rule defines a hidden set. Your job is to deduce the rule — by first cracking the witnesses.

---

## How it works

Each puzzle has two layers.

**Layer 1 — Crack the witnesses**

You're shown witnesses one at a time. Each witness is a hidden number. Logical clues drip in — *"this number has exactly 3 factors"*, *"the digit sum is prime"*, *"this number is divisible by 7"* — and you narrow down what the witness is. Guess early for efficiency. Once cracked, you learn whether the witness belongs to the secret set or not.

**Layer 2 — Name the rule**

As witnesses are revealed and their membership confirmed, you build a picture. All in-set witnesses share a hidden mathematical property. Once you think you know what it is, name the rule. The fewer witnesses you needed, the better your score.

---

## Scoring

Your score reflects two things: how efficiently you cracked the witnesses, and how early you named the rule. Results are summarized in a shareable score card that conveys your performance without spoiling the puzzle.

---

## Difficulty

Puzzles follow a weekly difficulty ramp. Monday is approachable. Sunday is for people who think in modular arithmetic for fun. The full clue set for any witness always uniquely identifies it — every puzzle is solvable by a persistent player.

---

## Number space

All witness values are integers between 1 and 999.

---

## Tech stack

- **Framework** — Next.js (TypeScript)
- **Hosting** — Vercel
- **Database** — Amazon DynamoDB, provisioned via the Vercel Marketplace and owned by your AWS account
- **Auth** — Vercel OIDC Federation + DynamoDB IAM authentication (no hardcoded credentials)

DynamoDB tables live in your AWS account and are fully accessible via the AWS Console. Vercel handles credential injection and environment variable wiring automatically.

---

## Project structure

```
proof/
├── engine/               # Puzzle generation and validation (headless)
│   ├── numberRegistry.js # Precomputed properties for all integers 1–MAX
│   ├── rules/            # Rule definitions, tiers, and validator functions
│   ├── clueEngine.js     # Clue generation and sequencing per witness
│   ├── witnessGenerator.js # Witness selection and ordering given a rule
│   └── validator.js      # Two-pass uniqueness validation
├── pipeline/             # Puzzle scheduling and storage
│   ├── scheduler.js      # Weekly difficulty schedule and date assignment
│   └── puzzleBank/       # Validated puzzle JSON documents
├── web/                  # Frontend
│   ├── components/       # Game UI components
│   └── ...
├── scripts/              # CLI tools for bulk generation, admin, testing
├── DESIGN.md             # Game design document
├── ROADMAP.md            # Full epics, features, and user stories
└── README.md
```

---

## Development order

The puzzle engine (everything under `engine/`) is fully buildable and testable without any UI. Start there.

1. Define the number space and rule taxonomy
2. Build the clue engine
3. Build the witness generator
4. Build the two-pass validator
5. Build the puzzle pipeline (scheduling + storage)
6. Build the frontend
7. Build scoring and share card

See [`ROADMAP.md`](./ROADMAP.md) for full epics, features, and user stories.

---

## Configuration

The number space upper bound is a single configurable constant:

```js
const MAX = 999; // expandable to 9999 or beyond without refactoring
```

All engine logic operates against this constant. Expanding the number space requires updating `MAX` and revalidating the rule and clue sets against the new space.

---

## Puzzle format

Each puzzle is stored as a JSON document:

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

---

## License

MIT


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
