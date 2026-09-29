import { warehouseHttpHandler } from "@app/core/adapters";
import { WarehouseServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/WarehouseServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetCustomBranchesRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-custom-branches";
import type { GetWarehouseDetailsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouse-details-req";
import type { GetWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouses-request";
import type { CreateWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-warehouse";
import type { GetWarehousesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses";
import type { GetCustomBranchesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/custom-branches-response";
import type { GetWarehouseDetailsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouse-details-res";

const warehouseServices = new WarehouseServices(warehouseHttpHandler);

interface useWarehouseProps {
	getWarehousesPayload?: GetWarehouseRequest;
	getCustomBranchesPayload?: GetCustomBranchesRequest;
	getWarehouseDetailsPayload?: GetWarehouseDetailsRequest;
}

const hasCompanyContext = (payload?: { company_id?: string; module_code?: string }) =>
	Boolean(payload?.company_id?.trim() && payload?.module_code?.trim());

export const useWarehouse = (props?: useWarehouseProps) => {
	const { getWarehousesPayload, getCustomBranchesPayload, getWarehouseDetailsPayload } = props || {};

	const queryClient = useQueryClient();

	const getWarehouseEnabled = Boolean(
		getWarehousesPayload?.company_id?.trim() &&
		getWarehousesPayload.module_code?.trim(),
	);

	const GetWarehouses = useQuery<GetWarehousesResponse, ApiErrorResponse>({
		queryKey: ["get-warehouses-records", getWarehousesPayload],
		queryFn: () => warehouseServices.GetWarehouses(getWarehousesPayload!),
		enabled: getWarehouseEnabled,
		refetchOnWindowFocus: false,
		retry: 1,
	});

	const CreateWarehouse = useMutation<void, ApiErrorResponse, CreateWarehouseRequest>({
		mutationKey: ["createWarehouse"],
		mutationFn: (payload: CreateWarehouseRequest) => warehouseServices.CreateWarehouse(payload),
		onSuccess: async (_data) => {
			await queryClient.refetchQueries({ queryKey: ["get-warehouses-records"] });
		},
		retry: 1,
	});

	const GetCustomBranches = useQuery<GetCustomBranchesResponse, ApiErrorResponse>({
		queryKey: ["get-custom-branches", getCustomBranchesPayload],
		queryFn: () => warehouseServices.GetCustomBranches(getCustomBranchesPayload!),
		enabled: Boolean(
			getCustomBranchesPayload?.company_id &&
			getCustomBranchesPayload?.module_code,
		),
		refetchOnWindowFocus: false,
	});

	const GetWarehouseDetails = useQuery<GetWarehouseDetailsResponse, ApiErrorResponse>({
		queryKey: ["get-warehouse-details-record", getWarehouseDetailsPayload],
		queryFn: () => warehouseServices.GetWarehouseDetails(getWarehouseDetailsPayload!),
		enabled:
			hasCompanyContext(getWarehouseDetailsPayload) &&
			Boolean(getWarehouseDetailsPayload?.warehouse_id),
		refetchOnWindowFocus: false,
		retry: 1,
	});

	return {
		GetWarehouses,
		CreateWarehouse,
		GetCustomBranches,
		GetWarehouseDetails,
	};
};
