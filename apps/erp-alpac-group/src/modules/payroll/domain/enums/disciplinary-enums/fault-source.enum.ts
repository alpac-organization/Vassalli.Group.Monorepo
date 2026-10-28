import type { EnumType } from "@app/shared/types/enum.type";

export const FaultSourceEnum: Record<string, EnumType> = {
  Manual: { value: 1, label: "Registro manual" },
  SystemEscalation: { value: 2, label: "Escalamiento por reincidencia" },
  BiometricClock: { value: 3, label: "Reloj biométrico" },
} as const;

export type FaultSourceEnum =
  (typeof FaultSourceEnum)[keyof typeof FaultSourceEnum];
