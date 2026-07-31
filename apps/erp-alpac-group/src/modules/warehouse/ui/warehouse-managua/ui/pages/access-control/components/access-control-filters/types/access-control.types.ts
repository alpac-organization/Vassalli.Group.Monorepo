import type { AccessControlFilters } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/types/movement.types";

export type AccessControlFiltersProps = {
  onApply: (filters: AccessControlFilters) => void;
  onClear: () => void;
  defaultValues?: AccessControlFilters;
};
