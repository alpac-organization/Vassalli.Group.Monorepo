import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
import { PayrollServices } from "@app/modules/payroll/infrastructure/services/payroll-services/PayrollServices";
import type { GetPayrollProcessResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-process";
import type { PayrollProcessRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
import type { PayrollRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-request";
import type { GetPayrollResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import type { InitializePayrollParams } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-initialize.request";

const payrollServices = new PayrollServices(httpHandler);

type UsePayrollStatusProps = {
  payload: PayrollProcessRequest;
  enabled?: boolean;
};

type UsePayrollDetailsProps = {
  payload: PayrollRequest;
  enabled?: boolean;
};

export function usePayrollStatus({
  payload,
  enabled = true,
}: UsePayrollStatusProps): UseQueryResult<GetPayrollProcessResponse, Error> {
  const { companie_id, module_code, payrol_type, branch_id } = payload;

  return useQuery<GetPayrollProcessResponse, Error>({
    queryKey: [
      "payrollsStatus",
      companie_id,
      module_code,
      payrol_type,
      branch_id,
    ],
    queryFn: () => payrollServices.getPayrollsProcessStatus(payload),
    enabled: enabled && Boolean(companie_id && module_code && branch_id),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function usePayrollDetails({
  payload,
  enabled = true,
}: UsePayrollDetailsProps): UseQueryResult<GetPayrollResponse, Error> {
  const {
    companie_id,
    module_code,
    type,
    branch_id,
    identification_number,
    page_number = 1,
    page_size = 10,
  } = payload;

  return useQuery<GetPayrollResponse, Error>({
    queryKey: [
      "detailsPayroll",
      companie_id,
      module_code,
      type,
      branch_id,
      identification_number,
      page_number,
      page_size,
    ],
    queryFn: () => payrollServices.getPayroll(payload),
    enabled:
      enabled && Boolean(companie_id && module_code && type && branch_id),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useInitializePayroll(): UseMutationResult<
  void | null,
  Error,
  InitializePayrollParams
> {
  const queryClient = useQueryClient();

  return useMutation<void | null, Error, InitializePayrollParams>({
    mutationFn: (payload) => payrollServices.initializePayroll(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "payrollsStatus",
          variables.companie_id,
          variables.module_code,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "detailsPayroll",
          variables.companie_id,
          variables.module_code,
        ],
      });
    },
  });
}
