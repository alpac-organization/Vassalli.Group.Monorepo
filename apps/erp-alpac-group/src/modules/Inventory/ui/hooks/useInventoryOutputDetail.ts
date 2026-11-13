import { skipToken, useQuery } from "@tanstack/react-query";

import { warehouseHttpHandler } from "@app/core/adapters";
import { InventoryOutputsServices } from "../../infrastructure/services/inventory-outputs-services";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { InventoryOutputDetailDto } from "@app/modules/Inventory/domain/api-contract/responses/inventory-outputs.response";
import type { useInventoryOutputDetailProps } from "../../application/interfaces/hooks/useInventoryOutputDetailProps";

const inventoryOutputsServices = new InventoryOutputsServices(warehouseHttpHandler);

export const useInventoryOutputDetail = function (props: useInventoryOutputDetailProps) {
  const { payloadGetInventoryOutputDetailRequest } = props;

  const GetInventoryOutputDetailQuery = useQuery<InventoryOutputDetailDto, ApiErrorResponse>({
    queryKey: ["inventory-output-detail", payloadGetInventoryOutputDetailRequest],
    queryFn: payloadGetInventoryOutputDetailRequest
      ? () => inventoryOutputsServices.GetInventoryOutputDetail(payloadGetInventoryOutputDetailRequest)
      : skipToken,

    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    GetInventoryOutputDetailQuery,
  };
};