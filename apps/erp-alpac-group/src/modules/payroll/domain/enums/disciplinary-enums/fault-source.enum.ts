import type { EnumType } from "@app/shared/types/enum.type";

export const FaultSourceEnum = {
  Manual: { value: 1, label: "Registro manual" },
  SystemEscalation: { value: 2, label: "Escalamiento por reincidencia" },
  BiometricClock: { value: 3, label: "Reloj biométrico" },
} as const satisfies Record<string, EnumType>;

export type FaultSourceEnum = (typeof FaultSourceEnum)[keyof typeof FaultSourceEnum];

export const FaultSourceOptions: EnumType[] = Object.values(FaultSourceEnum);

export type FaultSourceEnumMap = keyof typeof FaultSourceEnum;
