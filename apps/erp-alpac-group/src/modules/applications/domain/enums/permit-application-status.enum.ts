import type { EnumType } from "@app/shared/types/enum.type";

export const PermitApplicationStatusEnum: Record<string, EnumType> = {
   Pending: { value: 1, label: "Pendiente" },
   Approved: { value: 2, label: "Aprobada" },
   Rejected: { value: 3, label: "Rechazada" },
   Cancelled: { value: 4, label: "Cancelada" },
} as const;

export type PermitApplicationStatusEnum = keyof typeof PermitApplicationStatusEnum;

export const PermitApplicationStatusOptions = Object.values(PermitApplicationStatusEnum);

export const PermitApplicationStatus = Object.keys(PermitApplicationStatusEnum).reduce((acc, key) => {
   acc[key] = key;
   return acc;
}, {} as Record<string, string>);