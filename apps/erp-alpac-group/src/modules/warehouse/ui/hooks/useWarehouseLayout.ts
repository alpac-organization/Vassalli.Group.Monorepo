import { warehouseHttpHandler } from "@app/core/adapters";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { CreateLotsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-lots-request";
import type { CreateRacksRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-racks-request";
import type { CreateSectionRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-section-request";
import type { GetLotDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-lot-detail-request";
import type { GetLotsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-lots-request";
import type { GetRackDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-rack-detail-request";
import type { GetRacksRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-racks-request";
import type { GetSectionsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-sections-request";
import type { LotDetailResponse, LotListItemResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/lot-response";
import type { RackDetailResponse, RackSectionFilterResultResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/rack-response";
import type { SectionResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/section-response";
import { WarehouseLayoutServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/WarehouseLayoutServices";

const warehouseLayoutServices = new WarehouseLayoutServices(warehouseHttpHandler);

interface useWarehouseLayoutProps {
	getSectionsPayload?: GetSectionsRequest;
	getLotsPayload?: GetLotsRequest;
	getLotDetailPayload?: GetLotDetailRequest;
	getRacksPayload?: GetRacksRequest;
	getRackDetailPayload?: GetRackDetailRequest;
}

const hasCompanyContext = (payload?: {
	company_id?: string;
	module_code?: string;
}) => Boolean(payload?.company_id?.trim() && payload?.module_code?.trim());

export const useWarehouseLayout = (props?: useWarehouseLayoutProps) => {
	const queryClient = useQueryClient();

	const { getSectionsPayload, getLotsPayload, getLotDetailPayload, getRacksPayload, getRackDetailPayload } =
		props || {};

	const GetSections = useQuery<SectionResponse[], ApiErrorResponse>({
		queryKey: ["get-warehouse-sections-records", getSectionsPayload],
		queryFn: () => warehouseLayoutServices.GetSections(getSectionsPayload!),
		enabled: hasCompanyContext(getSectionsPayload) && Boolean(getSectionsPayload?.warehouse_id),
		refetchOnWindowFocus: false,
		retry: 1,
	});

	const GetLots = useQuery<LotListItemResponse[], ApiErrorResponse>({
		queryKey: ["get-section-lots-records", getLotsPayload],
		queryFn: () => warehouseLayoutServices.GetLots(getLotsPayload!),
		enabled: hasCompanyContext(getLotsPayload) && Boolean(getLotsPayload?.section_id),
		refetchOnWindowFocus: false,
		retry: 1,
	});

	const GetLotById = useQuery<LotDetailResponse, ApiErrorResponse>({
		queryKey: ["get-lot-detail-record", getLotDetailPayload],
		queryFn: () => warehouseLayoutServices.GetLotById(getLotDetailPayload!),
		enabled:
			hasCompanyContext(getLotDetailPayload) &&
			Boolean(getLotDetailPayload?.section_id && getLotDetailPayload?.lot_id),
		refetchOnWindowFocus: false,
		retry: 1,
	});

	const GetRacks = useQuery<RackSectionFilterResultResponse, ApiErrorResponse>({
		queryKey: ["get-section-racks-records", getRacksPayload],
		queryFn: () => warehouseLayoutServices.GetRacks(getRacksPayload!),
		enabled: hasCompanyContext(getRacksPayload) && Boolean(getRacksPayload?.section_id),
		refetchOnWindowFocus: false,
		retry: 1,
	});

	const GetRackById = useQuery<RackDetailResponse, ApiErrorResponse>({
		queryKey: ["get-rack-detail-record", getRackDetailPayload],
		queryFn: () => warehouseLayoutServices.GetRackById(getRackDetailPayload!),
		enabled: hasCompanyContext(getRackDetailPayload) && Boolean(getRackDetailPayload?.rack_id),
		refetchOnWindowFocus: false,
		retry: 1,
	});

	const CreateSection = useMutation<void, ApiErrorResponse, CreateSectionRequest>({
		mutationKey: ["createWarehouseSection"],
		mutationFn: (payload) => warehouseLayoutServices.CreateSection(payload),
		retry: 1,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["get-warehouse-sections-records"] });
		},
	});

	const CreateLots = useMutation<
		Awaited<ReturnType<typeof warehouseLayoutServices.CreateLots>>,
		ApiErrorResponse,
		CreateLotsRequest
	>({
		mutationKey: ["createSectionLots"],
		mutationFn: (payload) => warehouseLayoutServices.CreateLots(payload),
		retry: 1,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["get-section-lots-records"] });
		},
	});

	const CreateRacks = useMutation<
		Awaited<ReturnType<typeof warehouseLayoutServices.CreateRacks>>,
		ApiErrorResponse,
		CreateRacksRequest
	>({
		mutationKey: ["createSectionRacks"],
		mutationFn: (payload) => warehouseLayoutServices.CreateRacks(payload),
		retry: 1,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["get-section-racks-records"] });
		},
	});

	return { GetSections, GetLots, GetLotById, GetRacks, GetRackById, CreateSection, CreateLots, CreateRacks };
};