import { useQuery, skipToken } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import { InventoryEntriesServices } from "../../infrastructure/services/inventory-entries-services";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { useInventoryEntriesProps } from "../../application/interfaces/hooks/useInventoryEntriesProps";
import type {
  PagedInventoryEntriesResponse,
  InventoryEntryDetail,
} from "../../domain/api-contract/responses/inventory-entries.response";

const inventoryEntriesServices = new InventoryEntriesServices(warehouseHttpHandler);

export const useInventoryEntries = function (props: useInventoryEntriesProps) {
  const {
    payloadGetInventoryEntriesRequest,
    payloadGetInventoryEntryDetailRequest,
  } = props;

  const GetInventoryEntriesQuery = useQuery<PagedInventoryEntriesResponse, ApiErrorResponse>({
    queryKey: ["inventory-entries", payloadGetInventoryEntriesRequest],
    queryFn: payloadGetInventoryEntriesRequest
      ? () => inventoryEntriesServices.GetInventoryEntries(payloadGetInventoryEntriesRequest)
      : skipToken,

    staleTime: 0,
    retryDelay: 3000,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });

  const GetInventoryEntryDetailQuery = useQuery<InventoryEntryDetail, ApiErrorResponse>({
    queryKey: ["inventory-entry-detail", payloadGetInventoryEntryDetailRequest],
    queryFn: payloadGetInventoryEntryDetailRequest
      ? () => inventoryEntriesServices.GetInventoryEntryDetail(payloadGetInventoryEntryDetailRequest)
      : skipToken,

    staleTime: 0,
    retryDelay: 3000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    GetInventoryEntriesQuery,
    GetInventoryEntryDetailQuery,
  };
};
