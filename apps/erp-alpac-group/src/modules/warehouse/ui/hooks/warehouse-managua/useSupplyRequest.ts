import { useMutation, useQueryClient } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { RegisterSupplyRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/supply-requests/register-supply-request.request";
import { SupplyRequestsServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/warehouse-managua/SupplyRequestsServices";

const supplyRequestsServices = new SupplyRequestsServices(warehouseHttpHandler);

export const useSupplyRequest = () => {
  const queryClient = useQueryClient();

  const RegisterSupplyRequest = useMutation<
    void,
    ApiErrorResponse,
    RegisterSupplyRequest
  >({
    mutationFn: (payload) => supplyRequestsServices.RegisterSupplyRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });

  return {
    RegisterSupplyRequest,
  };
};