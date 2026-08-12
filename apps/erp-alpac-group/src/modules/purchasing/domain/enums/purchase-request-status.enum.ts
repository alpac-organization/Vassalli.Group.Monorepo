import type { EnumType } from "@app/shared/types/enum.type";

type PurchaseRequestStatusEnumType = EnumType & {
   textValue: string;
}

export const PurchaseRequestStatusEnum = {
   Pending: { value: 1, label: "Pendiente", textValue: "Pending" },
   Approved: { value: 2, label: "Aprobada", textValue: "Approved" },
   Rejected: { value: 3, label: "Rechazada", textValue: "Rejected" },
   Canceled: { value: 4, label: "Cancelada", textValue: "Canceled" }
} as const satisfies Record<string, PurchaseRequestStatusEnumType>;

export type PurchaseRequestStatusEnum = (typeof PurchaseRequestStatusEnum)[keyof typeof PurchaseRequestStatusEnum];

export const PurchaseRequestStatusOptions = Object.values(PurchaseRequestStatusEnum);