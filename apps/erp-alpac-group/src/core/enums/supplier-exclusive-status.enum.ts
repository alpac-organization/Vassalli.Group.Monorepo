import type { EnumType } from "@app/shared/types/enum.type";

export const SupplierExclusiveStatusEnum = {
  None: {
    value: 0,
    label: "Ninguno",
    stringValue: "None",
  },
  PendingReview: {
    value: 1,
    label: "Pendiente de revisión",
    stringValue: "PendingReview",
  },
  Approved: {
    value: 2,
    label: "Aprobado",
    stringValue: "Approved",
  },
  Rejected: {
    value: 3,
    label: "Rechazado",
    stringValue: "Rejected",
  },
} as const;

export type SupplierExclusiveStatusEnum =
  (typeof SupplierExclusiveStatusEnum)[keyof typeof SupplierExclusiveStatusEnum];
export type SupplierExclusiveStatus =
  SupplierExclusiveStatusEnum["stringValue"];

export type SupplierExclusiveStatusOnCreate = Extract<
  SupplierExclusiveStatus,
  "None" | "PendingReview"
>;

export type SupplierExclusiveStatusReview = Extract<
  SupplierExclusiveStatus,
  "Approved" | "Rejected"
>;

export const isSupplierExclusive = (
  status?: SupplierExclusiveStatus | null,
): boolean => status === SupplierExclusiveStatusEnum.Approved.stringValue;

export const SupplierExclusiveStatusOptions: EnumType[] = Object.values(
  SupplierExclusiveStatusEnum,
).map((item) => ({
  value: item.stringValue,
  label: item.label,
}));
