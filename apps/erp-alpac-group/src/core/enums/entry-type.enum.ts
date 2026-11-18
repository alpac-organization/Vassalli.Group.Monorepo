export type EntryType = "Buy" | "Return" | "InventoryAdjustment";

export interface EntryTypeValues {
  value: number;
  label: string;
}

export const EntryType: Record<EntryType, EntryTypeValues> = {
  Buy: {
    value: 1,
    label: "Compra",
  },
  Return: {
    value: 2,
    label: "Devolución",
  },
  InventoryAdjustment: {
    value: 3,
    label: "Ajuste de inventario",
  },
} as const;
