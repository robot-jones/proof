"use client";

type WitnessRecord = {
  value: number;
  inSet: boolean;
  cluesUsed: number;
};

type Props = {
  witnesses: WitnessRecord[];
};

export function WitnessHistory({ witnesses }: Props) {
  if (witnesses.length === 0) return null;

  return (
    <div className="space-y-2">
      {witnesses.map((w, i) => (
        <div
          key={i}
          className="flex items-center justify-between px-4 py-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 w-4">
              {i + 1}
            </span>
            <span className="text-2xl font-mono font-bold text-zinc-900 dark:text-zinc-100">
              {w.value}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              {w.cluesUsed} {w.cluesUsed === 1 ? "clue" : "clues"}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full tracking-wide ${
                w.inSet
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
              }`}
            >
              {w.inSet ? "IN" : "OUT"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
