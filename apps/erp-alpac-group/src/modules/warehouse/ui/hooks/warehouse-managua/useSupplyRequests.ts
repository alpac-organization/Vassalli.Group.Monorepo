import { skipToken, useQuery } from "@tanstack/react-query";

import { warehouseHttpHandler } from "@app/core/adapters";
import { SupplyRequestsServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/warehouse-managua/SupplyRequestsServices";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { PagedSupplyRequestsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/supply-requests/supply-requests.response";
import type { useSupplyRequestsProps } from "@app/modules/warehouse/application/interfaces/warehouse-interfaces/warehouse-managua/supply-requests/useSupplyRequestsProps";

const supplyRequestsServices = new SupplyRequestsServices(warehouseHttpHandler);

export const useSupplyRequests = function (props: useSupplyRequestsProps) {
  const { payloadGetSupplyRequestsRequest } = props;

  const GetSupplyRequestsQuery = useQuery<PagedSupplyRequestsResponse, ApiErrorResponse>({
    queryKey: ["supply-requests", payloadGetSupplyRequestsRequest],
    queryFn: payloadGetSupplyRequestsRequest
      ? () => supplyRequestsServices.GetSupplyRequests(payloadGetSupplyRequestsRequest)
      : skipToken,
    enabled: Boolean(
      payloadGetSupplyRequestsRequest?.company_id &&
        payloadGetSupplyRequestsRequest?.module_code,
    ),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    GetSupplyRequestsQuery,
  };
};
