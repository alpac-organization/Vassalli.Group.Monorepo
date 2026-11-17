import type { EnumType } from "@app/shared/types/enum.type";

/**
 * Estados de una sanción disciplinaria.
 *
 * Ciclo: al registrar queda `Pending`; RRHH la procesa a `Applied` o `Cancelled`.
 *
 * @property Pending - Propuesta registrada; pendiente de aprobación RRHH.
 * @property Applied - Aplicada por RRHH (efectos definitivos).
 * @property Cancelled - Rechazada / cancelada (con motivo).
 */
export const SanctionStatusEnum = {
	Applied: { value: 1, label: "Aplicada" },
	Cancelled: { value: 2, label: "Cancelada" },
	Pending: { value: 3, label: "Pendiente" },
} as const satisfies Record<string, EnumType>;

export type SanctionStatusEnum = (typeof SanctionStatusEnum)[keyof typeof SanctionStatusEnum];

export type SanctionStatusEnumMap = keyof typeof SanctionStatusEnum;
