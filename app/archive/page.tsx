import { listPuzzles } from "@/app/lib/puzzleLoader";
import { ArchiveList } from "./_components/ArchiveList";

export default function ArchivePage() {
  const puzzles = listPuzzles();
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <header className="space-y-1 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <span className="text-xs font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
            Proof
          </span>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Puzzle Archive
          </h1>
        </header>
        <ArchiveList puzzles={puzzles} />
      </div>
    </div>
  );
}
