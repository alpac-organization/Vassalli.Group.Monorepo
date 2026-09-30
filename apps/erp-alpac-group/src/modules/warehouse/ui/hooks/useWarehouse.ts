import { warehouseHttpHandler } from "@app/core/adapters";
import { WarehouseServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/WarehouseServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetCustomBranchesRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-custom-branches-request";
import type { GetWarehouseDetailsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouse-details-request";
import type { GetWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouses-request";
import type { CreateWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-warehouse-request";
import type { GetWarehousesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses-response";
import type { GetCustomBranchesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/custom-branches-response";
import type { GetWarehouseDetailsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouse-details-response";
import type { GetWarehouseCapacitiesRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouse-capacities-request";
import type { GetWarehouseCapacitiesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouse-capacities-response";
import type { UpdateWarehouseDetailsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/update-warehouse-details-request";

const warehouseServices = new WarehouseServices(warehouseHttpHandler);

interface useWarehouseProps {
	getWarehousesPayload?: GetWarehouseRequest;
	getCustomBranchesPayload?: GetCustomBranchesRequest;
	getWarehouseDetailsPayload?: GetWarehouseDetailsRequest;
	getWarehouseCapacitiesPayload?: GetWarehouseCapacitiesRequest;
}

const hasCompanyContext = (payload?: { company_id?: string; module_code?: string }) =>
	Boolean(payload?.company_id?.trim() && payload?.module_code?.trim());

export const useWarehouse = (props?: useWarehouseProps) => {
	const {
		getWarehousesPayload,
		getCustomBranchesPayload,
		getWarehouseDetailsPayload,
		getWarehouseCapacitiesPayload,
	} = props || {};

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

	const GetWarehouseCapacities = useQuery<GetWarehouseCapacitiesResponse, ApiErrorResponse>({
		queryKey: ["get-warehouse-capacities-record", getWarehouseCapacitiesPayload],
		queryFn: () => warehouseServices.GetWarehouseCapacities(getWarehouseCapacitiesPayload!),
		enabled:
			hasCompanyContext(getWarehouseCapacitiesPayload) &&
			Boolean(getWarehouseCapacitiesPayload?.warehouse_id),
		refetchOnWindowFocus: false,
		retry: 1,
	});

	const UpdateWarehouseDetails = useMutation<void, ApiErrorResponse, UpdateWarehouseDetailsRequest>({
		mutationKey: ["updateWarehouseDetails"],
		mutationFn: (payload: UpdateWarehouseDetailsRequest) =>
			warehouseServices.UpdateWarehouseDetails(payload),
		onSuccess: async () => {
			await Promise.all([
				queryClient.refetchQueries({ queryKey: ["get-warehouses-records"] }),
				queryClient.refetchQueries({ queryKey: ["get-warehouse-details-record"] }),
				queryClient.refetchQueries({ queryKey: ["get-warehouse-capacities-record"] }),
			]);
		},
		retry: 1,
	});

	return {
		GetWarehouses,
		CreateWarehouse,
		GetCustomBranches,
		GetWarehouseDetails,
		GetWarehouseCapacities,
		UpdateWarehouseDetails,
	};
};
