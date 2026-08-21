import type { EnumType } from "@app/shared/types/enum.type";

export type RackEnumType = EnumType & {
  textValue: string;
};

export const RackUsageProfileEnum = {
  ActiveFlow: {
    value: 1,
    label: "Flujo activo",
    textValue: "ActiveFlow",
  },
  StaticHold: {
    value: 2,
    label: "Flujo estático",
    textValue: "StaticHold",
  },
} as const satisfies Record<string, RackEnumType>;

export type RackUsageProfileEnum =
  (typeof RackUsageProfileEnum)[keyof typeof RackUsageProfileEnum];

export const RackUsageProfileOptions: EnumType[] =
  Object.values(RackUsageProfileEnum);

export type RackUsageProfileValue =
  (typeof RackUsageProfileEnum)[keyof typeof RackUsageProfileEnum]["textValue"];
