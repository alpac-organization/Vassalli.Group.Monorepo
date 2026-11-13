import type { EnumType } from "@app/shared/types/enum.type";

type CategoryTypeValues = EnumType & {
	textValue: string;
};

export const CategoryType = {
	Administrative: { value: 1, label: "Administrativo", textValue: "Administrative" },
	Operational: { value: 2, label: "Operacional", textValue: "Operational" },
} as const satisfies Record<string, CategoryTypeValues>;

export type CategoryType =
	(typeof CategoryType)[keyof typeof CategoryType]["textValue"];

export const CategoryTypeOptions = Object.values(CategoryType);
