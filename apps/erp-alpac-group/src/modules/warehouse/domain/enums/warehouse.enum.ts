import type { EnumType } from '@app/shared/types/enum.type';

export const WarehouseTypeEnum = {
    General: { value: 1, label: 'General' },
    Fiscal: { value: 2, label: 'Fiscal' },
    GaleronTechado: { value: 3, label: 'Galeron Techado' },
    PatioContenedores: { value: 4, label: 'Patio de Contenedores' },
    PredioAbierto: { value: 5, label: 'Predio Abierto' },
    Granel: { value: 6, label: 'Granel' }
} as const;

export type WarehouseTypeEnum =
    (typeof WarehouseTypeEnum)[keyof typeof WarehouseTypeEnum];

export const WarehouseTypeOptions: EnumType[] = Object.values(WarehouseTypeEnum).filter(
    (option) => option.value !== WarehouseTypeEnum.GaleronTechado.value
);
