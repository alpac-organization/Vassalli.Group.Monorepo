import type { EnumType } from '@app/shared/types/enum.type';

/**
 * @enum CollaboratorStatusEnum
 * @description IDs de los enums de los estados de los colaboradores disponibles en el sistema.
 */
export const CollaboratorStatusEnum = {
  ACTIVE: { value: 1, label: 'Activo' },
  INACTIVE: { value: 2, label: 'Inactivo' },
  VACATION: { value: 3, label: 'Vacaciones' },
  SUBSIDY: { value: 4, label: 'Subsidio' },
  SUSPENDED: { value: 5, label: 'Suspendido' },
  TERMINATED: { value: 6, label: 'Terminado' },
  TESTING_PROCESS: { value: 7, label: 'Proceso de Prueba' },
} as const;

export type CollaboratorStatusEnum =
  (typeof CollaboratorStatusEnum)[keyof typeof CollaboratorStatusEnum];

export const CollaboratorStatusOptions: EnumType[] = Object.values(CollaboratorStatusEnum);
  