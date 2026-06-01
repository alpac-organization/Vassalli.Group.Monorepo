import type { PayrollPeriodItem } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-periods";

export interface PayrollHistoryCardProps {
  period: PayrollPeriodItem;
  style?: React.CSSProperties;
  onViewDetails?: () => void;
}
