import type { EnumType } from "@app/shared/types/enum.type";

export type CoordinateEnumType = EnumType & {
  textValue: string;
};

export const CoordinateTargetTypeEnum = {
	LotsPositions: {
		value: 1,
		label: "Posiciones de tramos",
		textValue: "LotsPositions",
	},
	RackPositions: {
		value: 2,
		label: "Posiciones de racks",
		textValue: "RackPositions",
	},
} as const satisfies Record<string, CoordinateEnumType>;

export type CoordinateTypeEnum =
	(typeof CoordinateTargetTypeEnum)[keyof typeof CoordinateTargetTypeEnum];

export const CoordinateTypeOptions: EnumType[] = Object.values(CoordinateTargetTypeEnum);

export type CoordinateTypeValue =
	(typeof CoordinateTargetTypeEnum)[keyof typeof CoordinateTargetTypeEnum]["textValue"];
