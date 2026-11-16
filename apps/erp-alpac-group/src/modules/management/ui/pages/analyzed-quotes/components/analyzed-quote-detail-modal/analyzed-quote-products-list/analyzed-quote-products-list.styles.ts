export const COLUMN_HEADERS = [
	"Producto",
	"Descripción",
	"Cantidad",
	"Unidad",
	"Categoría",
	"Justificación",
	"Imágenes",
] as const;

export const mobileLabelClassName =
	"text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:hidden";

export const cellValueClassName =
	"min-w-0 wrap-break-words break-all text-sm text-slate-700 dark:text-slate-200";

export const cellValueMediumClassName =
	"min-w-0 wrap-break-words break-all text-sm font-medium text-slate-700 dark:text-slate-200";

export const accordionPanelTransition = {
	duration: 0.45,
	ease: [0.22, 1, 0.36, 1] as const,
};
