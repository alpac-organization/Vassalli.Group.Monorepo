import type { KardexTypeEnum } from "@app/core/enums/kardex-type.enum";
import type { KardexMovementTypeEnum } from "@app/core/enums/kardex-movement-type.enum";
import type { ReferenceTypeEnum } from "@app/core/enums/reference-type.enum";

import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

/**
 * Parámetros de consulta para obtener los movimientos del Kardex.
 */
export interface KardexMovementsRequest extends BaseRequest {
   branch_id?: string;
   cost_center_id?: string;
   work_area_id?: string;
   category_id?: string;
   product_code?: string;
   kardex_type?: KardexTypeEnum | null;
   reference_type?: ReferenceTypeEnum | null;
   movement_type?: KardexMovementTypeEnum | null;
   date_from?: string;
   date_to?: string;
   page_size?: number;
   page_number?: number;
}

export interface KardexMovementDetailRequest extends BaseRequest {
   kardex_id: string;
}
