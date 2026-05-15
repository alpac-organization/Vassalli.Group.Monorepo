interface PayrollSkeletonCardProps {
  style?: React.CSSProperties;
}

export function PayrollSkeletonCard({ style }: PayrollSkeletonCardProps) {
  return (
    <div
      style={style}
      className="absolute top-0 left-0 w-full px-2 py-2"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-slate-200 bg-white/50 shadow-sm dark:border-neutral-700 dark:bg-[#1e2229]/50 h-full animate-pulse">
        <div className="flex items-start gap-4 w-full">
          <div className="h-12 w-12 shrink-0 rounded-full bg-slate-200 dark:bg-neutral-800"></div>
          <div className="flex flex-col gap-2 w-full max-w-sm">
            <div className="h-5 w-40 rounded bg-slate-200 dark:bg-neutral-800"></div>
            <div className="h-4 w-56 rounded bg-slate-200 dark:bg-neutral-800 mt-1"></div>
            <div className="h-3 w-32 rounded bg-slate-200 dark:bg-neutral-800 mt-2"></div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 mt-4 md:mt-0">
          <div className="h-6 w-24 rounded-full bg-slate-200 dark:bg-neutral-800"></div>
        </div>
      </div>
    </div>
  );
}
