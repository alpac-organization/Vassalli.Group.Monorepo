import type { EnumType } from "@app/shared/types/enum.type";

type PurchaseRequestDestinationEnumType = EnumType & {
	textValue: string;
};

export const PurchaseRequestDestinationEnum = {
	Internal: { value: 0, label: "Interno", textValue: "Internal" },
	External: { value: 1, label: "Externo", textValue: "External" },
} as const satisfies Record<string, PurchaseRequestDestinationEnumType>;

export type PurchaseRequestDestinationEnum =
	(typeof PurchaseRequestDestinationEnum)[keyof typeof PurchaseRequestDestinationEnum];

export const PurchaseRequestDestinationOptions = Object.values(
	PurchaseRequestDestinationEnum,
);

export type PurchaseRequestDestinationType =
	(typeof PurchaseRequestDestinationEnum)[keyof typeof PurchaseRequestDestinationEnum]["textValue"];
