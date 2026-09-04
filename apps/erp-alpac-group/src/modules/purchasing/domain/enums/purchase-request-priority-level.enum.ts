import type { EnumType } from "@app/shared/types/enum.type";

type PriorityLevelEnumType = EnumType & {
   textValue: string;
};

export const PriorityLevelEnum = {
   None: { value: 0, label: "Ninguna", textValue: "None" },
   Critical: { value: 1, label: "Critica", textValue: "Critical" },
   Unforeseen: { value: 2, label: "Imprevisto", textValue: "Unforeseen" },
   Normal: { value: 3, label: "Normal", textValue: "Normal" },
   PrintedStationery: { value: 4, label: "Papelería Impresa", textValue: "PrintedStationery" },
} as const satisfies Record<string, PriorityLevelEnumType>;

export type PriorityLevelEnum =
   (typeof PriorityLevelEnum)[keyof typeof PriorityLevelEnum];

export const PriorityLevelOptions = Object.values(PriorityLevelEnum);

export type PriorityLevelType =
   (typeof PriorityLevelEnum)[keyof typeof PriorityLevelEnum]["textValue"];