import { PayrollPeriodStatCard } from "@app/modules/payroll/ui/pages/periods-payroll/components/payroll-period-stat-card/payroll-period-stat-card";
import type { PayrollPeriodsSummaryProps } from "@app/modules/payroll/ui/pages/periods-payroll/components/payroll-periods-summary/payroll-periods-summary.types";

export function PayrollPeriodsSummary({
  stats,
  className = "",
}: PayrollPeriodsSummaryProps) {
  if (stats.length === 0) return null;

  return (
    <div
      className={`grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 ${className}`}
    >
      {stats.map(({ id, ...cardProps }) => (
        <PayrollPeriodStatCard key={id} {...cardProps} />
      ))}
    </div>
  );
}
