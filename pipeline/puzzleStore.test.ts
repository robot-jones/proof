import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdirSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import {
  saveScheduledPuzzles,
  loadScheduledPuzzle,
  listScheduledDates,
} from "./puzzleStore";
import type { ScheduledPuzzle } from "./scheduler";

function makePuzzle(id: string, tier: 1 | 2 | 3): ScheduledPuzzle {
  return {
    id,
    scheduledDate: id,
    tier,
    rule: { id: "prime", description: "prime numbers" },
    witnesses: [{ value: 83, inSet: true, clues: ["this number is prime"] }],
  };
}

let tmpDir: string;

beforeEach(() => {
  tmpDir = join(tmpdir(), `proof-test-${Date.now()}`);
  mkdirSync(tmpDir, { recursive: true });
});

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

describe("saveScheduledPuzzles", () => {
  it("writes one JSON file per puzzle", () => {
    const puzzles = [makePuzzle("2026-05-04", 1), makePuzzle("2026-05-05", 1)];
    saveScheduledPuzzles(puzzles, tmpDir);
    expect(listScheduledDates(tmpDir)).toEqual(["2026-05-04", "2026-05-05"]);
  });

  it("creates the output directory if it does not exist", () => {
    const nested = join(tmpDir, "a", "b");
    saveScheduledPuzzles([makePuzzle("2026-05-04", 1)], nested);
    expect(listScheduledDates(nested)).toEqual(["2026-05-04"]);
  });

  it("written JSON round-trips correctly", () => {
    const puzzle = makePuzzle("2026-05-04", 1);
    saveScheduledPuzzles([puzzle], tmpDir);
    const loaded = loadScheduledPuzzle("2026-05-04", tmpDir)!;
    expect(loaded).toEqual(puzzle);
  });
});

describe("loadScheduledPuzzle", () => {
  it("loads a puzzle that was saved", () => {
    const puzzle = makePuzzle("2026-05-04", 2);
    saveScheduledPuzzles([puzzle], tmpDir);
    const loaded = loadScheduledPuzzle("2026-05-04", tmpDir);
    expect(loaded).not.toBeNull();
    expect(loaded!.id).toBe("2026-05-04");
    expect(loaded!.tier).toBe(2);
  });

  it("returns null for a date that has no puzzle", () => {
    expect(loadScheduledPuzzle("2026-05-04", tmpDir)).toBeNull();
  });

  it("preserves all puzzle fields", () => {
    const puzzle = makePuzzle("2026-05-04", 3);
    saveScheduledPuzzles([puzzle], tmpDir);
    const loaded = loadScheduledPuzzle("2026-05-04", tmpDir)!;
    expect(loaded.rule.id).toBe("prime");
    expect(loaded.witnesses[0].value).toBe(83);
    expect(loaded.witnesses[0].clues).toEqual(["this number is prime"]);
  });
});

describe("listScheduledDates", () => {
  it("returns an empty array when directory does not exist", () => {
    expect(listScheduledDates(join(tmpDir, "nonexistent"))).toEqual([]);
  });

  it("returns dates in sorted order", () => {
    saveScheduledPuzzles(
      [
        makePuzzle("2026-05-06", 1),
        makePuzzle("2026-05-04", 1),
        makePuzzle("2026-05-05", 1),
      ],
      tmpDir
    );
    expect(listScheduledDates(tmpDir)).toEqual([
      "2026-05-04",
      "2026-05-05",
      "2026-05-06",
    ]);
  });

  it("ignores non-JSON files", () => {
    saveScheduledPuzzles([makePuzzle("2026-05-04", 1)], tmpDir);
    writeFileSync(join(tmpDir, "README.txt"), "ignore me");
    expect(listScheduledDates(tmpDir)).toEqual(["2026-05-04"]);
  });
});
