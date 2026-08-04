export function getConstitutionTypeBadgeColor(constitutionType: string): string {
	switch (constitutionType) {
		case "Natural":
			return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200";

		case "Legal":
			return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200";

		default:
			return "bg-slate-100 text-slate-800";
	}
}
