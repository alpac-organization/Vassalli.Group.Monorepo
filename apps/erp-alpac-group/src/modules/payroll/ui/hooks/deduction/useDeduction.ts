import { useMutation } from "@tanstack/react-query";
import { DeductionServices } from "@app/modules/payroll/infrastructure/services/deduction-services/DeductionServices";
import { httpHandler } from "@app/core/adapters/axiosAdapter";

import type { CreateDeductionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/create-deduction.request";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

const deductionServices = new DeductionServices(httpHandler);

export const useDeduction = () => {

   const CreateDeduction = useMutation<void, ApiErrorResponse, CreateDeductionRequest>({
      mutationFn: (payload: CreateDeductionRequest) => {
         return deductionServices.CreateDeduction(payload);
      },
   })

   return {
      CreateDeduction
   }
}