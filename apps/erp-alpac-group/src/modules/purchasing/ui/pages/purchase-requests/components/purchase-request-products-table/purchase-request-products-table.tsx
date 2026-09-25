import { Button } from "@alpac/design-system";
import { ChevronDown, ImagesIcon } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { extractPurchaseRequestItemImages } from "@app/modules/purchasing/ui/pages/purchase-requests/utils/purchase-request-item-images.utils";
import { viewImagesButtonClass } from "@app/modules/purchasing/ui/pages/purchase-requests/components/purchase-request-detail-modal/utils/styles.purchasing";
import type { PurchaseRequestProductsTableProps } from "./purchase-request-products-table.types";
import { useSupplier } from "@app/modules/purchasing/ui/hooks/supplier/useSupplier";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { PaymentMethodEnum } from "@app/core/enums/payment-method.enum";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { AnalyzedQuoteProductQuotations } from "@app/modules/management/ui/pages/analyzed-quotes/components/analyzed-quote-detail-modal/analyzed-quote-product-quotations";

const COLUMN_HEADERS = [
	"Producto",
	"Descripción",
	"Cantidad",
	"Unidad",
	"Categoría",
	"Justificación",
	"Imágenes",
] as const;

const mobileLabelClassName =
	"text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:hidden";
const cellValueClassName = "text-sm text-slate-700 dark:text-slate-200";
const cellValueMediumClassName = "text-sm font-medium text-slate-700 dark:text-slate-200";

const EmptyProductsMessage = ({ productsCount }: { productsCount: number }) => {
	if (productsCount > 0) return null;
	return (
		<div className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
			No hay productos registrados.
		</div>
	);
};

const resolvePaymentMethodLabel = (method?: string | number | null) => {
	if (!method) return "—";
	const found = Object.values(PaymentMethodEnum).find(
		(item) => item.stringValue === method || item.value === Number(method),
	);
	return found ? found.label : String(method);
};

const SupplierDetailField = ({ label, value }: { label: string; value?: string | null }) => (
	<div className="flex min-w-0 flex-col gap-0.5">
		<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
			{label}
		</span>
		<span className="wrap-break-words text-sm text-slate-700 dark:text-slate-200">
			{value?.trim() || "—"}
		</span>
	</div>
);

const SelectedSupplierDetails = ({ supplierId }: { supplierId: string }) => {
	const { companyId, moduleCode } = useUserStore();

	const { GetSupplierDetails } = useSupplier({
		supplierDetailFilters: {
			company_id: companyId,
			module_code: moduleCode,
			supplier_id: supplierId,
		},
	});

	const { data: supplierDetails, isFetching } = GetSupplierDetails;
	const details = supplierDetails?.supplier_details;

	if (isFetching && !supplierDetails) {
		return (
			<div className="border-t border-slate-100 bg-slate-50/80 px-3 py-3 text-sm text-slate-500 dark:border-neutral-700 dark:bg-neutral-900/40 dark:text-slate-400">
				Cargando detalle del proveedor...
			</div>
		);
	}

	if (!supplierDetails || !details) return null;

	const supplierName = supplierDetails.supplier_legal_name?.trim() || "Proveedor";
	const paymentModality = details.has_credit
		? `Crédito (${details.credit_days ?? 0} días)`
		: "Contado";
	const creditCurrency = details.credit_currency === "NIO" ? "NIO" : "USD";
	const creditLimit =
		details.credit_limit != null
			? formatCurrency(details.credit_limit, creditCurrency)
			: "Sin límite fijado";
	const primaryAccount =
		supplierDetails.bank_accounts?.find((account) => account.is_primary) ??
		supplierDetails.bank_accounts?.[0];

	return (
		<div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/80 px-3 py-3 dark:border-neutral-700 dark:bg-neutral-900/40">
			<div className="flex flex-wrap items-center gap-2">
				<p className="m-0 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
					Detalle del Proveedor Seleccionado
				</p>
				<span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
					{supplierName}
				</span>
			</div>

			<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
				<SupplierDetailField
					label="Razón Social"
					value={supplierDetails.supplier_legal_name}
				/>
				<SupplierDetailField
					label="Nombre comercial"
					value={supplierDetails.commercial_name}
				/>
				<SupplierDetailField
					label="Identificación"
					value={
						[supplierDetails.identification_type, supplierDetails.identification_number]
							.filter(Boolean)
							.join(" · ") || null
					}
				/>
				<SupplierDetailField label="Contacto" value={details.contact_name} />
				<SupplierDetailField label="Teléfono" value={details.contact_phone_number} />
				<SupplierDetailField label="Correo" value={details.contact_email} />
				<SupplierDetailField label="Correo de soporte" value={details.email_support} />
				<SupplierDetailField label="Modalidad de pago" value={paymentModality} />
				<SupplierDetailField
					label="Método de pago"
					value={resolvePaymentMethodLabel(details.preferred_payment_method)}
				/>
				{details.has_credit ? (
					<SupplierDetailField label="Límite de crédito" value={creditLimit} />
				) : null}
				<SupplierDetailField label="Dirección" value={details.address} />
				{primaryAccount ? (
					<SupplierDetailField
						label="Cuenta bancaria"
						value={`${primaryAccount.bank_name} · ${primaryAccount.account_number}`}
					/>
				) : null}
			</div>
		</div>
	);
};

