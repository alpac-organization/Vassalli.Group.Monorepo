import type { DatePickerValue } from "@alpac/design-system";
import type { KardexMovementTypeEnum } from "@app/core/enums/kardex-movement-type.enum";
import type { KardexTypeEnum } from "@app/core/enums/kardex-type.enum";
import type { ReferenceTypeEnum } from "@app/core/enums/reference-type.enum";
import type { KardexMovementsData } from "@app/modules/Inventory/domain/api-contract/responses/kardex-movements.response";

export interface KardexMovementFilters {
   branch_id?: string;
   cost_center_id?: string;
   category_id?: string;
   product_code?: string;
   kardex_type?: KardexTypeEnum | null;
   reference_type?: ReferenceTypeEnum | null;
   movement_type?: KardexMovementTypeEnum | null;
   date_from?: DatePickerValue | null;
   date_to?: DatePickerValue | null;
   page_number?: number;
   page_size?: number;
}

export interface KardexMovementsColumnsProps {
   onViewDetail: (item: KardexMovementsData) => void;
}
