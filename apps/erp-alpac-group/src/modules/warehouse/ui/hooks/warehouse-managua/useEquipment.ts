import { useQuery } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters/axiosAdapter";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetEquipmentRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-equipment.request";
import type { PagedEquipmentResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-equipment.response";
import { EquipmentServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/EquipmentServices";

const equipmentServices = new EquipmentServices(warehouseHttpHandler);

export const useEquipment = (payload: GetEquipmentRequest | null) => {
  const GetEquipments = useQuery<PagedEquipmentResponse, ApiErrorResponse>({
    queryKey: ["equipment-catalog", payload],
    queryFn: () => equipmentServices.GetEquipments(payload as GetEquipmentRequest),
    enabled: Boolean(payload?.company_id && payload?.module_code),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    GetEquipments,
  };
};