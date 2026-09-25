import { useEffect, useMemo, useState } from "react";
import { Button, Dropdown, Modal, RadioButton } from "@alpac/design-system";
import { pdf } from "@react-pdf/renderer";
import type { PurchaseOrderDocumentModalProps } from "./purchase-order-document-modal.types";
import {
	PaymentMethodEnum,
	PaymentMethodOptions,
} from "@app/modules/purchasing/domain/enums/payment-method.enum";
import type { PaymentMethodType } from "@app/modules/purchasing/domain/enums/payment-method.enum";
import { PaymentMethodEnum as SupplierPaymentMethodEnum } from "@app/core/enums/payment-method.enum";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { PaymentRequestPDF } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/payment-request-pdf/payment-request-pdf";
import { mapPurchaseOrderToPaymentRequestPdf } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/payment-request-pdf/map-payment-request-from-purchase-order";
import { useCatalog } from "@app/modules/catalog/ui/hooks/useCatalog";
import { CatalogEnum } from "@app/core/enums/catalog.enum";
import { mapCatalogToOptions } from "@app/shared/utils/catalog.utils";
import { useSupplier } from "@app/modules/purchasing/ui/hooks/supplier/useSupplier";

const labelClassName = "text-black! dark:text-white!";
const dropdownClassName =
	"w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";

const defaultPaymentMethodValue = PaymentMethodOptions[0]?.value ?? PaymentMethodEnum.BankTransfer.value;

const resolveDocumentPaymentMethodFromSupplier = (
	preferredPaymentMethod?: string | number | null,
): number => {
	if (preferredPaymentMethod == null || preferredPaymentMethod === "") {
		return defaultPaymentMethodValue;
	}

	const normalized = String(preferredPaymentMethod).trim().toLowerCase();
	const checkValues = [
		String(SupplierPaymentMethodEnum.Check.stringValue).toLowerCase(),
		String(SupplierPaymentMethodEnum.Check.value),
		"check",
		"cheque",
	];

	if (checkValues.includes(normalized)) {
		return PaymentMethodEnum.Check.value;
	}

	return PaymentMethodEnum.BankTransfer.value;
};

export const PurchaseOrderDocumentModal = ({
	isOpen,
	onClose,
	details,
	products = [],
}: PurchaseOrderDocumentModalProps) => {
	const { urlImage } = useCompanyStore();
	const { companyAlias, companyId, moduleCode } = useUserStore();

	const [paymentMethod, setPaymentMethod] = useState<number>(defaultPaymentMethodValue);
	const [selectedBankId, setSelectedBankId] = useState<number | string>("");
	const [isGenerating, setIsGenerating] = useState(false);

	const acceptedSupplierId = useMemo(() => {
		const acceptedQuote = products
			.flatMap((product) => product.quotations ?? [])
			.find((quote) => quote.is_accepted_for_purchase);
		return acceptedQuote?.supplier_id?.trim() || null;
	}, [products]);

	const { GetSupplierDetails } = useSupplier({
		supplierDetailFilters:
			isOpen && acceptedSupplierId
				? {
						company_id: companyId,
						module_code: moduleCode,
						supplier_id: acceptedSupplierId,
					}
				: undefined,
	});

	const { GetCatalogListQuery } = useCatalog({
		company_id: companyId,
		catalog_type_id: CatalogEnum.BANKS,
	});

	const bankOptions = useMemo(
		() => mapCatalogToOptions(GetCatalogListQuery.data ?? []),
		[GetCatalogListQuery.data],
	);

	const selectedBankName =
		bankOptions.find((option) => option.value === selectedBankId)?.label ?? null;
	const hasSelectedBank = Boolean(selectedBankName);

	const supplierPreferredPaymentMethod =
		GetSupplierDetails.data?.supplier_details?.preferred_payment_method;

	useEffect(() => {
		if (!isOpen) return;
		setSelectedBankId("");
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;

		if (!acceptedSupplierId) {
			setPaymentMethod(defaultPaymentMethodValue);
			return;
		}

		if (GetSupplierDetails.isPending || GetSupplierDetails.isFetching) return;

		setPaymentMethod(
			resolveDocumentPaymentMethodFromSupplier(supplierPreferredPaymentMethod),
		);
	}, [
		isOpen,
		acceptedSupplierId,
		supplierPreferredPaymentMethod,
		GetSupplierDetails.isFetching,
		GetSupplierDetails.isPending,
	]);

	const resolveDocumentType = (): PaymentMethodType => {
		if (paymentMethod === PaymentMethodEnum.Check.value) {
			return PaymentMethodEnum.Check.textValue;
		}
		return PaymentMethodEnum.BankTransfer.textValue;
	};

	const handleGenerate = async () => {
		if (!details || !hasSelectedBank) return;

		try {
			setIsGenerating(true);

			const documentType = resolveDocumentType();
			const pdfData = mapPurchaseOrderToPaymentRequestPdf({
				documentType,
				details,
				products,
				logoUrl: urlImage || null,
				companyName: companyAlias,
				bankName: selectedBankName,
			});

			const blob = await pdf(<PaymentRequestPDF data={pdfData} />).toBlob();
			const url = URL.createObjectURL(blob);
			window.open(url, "_blank", "noopener,noreferrer");
			onClose();
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			variant="form"
			size="lg"
			title="Generar documento"
			description="Seleccione el medio de pago y el banco para generar la solicitud de transferencia o cheque."
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
					onChange={(value) => setSelectedBankId(value)}
					className={dropdownClassName}
					labelClassName={labelClassName}
					valueClassName={labelClassName}
					disabled={GetCatalogListQuery.isPending || bankOptions.length === 0}
				/>

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
						disabled={!details || !hasSelectedBank}
						className="w-full! rounded-md! bg-alpac-primary-500! text-[15px]! text-white! dark:bg-alpac-primary-700! sm:w-auto!"
					/>
				</div>
			</div>
		</Modal>
	);
};
