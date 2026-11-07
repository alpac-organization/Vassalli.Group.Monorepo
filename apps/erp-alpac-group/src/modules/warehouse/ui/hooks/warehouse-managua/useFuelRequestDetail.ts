import { skipToken, useQuery } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import { FuelRequestsServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/warehouse-managua/FuelRequestsServices";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { FuelRequestDetailDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/fuel-requests/fuel-requests.response";
import type { useFuelRequestDetailProps } from "@app/modules/warehouse/application/interfaces/warehouse-interfaces/warehouse-managua/fuel-requests/useFuelRequestDetailProps";

const fuelRequestsServices = new FuelRequestsServices(warehouseHttpHandler);

export const useFuelRequestDetail = function (props: useFuelRequestDetailProps) {
  const { payloadGetFuelRequestDetailRequest } = props;

  const GetFuelRequestDetailQuery = useQuery<FuelRequestDetailDto, ApiErrorResponse>({
    queryKey: ["fuel-request-detail", payloadGetFuelRequestDetailRequest],
    queryFn: payloadGetFuelRequestDetailRequest
      ? () => fuelRequestsServices.GetFuelRequestDetail(payloadGetFuelRequestDetailRequest)
      : skipToken,
    enabled: Boolean(payloadGetFuelRequestDetailRequest?.company_id && payloadGetFuelRequestDetailRequest?.module_code),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return { GetFuelRequestDetailQuery };
};
