import type { PayrollPeriodStatCardProps } from "@app/modules/payroll/ui/pages/periods-payroll/components/payroll-period-stat-card/payroll-period-stat-card.types";

export type PayrollPeriodSummaryStatItem = PayrollPeriodStatCardProps & {
  id: string;
};

export interface PayrollPeriodsSummaryProps {
  stats: PayrollPeriodSummaryStatItem[];
  className?: string;
}
