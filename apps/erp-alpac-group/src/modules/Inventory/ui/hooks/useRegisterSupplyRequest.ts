import { useMutation, useQueryClient } from "@tanstack/react-query";

import { warehouseHttpHandler } from "@app/core/adapters";
import { SupplyRequestsServices } from "../../infrastructure/services/supply-requests-services";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { RegisterSupplyRequest } from "../../domain/api-contract/requests/supply-requests/register-supply-request.request";

const supplyRequestsServices = new SupplyRequestsServices(warehouseHttpHandler);

export const useRegisterSupplyRequest = () => {
  const queryClient = useQueryClient();

  const RegisterSupplyRequest = useMutation<void, ApiErrorResponse, RegisterSupplyRequest>({
    mutationFn: (payload) => supplyRequestsServices.RegisterSupplyRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supply-requests"] });
    },
  });

  return {
    RegisterSupplyRequest,
  };
};
