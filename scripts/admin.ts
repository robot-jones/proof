import { join } from "path";
import {
  loadPuzzleBank,
  loadScheduledPuzzle,
  saveScheduledPuzzles,
  listScheduledDates,
} from "../pipeline/puzzleStore";
import { scheduleDates, assignPuzzles, dateKey } from "../pipeline/scheduler";

const BANK_DIR = join(process.cwd(), "pipeline/puzzleBank");
const SCHEDULED_DIR = join(process.cwd(), "pipeline/scheduled");

const [, , command, ...args] = process.argv;

function usage(): void {
  console.log(`
Usage: npx tsx scripts/admin.ts <command> [args]

Commands:
  list-bank                      List all puzzles in the bank by tier
  list-scheduled                 List all scheduled puzzles
  show <date>                    Show the puzzle scheduled for a date (YYYY-MM-DD)
  schedule <start-date> <count>  Schedule puzzles for <count> days from <start-date>
  swap <date> <rule-id>          Replace the puzzle on <date> with a rule from the bank
  `.trim());
}

function listBank(): void {
  const bank = loadPuzzleBank(BANK_DIR);
  for (const tier of [1, 2, 3] as const) {
    const puzzles = bank[tier];
    console.log(`\nTier ${tier} (${puzzles.length} puzzle(s)):`);
    for (const p of puzzles) {
      console.log(`  ${p.rule.id} — ${p.rule.description}`);
    }
  }
}

function listScheduled(): void {
  const dates = listScheduledDates(SCHEDULED_DIR);
  if (dates.length === 0) {
    console.log("No scheduled puzzles.");
    return;
  }
  for (const date of dates) {
    const puzzle = loadScheduledPuzzle(date, SCHEDULED_DIR)!;
    console.log(`  ${date}  [Tier ${puzzle.tier}]  ${puzzle.rule.id}`);
  }
}

function show(date: string): void {
  const puzzle = loadScheduledPuzzle(date, SCHEDULED_DIR);
  if (!puzzle) {
    console.error(`No puzzle scheduled for ${date}.`);
    process.exit(1);
  }
  console.log(JSON.stringify(puzzle, null, 2));
}

function schedule(startDate: string, count: number): void {
  const bank = loadPuzzleBank(BANK_DIR);
  const dates = scheduleDates(new Date(`${startDate}T00:00:00Z`), count);
  const puzzles = assignPuzzles(dates, bank);

  if (puzzles.length === 0) {
    console.error("No puzzles could be scheduled — puzzle bank may be empty.");
    process.exit(1);
  }

  saveScheduledPuzzles(puzzles, SCHEDULED_DIR);

  for (const p of puzzles) {
    console.log(`  ${p.scheduledDate}  [Tier ${p.tier}]  ${p.rule.id}`);
  }
  console.log(`\nScheduled ${puzzles.length} puzzle(s).`);
}

function swap(date: string, ruleId: string): void {
  const bank = loadPuzzleBank(BANK_DIR);
  const allPuzzles = [...bank[1], ...bank[2], ...bank[3]];
  const replacement = allPuzzles.find((p) => p.rule.id === ruleId);

  if (!replacement) {
    console.error(`Rule "${ruleId}" not found in puzzle bank.`);
    process.exit(1);
  }

  const existing = loadScheduledPuzzle(date, SCHEDULED_DIR);
  if (!existing) {
    console.error(`No puzzle scheduled for ${date}.`);
    process.exit(1);
  }

  const swapped = { ...replacement, id: date, scheduledDate: date };
  saveScheduledPuzzles([swapped], SCHEDULED_DIR);
  console.log(`Swapped ${date}: ${existing.rule.id} → ${ruleId}`);
}

switch (command) {
  case "list-bank":
    listBank();
    break;
  case "list-scheduled":
    listScheduled();
    break;
  case "show":
    if (!args[0]) { usage(); process.exit(1); }
    show(args[0]);
    break;
  case "schedule":
    if (!args[0] || !args[1]) { usage(); process.exit(1); }
    schedule(args[0], parseInt(args[1], 10));
    break;
  case "swap":
    if (!args[0] || !args[1]) { usage(); process.exit(1); }
    swap(args[0], args[1]);
    break;
  default:
    usage();
    if (command) process.exit(1);
}
