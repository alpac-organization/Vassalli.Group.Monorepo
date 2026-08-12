import type { EnumType } from "@app/shared/types/enum.type";

export const DucaRecord: Record<string, EnumType> = {
  Pending: { value: 1, label: "Pendiente" },
  Completed: { value: 2, label: "Completado" },
};

export const DucaStatusOptions: EnumType[] = Object.values(DucaRecord);

export type DucaStatusType = (typeof DucaRecord)[keyof typeof DucaRecord];
