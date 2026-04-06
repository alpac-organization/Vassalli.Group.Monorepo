import type { EnumType } from "@app/shared/types/enum.type";

/**
 * @enum GenderEnum
 * @description IDs de los enums de los sexos disponibles en el sistema.
 */
export const GenderEnum = {
  MALE: { value: 1, label: "Masculino" },
  FEMALE: { value: 2, label: "Femenino" },
} as const;

export type GenderEnum = (typeof GenderEnum)[keyof typeof GenderEnum];

export const GenderOptions: EnumType[] = Object.values(GenderEnum);
