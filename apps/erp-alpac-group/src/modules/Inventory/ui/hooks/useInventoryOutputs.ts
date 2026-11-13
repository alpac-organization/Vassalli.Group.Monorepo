import { useQuery, skipToken } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import { InventoryOutputsServices } from "../../infrastructure/services/inventory-outputs-services";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { useInventoryOutputsProps } from "../../application/interfaces/hooks/useInventoryOutputsProps";
import type { PagedInventoryOutputsResponse } from "../../domain/api-contract/responses/inventory-outputs.response";

const inventoryOutputsServices = new InventoryOutputsServices(warehouseHttpHandler);

export const useInventoryOutputs = function (props: useInventoryOutputsProps) {
  const { payloadGetInventoryOutputsRequest } = props;

  const GetInventoryOutputsQuery = useQuery<PagedInventoryOutputsResponse, ApiErrorResponse>({
    queryKey: ["inventory-outputs", payloadGetInventoryOutputsRequest],
    queryFn: payloadGetInventoryOutputsRequest
      ? () => inventoryOutputsServices.GetInventoryOutputs(payloadGetInventoryOutputsRequest)
      : skipToken,

    staleTime: 0,
    retryDelay: 3000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    GetInventoryOutputsQuery,
  };
};