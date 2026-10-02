import { LotService } from "@app/modules/admin-warehouse/warehouse-managua/infrastructure/services/LotService";
import { warehouseHttpHandler } from "@app/core/adapters";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery, useMutation } from "@tanstack/react-query";

import type { GetLotsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lots-req";
import type { GetLotCapacitiesRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lot-capacities-req";
import type { GetLotCoordinatesRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lot-coordinates-req";
import type { GetLotsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { LotCapacitiesResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-capacities-res";
import type { LotCoordinatesResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-coordinates-res";
import type { RegisterLotRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-lots-req";
import type { RegisterLotCoordinatesRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/register-lot-coordinates-req";
import type { UpdateLotCoordinatesRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/update-lot-coordinates-req";
import type { GetLotLayoutRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lot-layout-req";
import type { LotLayoutResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-layout-res";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

const lotServices = new LotService(warehouseHttpHandler);

interface useWarehouseLayoutProps {
	getLotsPayload?: GetLotsRequest;
	getLotCapacitiesPayload?: GetLotCapacitiesRequest;
	getLotCoordinatesPayload?: GetLotCoordinatesRequest;
	getLotLayoutPayload?: GetLotLayoutRequest;
}

const hasCompanyContext = (payload?: {
	company_id?: string;
	module_code?: string;
}) => Boolean(payload?.company_id?.trim() && payload?.module_code?.trim());

export const useLot = (props?: useWarehouseLayoutProps) => {

	const queryClient = useQueryClient();

	const {
		getLotsPayload,
		getLotCapacitiesPayload,
		getLotCoordinatesPayload,
		getLotLayoutPayload
	} = props || {};

	const GetLots = useQuery<GetLotsResponse, ApiErrorResponse>({
		queryKey: ["get-lots-records", getLotsPayload],
		queryFn: () => lotServices.GetLots(getLotsPayload!),
		enabled: hasCompanyContext(getLotsPayload) && Boolean(getLotsPayload?.section_id),
		refetchOnWindowFocus: false,
		retry: 1,
	});

	const GetLotCapacities = useQuery<LotCapacitiesResponse, ApiErrorResponse>({
		queryKey: ["get-lot-capacities-record", getLotCapacitiesPayload],
		queryFn: () => lotServices.GetLotCapacities(getLotCapacitiesPayload!),
		enabled:
			hasCompanyContext(getLotCapacitiesPayload) &&
			Boolean(
				getLotCapacitiesPayload?.warehouse_id &&
				getLotCapacitiesPayload?.section_id &&
				getLotCapacitiesPayload?.lot_id,
			),
		refetchOnWindowFocus: false,
		retry: 1,
	});

	const GetLotCoordinates = useQuery<LotCoordinatesResponse, ApiErrorResponse>({
		queryKey: ["get-lot-coordinates-record", getLotCoordinatesPayload],
		queryFn: () => lotServices.GetLotCoordinates(getLotCoordinatesPayload!),
		enabled:
			hasCompanyContext(getLotCoordinatesPayload) &&
			Boolean(
				getLotCoordinatesPayload?.warehouse_id &&
				getLotCoordinatesPayload?.section_id &&
				getLotCoordinatesPayload?.lot_id,
			),
		refetchOnWindowFocus: false,
		retry: 1,
	});

	const GetLotLayout = useQuery<LotLayoutResponse, ApiErrorResponse>({
		queryKey: ["get-lot-layout-record", getLotLayoutPayload],
		queryFn: () => lotServices.GetLotLayout(getLotLayoutPayload!),
		enabled: hasCompanyContext(getLotLayoutPayload) && Boolean(getLotLayoutPayload?.warehouse_id && getLotLayoutPayload?.section_id),
		refetchOnWindowFocus: false,
		retry: 1,
	});

	const RegisterLot = useMutation<void, ApiErrorResponse, RegisterLotRequest>({
		mutationKey: ["registerSectionLot"],
		mutationFn: (payload) => lotServices.RegisterLot(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["get-lots-records"] });
			queryClient.invalidateQueries({ queryKey: ["get-lot-layout-record"] });
		},
		retry: 1,
	});

	const RegisterLotCoordinates = useMutation<void, ApiErrorResponse, RegisterLotCoordinatesRequest>({
		mutationKey: ["registerLotCoordinates"],
		mutationFn: (payload) => lotServices.RegisterLotCoordinates(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["get-lot-layout-record"] });
			queryClient.invalidateQueries({ queryKey: ["get-lots-records"] });
		},
		retry: 1,
	});

	const UpdateLotCoordinates = useMutation<void, ApiErrorResponse, UpdateLotCoordinatesRequest>({
		mutationKey: ["updateLotCoordinates"],
		mutationFn: (payload) => lotServices.UpdateLotCoordinates(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["get-lot-layout-record"] });
			queryClient.invalidateQueries({ queryKey: ["get-lots-records"] });
		},
		retry: 1,
	});

	return {
		GetLots,
		GetLotLayout,
		GetLotCapacities,
		GetLotCoordinates,
		RegisterLot,
		RegisterLotCoordinates,
		UpdateLotCoordinates,
	};
};
