import type { EnumType } from "@app/shared/types/enum.type";

export const BankAccountTypeEnum = {
	Savings: { value: 1, label: "Cuenta de Ahorro", stringValue: "Savings" },
	Checking: { value: 2, label: "Cuenta Corriente", stringValue: "Checking" },
} as const;

export type BankAccountTypeEnum =
	(typeof BankAccountTypeEnum)[keyof typeof BankAccountTypeEnum];

export const BankAccountTypeOptions: EnumType[] = Object.values(
	BankAccountTypeEnum,
).map((item) => ({
	value: item.stringValue,
	label: item.label,
}));

