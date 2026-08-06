import type { MerchandiseFilters } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/types/merchandise.types";

export type MerchandiseFiltersProps = {
  onApply: (filters: MerchandiseFilters) => void;
  onClear: () => void;
  defaultValues?: MerchandiseFilters;
};
