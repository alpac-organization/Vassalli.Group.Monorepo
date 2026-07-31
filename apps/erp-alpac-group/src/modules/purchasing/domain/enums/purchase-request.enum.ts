import type { EnumType } from "@app/shared/types/enum.type";

export const PurchaseRequestEnum: Record<string, EnumType> = {
   Requisition: { value: 1, label: "Requisición" },
   Eventual: { value: 2, label: "Eventual" },
   Monthly: { value: 3, label: "Mensual" }
} as const;

export type PurchaseRequestEnum = (typeof PurchaseRequestEnum)[keyof typeof PurchaseRequestEnum];

export const PurchaseRequestTypeOptions = Object.values(PurchaseRequestEnum);