export const sectionTitleClassName =
	"m-0 pb-2 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-200 border-b border-slate-200 dark:border-neutral-600";

export function formatLotMetric(
	value: number | string | null | undefined,
	suffix = "",
): string {
	if (value === null || value === undefined || value === "") return "—";

	const numeric = typeof value === "number" ? value : Number(value);
	if (Number.isNaN(numeric)) return "—";

	const formatted = new Intl.NumberFormat("en-US", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(numeric);

	return suffix ? `${formatted} ${suffix}` : formatted;
}

export function formatLotBoolean(value: boolean | null | undefined): string {
	if (value === null || value === undefined) return "—";
	return value ? "Sí" : "No";
}
