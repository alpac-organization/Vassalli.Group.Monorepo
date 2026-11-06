import { useMutation, useQueryClient } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import { SupplyRequestsServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/warehouse-managua/SupplyRequestsServices";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { ApproveSupplyRequestRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/supply-requests/approve-supply-request.request";

const supplyRequestsServices = new SupplyRequestsServices(warehouseHttpHandler);

export const useApproveFuelRequest = () => {
  const queryClient = useQueryClient();

  const ApproveFuelRequest = useMutation<void, ApiErrorResponse, ApproveSupplyRequestRequest>({
    mutationFn: (payload) => supplyRequestsServices.ApproveSupplyRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-requests"] });
      queryClient.invalidateQueries({ queryKey: ["fuel-request-detail"] });
    },
  });

  return { ApproveFuelRequest };
};
