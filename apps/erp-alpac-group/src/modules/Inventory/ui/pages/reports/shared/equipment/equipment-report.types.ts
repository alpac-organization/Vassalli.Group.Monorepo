import type { DatePickerValue } from "@alpac/design-system";

export interface EquipmentReportFiltersValues {
   from: DatePickerValue | null;
   to: DatePickerValue | null;
   branch_id?: string;
   category_ids?: string[];
   equipment_ids?: string[];
   product_ids?: string[];
}
