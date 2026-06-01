import type { PayrollPeriodStatCardProps } from "@app/modules/payroll/ui/pages/periods-payroll/components/payroll-period-stat-card/payroll-period-stat-card.types";

export function PayrollPeriodStatCard({
  icon: Icon,
  iconContainerClassName = "bg-slate-100 dark:bg-neutral-800",
  iconClassName = "text-slate-500 dark:text-slate-400",
  label,
  value,
  subLabel,
  className = "",
}: PayrollPeriodStatCardProps) {
  return (
    <div
      className={`flex items-center gap-3 sm:gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:px-5 sm:py-4 dark:border-neutral-700/60 dark:bg-[#272b34] ${className}`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-11 sm:w-11 ${iconContainerClassName}`}
      >
        <Icon
          size={18}
          strokeWidth={1.75}
          className={`sm:h-5 sm:w-5 ${iconClassName}`}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-[11px] font-medium leading-none text-slate-400 dark:text-slate-500 sm:text-xs">
          {label}
        </p>
        <p className="text-lg font-bold leading-tight text-slate-800 dark:text-white sm:text-xl">
          {value === "" || value === null || value === undefined ? "—" : value}
        </p>
        <p className="text-[11px] leading-none text-slate-400 dark:text-slate-500 sm:text-xs">
          {subLabel}
        </p>
      </div>
    </div>
  );
}
