import { useMutation, useQuery, useQueryClient, skipToken } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import { InventoryEntriesServices } from "../../infrastructure/services/inventory-entries-services";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { useInventoryEntriesProps } from "../../application/interfaces/hooks/useInventoryEntriesProps";
import type { RegisterInventoryEntryRequest } from "../../domain/api-contract/requests/inventory-entries.request";
import type {
  PagedInventoryEntriesResponse,
  InventoryEntry,
  InventoryEntryDetail,
} from "../../domain/api-contract/responses/inventory-entries.response";

const inventoryEntriesServices = new InventoryEntriesServices(warehouseHttpHandler);

export const useInventoryEntries = function (props: useInventoryEntriesProps) {
  const {
    payloadGetInventoryEntriesRequest,
    payloadGetInventoryEntryDetailRequest,
  } = props;
  const queryClient = useQueryClient();

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

  const RegisterInventoryEntry = useMutation<
    InventoryEntry,
    ApiErrorResponse,
    RegisterInventoryEntryRequest
  >({
    mutationKey: ["register-inventory-entry"],
    mutationFn: (payload) =>
      inventoryEntriesServices.RegisterInventoryEntry(payload),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["inventory-entries"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-entry-detail"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-stocks-items"] });
      queryClient.invalidateQueries({ queryKey: ["kardex-movements"] });
    },
    retry: 0,
  });

  return {
    GetInventoryEntriesQuery,
    GetInventoryEntryDetailQuery,
    RegisterInventoryEntry,
  };
};
