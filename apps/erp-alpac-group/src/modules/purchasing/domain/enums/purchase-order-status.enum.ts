import type { EnumType } from "@app/shared/types/enum.type";

type PurchaseOrderStatusEnumType = EnumType & {
  textValue: string;
};

export const PurchaseOrderStatusEnum = {
  Pending: { value: 1, label: "Pendiente", textValue: "Pending" },
  Generated: { value: 2, label: "Generada", textValue: "Generated" },
} as const satisfies Record<string, PurchaseOrderStatusEnumType>;

export type PurchaseOrderStatusEnum =
  (typeof PurchaseOrderStatusEnum)[keyof typeof PurchaseOrderStatusEnum];

export type PurchaseOrderStatusType =
  (typeof PurchaseOrderStatusEnum)[keyof typeof PurchaseOrderStatusEnum]["textValue"];

export const PurchaseOrderStatusOptions = Object.values(
  PurchaseOrderStatusEnum,
);
