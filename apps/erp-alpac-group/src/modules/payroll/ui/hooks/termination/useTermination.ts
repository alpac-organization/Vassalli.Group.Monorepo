import { httpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { CancelTerminationRequest } from "@app/modules/payroll/domain/ApiContract/Requests/termination-requests/cancel-termination.request";
import type { CloseTerminationRequest } from "@app/modules/payroll/domain/ApiContract/Requests/termination-requests/close-termination.request";
import type { GetTerminationDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/termination-requests/get-termination-details.request";
import type { GetTerminationsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/termination-requests/get-terminations.request";
import type { RegisterTerminationRequest } from "@app/modules/payroll/domain/ApiContract/Requests/termination-requests/register-termination.request";
import type {
  GetTerminationsResponse,
  TerminationDetailDto,
} from "@app/modules/payroll/domain/ApiContract/Responses/termination-responses/get-terminations.response";
import { TerminationServices } from "@app/modules/payroll/infrastructure/services/termination-services/TerminationServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const terminationServices = new TerminationServices(httpHandler);

const TERMINATIONS_QUERY_KEY = "terminations";
const TERMINATION_DETAILS_QUERY_KEY = "termination-details";

const isListEnabled = (filters?: GetTerminationsRequest) =>
  Boolean(filters?.company_id?.trim() && filters.module_code?.trim() && filters.page_number);

const isDetailEnabled = (filters?: GetTerminationDetailsRequest) =>
  Boolean(
    filters?.company_id?.trim() && filters.module_code?.trim() && filters.termination_id,
  );

type UseTerminationProps = {
  terminationsFilters?: GetTerminationsRequest;
  terminationDetailFilters?: GetTerminationDetailsRequest;
};

export const useTermination = (props?: UseTerminationProps) => {
  const queryClient = useQueryClient();
  const filters = props?.terminationsFilters;
  const detailFilters = props?.terminationDetailFilters;

  const GetTerminations = useQuery<GetTerminationsResponse, ApiErrorResponse>({
    queryKey: [TERMINATIONS_QUERY_KEY, filters],
    queryFn: () => {
      if (!filters) {
        return Promise.reject(new Error("Filtros de bajas no definidos"));
      }
      return terminationServices.getTerminations(filters);
    },
    enabled: isListEnabled(filters),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const GetTerminationDetails = useQuery<TerminationDetailDto, ApiErrorResponse>({
    queryKey: [TERMINATION_DETAILS_QUERY_KEY, detailFilters],
    queryFn: () => {
      if (!detailFilters) {
        return Promise.reject(new Error("Detalle de baja no definido"));
      }
      return terminationServices.getTerminationDetails(detailFilters);
    },
    enabled: isDetailEnabled(detailFilters),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [TERMINATIONS_QUERY_KEY] });
    queryClient.invalidateQueries({ queryKey: [TERMINATION_DETAILS_QUERY_KEY] });
  };

  const RegisterTermination = useMutation<void, ApiErrorResponse, RegisterTerminationRequest>({
    mutationKey: ["register-termination"],
    mutationFn: (payload) => terminationServices.registerTermination(payload),
    onSuccess: invalidate,
  });

  const CloseTermination = useMutation<void, ApiErrorResponse, CloseTerminationRequest>({
    mutationKey: ["close-termination"],
    mutationFn: (payload) => terminationServices.closeTermination(payload),
    onSuccess: invalidate,
  });

  const CancelTermination = useMutation<void, ApiErrorResponse, CancelTerminationRequest>({
    mutationKey: ["cancel-termination"],
    mutationFn: (payload) => terminationServices.cancelTermination(payload),
    onSuccess: invalidate,
  });

  return {
    GetTerminations,
    GetTerminationDetails,
    RegisterTermination,
    CloseTermination,
    CancelTermination,
  };
};
