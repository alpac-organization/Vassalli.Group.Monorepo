import type { EnumType } from "@app/shared/types/enum.type";

export type WarehouseEnumType = EnumType & {
	textValue: string;
};

export const WarehouseTypeEnum = {
	Fiscal: { value: 1, label: "Fiscal", textValue: "Fiscal" },
	Granel: { value: 2, label: "Granel", textValue: "Granel" },
	Nationalized: { value: 3, label: "Nacionalizada", textValue: "Nationalized" },
} as const satisfies Record<string, WarehouseEnumType>;

export type WarehouseTypeEnum =
	(typeof WarehouseTypeEnum)[keyof typeof WarehouseTypeEnum];

export const WarehouseTypeOptions: EnumType[] = Object.values(WarehouseTypeEnum);

export type WarehouseTypeValue =
	(typeof WarehouseTypeEnum)[keyof typeof WarehouseTypeEnum]["textValue"];

export function getWarehouseTypeLabel(warehouseType: string | null | undefined): string {
	if (!warehouseType) return "—";

	const match = Object.values(WarehouseTypeEnum)
		.find((option) => option.textValue === warehouseType);

	return match?.label ?? warehouseType;
}
