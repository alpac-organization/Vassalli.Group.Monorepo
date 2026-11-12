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

export const getInventoryStockStatusKey = (status: unknown): InventoryStockStatusEnum | undefined => {
   if (typeof status === "number") {
      return (Object.keys(InventoryStockStatus) as InventoryStockStatusEnum[]).find(
         (key) => InventoryStockStatus[key].value === status,
      );
   }

   if (typeof status === "string" && status in InventoryStockStatus) {
      return status as InventoryStockStatusEnum;
   }

   return undefined;
};

export const getInventoryStockStatusLabel = (status: unknown): string => {
   const key = getInventoryStockStatusKey(status);
   return key ? InventoryStockStatus[key].label : String(status);
};

