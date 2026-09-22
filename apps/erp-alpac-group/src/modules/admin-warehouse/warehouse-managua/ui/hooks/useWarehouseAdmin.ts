import type { GetLotsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lots-req";
import type { GetLotDetailRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lots-details-req";
import type { GetRacksRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-racks";
import type { GetRackDetailRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-rack-detail";
import type { GetLotsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { LotDetailResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-detail";
import type { RegisterLotRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-lots-req";
import type { GetRackResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-rack-res";
import type { GetRackDetailResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-rack-detail";
import type { CreateRacksRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-racks-req";
import { WarehouseAdminServices } from "@app/modules/admin-warehouse/warehouse-managua/infrastructure/services/WarehouseAdminService";
import { warehouseHttpHandler } from "@app/core/adapters";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { useQuery, useMutation } from "@tanstack/react-query";

const warehouseLayoutServices = new WarehouseAdminServices(
  warehouseHttpHandler,
);

interface useWarehouseLayoutProps {
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
    getLotsPayload,
    getLotDetailPayload,
    getRacksPayload,
    getRackDetailPayload,
  } = props || {};


  const GetLots = useQuery<GetLotsResponse, ApiErrorResponse>({
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

  const RegisterLot = useMutation<void, ApiErrorResponse, RegisterLotRequest>({
    mutationKey: ["registerSectionLot"],
    mutationFn: (payload) => warehouseLayoutServices.RegisterLot(payload),
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
    GetLots,
    GetLotById,
    GetRacks,
    GetRackById,
    RegisterLot,
    CreateRacks,
  };
};
