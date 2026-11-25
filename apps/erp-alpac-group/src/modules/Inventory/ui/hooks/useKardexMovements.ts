import { skipToken, useQuery } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import { KardexMovementsServices } from "../../infrastructure/services/kardex-movements-services";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type { useKardexMovementsProps } from "../../application/interfaces/hooks/useKardexMovementsProps";
import type {
   KardexMovementDetail,
   KardexMovementsData,
} from "../../domain/api-contract/responses/kardex-movements.response";

const kardexMovementsServices = new KardexMovementsServices(warehouseHttpHandler);

export const useKardexMovements = function (props: useKardexMovementsProps) {
   const {
      payloadGetKardexMovementsRequest,
      payloadGetKardexMovementDetailRequest,
   } = props;

   const GetKardexMovementsQuery = useQuery<
      PaginateBaseResponse<KardexMovementsData>,
      ApiErrorResponse
   >({
      queryKey: ["kardex-movements", payloadGetKardexMovementsRequest],
      queryFn: payloadGetKardexMovementsRequest
         ? () =>
              kardexMovementsServices.GetKardexMovements(
                 payloadGetKardexMovementsRequest,
              )
         : skipToken,

      staleTime: 0,
      retryDelay: 3000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
   });

   const GetKardexMovementDetailQuery = useQuery<
      KardexMovementDetail,
      ApiErrorResponse
   >({
      queryKey: [
         "kardex-movement-detail",
         payloadGetKardexMovementDetailRequest,
      ],
      queryFn: payloadGetKardexMovementDetailRequest
         ? () =>
              kardexMovementsServices.GetKardexMovementDetail(
                 payloadGetKardexMovementDetailRequest,
              )
         : skipToken,

      staleTime: 0,
      retryDelay: 3000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
   });

   return {
      GetKardexMovementsQuery,
      GetKardexMovementDetailQuery,
   };
};
