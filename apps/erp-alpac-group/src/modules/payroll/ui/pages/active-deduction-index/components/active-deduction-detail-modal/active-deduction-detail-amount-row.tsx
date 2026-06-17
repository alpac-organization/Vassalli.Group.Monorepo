import { formatCurrency } from "@app/shared/utils/currency.utils";

type ActiveDeductionDetailAmountRowProps = {
  label: string;
  nio: number;
  usd?: number | null;
  highlight?: boolean;
  bold?: boolean;
  labelClassName?: string;
  gridClassName?: string;
};

export function ActiveDeductionDetailAmountRow({
  label,
  nio,
  usd,
  highlight,
  bold,
  labelClassName,
  gridClassName = "sm:grid-cols-3",
}: ActiveDeductionDetailAmountRowProps) {
  const textClass = bold
    ? "font-bold text-slate-900 dark:text-white"
    : highlight
      ? "font-semibold text-blue-700 dark:text-blue-300"
      : "font-medium text-slate-700 dark:text-slate-200";

  const labelTextClass =
    labelClassName ?? "text-sm font-medium text-slate-600 dark:text-slate-300";

  const desktopLabelClass =
    labelClassName ?? "text-sm text-slate-500 dark:text-slate-400";

  return (
    <>
      <div className="flex flex-col gap-3 px-3 py-3 sm:hidden">
        <p className={labelTextClass}>{label}</p>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              NIO
            </span>
            <span
              className={`font-mono text-sm tabular-nums wrap-break-word text-right ${textClass}`}
            >
              {formatCurrency(nio, "NIO")}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              USD
            </span>
            <span
              className={`font-mono text-sm tabular-nums wrap-break-word text-right ${textClass}`}
            >
              {usd != null ? formatCurrency(usd, "USD") : "—"}
            </span>
          </div>
        </div>
      </div>

      <div className={`hidden sm:grid ${gridClassName}`}>
        <div className={`px-3 py-2.5 ${desktopLabelClass}`}>
          {label}
        </div>
        <div className={`px-3 py-2.5 font-mono text-sm tabular-nums ${textClass}`}>
          {formatCurrency(nio, "NIO")}
        </div>
        <div className={`px-3 py-2.5 font-mono text-sm tabular-nums ${textClass}`}>
          {usd != null ? formatCurrency(usd, "USD") : "—"}
        </div>
      </div>
    </>
  );
}
