"use client";

type Props = {
  onDismiss: () => void;
};

const STEPS = [
  {
    number: "1",
    title: "Crack the witnesses",
    body: "Each puzzle presents a series of mystery numbers. Clues reveal their mathematical properties one at a time. Request clues until you can guess the number.",
  },
  {
    number: "2",
    title: "Read the pattern",
    body: "Each cracked witness is labelled IN or OUT — whether it belongs to the hidden set. Use the growing IN/OUT pattern to form a theory.",
  },
  {
    number: "3",
    title: "Name the rule",
    body: 'Once you know the rule that defines the set, select it from the menu and submit. You can guess the rule at any time — early guesses earn a skip bonus.',
  },
];

export function HowToPlay({ onDismiss }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onDismiss();
      }}
    >
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            How to play
          </h2>
          <button
            onClick={onDismiss}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {STEPS.map((step) => (
            <div key={step.number} className="flex gap-4">
              <span className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-400">
                {step.number}
              </span>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {step.title}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
          <p>Fewer clues used = higher score.</p>
          <p>Guess the rule before the last witness for a skip bonus.</p>
        </div>

        <button
          onClick={onDismiss}
          className="w-full py-2.5 text-sm font-medium rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
