import type { EnumType } from "@app/shared/types/enum.type";


export const TransportUnit: Record<string, EnumType> = {
  Container: { value: 1, label: "Contenedor" },
  Van: { value: 2, label: "Camión" },
};

export const TransportUnitOptions: EnumType[] = Object.values(TransportUnit);

export type TransportUnitType = (typeof TransportUnit)[keyof typeof TransportUnit];