import type { EnumType } from "@app/shared/types/enum.type";

type ServiceOrderStatusEnumType = EnumType & {
   textValue: string;
};

export const ServiceOrderStatusEnum = {
   Pending: { value: 1, label: "Pendiente", textValue: "Pending" },
   InProgress: { value: 2, label: "En Progreso", textValue: "InProgress" },
   Completed: { value: 3, label: "Completada", textValue: "Completed" },
   Canceled: { value: 4, label: "Cancelada", textValue: "Canceled" },
} as const satisfies Record<string, ServiceOrderStatusEnumType>;

export type ServiceOrderStatusEnum =
   (typeof ServiceOrderStatusEnum)[keyof typeof ServiceOrderStatusEnum];

export type ServiceOrderStatusType =
   (typeof ServiceOrderStatusEnum)[keyof typeof ServiceOrderStatusEnum]["textValue"];

export const ServiceOrderStatusTypeOptions = Object.values(ServiceOrderStatusEnum);
