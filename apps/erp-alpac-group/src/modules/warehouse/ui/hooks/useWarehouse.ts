import { warehouseHttpHandler } from "@app/core/adapters";
import { WarehouseServices } from "../../infrastructure/services/warehouse-services/WarehouseServices";
import { useMutation } from "@tanstack/react-query";
import type { CreateWarehouseRequest } from "../../domain/ApiContract/Requests/warehouse-requests/create-warehouse-request";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

const warehouseServices = new WarehouseServices(warehouseHttpHandler);

export const useWarehouse = () => {

   const CreateWarehouse = useMutation<void, ApiErrorResponse, CreateWarehouseRequest>({
      mutationKey: ["createWarehouse"],
      mutationFn: (payload: CreateWarehouseRequest) => warehouseServices.CreateWarehouse(payload),
      retry: 1
   });

   return { CreateWarehouse }
} 