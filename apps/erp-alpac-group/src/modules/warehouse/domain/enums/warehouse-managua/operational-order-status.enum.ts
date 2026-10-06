import type { EnumType } from "@app/shared/types/enum.type";

export type OperationalOrderEnumType = EnumType & {
  textValue: string;
};

export const OperationalOrderStatusEnum = {
  PendingDocument: {
    value: 1,
    label: "Documento Pendiente",
    textValue: "PendingDocument",
  },
} as const satisfies Record<string, OperationalOrderEnumType>;

export type OperationalOrderStatusType =
  | (typeof OperationalOrderStatusEnum)[keyof typeof OperationalOrderStatusEnum]["textValue"]
  | string;

export const OperationalOrderStatusOptions: EnumType[] = Object.values(
  OperationalOrderStatusEnum,
);

export function getOperationalOrderStatusLabel(
  status: string | null | undefined,
): string {
  if (!status) return "—";

  const match = Object.values(OperationalOrderStatusEnum).find(
    (option) => option.textValue === status,
  );

  return match?.label ?? status;
}
