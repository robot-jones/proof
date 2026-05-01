import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { rules } from "../engine/rules";
import { generatePuzzle } from "../engine/puzzleGenerator";

const PUZZLE_BANK_DIR = join(process.cwd(), "pipeline/puzzleBank");

const n = parseInt(process.argv[2] ?? "5", 10);
if (isNaN(n) || n < 1) {
  console.error("Usage: npx tsx scripts/generatePuzzles.ts [n]");
  process.exit(1);
}

const tiers = [1, 2, 3] as const;
let totalGenerated = 0;
let totalFailed = 0;

for (const tier of tiers) {
  const tierRules = rules.filter((r) => r.tier === tier).slice(0, n);
  const tierDir = join(PUZZLE_BANK_DIR, `tier${tier}`);
  mkdirSync(tierDir, { recursive: true });

  let generated = 0;
  let failed = 0;

  console.log(`\nTier ${tier} (${tierRules.length} rule(s)):`);

  for (const rule of tierRules) {
    const result = generatePuzzle(rule);
    if (result.puzzle) {
      const path = join(tierDir, `${rule.id}.json`);
      writeFileSync(path, JSON.stringify(result.puzzle, null, 2));
      console.log(`  ✓ ${rule.id}`);
      generated++;
    } else {
      console.log(`  ✗ ${rule.id} — ${result.failureReason}`);
      failed++;
    }
  }

  console.log(`  ${generated} generated, ${failed} failed`);
  totalGenerated += generated;
  totalFailed += failed;
}

console.log(`\nTotal: ${totalGenerated} generated, ${totalFailed} failed`);
