import type { EnumType } from "@app/shared/types/enum.type";

type AccountingReviewStatusEnumType = EnumType & {
  textValue: string;
};

export const AccountingReviewStatus = {
  Pending: {
    value: 1,
    label: "Pendiente",
    textValue: "Pending",
  },
  Approved: { value: 2, label: "Aprobado", textValue: "Approved" },
  Rejected: { value: 3, label: "Rechazado", textValue: "Rejected" },
  Returned: { value: 4, label: "Retornada", textValue: "Returned" },
} as const satisfies Record<string, AccountingReviewStatusEnumType>;

export type AccountingReviewStatus =
  (typeof AccountingReviewStatus)[keyof typeof AccountingReviewStatus];

export type accountingReviewStatusType = AccountingReviewStatus["textValue"];

export const AccountingTypeOptions = Object.values(AccountingReviewStatus).map(
  (status) => ({
    label: status.label,
    value: status.textValue,
  }),
);
