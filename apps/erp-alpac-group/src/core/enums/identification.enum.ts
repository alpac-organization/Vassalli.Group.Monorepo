import type { EnumType } from "@app/shared/types/enum.type";

export const IdentificationEnum = {
  NATIONAL_ID: { value: 1, label: "Cédula Nicaragüense", stringValue: "Cedula" },
  PASSPORT: { value: 2, label: "Pasaporte", stringValue: "Pasaporte" },
  RESIDENCE_ID: { value: 3, label: "Cédula de Residencia", stringValue: "CedulaResidencia" },
  RUC: { value: 4, label: "Registro Único de Contribuyente", stringValue: "Ruc" },
} as const;

export type IdentificationEnum =
  (typeof IdentificationEnum)[keyof typeof IdentificationEnum];

export const IdentificationOptions: EnumType[] = Object.values(
  IdentificationEnum,
).sort((a, b) => a.label.localeCompare(b.label));
