import { skipToken, useQuery } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import { KardexMovementsServices } from "../../infrastructure/services/kardex-movements-services";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type { useKardexMovementsProps } from "../../application/interfaces/hooks/useKardexMovementsProps";
import type { KardexMovementsResponse } from "../../domain/api-contract/responses/kardex-movements.response";

const kardexMovementsServices = new KardexMovementsServices(warehouseHttpHandler);

export const useKardexMovements = function(props: useKardexMovementsProps){

   const {
      payloadGetKardexMovementsRequest
   } = props;

   //#region Obtener movimientos de kardex
   
   const GetKardexMovementsQuery = useQuery<PaginateBaseResponse<KardexMovementsResponse>, ApiErrorResponse>({
      queryKey: ["kardex-movements", payloadGetKardexMovementsRequest],
      queryFn: payloadGetKardexMovementsRequest
         ? () => kardexMovementsServices.GetKardexMovements(payloadGetKardexMovementsRequest)
         : skipToken,
      
      staleTime: 0,
      retryDelay: 3000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
   });

   //#endregion

   return {
      GetKardexMovementsQuery
   }
}