import { useMutation, useQuery, useQueryClient, skipToken  } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import { InventoryStocksServices } from "../../infrastructure/services/inventory-stocks-services";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { useInventoryStocksProps } from "../../application/interfaces/hooks/useInventoryStocksProps";
import type { InventoryStockData, PagedResponseStock } from "../../domain/api-contract/responses/inventory-stocks.response";
import type { PatchInventoryStockRequest } from "../../domain/api-contract/requests/patch-inventory-stock.request";

const inventoryStocksServices = new InventoryStocksServices(warehouseHttpHandler);

export const useInventoryStocks = function(props: useInventoryStocksProps) {
 
   const queryClient = useQueryClient();

   const { 
      payloadGetInventoryStocksRequest
   } = props;

   //#region Obtener listado de productos en stocks
   
   const GetInventoryStocksQuery = useQuery<PagedResponseStock<InventoryStockData>, ApiErrorResponse>({
      queryKey: ["inventory-stocks-items", payloadGetInventoryStocksRequest],
      queryFn: payloadGetInventoryStocksRequest
         ? () => inventoryStocksServices.GetInventoryStocks(payloadGetInventoryStocksRequest)
         : skipToken,
      
      staleTime: 0,
      retryDelay: 3000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
   });
   
   //#endregion 

   //#region obtener movimiento de kardex


   //#endregion
   //#region Actualizar niveles de stock para lanzar notificaciones de alerta

   const PatchInventoryStock = useMutation<void, ApiErrorResponse, PatchInventoryStockRequest>({
      mutationKey: ["patch-inventory-stock"],
      mutationFn: (payload: PatchInventoryStockRequest) =>
         inventoryStocksServices.PatchInventoryStock(payload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["inventory-stocks-items"] });
      },
      retry: 1,
   });

   //#endregion

   return {
      GetInventoryStocksQuery,
      PatchInventoryStock
   }
}