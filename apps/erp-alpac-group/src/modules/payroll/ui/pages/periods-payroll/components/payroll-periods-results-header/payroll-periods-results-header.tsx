import type { PayrollPeriodsResultsHeaderProps } from "@app/modules/payroll/ui/pages/periods-payroll/components/payroll-periods-results-header/payroll-periods-results-header.types";

export function PayrollPeriodsResultsHeader({
  totalPeriods,
  periodTypeLabel,
  branchName,
  className = "",
}: PayrollPeriodsResultsHeaderProps) {
  const periodsLabel =
    totalPeriods === 1 ? "periodo encontrado" : "periodos encontrados";

  return (
    <div className={`flex flex-wrap items-center gap-2 sm:gap-3 ${className}`}>
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
        {totalPeriods} {periodsLabel}
      </span>

      {periodTypeLabel && branchName && (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-500 dark:bg-blue-500/10 dark:text-blue-400 sm:text-xs">
          {[periodTypeLabel, branchName].filter(Boolean).join(" · ")}
        </span>
      )}
    </div>
  );
}
