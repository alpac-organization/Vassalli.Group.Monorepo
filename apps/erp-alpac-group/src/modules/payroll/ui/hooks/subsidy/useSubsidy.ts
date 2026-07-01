import { SubsidyServices } from "@app/modules/payroll/infrastructure/services/subsidy-services/SubsidyServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters/axiosAdapter";

import type { CreateSubsidyRequest } from "@app/modules/payroll/domain/ApiContract/Requests/subsidy-requests/create-subsidy.request";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetSubsidyTypesRequest } from "@app/modules/payroll/domain/ApiContract/Requests/subsidy-requests/get-subsidy-types.request";
import type { GetSubsidyTypesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/subsidy-responses/get-subsidy-types.response";
import type { GetSubsidyHistoryResponse } from "@app/modules/payroll/domain/ApiContract/Responses/subsidy-responses/get-subsidy-history.response";
import type { GetSubsidyHistoryRequest } from "@app/modules/payroll/domain/ApiContract/Requests/subsidy-requests/get-subsidy-history.request";

const subsidyServices = new SubsidyServices(httpHandler);

interface useSubsidyProps {
  subsidyTypesPayload?: GetSubsidyTypesRequest;
  subsidyHistoryPayload?: GetSubsidyHistoryRequest;
}

export const useSubsidy = (props?: useSubsidyProps) => {
  const queryClient = useQueryClient();
  const CreateSubsidy = useMutation<
    void,
    ApiErrorResponse,
    CreateSubsidyRequest
  >({
    mutationFn: (payload: CreateSubsidyRequest) => {
      return subsidyServices.CreateSubsidy(payload);
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

  const GetSubsidyTypes = useQuery<GetSubsidyTypesResponse, ApiErrorResponse>({
    queryKey: ["subsidy-types", props?.subsidyTypesPayload],
    queryFn: () => {
      return subsidyServices.GetSubsidyTypes(props?.subsidyTypesPayload!);
    },
    enabled: Boolean(props?.subsidyTypesPayload),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const GetSubsidyHistory = useQuery<GetSubsidyHistoryResponse[], ApiErrorResponse>({
    queryKey: ["subsidy-history", props?.subsidyHistoryPayload],
    queryFn: () => {
      return subsidyServices.GetSubsidyHistory(props?.subsidyHistoryPayload!)
    },
    enabled: Boolean(props?.subsidyHistoryPayload),
    refetchOnWindowFocus: false,
    retry: 1
  });


  return {
    CreateSubsidy,
    GetSubsidyTypes,
    GetSubsidyHistory,
  };
};
