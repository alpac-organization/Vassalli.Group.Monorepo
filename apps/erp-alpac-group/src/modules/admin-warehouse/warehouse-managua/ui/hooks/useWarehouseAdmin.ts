import type { GetLotsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lots-req";
import type { GetLotDetailRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lots-details-req";
import type { GetLotCapacitiesRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lot-capacities-req";
import type { GetLotsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { LotDetailResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-detail";
import type { LotCapacitiesResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-capacities-res";
import type { RegisterLotRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-lots-req";
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
  getLotCapacitiesPayload?: GetLotCapacitiesRequest;
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
    getLotCapacitiesPayload,
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

  const GetLotCapacities = useQuery<LotCapacitiesResponse, ApiErrorResponse>({
    queryKey: ["get-lot-capacities-record", getLotCapacitiesPayload],
    queryFn: () =>
      warehouseLayoutServices.GetLotCapacities(getLotCapacitiesPayload!),
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

  const RegisterLot = useMutation<void, ApiErrorResponse, RegisterLotRequest>({
    mutationKey: ["registerSectionLot"],
    mutationFn: (payload) => warehouseLayoutServices.RegisterLot(payload),
    retry: 1,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-section-lots-records"] });
    },
  });

  return {
    GetLots,
    GetLotById,
    GetLotCapacities,
    RegisterLot,
  };
};
