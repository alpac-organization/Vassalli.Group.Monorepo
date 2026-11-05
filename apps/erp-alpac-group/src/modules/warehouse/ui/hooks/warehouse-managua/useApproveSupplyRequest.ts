import { useMutation, useQueryClient } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import { SupplyRequestsServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/warehouse-managua/SupplyRequestsServices";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { ApproveSupplyRequestRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/supply-requests/approve-supply-request.request";

const supplyRequestsServices = new SupplyRequestsServices(warehouseHttpHandler);

export const useApproveSupplyRequest = () => {
  const queryClient = useQueryClient();

  const ApproveSupplyRequest = useMutation<void, ApiErrorResponse, ApproveSupplyRequestRequest>({
    mutationFn: (payload) => supplyRequestsServices.ApproveSupplyRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supply-requests"] });
      queryClient.invalidateQueries({ queryKey: ["supply-request-detail"] });
    },
  });

  return { ApproveSupplyRequest };
};
