import { useMutation, useQueryClient } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters/axiosAdapter";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { RegisterSupplyRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/supply-requests/register-supply-request.request";
import { SupplyRequestServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/warehouse-managua/SupplyRequestServices";

const supplyRequestServices = new SupplyRequestServices(warehouseHttpHandler);

export const useSupplyRequest = () => {
  const queryClient = useQueryClient();

  const RegisterSupplyRequest = useMutation<
    void,
    ApiErrorResponse,
    RegisterSupplyRequest
  >({
    mutationFn: (payload) => supplyRequestServices.registerSupplyRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });

  return {
    RegisterSupplyRequest,
  };
};
