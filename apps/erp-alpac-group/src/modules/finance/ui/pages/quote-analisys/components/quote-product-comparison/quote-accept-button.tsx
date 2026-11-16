import { Button } from "@alpac/design-system";
import type { accountingReviewStatusType } from "@app/modules/finance/domain/enum/analysis-quotation/accounting-review-status";

type QuoteAcceptButtonProps = {
	isSelected: boolean;
	isAccepting?: boolean;
	onAccept: () => void;
	accountingReviewStatus: accountingReviewStatusType;
};

export function QuoteAcceptButton({
	isSelected,
	isAccepting,
	onAccept,
	accountingReviewStatus,
}: QuoteAcceptButtonProps) {
	if (isSelected) {
		return (
			<Button
				type="button"
				size="small"
				label="Oferta seleccionada"
				disabled
				className="w-full! rounded-md! border! border-blue-500! bg-blue-600! dark:bg-alpac-primary-700! text-[13px]! text-white! opacity-100!"
			/>
		);
	}

	if (accountingReviewStatus !== "Pending") return null;

	return (
		<Button
			type="button"
			size="small"
			label="Aceptar esta oferta"
			onClick={onAccept}
			disabled={isAccepting}
			className="w-full! rounded-md! border! border-slate-400! bg-transparent! text-[13px]! text-slate-700! hover:bg-slate-100! dark:border-slate-500! dark:text-slate-200! dark:hover:bg-slate-700/40!"
		/>
	);
}
