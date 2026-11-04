export type ReasonUse = "Sale" | "Operation";

export interface ReasonUseValues {
  value: number;
  label: string;
}

export const ReasonUse: Record<ReasonUse, ReasonUseValues> = {
  Sale: {
    value: 1,
    label: "Venta",
  },
  Operation: {
    value: 2,
    label: "Operativo",
  }
} as const;
