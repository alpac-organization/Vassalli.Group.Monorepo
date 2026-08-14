import type { EnumType } from '@app/shared/types/enum.type';

export const MachineryTypeEnum = {
    Forklift: { value: 1, label: 'Montacargas' },
    Crane: { value: 2, label: 'Grúa' },
    PalletJack: { value: 3, label: 'Transpaleta' },
    Conveyor: { value: 4, label: 'Transportador' },
    Other: { value: 5, label: 'Otro' }
} as const;

export type MachineryTypeKey = keyof typeof MachineryTypeEnum;

export const MachineryTypeOptions: EnumType[] = Object.values(MachineryTypeEnum);