import type { EnumType } from "@app/shared/types/enum.type";

/**
 * Estados de una falta disciplinaria.
 *
 * @property Open - Pendiente de sanción.
 * @property SanctionApplied - Sanción aplicada sobre la falta.
 * @property Prescribed - Prescrita (ya no sancionable).
 * @property Cancelled - Anulada (soft-delete + motivo).
 */
export const FaultStatusEnum = {
	Open: { value: 1, label: "Pendiente de sanción" },
	SanctionApplied: { value: 2, label: "Sanción aplicada" },
	Prescribed: { value: 3, label: "Prescrita" },
	Cancelled: { value: 4, label: "Cancelada" },
} as const satisfies Record<string, EnumType>;

export type FaultStatusEnum = (typeof FaultStatusEnum)[keyof typeof FaultStatusEnum];

export type FaultStatusEnumMap = keyof typeof FaultStatusEnum;
