import { Badges } from "@alpac/design-system";
import { AlertCircle } from "lucide-react";

export function AlertedMerchandiseBadge() {
	return (
		<div className="absolute top-0 right-0 z-10 flex max-w-[min(100%,9.5rem)] items-center sm:max-w-none">
			<Badges
				label="Mercadería Alertada"
				color="danger"
				childIcon={AlertCircle}
				className="gap-1! sm:gap-1.5! bg-red-100! text-red-800! border border-red-200! dark:bg-red-900/40! dark:text-red-200! dark:border-red-800! w-fit! max-w-full! px-2! py-0.5! sm:px-3! sm:py-1! text-[11px]! sm:text-sm! font-semibold! leading-tight! whitespace-normal! sm:whitespace-nowrap!"
			/>
		</div>
	);
}
