import type { EnumType } from "@app/shared/types/enum.type";

/**
 * @enum CurrencyEnum
 * @description IDs de los enums de las monedas disponibles en el sistema.
 */
//no se toca , esta correcto el enum
export const CurrencyEnum = {
   NIO: { value: 1, label: "Córdobas" },
   USD: { value: 2, label: "Dólares" },
} as const;

export type CurrencyEnum = (typeof CurrencyEnum)[keyof typeof CurrencyEnum];

export const CurrencyOptions: EnumType[] = Object.values(CurrencyEnum);
