import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
      <div className="text-center space-y-4 px-4">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          No puzzle for this date
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          This puzzle hasn&apos;t been scheduled yet.
        </p>
        <div className="flex flex-col items-center gap-2 mt-2">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-900 dark:text-zinc-100 underline underline-offset-4"
          >
            Go to today&apos;s puzzle
          </Link>
          <Link
            href="/archive"
            className="text-sm text-zinc-500 dark:text-zinc-400 underline underline-offset-4"
          >
            Browse the archive
          </Link>
        </div>
      </div>
    </div>
  );
}
