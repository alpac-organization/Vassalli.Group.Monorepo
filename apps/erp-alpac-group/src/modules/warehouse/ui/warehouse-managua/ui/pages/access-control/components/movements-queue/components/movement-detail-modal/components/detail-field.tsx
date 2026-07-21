type DetailFieldProps = {
  label: string;
  value?: string | null;
  className?: string;
};

function displayValue(value?: string | null): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}

export function DetailField({ label, value, className = "" }: DetailFieldProps) {
  return (
    <div className={`min-w-0 ${className}`}>
      <p className="m-0! mb-1! text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="m-0! wrap-break-word text-sm font-medium text-slate-900 dark:text-white">
        {displayValue(value)}
      </p>
    </div>
  );
}
