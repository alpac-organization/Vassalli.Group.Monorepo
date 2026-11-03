import { skipToken, useQuery } from "@tanstack/react-query";

import { warehouseHttpHandler } from "@app/core/adapters";
import { SupplyRequestsServices } from "../../infrastructure/services/supply-requests-services";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { PagedSupplyRequestsResponse } from "../../domain/api-contract/responses/supply-requests.response";
import type { useSupplyRequestsProps } from "../../application/interfaces/hooks/useSupplyRequestsProps";

const supplyRequestsServices = new SupplyRequestsServices(warehouseHttpHandler);

export const useSupplyRequests = function (props: useSupplyRequestsProps) {
  const { payloadGetSupplyRequestsRequest } = props;

  const GetSupplyRequestsQuery = useQuery<PagedSupplyRequestsResponse, ApiErrorResponse>({
    queryKey: ["supply-requests", payloadGetSupplyRequestsRequest],
    queryFn: payloadGetSupplyRequestsRequest
      ? () => supplyRequestsServices.GetSupplyRequests(payloadGetSupplyRequestsRequest)
      : skipToken,
    staleTime: 0,
    retryDelay: 3000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    GetSupplyRequestsQuery,
  };
};
