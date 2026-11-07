import type { ProductUsageType } from "@app/core/enums/product-usage-type.enum";
import type { EnumType } from "@app/shared/types/enum.type";

type PurchaseRequestDestinationEnumType = EnumType & {
	textValue: string;
};

export const PurchaseRequestDestinationEnum = {
	Internal: { value: 0, label: "Administrativo", textValue: "Internal" },
	Client: { value: 1, label: "Externo", textValue: "External" },
	ServiceOrder: { value: 2, label: "Operacional", textValue: "ServiceOrder" },
} as const satisfies Record<string, PurchaseRequestDestinationEnumType>;

export type PurchaseRequestDestinationEnum =
	(typeof PurchaseRequestDestinationEnum)[keyof typeof PurchaseRequestDestinationEnum];

export const PurchaseRequestDestinationOptions = Object.values(
	PurchaseRequestDestinationEnum,
);

export type PurchaseRequestDestinationType =
	(typeof PurchaseRequestDestinationEnum)[keyof typeof PurchaseRequestDestinationEnum]["textValue"];

const productUsageTypeByDestination = {
	Internal: "Administrative",
	ServiceOrder: "Operational",
} as const satisfies Partial<Record<PurchaseRequestDestinationType, ProductUsageType>>;

export const getProductUsageTypeByDestination = (
	destination: string | null | undefined,
): ProductUsageType | undefined => {
	if (destination === "Internal" || destination === "ServiceOrder") {
		return productUsageTypeByDestination[destination];
	}

	return undefined;
};
