import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DeductionServices } from "@app/modules/payroll/infrastructure/services/deduction-services/DeductionServices";
import { DeductionsServicesByPayroll } from "@app/modules/payroll/infrastructure/services/deduction-services/DeductionsServicesByPayroll";
import { httpHandler } from "@app/core/adapters/axiosAdapter";

import type { CreateDeductionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/create-deduction.request";
import type { GetDeductionsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/get-deductions.request";
import type { GetDeductionDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/get-deduction-details.request";
import type { GetDeductionPaymentsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/get-deduction-payments.request";
import type { GetDeductionsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deductions.response";
import type { DeductionDetailsDto } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deduction-details.response";
import type { GetDeductionPaymentsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deduction-payments.response";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

const deductionServices = new DeductionServices(httpHandler);
const deductionsServicesByPayroll = new DeductionsServicesByPayroll(httpHandler);

export const useDeduction = () => {
  const queryClient = useQueryClient();

  const CreateDeduction = useMutation<
    void,
    ApiErrorResponse,
    CreateDeductionRequest
  >({
    mutationFn: (payload: CreateDeductionRequest) => {
      return deductionServices.CreateDeduction(payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "detailsPayroll",
          variables.company_id,
          variables.module_code,
        ],
      });
    },
  });

  const useGetDeductions = (
    payload: GetDeductionsRequest,
    options?: { enabled?: boolean },
  ) => {
    return useQuery<GetDeductionsResponse, ApiErrorResponse>({
      queryKey: [
        "deductions",
        payload.companie_id,
        payload.module_code,
        payload.identification_number,
        payload.status,
        payload.type,
      ],
      queryFn: () => deductionsServicesByPayroll.GetDeductionsByAsync(payload),
      enabled: options?.enabled,
    });
  };

  const useGetDeductionDetails = (
    payload: GetDeductionDetailsRequest,
    options?: { enabled?: boolean },
  ) => {
    return useQuery<DeductionDetailsDto, ApiErrorResponse>({
      queryKey: [
        "deductionDetails",
        payload.companie_id,
        payload.module_code,
        payload.deduction_id,
        payload.identification_number,
      ],
      queryFn: () =>
        deductionsServicesByPayroll.GetDeductionDetailsAsync(payload),
      enabled: options?.enabled,
    });
  };

  const useGetDeductionPayments = (
    payload: GetDeductionPaymentsRequest,
    options?: { enabled?: boolean },
  ) => {
    return useQuery<GetDeductionPaymentsResponse, ApiErrorResponse>({
      queryKey: [
        "deductionPayments",
        payload.companie_id,
        payload.module_code,
        payload.deduction_id,
        payload.page_number,
        payload.page_size,
      ],
      queryFn: () =>
        deductionsServicesByPayroll.GetDeductionPaymentsAsync(payload),
      enabled: options?.enabled,
    });
  };

  return {
    CreateDeduction,
    useGetDeductions,
    useGetDeductionDetails,
    useGetDeductionPayments,
  };
};
