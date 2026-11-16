import { useMutation, useQueryClient } from "@tanstack/react-query";

import { warehouseHttpHandler } from "@app/core/adapters";
import { SupplyRequestsServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/warehouse-managua/SupplyRequestsServices";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { ApproveSupplyRequestRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/supply-requests/approve-supply-request.request";
import type { DeclineSupplyRequestRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/supply-requests/decline-supply-request.request";

const supplyRequestsServices = new SupplyRequestsServices(warehouseHttpHandler);

export interface SupplyRequestDecisionKeys {
  listKey: string;
  detailKey: string;
}

export const useSupplyRequestDecision = (keys: SupplyRequestDecisionKeys) => {
  const queryClient = useQueryClient();

  const ApproveSupplyRequest = useMutation<void, ApiErrorResponse, ApproveSupplyRequestRequest>({
    mutationFn: (payload) => supplyRequestsServices.ApproveSupplyRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.listKey] });
      queryClient.invalidateQueries({ queryKey: [keys.detailKey] });
    },
  });

  const DeclineSupplyRequest = useMutation<void, ApiErrorResponse, DeclineSupplyRequestRequest>({
    mutationFn: (payload) => supplyRequestsServices.DeclineSupplyRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [keys.listKey] });
      queryClient.invalidateQueries({ queryKey: [keys.detailKey] });
    },
  });

  return { ApproveSupplyRequest, DeclineSupplyRequest };
};