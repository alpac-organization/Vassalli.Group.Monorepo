import type { EnumType } from "@app/shared/types/enum.type";

export type WarehouseEnumType = EnumType & {
  textValue: string;
};

export const WarehouseTypeEnum = {
  General: { value: 1, label: "General", textValue: "General" },
  Fiscal: { value: 2, label: "Fiscal", textValue: "Fiscal" },
  GaleronTechado: {
    value: 3,
    label: "Galeron Techado",
    textValue: "GaleronTechado",
  },
  PatioContenedores: {
    value: 4,
    label: "Patio de Contenedores",
    textValue: "PatioContenedores",
  },
  PredioAbierto: {
    value: 5,
    label: "Predio Abierto",
    textValue: "PredioAbierto",
  },
  Granel: { value: 6, label: "Granel", textValue: "Granel" },
} as const satisfies Record<string, WarehouseEnumType>;

export type WarehouseTypeEnum =
  (typeof WarehouseTypeEnum)[keyof typeof WarehouseTypeEnum];

export const WarehouseTypeOptions: EnumType[] =
  Object.values(WarehouseTypeEnum);

export type WarehouseTypeValue =
  (typeof WarehouseTypeEnum)[keyof typeof WarehouseTypeEnum]["textValue"];

/** Label amigable desde el `warehouse_type` del contrato (`"Fiscal"`, `"GaleronTechado"`, …). */
export function getWarehouseTypeLabel(
  warehouseType: string | null | undefined,
): string {
  if (!warehouseType) return "—";

  const match = Object.values(WarehouseTypeEnum).find(
    (option) => option.textValue === warehouseType,
  );

  return match?.label ?? warehouseType;
}
