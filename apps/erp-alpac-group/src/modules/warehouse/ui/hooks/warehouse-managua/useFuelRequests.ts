import { skipToken, useQuery } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import { FuelRequestsServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/warehouse-managua/FuelRequestsServices";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { PagedFuelRequestsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/fuel-requests/fuel-requests.response";
import type { useFuelRequestsProps } from "@app/modules/warehouse/application/interfaces/warehouse-interfaces/warehouse-managua/fuel-requests/useFuelRequestsProps";

const fuelRequestsServices = new FuelRequestsServices(warehouseHttpHandler);

export const useFuelRequests = function (props: useFuelRequestsProps) {
  const { payloadGetFuelRequestsRequest } = props;

  const GetFuelRequestsQuery = useQuery<PagedFuelRequestsResponse, ApiErrorResponse>({
    queryKey: ["fuel-requests", payloadGetFuelRequestsRequest],
    queryFn: payloadGetFuelRequestsRequest
      ? () => fuelRequestsServices.GetFuelRequests(payloadGetFuelRequestsRequest)
      : skipToken,
    enabled: Boolean(
      payloadGetFuelRequestsRequest?.company_id &&
        payloadGetFuelRequestsRequest?.module_code,
    ),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return { GetFuelRequestsQuery };
};
