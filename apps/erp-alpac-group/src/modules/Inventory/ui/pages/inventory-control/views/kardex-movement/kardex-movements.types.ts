import type { KardexMovementTypeEnum } from "@app/core/enums/kardex-movement-type.enum";
import type { KardexTypeEnum } from "@app/core/enums/kardex-type.enum";

export interface KardexMovementFilters {
    category_id?:  string;
    product_code?: string;
    kardex_type?:   KardexTypeEnum | null;
    movement_type?: KardexMovementTypeEnum | null;
    page_number?:  number;
    page_size?:    number;
}