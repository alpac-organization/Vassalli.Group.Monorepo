import type { EnumType } from "@app/shared/types/enum.type";

export const CurrencyEnum = {
   NIO: { value: 1, label: "Córdobas" },
   USD: { value: 2, label: "Dólares" },
} as const;

export type CurrencyEnum = (typeof CurrencyEnum)[keyof typeof CurrencyEnum];

export type CurrencyCode = keyof typeof CurrencyEnum;

export const CurrencyOptions: EnumType[] = Object.values(CurrencyEnum);

export const CurrencyCodeOptions: EnumType[] = (
	Object.keys(CurrencyEnum) as CurrencyCode[]
).map((code) => ({
	value: code,
	label: CurrencyEnum[code].label,
}));
