import { useEffect, useMemo, useState } from "react";
import { Button, Dropdown, Modal, RadioButton } from "@alpac/design-system";
import { pdf } from "@react-pdf/renderer";
import type { PurchaseOrderDocumentModalProps } from "./purchase-order-document-modal.types";
import {
	PaymentMethodEnum as DocumentPaymentMethodEnum,
} from "@app/modules/purchasing/domain/enums/payment-method.enum";
import type { PaymentMethodType as DocumentPaymentMethodType } from "@app/modules/purchasing/domain/enums/payment-method.enum";
import {
	PaymentMethodEnum,
	PaymentMethodOptions,
} from "@app/core/enums/payment-method.enum";
import type { PaymentMethodType } from "@app/core/enums/payment-method.enum";
import { RoleEnum } from "@app/core/enums/role.enum";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { PaymentRequestPDF } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/payment-request-pdf/payment-request-pdf";
import { mapTransferRequestReportToPdf } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/payment-request-pdf/map-transfer-request-report-to-pdf";
import { useCatalog } from "@app/modules/catalog/ui/hooks/useCatalog";
import { CatalogEnum } from "@app/core/enums/catalog.enum";
import { mapCatalogToOptions } from "@app/shared/utils/catalog.utils";
import { warehouseHttpHandler } from "@app/core/adapters/axiosAdapter";
import { PurchaseServices } from "@app/modules/purchasing/infrastructure/services/purchase/PurchaseServices";

const purchaseServices = new PurchaseServices(warehouseHttpHandler);

const labelClassName = "text-black! dark:text-white!";
const dropdownClassName =
	"w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";

const defaultPaymentMethodValue = PaymentMethodEnum.ACH.stringValue;

const CAN_SELECT_BANK_ROLES: readonly string[] = [
	RoleEnum.ADMINISTRATOR,
	RoleEnum.SUPERVISOR,
];

export const PurchaseOrderDocumentModal = ({
	isOpen,
	onClose,
	purchaseOrderId,
	details,
}: PurchaseOrderDocumentModalProps) => {
	const { urlImage } = useCompanyStore();
	const { companyAlias, companyId, moduleCode, fullName, role, companyName } =
		useUserStore();

	const canSelectBank = CAN_SELECT_BANK_ROLES.includes(role);

	const [paymentMethod, setPaymentMethod] =
		useState<PaymentMethodType>(defaultPaymentMethodValue);
	const [selectedBankId, setSelectedBankId] = useState<number | string>("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { GetCatalogListQuery } = useCatalog({
		company_id: companyId,
		catalog_type_id: CatalogEnum.BANKS,
	});

	const bankOptions = useMemo(
		() => mapCatalogToOptions(GetCatalogListQuery.data ?? []),
		[GetCatalogListQuery.data],
	);

	const selectedBankName =
		bankOptions.find((option) => option.value === selectedBankId)?.label ??
		null;
	const hasSelectedBank = Boolean(selectedBankName);

	const branchNameForSeal =
		details?.purchase_request_details?.branch_information?.branch_name ??
		details?.purchase_request?.branch_information?.branch_name ??
		companyName;

	useEffect(() => {
		if (!isOpen) return;
		setSelectedBankId("");
		setPaymentMethod(defaultPaymentMethodValue);
		setErrorMessage(null);
	}, [isOpen]);

	const resolveDocumentType = (): DocumentPaymentMethodType => {
		if (paymentMethod === PaymentMethodEnum.Check.stringValue) {
			return DocumentPaymentMethodEnum.Check.textValue;
		}
		return DocumentPaymentMethodEnum.BankTransfer.textValue;
	};

	const handleGenerate = async () => {
		if (!purchaseOrderId.trim()) return;
		if (canSelectBank && !hasSelectedBank) {
			setErrorMessage("Seleccione un banco para continuar.");
			return;
		}

		try {
			setIsGenerating(true);
			setErrorMessage(null);

			const report = await purchaseServices.GetTransferRequestReport({
				company_id: companyId,
				module_code: moduleCode,
				purchase_order_id: purchaseOrderId,
			});

			const documentType = resolveDocumentType();
			const pdfData = mapTransferRequestReportToPdf({
				report,
				documentType,
				logoUrl: urlImage || null,
				companyNameFallback: companyAlias || companyName,
				bankName: canSelectBank ? selectedBankName : null,
				branchName: branchNameForSeal,
				generatedBy: fullName,
				generatedAt: new Date().toISOString(),
			});

			const blob = await pdf(<PaymentRequestPDF data={pdfData} />).toBlob();
			const url = URL.createObjectURL(blob);
			window.open(url, "_blank", "noopener,noreferrer");
			onClose();
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "No se pudo generar la solicitud de pago.";
			setErrorMessage(message);
		} finally {
			setIsGenerating(false);
		}
	};

	const canGenerate =
		Boolean(purchaseOrderId.trim()) &&
		(!canSelectBank || hasSelectedBank) &&
		!isGenerating;

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			variant="form"
			size="lg"
			title="Generar documento"
			description={
				canSelectBank
					? "Seleccione el medio de pago y el banco para generar la solicitud de pago"
					: "Seleccione el medio de pago para generar la solicitud de pago"
			}
		>
			<div className="mt-4 flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<p className="m-0 text-sm font-medium text-slate-800 dark:text-white">
						Medio de pago
					</p>
					<div className="flex flex-col gap-3">
						{PaymentMethodOptions.map((option) => (
							<RadioButton
								key={option.value}
								label={option.label}
								name="payment-method"
								checked={paymentMethod === option.value}
								onChange={() =>
									setPaymentMethod(option.value as PaymentMethodType)
								}
							/>
						))}
					</div>
				</div>

				{canSelectBank ? (
					<Dropdown
						label="Banco"
						isRequired
						placeholder={
							GetCatalogListQuery.isPending
								? "Cargando bancos..."
								: "Seleccione un banco"
						}
						appearance="dark"
						options={bankOptions}
						value={selectedBankId}
						onChange={(value) => {
							setSelectedBankId(value);
							if (errorMessage) setErrorMessage(null);
						}}
						className={dropdownClassName}
						labelClassName={labelClassName}
						valueClassName={labelClassName}
						disabled={
							GetCatalogListQuery.isPending || bankOptions.length === 0
						}
					/>
				) : (
					<p className="m-0 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[13px] text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
						La selección de banco está restringida a Supervisor y
						Administrador.
					</p>
				)}

				{errorMessage ? (
					<p className="m-0 text-[13px] text-red-500">{errorMessage}</p>
				) : null}

				<div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
					<Button
						type="button"
						size="giant"
						label="Cancelar"
						onClick={onClose}
						disabled={isGenerating}
						className="w-full! rounded-md! border! border-slate-400! bg-transparent! text-[15px]! text-slate-700! hover:bg-slate-100! dark:border-slate-500! dark:text-slate-200! dark:hover:bg-slate-700/40! sm:w-auto!"
					/>
					<Button
						type="button"
						size="giant"
						label="Generar documento"
						onClick={handleGenerate}
						isLoading={isGenerating}
						disabled={!canGenerate}
						className="w-full! rounded-md! bg-alpac-primary-500! text-[15px]! text-white! dark:bg-alpac-primary-700! sm:w-auto!"
					/>
				</div>
			</div>
		</Modal>
	);
};
