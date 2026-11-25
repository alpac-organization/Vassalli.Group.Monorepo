import type {
   KardexMovementDetail,
   KardexMovementsData,
} from "@app/modules/Inventory/domain/api-contract/responses/kardex-movements.response";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type {
   KardexMovementDetailRequest,
   KardexMovementsRequest,
} from "@app/modules/Inventory/domain/api-contract/requests/kardex-movements.request";

export interface IKardexMovementsServices {
   GetKardexMovements(
      payload: KardexMovementsRequest,
   ): Promise<PaginateBaseResponse<KardexMovementsData>>;

   GetKardexMovementDetail(
      payload: KardexMovementDetailRequest,
   ): Promise<KardexMovementDetail>;
}
