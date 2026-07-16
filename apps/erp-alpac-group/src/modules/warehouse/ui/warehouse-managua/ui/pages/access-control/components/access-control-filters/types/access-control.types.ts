import type { EnumType } from "@app/shared/types/enum.type";
import type { AccessControlFilters } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/types/movement.types";

export type AccessControlFiltersProps = {
  plateOptions: EnumType[];
  conductorOptions: EnumType[];
  onApply: (filters: AccessControlFilters) => void;
  onClear: () => void;
  defaultValues?: AccessControlFilters;
};
