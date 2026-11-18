import { useMutation, useQueryClient } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { RegisterSupplyRequestManual } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/supply-requests/register-supply-request-manual.request";
import { SupplyRequestsServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/warehouse-managua/SupplyRequestsServices";

const supplyRequestsServices = new SupplyRequestsServices(warehouseHttpHandler);

export const useRegisterSupplyRequestManual = () => {
  const queryClient = useQueryClient();

  const RegisterSupplyRequestManual = useMutation<
    string,
    ApiErrorResponse,
    RegisterSupplyRequestManual
  >({
    mutationFn: (payload) => supplyRequestsServices.RegisterSupplyRequestManual(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supply-requests"] });
    },
  });

  return {
    RegisterSupplyRequestManual,
  };
};