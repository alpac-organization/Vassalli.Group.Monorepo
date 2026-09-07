import type { EnumType } from "@app/shared/types/enum.type";

type PaymentMethodEnumType = EnumType & {
  textValue: string;
};

export const PaymentMethodEnum = {
  BankTransfer: { value: 1, label: "Transferencia", textValue: "BankTransfer" },
  Check: { value: 2, label: "Cheque", textValue: "Check" },
} as const satisfies Record<string, PaymentMethodEnumType>;

export type PaymentMethodEnum =
  (typeof PaymentMethodEnum)[keyof typeof PaymentMethodEnum];

export type PaymentMethodType = PaymentMethodEnum["textValue"];

export const PaymentMethodOptions = Object.values(PaymentMethodEnum);
