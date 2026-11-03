import { skipToken, useQuery } from "@tanstack/react-query";

import { warehouseHttpHandler } from "@app/core/adapters";
import { SupplyRequestsServices } from "../../infrastructure/services/supply-requests-services";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { SupplyRequestDetailDto } from "../../domain/api-contract/responses/supply-requests.response";
import type { useSupplyRequestDetailProps } from "../../application/interfaces/hooks/useSupplyRequestDetailProps";

const supplyRequestsServices = new SupplyRequestsServices(warehouseHttpHandler);

export const useSupplyRequestDetail = function (props: useSupplyRequestDetailProps) {
  const { payloadGetSupplyRequestDetailRequest } = props;

  const GetSupplyRequestDetailQuery = useQuery<SupplyRequestDetailDto, ApiErrorResponse>({
    queryKey: ["supply-request-detail", payloadGetSupplyRequestDetailRequest],
    queryFn: payloadGetSupplyRequestDetailRequest
      ? () => supplyRequestsServices.GetSupplyRequestDetail(payloadGetSupplyRequestDetailRequest)
      : skipToken,
    staleTime: 0,
    retryDelay: 3000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    GetSupplyRequestDetailQuery,
  };
};
