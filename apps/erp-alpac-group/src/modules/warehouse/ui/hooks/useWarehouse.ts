import { warehouseHttpHandler } from "@app/core/adapters";
import { WarehouseServices } from "../../infrastructure/services/warehouse-services/WarehouseServices";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { CreateWarehouseRequest } from "../../domain/ApiContract/Requests/warehouse-requests/create-warehouse-request";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetWarehouseRequest } from "../../domain/ApiContract/Requests/warehouse-requests/get-warehouses-request";
import type { GetCustomBranchesRequest } from "../../domain/ApiContract/Requests/warehouse-requests/get-custom-branches";

const warehouseServices = new WarehouseServices(warehouseHttpHandler);

interface useWarehouseProps {
  getWarehousesPayload?: GetWarehouseRequest;
  getCustomBranchesPayload?: GetCustomBranchesRequest;
}

export const useWarehouse = (props?: useWarehouseProps) => {
  const { getWarehousesPayload, getCustomBranchesPayload } = props || {};

  const getWarehouseEnabled = Boolean(
    getWarehousesPayload?.company_id?.trim() &&
    getWarehousesPayload.module_code?.trim(),
  );

  const GetWarehouses = useQuery({
    queryKey: ["get-warehouses-records", getWarehousesPayload],
    queryFn: () => warehouseServices.GetWarehouses(getWarehousesPayload!),
    enabled: getWarehouseEnabled,
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const CreateWarehouse = useMutation<
    void,
    ApiErrorResponse,
    CreateWarehouseRequest
  >({
    mutationKey: ["createWarehouse"],
    mutationFn: (payload: CreateWarehouseRequest) =>
      warehouseServices.CreateWarehouse(payload),
    retry: 1,
  });

 const GetCustomBranches = useQuery({
    queryKey: ["get-custom-branches", getCustomBranchesPayload],
    queryFn: () => warehouseServices.getCustomBranches(getCustomBranchesPayload!),
    enabled: Boolean(getCustomBranchesPayload?.company_id && getCustomBranchesPayload?.module_code),
    refetchOnWindowFocus: false,
  });
  return { GetWarehouses, CreateWarehouse, GetCustomBranches };
};
