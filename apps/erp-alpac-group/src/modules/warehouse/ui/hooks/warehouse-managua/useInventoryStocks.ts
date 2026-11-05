import { useQuery } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters/axiosAdapter";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetInventoryStocksRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/inventory-stocks/get-inventory-stocks.request";
import type { GetInventoryStocksResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/inventory-stocks/get-inventory-stocks-response";
import { InventoryStocksServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/warehouse-managua/InventoryStocksServices";

const inventoryStocksServices = new InventoryStocksServices(warehouseHttpHandler);

export const useInventoryStocks = (
  payload: GetInventoryStocksRequest | null,
) => {
  const GetInventoryStocks = useQuery<
    GetInventoryStocksResponse,
    ApiErrorResponse
  >({
    queryKey: ["inventory-stocks", payload],
    queryFn: () =>
      inventoryStocksServices.getInventoryStocks(
        payload as GetInventoryStocksRequest,
      ),
    enabled: Boolean(payload?.company_id && payload?.module_code),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    GetInventoryStocks,
  };
};
