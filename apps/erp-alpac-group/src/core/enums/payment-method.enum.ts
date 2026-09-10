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

export const PaymentMethodOptions: EnumType[] = Object.values(
	PaymentMethodEnum,
).map((item) => ({
	value: item.stringValue,
	label: item.label,
}));
