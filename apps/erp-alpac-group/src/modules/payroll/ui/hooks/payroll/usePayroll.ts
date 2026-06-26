import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
import { PayrollServices } from "@app/modules/payroll/infrastructure/services/payroll-services/PayrollServices";
import type { GetPayrollProcessResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-process";
import type { PayrollProcessRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
import type {
  PayrollClosedDetailsRequest,
  PayrollRequest,
} from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-request";
import type { GetPayrollResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import type { InitializePayrollParams } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-initialize.request";
import type { PayrollCloseRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-close.request";
import type { ClosePayrollResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/payroll-close.response";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

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
    area_id,
    job_position_id,
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
      area_id,
      job_position_id,
      page_number,
      page_size,
    ],
    queryFn: () => payrollServices.getPayroll(payload),
    enabled:
      enabled && Boolean(companie_id && module_code && type && branch_id),
    staleTime: 1000 * 60 * 2,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useInitializePayroll(): UseMutationResult<
  void | null,
  ApiErrorResponse,
  InitializePayrollParams
> {
  const queryClient = useQueryClient();

  return useMutation<void | null, ApiErrorResponse, InitializePayrollParams>({
    mutationFn: (payload) => payrollServices.initializePayroll(payload),
    onSuccess: (_, variables) => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            "payrollsStatus",
            variables.companie_id,
            variables.module_code,
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: [
            "detailsPayroll",
            variables.companie_id,
            variables.module_code,
          ],
        }),
      ]);
    },
  });
}

export function useClosePayroll(): UseMutationResult<
  ClosePayrollResponse,
  ApiErrorResponse,
  PayrollCloseRequest
> {
  const queryClient = useQueryClient();

  return useMutation<
    ClosePayrollResponse,
    ApiErrorResponse,
    PayrollCloseRequest
  >({
    mutationFn: (payload) => payrollServices.closePayroll(payload),
    onSuccess: (_, variables) => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            "payrollsStatus",
            variables.companie_id,
            variables.module_code,
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: [
            "detailsPayroll",
            variables.companie_id,
            variables.module_code,
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: [
            "payrollPeriodsHistory",
            variables.companie_id,
            variables.module_code,
            variables.branch_id,
            variables.payroll_type,
          ],
        }),
      ]);
    },
  });
}
export function usePayrollClosedDetails(
  payload: PayrollClosedDetailsRequest,
  enabled = true,
): UseQueryResult<GetPayrollResponse, Error> {
  const {
    companie_id,
    module_code,
    payroll_id,
    branch_id,
    identification_number,
    area_id,
    job_position_id,
    page_number = 1,
    page_size = 10,
  } = payload;
  return useQuery<GetPayrollResponse, Error>({
    queryKey: [
      "payrollClosedDetails",
      companie_id,
      module_code,
      payroll_id,
      branch_id,
      identification_number,
      area_id,
      job_position_id,
      page_number,
      page_size,
    ],
    queryFn: () => payrollServices.getPayrollClosedDetails(payload),
    enabled:
      enabled && Boolean(companie_id && module_code && payroll_id && branch_id),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
