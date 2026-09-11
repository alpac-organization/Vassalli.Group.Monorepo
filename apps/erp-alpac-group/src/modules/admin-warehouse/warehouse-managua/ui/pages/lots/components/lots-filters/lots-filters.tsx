import { InputText } from "@alpac/design-system";
import { useForm } from "react-hook-form";
import {
  EMPTY_LOT_FILTERS,
  type LotFilters,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/types/lots.types";
import type { LotsFiltersProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lots-filters/types/lots-filters.types";
import {
  inputClassName,
  labelClassName,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lots-filters/utils/styles";
import {
  buildFiltersPayload,
  STATUS_FILTER_OPTIONS,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lots-filters/utils/lots-filter.utils";
import { FilterActions } from "@app/shared/components/filters/filter-actions/filter-actions";
import { StatusFilterDropdown } from "@app/shared/components/filters/status-filter-dropdown/filter-dropdown";

export function LotsFiltersBar({
  onApply,
  onClear,
  defaultValues = EMPTY_LOT_FILTERS,
}: LotsFiltersProps) {
  const { register, handleSubmit, control, reset } = useForm<LotFilters>({
    defaultValues,
    mode: "onSubmit",
  });

  const handleClear = () => {
    reset(EMPTY_LOT_FILTERS);
    onClear();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col justify-center gap-2">
          <h3 className="p-0! m-0!">Filtros</h3>
          <small className="text-gray-500 dark:text-gray-300 text-[12px] sm:text-sm leading-snug">
            Filtra por código o estado
          </small>
        </div>
      </div>

      <form
        onSubmit={handleSubmit((values) => {
          onApply(buildFiltersPayload(values));
        })}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 items-end"
      >
        <div className="flex flex-col min-w-0">
          <InputText
            label="Código"
            className={inputClassName}
            labelClassName={labelClassName}
            type="text"
            placeholder="Buscar por código..."
            {...register("searchTerm")}
          />
        </div>

        <StatusFilterDropdown
          control={control}
          options={STATUS_FILTER_OPTIONS}
          inputClassName={inputClassName}
          labelClassName={labelClassName}
        />

        <FilterActions onClear={handleClear} />
      </form>
    </div>
  );
}
