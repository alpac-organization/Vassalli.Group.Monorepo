import { useQuery } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import { InventoryStocksServices } from "../../infrastructure/services/inventory-stocks-services";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { useInventoryStocksProps } from "../../application/interfaces/hooks/useInventoryStocksProps";
import type { InventoryStockData, PagedResponseStock } from "../../domain/api-contract/responses/inventory-stocks.response";

const inventoryStocksServices = new InventoryStocksServices(warehouseHttpHandler);

export const useInventoryStocks = function(props: useInventoryStocksProps) {

    const { 
        payloadGetInventoryStocksRequest
    } = props;

    //#region Obtener listado de productos en stocks

    const GetInventoryStocksQuery = useQuery<PagedResponseStock<InventoryStockData>, ApiErrorResponse>({
        queryKey: ["inventory-stocks-items", payloadGetInventoryStocksRequest],
        queryFn: () => inventoryStocksServices.GetInventoryStocks(payloadGetInventoryStocksRequest),
        enabled: Boolean(payloadGetInventoryStocksRequest),

        retry: 1,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    //#endregion 

    return {
        GetInventoryStocksQuery
    }
}