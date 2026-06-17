import type { PayrollPeriodItem } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-periods";
import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";

export interface VirtualPayrollListProps {
  items: PayrollPeriodItem[];
  itemHeight: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isError: boolean;
  fetchNextPage: () => void;
  className?: string;
  isMobileLayout?: boolean;
  selectedBranch: string | null;
  selectedPayrollType: PayrollType | null;
}
