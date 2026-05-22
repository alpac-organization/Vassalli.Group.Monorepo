import { SubsidyServices } from "@app/modules/payroll/infrastructure/services/subsidy-services/SubsidyServices";
import { useMutation, useQuery } from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters/axiosAdapter";

import type { CreateSubsidyRequest } from "@app/modules/payroll/domain/ApiContract/Requests/subsidy-requests/create-subsidy.request";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetSubsidyTypesRequest } from "@app/modules/payroll/domain/ApiContract/Requests/subsidy-requests/get-subsidy-types.request";
import type { GetSubsidyTypesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/subsidy-responses/get-subsidy-types.response";

const subsidyServices = new SubsidyServices(httpHandler);

interface useSubsidyProps {
   subsidyTypesPayload?: GetSubsidyTypesRequest;
}

export const useSubsidy = (props?: useSubsidyProps) => {

   const CreateSubsidy = useMutation<void, ApiErrorResponse, CreateSubsidyRequest>({
      mutationFn: (payload: CreateSubsidyRequest) => {
         return subsidyServices.CreateSubsidy(payload);
      },
   })

   const GetSubsidyTypes = useQuery<GetSubsidyTypesResponse, ApiErrorResponse>({
      queryKey: ["subsidy-types", props?.subsidyTypesPayload],
      queryFn: () => {
         return subsidyServices.GetSubsidyTypes(props?.subsidyTypesPayload!);
      },
      enabled: Boolean(props?.subsidyTypesPayload),
      staleTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: 1,
   })

   return {
      CreateSubsidy,
      GetSubsidyTypes
   };
}