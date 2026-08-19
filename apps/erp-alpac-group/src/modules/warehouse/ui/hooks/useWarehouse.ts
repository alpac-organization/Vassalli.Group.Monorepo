import { warehouseHttpHandler } from "@app/core/adapters";
import { WarehouseServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/WarehouseServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetCustomBranchesRequest } from "../../domain/ApiContract/Requests/warehouse-requests/get-custom-branches";

import type { GetWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouses-request";
import type { CreateWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-warehouse";
const warehouseServices = new WarehouseServices(warehouseHttpHandler);

interface useWarehouseProps {
  getWarehousesPayload?: GetWarehouseRequest;
  getCustomBranchesPayload?: GetCustomBranchesRequest;
}

export const useWarehouse = (props?: useWarehouseProps) => {
  const { getWarehousesPayload, getCustomBranchesPayload } = props || {};
  const queryClient = useQueryClient();

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-warehouses-records"] });
    },
    retry: 1,
  });

  const GetCustomBranches = useQuery({
    queryKey: ["get-custom-branches", getCustomBranchesPayload],
    queryFn: () =>
      warehouseServices.getCustomBranches(getCustomBranchesPayload!),
    enabled: Boolean(
      getCustomBranchesPayload?.company_id &&
      getCustomBranchesPayload?.module_code,
    ),
    refetchOnWindowFocus: false,
  });
  return { GetWarehouses, CreateWarehouse, GetCustomBranches };
};
