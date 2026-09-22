import { SectionStorageTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import {
  SectionTypeEnum,
  type SectionEnumType,
} from "@app/modules/admin-warehouse/warehouse-managua/enum/section-type";

/** Colores de estado ya usados en los badges de bodega (tabla / racks). */
export const SECTION_STATUS_COLORS = {
  available: "#4ade80",
  occupied: "#fbbf24",
  maintenance: "#f87171",
  reserved: "#2F6FB2",
} as const;

export const SECTION_STATUS_LEGEND = [
  { text: "Disponible", color: SECTION_STATUS_COLORS.available },
  { text: "Ocupada", color: SECTION_STATUS_COLORS.occupied },
  { text: "Mantenimiento", color: SECTION_STATUS_COLORS.maintenance },
  { text: "Reservada", color: SECTION_STATUS_COLORS.reserved },
] as const;

function resolveSectionEnum(
  options: readonly SectionEnumType[],
  value: string | number,
): SectionEnumType | undefined {
  if (value == null || value === "") return undefined;

  const asString = String(value);
  const asNumber = typeof value === "number" ? value : Number(value);

  return options.find(
    (option) =>
      option.textValue === asString ||
      option.value === asNumber ||
      String(option.value) === asString,
  );
}

export const getSectionTypeLabel = (value: string | number | null) => {
  if (value == null || value === "") return "-";
  return (
    resolveSectionEnum(Object.values(SectionTypeEnum), value)?.label ??
    String(value)
  );
};

export const getSectionStorageTypeLabel = (value: string | number | null) => {
  if (value == null || value === "") return "-";
  return (
    resolveSectionEnum(Object.values(SectionStorageTypeEnum), value)?.label ??
    String(value)
  );
};

export const resolveSectionType = (value: string | number) =>
  resolveSectionEnum(Object.values(SectionTypeEnum), value ?? "");

export const resolveSectionStorageType = (value: string | number) =>
  resolveSectionEnum(Object.values(SectionStorageTypeEnum), value ?? "");
