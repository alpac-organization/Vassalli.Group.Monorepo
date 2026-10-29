export type KardexMovementTypeEnum = "Buys" | "Exit" | "Returns";

export interface KardexMovementTypeEnumValues {
   value: number;
   label: string;
}

export const KardexMovementType : Record<KardexMovementTypeEnum, KardexMovementTypeEnumValues> = {
   Buys: {
      value: 1,
      label: "Compra",
   },
   Exit: {
      value: 2,
      label: "Salida",
   },
   Returns: {
      value: 3,
      label: "Devolución"
   }
} as const;
