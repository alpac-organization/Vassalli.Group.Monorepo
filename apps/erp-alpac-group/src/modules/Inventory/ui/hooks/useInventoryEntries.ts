import { useQuery, skipToken } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import { InventoryEntriesServices } from "../../infrastructure/services/inventory-entries-services";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { useInventoryEntriesProps } from "../../application/interfaces/hooks/useInventoryEntriesProps";
import type { InventoryEntryData } from "../../domain/api-contract/responses/inventory-entries.response";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

const inventoryEntriesServices = new InventoryEntriesServices(warehouseHttpHandler);

export const useInventoryEntries = function(props: useInventoryEntriesProps) {
   const {
      payloadGetInventoryEntriesRequest,
   } = props;

   const GetInventoryEntriesQuery = useQuery<PaginateBaseResponse<InventoryEntryData[]>, ApiErrorResponse>({
      queryKey: ["inventory-entries-items", payloadGetInventoryEntriesRequest],
      queryFn: payloadGetInventoryEntriesRequest
         ? () => inventoryEntriesServices.GetInventoryEntries(payloadGetInventoryEntriesRequest)
         : skipToken,

      staleTime: 0,
      retryDelay: 3000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
   });

   return {
      GetInventoryEntriesQuery,
   };
};