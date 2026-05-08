import type { CreateSubsidyRequest } from "@app/modules/payroll/domain/ApiContract/Requests/subsidy-requests/create-subsidy.request";
import { SubsidyServices } from "@app/modules/payroll/infrastructure/services/subsidy-services/SubsidyServices";
import { useMutation } from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

const subsidyServices = new SubsidyServices(httpHandler);

export const useSubsidy = () => {

   const CreateSubsidy = useMutation<void, ApiErrorResponse, CreateSubsidyRequest>({
      mutationFn: (payload: CreateSubsidyRequest) => {
         return subsidyServices.CreateSubsidy(payload);
      },
   })

   return {
      CreateSubsidy
   };
}