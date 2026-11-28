import type { EnumType } from "@app/shared/types/enum.type";

export const TerminationTypeEnum = {
  VoluntaryResignation: { value: 1, label: "Renuncia voluntaria" },
  MutualAgreement: { value: 2, label: "Mutuo acuerdo" },
  JustifiedDismissal: { value: 3, label: "Despido justificado" },
  UnjustifiedDismissal: { value: 4, label: "Despido injustificado" },
  ContractExpiration: { value: 5, label: "Vencimiento de contrato" },
  WorkCompletion: { value: 6, label: "Conclusión de obra o servicio" },
  EmployeeDeath: { value: 7, label: "Fallecimiento" },
  Retirement: { value: 8, label: "Jubilación" },
} as const satisfies Record<string, EnumType>;

export type TerminationTypeEnum =
  (typeof TerminationTypeEnum)[keyof typeof TerminationTypeEnum];

export type TerminationTypeEnumMap = keyof typeof TerminationTypeEnum;
