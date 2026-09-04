import { useEffect, useState } from "react";
import { Button, Modal, RadioButton } from "@alpac/design-system";
import type { PurchaseOrderDocumentModalProps } from "./purchase-order-document-modal.types";
import {
	PaymentMethodEnum,
	PaymentMethodOptions,
} from "@app/modules/purchasing/domain/enums/payment-method.enum";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { useUserStore } from "@app/shared/stores/useUserStore";

export const PurchaseOrderDocumentModal = ({
	isOpen,
	onClose,
	purchaseOrderId,
}: PurchaseOrderDocumentModalProps) => {
	const { companyId, moduleCode } = useUserStore();
	const { GetPurchaseOrderDocument } = usePurchase();

	const [paymentMethod, setPaymentMethod] = useState<number>(
		PaymentMethodEnum.BankTransfer.value,
	);

	const isLoading = GetPurchaseOrderDocument.isPending;

	useEffect(() => {
		if (!isOpen) return;
		setPaymentMethod(PaymentMethodEnum.BankTransfer.value);
	}, [isOpen]);

	const handleGenerate = () => {
		GetPurchaseOrderDocument.mutate(
			{
				company_id: companyId,
				module_code: moduleCode,
				purchase_order_id: purchaseOrderId,
				payment_method: paymentMethod,
			},
			{
				onSuccess: (response) => {
					if (response?.document_url) {
						window.open(response.document_url, "_blank", "noopener,noreferrer");
					}
					onClose();
				},
			},
		);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			variant="form"
			size="lg"
			title="Generar documento"
			description="Seleccione el medio de pago para generar la solicitud del documento."
		>
			<div className="mt-4 flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<p className="m-0 text-sm font-medium text-slate-800 dark:text-white">
						Medio de pago
					</p>
					<div className="flex flex-wrap gap-4">
						{PaymentMethodOptions.map((option) => (
							<RadioButton
								key={option.value}
								label={option.label}
								name="payment-method"
								checked={paymentMethod === option.value}
								onChange={() => setPaymentMethod(option.value)}
							/>
						))}
					</div>
				</div>

				<div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
					<Button
						type="button"
						size="giant"
						label="Cancelar"
						onClick={onClose}
						disabled={isLoading}
						className="w-full! rounded-md! border! border-slate-400! bg-transparent! text-[15px]! text-slate-700! hover:bg-slate-100! dark:border-slate-500! dark:text-slate-200! dark:hover:bg-slate-700/40! sm:w-auto!"
					/>
					<Button
						type="button"
						size="giant"
						label="Generar documento"
						onClick={handleGenerate}
						isLoading={isLoading}
						className="w-full! rounded-md! bg-alpac-primary-500! text-[15px]! text-white! dark:bg-alpac-primary-700! sm:w-auto!"
					/>
				</div>
			</div>
		</Modal>
	);
};
