import type { EnumType } from "@app/shared/types/enum.type";

type PurchaseRequestEnumType = EnumType & {
  textValue: string;
};

export const PurchaseRequestEnum = {
  Requisition: { value: 1, label: "Requisición", textValue: "Requisition" },
  Eventual: { value: 2, label: "Eventual", textValue: "Eventual" },
  Monthly: { value: 3, label: "Mensual", textValue: "Monthly" },
} as const satisfies Record<string, PurchaseRequestEnumType>;

export type PurchaseRequestEnum =
  (typeof PurchaseRequestEnum)[keyof typeof PurchaseRequestEnum];
export type PurchaseRequestType =
  (typeof PurchaseRequestEnum)[keyof typeof PurchaseRequestEnum]["textValue"];

export const PurchaseRequestTypeOptions = Object.values(PurchaseRequestEnum);
