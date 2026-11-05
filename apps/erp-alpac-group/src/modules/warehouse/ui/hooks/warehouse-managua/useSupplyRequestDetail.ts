import { skipToken, useQuery } from "@tanstack/react-query";

import { warehouseHttpHandler } from "@app/core/adapters";
import { SupplyRequestsServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/warehouse-managua/SupplyRequestsServices";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { SupplyRequestDetailDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/supply-requests/supply-requests.response";
import type { useSupplyRequestDetailProps } from "@app/modules/warehouse/application/interfaces/warehouse-interfaces/warehouse-managua/supply-requests/useSupplyRequestDetailProps";

const supplyRequestsServices = new SupplyRequestsServices(warehouseHttpHandler);

export const useSupplyRequestDetail = function (props: useSupplyRequestDetailProps) {
  const { payloadGetSupplyRequestDetailRequest } = props;

  const GetSupplyRequestDetailQuery = useQuery<SupplyRequestDetailDto, ApiErrorResponse>({
    queryKey: ["supply-request-detail", payloadGetSupplyRequestDetailRequest],
    queryFn: payloadGetSupplyRequestDetailRequest
      ? () => supplyRequestsServices.GetSupplyRequestDetail(payloadGetSupplyRequestDetailRequest)
      : skipToken,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    GetSupplyRequestDetailQuery,
  };
};
