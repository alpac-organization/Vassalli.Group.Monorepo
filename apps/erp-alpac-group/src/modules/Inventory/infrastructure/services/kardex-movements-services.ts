import { cleanParams } from "@app/shared/utils/object.utils";

import type { IHttpHandler } from "@app/core/ports";
import type { KardexMovementsData } from "../../domain/api-contract/responses/kardex-movements.response";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type { KardexMovementsRequest } from "../../domain/api-contract/requests/kardex-movements.request";
import type { IKardexMovementsServices } from "../../application/interfaces/services/Ikardex-movements-services";

export class KardexMovementsServices implements IKardexMovementsServices {
   private readonly httpClient: IHttpHandler;
   
   constructor(httpClient: IHttpHandler) {
      this.httpClient = httpClient;
   }

   async GetKardexMovements(payload: KardexMovementsRequest) : Promise<PaginateBaseResponse<KardexMovementsData>>{
      try {
         const { company_id, module_code, ...rest } = payload;

         return this.httpClient.get<PaginateBaseResponse<KardexMovementsData>>(`/companies/${company_id}/modules/${module_code}/kardex-movement`, {
            params: cleanParams(rest),
         });
      }
      catch(error: unknown){
         throw error;
      }
   }
}