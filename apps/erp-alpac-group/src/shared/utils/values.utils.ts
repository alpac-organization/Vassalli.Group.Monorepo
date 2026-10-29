import type { Option } from "@alpac/design-system";

type OptionField<T, R> = keyof T | ((item: T) => R);

const resolveOptionField = <T, R>(item: T, field: OptionField<T, R>): R =>
  typeof field === "function" ? field(item) : (item[field] as R);

export type OptionListMap<T> = {
  list: readonly T[];
  label: OptionField<T, string>;
  value: OptionField<T, string>;
  allLabel?: string;
};

export const isValidateValue = (value?: string | number | null): boolean =>
  value !== undefined && value !== null && Number(value) !== 0;

/**
 * Convierte cualquier lista en opciones de dropdown (`Option[]`).
 *
 * Evita repetir el mapeo manual a `{ label, value }` en filtros, catálogos o enums.
 * Recibe la lista y el origen de cada campo: una clave del ítem o una función
 * que lo transforme (`label` / `value`).
 *
 * Si se indica `allLabel`, antepone `{ label: allLabel, value: "all" }`.
 *
 * @example Por clave del ítem
 * ```ts
 * getMappedOptionList({
 *   list: collaborators,
 *   label: "full_name",
 *   value: "collaborator_id",
 *   allLabel: "Todos",
 * });
 * ```
 *
 * @example Por función (transformación)
 * ```ts
 * getMappedOptionList({
 *   list: catalog.filter((i) => i.is_active !== false),
 *   label: (item) => (item.code ? `${item.code} — ${item.name}` : item.name),
 *   value: (item) => item.fault_catalog_id,
 * });
 * ```
 *
 * @example Desde un enum map
 * ```ts
 * getMappedOptionList({
 *   list: Object.entries(FaultSeverityEnum),
 *   label: ([, item]) => item.label,
 *   value: ([key]) => key,
 *   allLabel: "Todas las severidades",
 * });
 * ```
 */
export const getMappedOptionList = <T>(
  { list, label, value, allLabel }: OptionListMap<T>): Option[] => {

  const options = list.map((item) => ({
    label: String(resolveOptionField(item, label)),
    value: resolveOptionField(item, value),
  }));

  return allLabel ?
    [{ label: allLabel, value: "all" }, ...options] : options;
};
