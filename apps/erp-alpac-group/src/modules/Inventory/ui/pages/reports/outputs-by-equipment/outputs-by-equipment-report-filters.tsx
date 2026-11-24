import type { ComponentProps } from "react";

import { EquipmentReportFilters } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/equipment-report-filters";
import type { EquipmentReportFiltersValues } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/equipment-report.types";

export type OutputsByEquipmentReportFiltersValues = EquipmentReportFiltersValues;

export const OutputsByEquipmentReportFilters = function (
   props: Omit<ComponentProps<typeof EquipmentReportFilters>, "requireCategory">,
) {
   return <EquipmentReportFilters {...props} requireCategory />;
};
