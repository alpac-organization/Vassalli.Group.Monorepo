import type { CreateSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-section-req";
import type { GetSectionsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-sections-req";
import type { GetLotsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lots-req";
import type { GetLotDetailRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lots-details-req";
import type { GetRacksRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-racks";
import type { GetRackDetailRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-rack-detail";

import type { LotListItemResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { LotDetailResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-detail";
import type { CreateLotsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-lots-req";
import type { GetRackResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-rack-res";
import type { GetRackDetailResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-rack-detail";
import type { CreateRacksRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-racks-req";
import { WarehouseAdminServices } from "@app/modules/admin-warehouse/warehouse-managua/infrastructure/services/WarehouseAdmin";
import { warehouseHttpHandler } from "@app/core/adapters";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { SectionResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-section-res";
import { useQuery, useMutation } from "@tanstack/react-query";

const warehouseLayoutServices = new WarehouseAdminServices(
  warehouseHttpHandler,
);

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

export const useWarehouseAdmin = (props?: useWarehouseLayoutProps) => {
  const queryClient = useQueryClient();

  const {
    getSectionsPayload,
    getLotsPayload,
    getLotDetailPayload,
    getRacksPayload,
    getRackDetailPayload,
  } = props || {};

  const GetSections = useQuery<SectionResponse[], ApiErrorResponse>({
    queryKey: ["get-warehouse-sections-records", getSectionsPayload],
    queryFn: () => warehouseLayoutServices.GetSections(getSectionsPayload!),
    enabled:
      hasCompanyContext(getSectionsPayload) &&
      Boolean(getSectionsPayload?.warehouse_id),
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const GetLots = useQuery<LotListItemResponse[], ApiErrorResponse>({
    queryKey: ["get-section-lots-records", getLotsPayload],
    queryFn: () => warehouseLayoutServices.GetLots(getLotsPayload!),
    enabled:
      hasCompanyContext(getLotsPayload) && Boolean(getLotsPayload?.section_id),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const GetLotById = useQuery<LotDetailResponse, ApiErrorResponse>({
    queryKey: ["get-lot-detail-record", getLotDetailPayload],
    queryFn: () => warehouseLayoutServices.GetLotsById(getLotDetailPayload!),
    enabled:
      hasCompanyContext(getLotDetailPayload) &&
      Boolean(getLotDetailPayload?.section_id && getLotDetailPayload?.lot_id),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const GetRacks = useQuery<GetRackResponse, ApiErrorResponse>({
    queryKey: ["get-section-racks-records", getRacksPayload],
    queryFn: () => warehouseLayoutServices.GetRacks(getRacksPayload!),
    enabled:
      hasCompanyContext(getRacksPayload) &&
      Boolean(getRacksPayload?.section_id),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const GetRackById = useQuery<GetRackDetailResponse, ApiErrorResponse>({
    queryKey: ["get-rack-detail-record", getRackDetailPayload],
    queryFn: () => warehouseLayoutServices.GetRackById(getRackDetailPayload!),
    enabled:
      hasCompanyContext(getRackDetailPayload) &&
      Boolean(getRackDetailPayload?.rack_id),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const CreateSection = useMutation<
    void,
    ApiErrorResponse,
    CreateSectionRequest
  >({
    mutationKey: ["createWarehouseSection"],
    mutationFn: (payload) => warehouseLayoutServices.CreateSection(payload),
    retry: 1,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-warehouse-sections-records"],
      });
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
      queryClient.invalidateQueries({
        queryKey: ["get-section-racks-records"],
      });
    },
  });

  return {
    GetSections,
    GetLots,
    GetLotById,
    GetRacks,
    GetRackById,
    CreateSection,
    CreateLots,
    CreateRacks,
  };
};
