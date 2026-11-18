export type EntryType = "Buy" | "Return" | "InventoryAdjustment";

export interface EntryTypeValues {
  value: number;
  label: string;
  badgeColor: string;
}

export const EntryTypeEnum: Record<EntryType, EntryTypeValues> = {
  Buy: {
    value: 1,
    label: "Compra",
    badgeColor: "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    // badgeColor: "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  },
  Return: {
    value: 2,
    label: "Devolución",
    badgeColor: "bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  },
  InventoryAdjustment: {
    value: 3,
    label: "Ajuste de inventario",
    badgeColor: "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  },
};