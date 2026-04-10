import type { EnumType } from '@app/shared/types/enum.type';

/**
 * @enum CollaboratorStatusEnum
 * @description IDs de los enums de los estados de los colaboradores disponibles en el sistema.
 */
export const CollaboratorStatusEnum: Record<string, EnumType> = {
   Active: { value: 1, label: 'Activo' },
   Inactive: { value: 2, label: 'Inactivo' },
   Vacation: { value: 3, label: 'Vacaciones' },
   Subsidy: { value: 4, label: 'Subsidio' },
   Suspended: { value: 5, label: 'Suspendido' },
   Terminated: { value: 6, label: 'Terminado' },
   TestingProcess: { value: 7, label: 'Proceso de Prueba' },
} as const;

export type CollaboratorStatusEnum =
   (typeof CollaboratorStatusEnum)[keyof typeof CollaboratorStatusEnum];

export const CollaboratorStatusOptions: EnumType[] = Object.values(CollaboratorStatusEnum);

export const CollaboratorStatusBadgeColor: Record<CollaboratorStatusEnum['value'], string> = {
   Active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
   Inactive: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
   Vacation: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
   Subsidy: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
   Suspended: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200',
   Terminated: 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-200',
   TestingProcess: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200',
} as const;
