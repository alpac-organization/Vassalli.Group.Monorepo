export type InventoryStockStatusEnum = "Stable" | "LowStock" | "Empty"

export interface InventoryStockStatusValues {
   value: number;
   label: string;
}

export const InventoryStockStatus : Record<InventoryStockStatusEnum, InventoryStockStatusValues> = {
   Stable: {
      value: 1,
      label: "Normal",
   },
   LowStock: {
      value: 2,
      label: "Bajo stock",
   },
   Empty: {
      value: 3,
      label: "Sin stock",
   },
} as const;

