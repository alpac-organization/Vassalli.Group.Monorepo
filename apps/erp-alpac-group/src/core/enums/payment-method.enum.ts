import type { EnumType } from "@app/shared/types/enum.type";

export const PaymentMethodEnum = {
	ACH: { value: 1, label: "Transferencia ACH", stringValue: "ACH", description: "Transferencia electrónica interbancaria" },
	LocalTransfer: { value: 2, label: "Transferencia Local", stringValue: "LocalTransfer", description: "Transferencia entre cuentas del mismo banco" },
	Check: { value: 3, label: "Cheque", stringValue: "Check", description: "Emisión de cheque corporativo" },
	Cash: { value: 4, label: "Efectivo / Caja Chica", stringValue: "Cash", description: "Pago en efectivo en caja" },
	InternationalWire: { value: 5, label: "Transferencia Internacional", stringValue: "InternationalWire", description: "Giro o transferencia bancaria al exterior" },
} as const;

export type PaymentMethodEnum =
	(typeof PaymentMethodEnum)[keyof typeof PaymentMethodEnum];
export type PaymentMethodType = PaymentMethodEnum["stringValue"];

export const PaymentMethodOptions: EnumType[] = Object.values(
	PaymentMethodEnum,
).map((item) => ({
	value: item.stringValue,
	label: item.label,
}));



export const PaymentConditionEnum = {
	Credit: { value: 1, label: "Credito", stringValue: "Credit" },
	Cash: { value: 2, label: "Efectivo", stringValue: "Cash" },
} as const;

export type PaymentConditionTypeEnum =
	(typeof PaymentConditionEnum)[keyof typeof PaymentConditionEnum];
export type PaymentConditionType = PaymentConditionTypeEnum["stringValue"];