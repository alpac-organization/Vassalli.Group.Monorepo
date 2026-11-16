export type InventoryStockStatusEnum = "Stable" | "LowBalance" | "Empty"

export interface InventoryStockStatusValues {
   value: number;
   label: string;
}

export const InventoryStockStatus : Record<InventoryStockStatusEnum, InventoryStockStatusValues> = {
   Stable: {
      value: 1,
      label: "Normal",
   },
   LowBalance: {
      value: 2,
      label: "Bajo stock",
   },
   Empty: {
      value: 3,
      label: "Sin stock",
   },
} as const;

