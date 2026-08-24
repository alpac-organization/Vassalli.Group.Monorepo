import type { EnumType } from "@app/shared/types/enum.type";

export const IdentificationTypeEnum = {
  Cedula: { value: 1, label: "Cédula" },
  Pasaporte: { value: 2, label: "Pasaporte" },
  CedulaResidencia: { value: 3, label: "Cédula de Residencia" },
  Ruc: { value: 4, label: "RUC" },
} as const satisfies Record<string, EnumType>;

export type IdentificationTypeEnum =
  (typeof IdentificationTypeEnum)[keyof typeof IdentificationTypeEnum];

export const IdentificationTypeOptions: EnumType[] =
  Object.values(IdentificationTypeEnum);
