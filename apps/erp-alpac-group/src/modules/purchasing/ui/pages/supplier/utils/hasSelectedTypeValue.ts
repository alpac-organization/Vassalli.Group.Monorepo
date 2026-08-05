/**
 * Indica si un tipo (constitución / identificación) tiene un valor seleccionado
 * distinto de vacío, null o "Ninguno" (0).
 */
export const hasSelectedTypeValue = (value?: string | number | null): boolean =>
	value !== undefined && value !== null && Number(value) !== 0;
