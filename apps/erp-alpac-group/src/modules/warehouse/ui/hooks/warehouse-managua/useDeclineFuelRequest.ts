import { useMutation, useQueryClient } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import { SupplyRequestsServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/warehouse-managua/SupplyRequestsServices";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { DeclineSupplyRequestRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/supply-requests/decline-supply-request.request";

const supplyRequestsServices = new SupplyRequestsServices(warehouseHttpHandler);

export const useDeclineFuelRequest = () => {
  const queryClient = useQueryClient();

  const DeclineFuelRequest = useMutation<void, ApiErrorResponse, DeclineSupplyRequestRequest>({
    mutationFn: (payload) => supplyRequestsServices.DeclineSupplyRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-requests"] });
      queryClient.invalidateQueries({ queryKey: ["fuel-request-detail"] });
    },
  });

  return { DeclineFuelRequest };
};
