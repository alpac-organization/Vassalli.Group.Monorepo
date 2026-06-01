import type { PayrollPeriodItem } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-periods";
export interface VirtualPayrollListProps {
  items: PayrollPeriodItem[];
  itemHeight: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isError: boolean;
  fetchNextPage: () => void;
  className?: string;
  isMobileLayout?: boolean;
}
