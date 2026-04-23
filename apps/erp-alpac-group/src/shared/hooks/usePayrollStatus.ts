import { useQuery } from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
import { PayrollServices } from "@app/modules/payroll/infrastructure/services/payroll-services/PayrollServices";
import type { GetPayrollProcessResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-process";
import type { PayrollProcessRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";

const payrollServices = new PayrollServices(httpHandler);

export interface UsePayrollStatusParams {
  payload: PayrollProcessRequest;
  enabled?: boolean;
}

export function usePayrollProcessStatus({
  payload,
  enabled = true,
}: UsePayrollStatusParams) {
  const { companyId, moduleCode, payrol_type } = payload;
  return useQuery<GetPayrollProcessResponse, Error>({
    queryKey: ["payrollsStatus", companyId, moduleCode, payrol_type],
    queryFn: () => payrollServices.getPayrollsProcessStatus(payload),
    enabled: enabled && Boolean(companyId && moduleCode),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
