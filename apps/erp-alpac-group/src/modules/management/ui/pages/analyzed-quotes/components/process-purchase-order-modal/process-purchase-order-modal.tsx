import { useEffect, useState } from "react";
import { Button, Modal, RadioButton, Textarea } from "@alpac/design-system";
import type { ProcessPurchaseOrderModalProps } from "./process-purchase-order-modal.types";
import { ManagementReviewStatus } from "@app/modules/management/domain/enum/management-review-status";
import { useUserStore } from "@app/shared/stores/useUserStore";

const textareaClassName =
	"w-full! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500! dark:text-white!";
const textareaLabelClassName = "text-black! dark:text-white!";

export function ProcessPurchaseOrderModal({
	isOpen,
	isSubmitting,
	requisitionManagementReview,
	onClose,
	onConfirm,
}: ProcessPurchaseOrderModalProps) {

	const { companyId, moduleCode } = useUserStore();

	const [comments, setComments] = useState("");
	const [isApproved, setIsApproved] = useState(true);

	useEffect(() => {
		if (!isOpen) return;
		setComments("");
		setIsApproved(true);
	}, [isOpen]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			variant="form"
			size="lg"
			title="¿Aprobar está cotización?"
			description={`Apruebe o Rechaze la cotizació. El comentario es opcional.`}
		>
			<div className="mt-4 flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<p className="m-0 text-sm font-medium text-slate-800 dark:text-white">
						Decisión
					</p>
					<div className="flex flex-wrap gap-4">
						<RadioButton
							label="Aprobar"
							name="review-decision"
							value="approved"
							checked={isApproved}
							onChange={() => setIsApproved(true)}
						/>
						<RadioButton
							label="Rechazar"
							name="review-decision"
							value="rejected"
							checked={!isApproved}
							onChange={() => setIsApproved(false)}
						/>
					</div>
				</div>

				<Textarea
					label="Comentarios"
					placeholder="Escriba un comentario (opcional)..."
					className={textareaClassName}
					labelClassName={textareaLabelClassName}
					value={comments}
					onChange={(e) => setComments(e.target.value)}
					maxLength={500}
					enableCharacterCount
					style={{
						resize: "none",
						minHeight: "100px",
					}}
				/>

				<div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
					<Button
						type="button"
						size="giant"
						label="Cancelar"
						onClick={onClose}
						disabled={isSubmitting}
						className="w-full! rounded-md! border! border-slate-400! bg-transparent! text-[15px]! text-slate-700! hover:bg-slate-100! dark:border-slate-500! dark:text-slate-200! dark:hover:bg-slate-700/40! sm:w-auto!"
					/>
					<Button
						type="button"
						size="giant"
						label="Procesar"
						onClick={() =>
							onConfirm({
								company_id: companyId,
								module_code: moduleCode,
								comments: comments?.trim() || undefined,
								requisition_management_review_id:
									requisitionManagementReview.purchase_requests_reviewed_management_id,
								new_status: isApproved
									? ManagementReviewStatus.Approved.value
									: ManagementReviewStatus.Rejected.value,
							})
						}
						isLoading={isSubmitting}
						className="w-full! rounded-md! bg-alpac-primary-500! text-[15px]! text-white! dark:bg-alpac-primary-700! sm:w-auto!"
					/>
				</div>
			</div>
		</Modal>
	);
}
