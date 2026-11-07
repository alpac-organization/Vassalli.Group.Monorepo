import { Badges } from "@alpac/design-system";
import { m } from "framer-motion";
import { ChevronDown, Package } from "lucide-react";
import { type KeyboardEvent } from "react";
import type { PurchaseOrderDetailItem } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-order-details-response";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { resolvePaymentMethodLabel } from "@app/modules/purchasing/domain/utils/quotation-label.utils";
import {
	formatPurchaseOrderReportMoney,
	resolveAcceptedQuoteCurrency,
} from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/utils/resolve-purchase-order-report-currency";

type PurchaseOrderItemAccordionRowProps = {
	item: PurchaseOrderDetailItem;
	isOpen: boolean;
	onToggle: () => void;
	requestProduct?: PurchaseRequestProductInformation;
};

const emptyCell = "—";

const accordionPanelTransition = {
	duration: 0.45,
	ease: [0.22, 1, 0.36, 1] as const,
};

const formatQuantity = (value: number) =>
	new Intl.NumberFormat("es-NI", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(value ?? 0);

const QuoteField = ({
	label,
	value,
	emphasize,
}: {
	label: string;
	value: string;
	emphasize?: boolean;
}) => (
	<div className="flex min-w-0 flex-col gap-0.5">
		<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
			{label}
		</span>
		<span
			className={`min-w-0 max-w-full whitespace-normal [overflow-wrap:anywhere] text-sm ${
				emphasize
					? "font-semibold text-slate-800 dark:text-slate-100"
					: "text-slate-700 dark:text-slate-200"
			}`}
		>
			{value}
		</span>
	</div>
);

export const PurchaseOrderItemAccordionRow = ({
	item,
	isOpen,
	onToggle,
	requestProduct,
}: PurchaseOrderItemAccordionRowProps) => {
	const quotation = item.quotation;
	const productName = item.product_name?.trim() || emptyCell;
	const productCode = item.product_code?.trim() || emptyCell;
	const isAccepted = quotation?.is_accepted_for_purchase === true;
	const supplierName =
		quotation?.supplier_information?.suppliers_legal_name?.trim() || emptyCell;
	const identificationNumber =
		quotation?.supplier_information?.identification_number?.trim() || emptyCell;
	const identificationType =
		quotation?.supplier_information?.identification_type?.trim() || emptyCell;
	const paymentMethodLabel = resolvePaymentMethodLabel(
		quotation?.payment_method_type,
	);
	const currency = resolveAcceptedQuoteCurrency(requestProduct);
	const unitPrice = formatPurchaseOrderReportMoney(
		item.unit_price ?? quotation?.price_unit ?? 0,
		currency,
	);
	const totalPrice = formatPurchaseOrderReportMoney(
		quotation?.price_total ?? 0,
		currency,
	);

	const rowKey = item.purchase_order_item_id;
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
				className="flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-left outline-none transition-colors duration-200 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-600/25 focus-visible:ring-inset dark:hover:bg-white/5"
			>
				<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-600 ring-1 ring-slate-200 dark:text-slate-300 dark:ring-neutral-600">
					<Package size={18} aria-hidden />
				</span>

				<div className="flex min-w-0 flex-1 flex-col gap-1">
					<p className="m-0 min-w-0 whitespace-normal [overflow-wrap:anywhere] text-sm font-medium text-slate-800 dark:text-slate-100">
						{productName}
					</p>
					<div className="flex flex-wrap items-center gap-2">
						<span className="min-w-0 whitespace-normal [overflow-wrap:anywhere] text-xs text-slate-500 dark:text-slate-400">
							{productCode}
						</span>
						<span className="text-xs text-slate-500 dark:text-slate-400">
							· Cantidad {formatQuantity(item.quantity)}
						</span>
						{isAccepted ? (
							<Badges
								label="Aceptada"
								color="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
							/>
						) : null}
					</div>
				</div>

				<ChevronDown
					className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none dark:text-slate-400 ${
						isOpen ? "rotate-180" : "rotate-0"
					}`}
					aria-hidden
				/>
			</div>

			<m.div
				id={panelId}
				role="region"
				aria-labelledby={triggerId}
				aria-hidden={!isOpen}
				initial={false}
				animate={
					isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
				}
				transition={accordionPanelTransition}
				style={{ overflow: "hidden" }}
			>
				<div className="min-h-0 border-t border-slate-100 bg-slate-50/80 px-3 py-3 dark:border-neutral-700 dark:bg-neutral-900/40">
					<div
						className={`flex min-w-0 flex-col gap-3 rounded-lg border p-3 ${
							isAccepted
								? "border-blue-500 bg-blue-50/70 dark:border-blue-500 dark:bg-blue-500/10"
								: "border-slate-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
						}`}
					>
						<div className="flex min-w-0 items-start justify-between gap-2">
							<p className="m-0 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
								Cotización
							</p>
							{isAccepted ? (
								<span className="shrink-0 rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white dark:bg-alpac-primary-700">
									Aceptada
								</span>
							) : null}
						</div>

						<div className="grid grid-cols-2 gap-3 md:grid-cols-3">
							<QuoteField label="Proveedor" value={supplierName} />
							<QuoteField
								label="Identificación"
								value={`${identificationNumber}${
									identificationType !== emptyCell
										? ` · ${identificationType}`
										: ""
								}`}
							/>
							<QuoteField label="Método de pago" value={paymentMethodLabel} />
							<QuoteField label="Precio unitario" value={unitPrice} />
							<QuoteField label="Total" value={totalPrice} emphasize />
						</div>
					</div>
				</div>
			</m.div>
		</div>
	);
};
