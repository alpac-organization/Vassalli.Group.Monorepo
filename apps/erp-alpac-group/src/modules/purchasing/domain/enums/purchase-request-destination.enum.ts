import type { EnumType } from "@app/shared/types/enum.type";

type PurchaseRequestDestinationEnumType = EnumType & {
   textValue: string;
};

export const PurchaseRequestDestinationEnum = {
   Internal: { value: 0, label: "Administrativo", textValue: "Internal" },
   Client: { value: 1, label: "Cliente Externo", textValue: "Client" },
   ServiceOrder: { value: 2, label: "Orden de Servicio", textValue: "ServiceOrder" },
} as const satisfies Record<string, PurchaseRequestDestinationEnumType>;

export type PurchaseRequestDestinationEnum =
   (typeof PurchaseRequestDestinationEnum)[keyof typeof PurchaseRequestDestinationEnum];

export const PurchaseRequestDestinationOptions = Object.values(PurchaseRequestDestinationEnum);

export type PurchaseRequestDestinationType =
   (typeof PurchaseRequestDestinationEnum)[keyof typeof PurchaseRequestDestinationEnum]["textValue"];