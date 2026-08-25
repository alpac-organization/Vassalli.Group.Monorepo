import type { EnumType } from "@app/shared/types/enum.type";

type ManagementReviewStatusEnumType = EnumType & {
  textValue: string;
};

export const ManagementReviewStatus = {
  Pending: {
    value: 1,
    label: "Pendiente",
    textValue: "Pending",
  },
  Approved: { value: 2, label: "Aprobado", textValue: "Approved" },
  Rejected: { value: 3, label: "Rechazado", textValue: "Rejected" },
} as const satisfies Record<string, ManagementReviewStatusEnumType>;

export type ManagementReviewStatus =
  (typeof ManagementReviewStatus)[keyof typeof ManagementReviewStatus];

export type managementReviewStatusType = ManagementReviewStatus["textValue"];

export const ManagementReviewStatusOptions = Object.values(
  ManagementReviewStatus,
).map((status) => ({
  label: status.label,
  value: status.textValue,
}));
