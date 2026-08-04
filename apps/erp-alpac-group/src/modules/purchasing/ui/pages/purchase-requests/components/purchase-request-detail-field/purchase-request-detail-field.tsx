import type { ReactNode } from "react";

export const PurchaseRequestDetailField = ({
	label,
	value,
}: {
	label: string;
	value: ReactNode;
}) => (
	<div className="flex flex-col gap-1">
		<span className="text-[12px]! font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
			{label}
		</span>
		<div className="flex">
			{typeof value === "string" || value == null ? (
				<span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
					{(typeof value === "string" ? value?.trim() : "") || "—"}
				</span>
			) : (
				value
			)}
		</div>
	</div>
);