const getAcceptedSupplierId = (product: PurchaseRequestProductInformation) =>
	product.quotations?.find((quote) => quote.is_accepted_for_purchase)?.supplier_id;

type ProductRowGridProps = {
	product: PurchaseRequestProductInformation;
	productName: string;
	productImages: ReturnType<typeof extractPurchaseRequestItemImages>;
	onViewImages: PurchaseRequestProductsTableProps["onViewImages"];
};

const ProductRowGrid = ({
	product,
	productName,
	productImages,
	onViewImages,
}: ProductRowGridProps) => (
	<div className="grid min-w-0 flex-1 grid-cols-1 gap-6 sm:grid-cols-7 sm:items-center">
		<span className={mobileLabelClassName}>Producto</span>
		<span className={cellValueMediumClassName}>
			{product.product_details.product_name?.trim() || "—"}
		</span>

		<span className={mobileLabelClassName}>Descripción</span>
		<span className={cellValueClassName}>{product.description?.trim() || "—"}</span>

		<span className={mobileLabelClassName}>Cantidad</span>
		<span className={cellValueClassName}>
			{product.quantity}
			{product.quantity_unit != null ? ` × ${product.quantity_unit}` : ""}
		</span>

		<span className={mobileLabelClassName}>Unidad</span>
		<span className={cellValueClassName}>
			{product.unit_measure_information.name?.trim() ||
				product.unit_measure_information.symbol?.trim() ||
				"—"}
		</span>

		<span className={mobileLabelClassName}>Categoría</span>
		<span className={cellValueClassName}>
			{product.product_details.category_information.name?.trim() || "—"}
		</span>

		<span className={mobileLabelClassName}>Justificación</span>
		<span className={cellValueClassName}>{product.justification?.trim() || "—"}</span>

		<span className={mobileLabelClassName}>Imágenes</span>
		{productImages.length > 0 ? (
			<Button
				type="button"
				size="small"
				label="Ver imágenes"
				icon={<ImagesIcon size={16} />}
				className={viewImagesButtonClass}
				onClick={(event) => {
					event.stopPropagation();
					onViewImages({
						productName,
						images: productImages,
					});
				}}
			/>
		) : (
			<span className={cellValueClassName}>—</span>
		)}
	</div>
);

type ProductAccordionRowProps = {
	rowKey: string;
	product: PurchaseRequestProductInformation;
	productName: string;
	productImages: ReturnType<typeof extractPurchaseRequestItemImages>;
	acceptedSupplierId?: string;
	isOpen: boolean;
	onToggle: () => void;
	onViewImages: PurchaseRequestProductsTableProps["onViewImages"];
	onGenerateDocument: PurchaseRequestProductsTableProps["onGenerateDocument"];
};

