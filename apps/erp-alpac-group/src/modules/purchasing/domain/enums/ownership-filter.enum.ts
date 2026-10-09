import type { EnumType } from "@app/shared/types/enum.type";

type OwnershipFilterEnumType = EnumType & {
	textValue: string;
};

export const OwnershipFilterEnum = {
	All: { value: 0, label: "Todas", textValue: "All" },
	Mine: { value: 1, label: "Mías", textValue: "Mine" },
	Others: { value: 2, label: "De otros", textValue: "Others" },
} as const satisfies Record<string, OwnershipFilterEnumType>;

export type OwnershipFilterEnum =
	(typeof OwnershipFilterEnum)[keyof typeof OwnershipFilterEnum];

export const OwnershipFilterOptions = Object.values(OwnershipFilterEnum);

export type OwnershipFilterValue =
	(typeof OwnershipFilterEnum)[keyof typeof OwnershipFilterEnum]["value"];
