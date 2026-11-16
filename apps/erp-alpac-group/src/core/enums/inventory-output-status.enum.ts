export type InventoryOutputsStatus =
  | "OutputPending"
  | "Dispatched"
  | "InProgress"
  | "Rejected";

export interface InventoryOutputsStatusValues {
  value: number;
  label: string;
}

export const InventoryOutputsStatus: Record<InventoryOutputsStatus, InventoryOutputsStatusValues> = {
  OutputPending: {
    value: 1,
    label: "Pendiente",
  },
  Dispatched: {
    value: 2,
    label: "Despachado",
  },
  InProgress: {
    value: 3,
    label: "En proceso",
  },
  Rejected: {
    value: 4,
    label: "Rechazado",
  },
} as const;