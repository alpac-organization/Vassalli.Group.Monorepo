import { cleanParams } from "@app/shared/utils/object.utils";

import type { IHttpHandler } from "@app/core/ports";
import type {
   KardexMovementDetail,
   KardexMovementsData,
} from "../../domain/api-contract/responses/kardex-movements.response";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type {
   KardexMovementDetailRequest,
   KardexMovementsRequest,
} from "../../domain/api-contract/requests/kardex-movements.request";
import type { IKardexMovementsServices } from "../../application/interfaces/services/Ikardex-movements-services";

export class KardexMovementsServices implements IKardexMovementsServices {
   private readonly httpClient: IHttpHandler;

   constructor(httpClient: IHttpHandler) {
      this.httpClient = httpClient;
   }

   async GetKardexMovements(
      payload: KardexMovementsRequest,
   ): Promise<PaginateBaseResponse<KardexMovementsData>> {
      const { company_id, module_code, ...rest } = payload;

      return this.httpClient.get<PaginateBaseResponse<KardexMovementsData>>(
         `/companies/${company_id}/modules/${module_code}/kardex-movement`,
         {
            params: cleanParams(rest),
         },
      );
   }

   async GetKardexMovementDetail(
      payload: KardexMovementDetailRequest,
   ): Promise<KardexMovementDetail> {
      const { company_id, module_code, kardex_id } = payload;

      return this.httpClient.get<KardexMovementDetail>(
         `/companies/${company_id}/modules/${module_code}/kardex-movement/${kardex_id}/details`,
      );
   }
}