const ProductAccordionRow = ({
	rowKey,
	product,
	productName,
	productImages,
	acceptedSupplierId,
	isOpen,
	onToggle,
	onViewImages,
	onGenerateDocument
}: ProductAccordionRowProps) => {
	const panelId = `${rowKey}-panel`;
	const triggerId = `${rowKey}-trigger`;

	const handleTriggerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			onToggle();
		}
	};

	return (
		<div className="flex flex-col">
			<div
				id={triggerId}
				role="button"
				tabIndex={0}
				aria-expanded={isOpen}
				aria-controls={panelId}
				onClick={onToggle}
				onKeyDown={handleTriggerKeyDown}
				className="flex w-full cursor-pointer items-start gap-2 px-3 py-3 text-left outline-none transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-600/25 focus-visible:ring-inset dark:hover:bg-white/5"
			>
				<ProductRowGrid
					product={product}
					productName={productName}
					productImages={productImages}
					onViewImages={onViewImages}
				/>
				<ChevronDown
					className={`mt-1 h-4 w-4 shrink-0 text-slate-500 transition-transform duration-280 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none dark:text-slate-400 ${isOpen ? "rotate-180" : "rotate-0"
						}`}
					aria-hidden
				/>
			</div>

			<div
				id={panelId}
				role="region"
				aria-labelledby={triggerId}
				aria-hidden={!isOpen}
				className={`grid overflow-hidden transition-[grid-template-rows] duration-280 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:duration-0 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
					}`}
			>
				<div className="min-h-0 overflow-hidden">
					<AnalyzedQuoteProductQuotations
						quotations={product.quotations ?? []}
						onGenerateDocument={onGenerateDocument}
					/>
					{acceptedSupplierId ? (
						<SelectedSupplierDetails
							supplierId={acceptedSupplierId}
						/>
					) : null}
				</div>
			</div>
		</div>
	);
};

export const PurchaseRequestProductsTable = ({
	products,
	onViewImages,
	onGenerateDocument
}: PurchaseRequestProductsTableProps) => {
	const [openRows, setOpenRows] = useState<Record<string, boolean>>({});

	const toggleRow = (rowKey: string) => {
		setOpenRows((current) => ({
			...current,
			[rowKey]: !current[rowKey],
		}));
	};

	return (
		<div className="overflow-hidden rounded-lg border border-slate-200 dark:border-neutral-700">
			<div className="hidden border-b border-slate-200 bg-slate-100 sm:grid sm:grid-cols-7 dark:border-neutral-700 dark:bg-neutral-800">
				{COLUMN_HEADERS.map((header) => (
					<div
						key={header}
						className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
					>
						{header}
					</div>
				))}
			</div>

			<div className="flex flex-col divide-y divide-slate-100 dark:divide-neutral-700">
				<EmptyProductsMessage productsCount={products.length} />
				{products.length > 0 &&
					products.map((product, index) => {
						const productImages = extractPurchaseRequestItemImages(
							product.additional_data,
						);
						const productName =
							product.product_details.product_name?.trim() || "producto";
						const acceptedSupplierId = getAcceptedSupplierId(product);
						const hasExpandableContent = Boolean(acceptedSupplierId);
						const rowKey = `${product?.purchase_request_item_id}-${product.product_details.product_id}-${index}`;

						if (!hasExpandableContent) {
							return (
								<div key={rowKey} className="px-3 py-3">
									<ProductRowGrid
										product={product}
										productName={productName}
										productImages={productImages}
										onViewImages={onViewImages}
									/>
								</div>
							);
						}

						return (
							<ProductAccordionRow
								key={rowKey}
								rowKey={rowKey}
								product={product}
								productName={productName}
								productImages={productImages}
								acceptedSupplierId={acceptedSupplierId}
								isOpen={Boolean(openRows[rowKey])}
								onToggle={() => toggleRow(rowKey)}
								onViewImages={onViewImages}
								onGenerateDocument={onGenerateDocument}
							/>
						);
					})}
			</div>
		</div>
	);
};
