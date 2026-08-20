import { Button, Dropdown, InputText } from "@alpac/design-system";
import type { Option } from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import { SectionTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-type";
import { SectionStorageTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import {
  EMPTY_SECTION_FILTERS,
  type SectionFilters,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/types/sections.types";
import type { SectionsFiltersProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-filters/types/sections-filters.types";
import {
  inputClassName,
  labelClassName,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-filters/utils/styles";

const SECTION_TYPE_FILTER_OPTIONS: Option[] = [
  { value: "", label: "Todos" },
  ...Object.values(SectionTypeEnum).map((option) => ({
    value: option.textValue,
    label: option.label,
  })),
];

const STORAGE_TYPE_FILTER_OPTIONS: Option[] = [
  { value: "", label: "Todos" },
  ...Object.values(SectionStorageTypeEnum).map((option) => ({
    value: option.textValue,
    label: option.label,
  })),
];

const STATUS_FILTER_OPTIONS: Option[] = [
  { value: "", label: "Todos" },
  { value: "Activa", label: "Activa" },
  { value: "Inactiva", label: "Inactiva" },
];

function buildFiltersPayload(values: SectionFilters): SectionFilters {
  return {
    searchTerm: values.searchTerm.trim(),
    filterType: values.filterType,
    filterStorage: values.filterStorage,
    filterStatus: values.filterStatus,
  };
}

export function SectionsFiltersBar({
  onApply,
  onClear,
  defaultValues = EMPTY_SECTION_FILTERS,
}: SectionsFiltersProps) {
  const { register, handleSubmit, control, reset } = useForm<SectionFilters>({
    defaultValues,
    mode: "onSubmit",
  });

  const handleClear = () => {
    reset(EMPTY_SECTION_FILTERS);
    onClear();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col justify-center gap-2">
          <h3 className="p-0! m-0!">Filtros</h3>
          <small className="text-gray-500 dark:text-gray-300 text-[12px] sm:text-sm leading-snug">
            Filtra por nombre, código, tipo, almacenamiento o estado
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
            label="Búsqueda"
            className={inputClassName}
            labelClassName={labelClassName}
            type="text"
            placeholder="Buscar por nombre o código..."
            {...register("searchTerm")}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <Controller
            name="filterType"
            control={control}
            render={({ field }) => (
              <Dropdown
                appearance="dark"
                label="Tipo"
                placeholder="Todos"
                options={SECTION_TYPE_FILTER_OPTIONS}
                value={field.value || undefined}
                onChange={(value) => field.onChange(String(value ?? ""))}
                labelClassName={labelClassName}
                valueClassName={labelClassName}
                className={`${inputClassName} h-[42px]! sm:h-[46px]!`}
              />
            )}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <Controller
            name="filterStorage"
            control={control}
            render={({ field }) => (
              <Dropdown
                appearance="dark"
                label="Almacenamiento"
                placeholder="Todos"
                options={STORAGE_TYPE_FILTER_OPTIONS}
                value={field.value || undefined}
                onChange={(value) => field.onChange(String(value ?? ""))}
                labelClassName={labelClassName}
                valueClassName={labelClassName}
                className={`${inputClassName} h-[42px]! sm:h-[46px]!`}
              />
            )}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <Controller
            name="filterStatus"
            control={control}
            render={({ field }) => (
              <Dropdown
                appearance="dark"
                label="Estado"
                placeholder="Todos"
                options={STATUS_FILTER_OPTIONS}
                value={field.value || undefined}
                onChange={(value) => field.onChange(String(value ?? ""))}
                labelClassName={labelClassName}
                valueClassName={labelClassName}
                className={`${inputClassName} h-[42px]! sm:h-[46px]!`}
              />
            )}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <Button
            type="submit"
            size="giant"
            className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            label="Aplicar filtros"
          />
        </div>

        <div className="flex flex-col min-w-0">
          <Button
            type="button"
            size="giant"
            className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
            label="Limpiar filtros"
            onClick={handleClear}
          />
        </div>
      </form>
    </div>
  );
}
