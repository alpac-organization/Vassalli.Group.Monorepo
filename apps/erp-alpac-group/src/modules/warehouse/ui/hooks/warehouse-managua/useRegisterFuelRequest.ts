import { useMutation, useQueryClient } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { RegisterFuelRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/fuel-requests/register-fuel-request.request";
import { FuelRequestsServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/warehouse-managua/FuelRequestsServices";

const fuelRequestsServices = new FuelRequestsServices(warehouseHttpHandler);

export const useRegisterFuelRequest = () => {
  const queryClient = useQueryClient();

  const RegisterFuelRequest = useMutation<string, ApiErrorResponse, RegisterFuelRequest>({
    mutationFn: (payload) => fuelRequestsServices.RegisterFuelRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-requests"] });
    },
  });

  return {
    RegisterFuelRequest,
  };
};