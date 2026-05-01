import { notFound } from "next/navigation";
import { loadPuzzle } from "@/app/lib/puzzleLoader";
import { RULES } from "@/app/lib/ruleList";
import { Game } from "./_components/Game";

export default async function PuzzlePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const puzzle = loadPuzzle(date);
  if (!puzzle) notFound();
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Game puzzle={puzzle} rules={RULES} />
    </div>
  );
}
