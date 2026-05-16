import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
  type InfiniteData,
} from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
import { PayrollServices } from "@app/modules/payroll/infrastructure/services/payroll-services/PayrollServices";
import type { PayrollPeriodsHistoryRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-periods-history.request";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { PayrollPeriodItem } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-periods";
const payrollServices = new PayrollServices(httpHandler);

type UsePayrollPeriodsHistoryProps = {
  payload: Omit<PayrollPeriodsHistoryRequest, "page_number">;
  enabled?: boolean;
};

export function usePayrollPeriodsHistory({
  payload,
  enabled = true,
}: UsePayrollPeriodsHistoryProps): UseInfiniteQueryResult<
  InfiniteData<PayrollPeriodItem[], number>,
  ApiErrorResponse
> {
  const { companie_id, module_code, branch_id, type, page_size = 10 } = payload;

  return useInfiniteQuery({
    queryKey: [
      "payrollPeriodsHistory",
      companie_id,
      module_code,
      branch_id,
      type,
    ],
    queryFn: ({ pageParam = 1 }) =>
      payrollServices.getPayrollPeriodsHistory({
        ...payload,
        page_number: pageParam,
        page_size,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      return lastPage.length < page_size ? undefined : lastPageParam + 1;
    },
    enabled: enabled && Boolean(companie_id && module_code && branch_id),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
