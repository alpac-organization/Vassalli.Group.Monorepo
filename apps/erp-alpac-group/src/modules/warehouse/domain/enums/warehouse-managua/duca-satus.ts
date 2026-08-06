import type { EnumType } from "@app/shared/types/enum.type";

const DucaRecord: Record<string, EnumType> = {
  Pending: { value: 3, label: "Pending" },
  Completed: { value: 4, label: "Completado" },
};

export const DucaStatusOptions: EnumType[] = Object.values(DucaRecord);

export type DucaStatusType = (typeof DucaRecord)[keyof typeof DucaRecord];
