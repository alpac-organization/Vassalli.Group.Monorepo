import { useEffect, useState } from "react";
import { Button, Modal } from "@alpac/design-system";
import { SaveIcon, XIcon } from "lucide-react";
import { CatalogLinkEditor } from "@app/modules/product/ui/components/catalog-link-editor/catalog-link-editor";
import {
	emptyCatalogLinkItem,
	type CatalogLinkItemForm,
} from "@app/modules/product/ui/components/catalog-link-editor/catalog-link-editor.types";
import { useUnitOfMeasurement } from "@app/modules/unit-of-measurement/hooks/useUnitOfMeasurement";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import type { CurrencyCode } from "@app/core/enums/currency.enum";
import type { GetSuppliersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";
import type {
	LinkedSupplierQuotePrice,
	LinkSupplierProductModalProps,
} from "./link-supplier-product-modal.types";
import {
	quoteFormPrimaryButtonClassName,
	quoteFormSecondaryButtonClassName,
} from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/styles/create-quote-form.styles";

const resolveSupplierLabel = (supplier: GetSuppliersResponse) =>
	supplier.commercial_name?.trim() ||
	supplier.supplier_legal_name?.trim() ||
	supplier.supplier_id;

const buildLinkItems = (
	suppliers: GetSuppliersResponse[],
	defaultUnitMeasureId: string,
): CatalogLinkItemForm[] =>
	suppliers.map((supplier) => ({
		...emptyCatalogLinkItem(),
		entity_id: supplier.supplier_id,
		entity_label: resolveSupplierLabel(supplier),
		unit_measure_id: defaultUnitMeasureId,
	}));

const validateLinkItems = (links: CatalogLinkItemForm[]): string | null => {
	if (links.length === 0) {
		return "Debe agregar al menos un proveedor.";
	}

	for (const [index, link] of links.entries()) {
		const label = link.entity_label || `Proveedor ${index + 1}`;
		if (!link.entity_id.trim()) {
			return `Seleccione el proveedor en la fila ${index + 1}.`;
		}
		if (!link.unit_price.trim() || Number(link.unit_price) <= 0) {
			return `Ingrese un precio unitario válido para ${label}.`;
		}
		if (!link.currency) {
			return `Seleccione la moneda para ${label}.`;
		}
		if (!link.unit_measure_id.trim()) {
			return `Seleccione la unidad de medida para ${label}.`;
		}
	}

	return null;
};

const mapLinksToQuotePrices = (
	links: CatalogLinkItemForm[],
	suppliers: GetSuppliersResponse[],
): LinkedSupplierQuotePrice[] => {
	const suppliersById = new Map(
		suppliers.map((supplier) => [supplier.supplier_id, supplier]),
	);

	return links.flatMap((link) => {
		const supplier = suppliersById.get(link.entity_id.trim());
		if (!supplier) return [];

		const unitPrice = Number(link.unit_price);
		const unitMeasureId = link.unit_measure_id.trim();
		if (!Number.isFinite(unitPrice) || unitPrice <= 0 || !unitMeasureId) {
			return [];
		}

		return [
			{
				supplier,
				unit_price: unitPrice,
				currency: (link.currency || "USD") as CurrencyCode,
				unit_measure_id: unitMeasureId,
			},
		];
	});
};

export const LinkSupplierProductModal = ({
	isOpen,
	productId,
	productLabel,
	defaultUnitMeasureId = "",
	suppliers,
	onClose,
	onLinked,
	onPendingSuppliersChange,
	onRequestAddMore,
	onRequestError,
}: LinkSupplierProductModalProps) => {
	const { companyId, moduleCode } = useUserStore();
	const { handleRequestWarning, AlertComponent } = useAlertState();

	const [linkItems, setLinkItems] = useState<CatalogLinkItemForm[]>([]);
	const [pendingSuppliers, setPendingSuppliers] = useState<
		GetSuppliersResponse[]
	>([]);

	const { GetUnitMeasurements } = useUnitOfMeasurement({
		payloadUnitOfMeasurement: {
			companie_id: companyId,
			module_code: moduleCode,
		},
		enabled: isOpen,
	});

	const unitMeasureData = GetUnitMeasurements.data;
	const unitMeasureOptions = Array.isArray(unitMeasureData)
		? unitMeasureData.map((item) => ({
				value: item.unit_measure_id,
				label: `${item.name}${item.symbol ? ` (${item.symbol})` : ""}`,
			}))
		: [];

	useEffect(() => {
		if (!isOpen) {
			setLinkItems([]);
			setPendingSuppliers([]);
			return;
		}

		const defaultUom = defaultUnitMeasureId.trim();
		setPendingSuppliers(suppliers);
		setLinkItems((prev) => {
			const supplierIds = new Set(
				suppliers.map((supplier) => supplier.supplier_id),
			);
			const kept = prev.filter((item) => supplierIds.has(item.entity_id));
			const keptIds = new Set(kept.map((item) => item.entity_id));
			const toAdd = suppliers.filter(
				(supplier) => !keptIds.has(supplier.supplier_id),
			);
			return [...kept, ...buildLinkItems(toAdd, defaultUom)];
		});
	}, [defaultUnitMeasureId, isOpen, suppliers]);

	const canSubmit = Boolean(productId.trim()) && linkItems.length > 0;

	const handleLinkItemsChange = (nextItems: CatalogLinkItemForm[]) => {
		setLinkItems(nextItems);
		const remainingIds = new Set(
			nextItems.map((item) => item.entity_id).filter(Boolean),
		);
		const nextSuppliers = pendingSuppliers.filter((supplier) =>
			remainingIds.has(supplier.supplier_id),
		);
		setPendingSuppliers(nextSuppliers);
		onPendingSuppliersChange?.(nextSuppliers);
	};

	const handleClose = () => {
		onClose();
	};

	const handleConfirm = () => {
		const productIdTrimmed = productId.trim();
		if (!productIdTrimmed) {
			const message = "No se encontró el producto a cotizar.";
			handleRequestWarning(message, "Producto requerido");
			onRequestError?.(message);
			return;
		}

		const validationError = validateLinkItems(linkItems);
		if (validationError) {
			handleRequestWarning(validationError, "Campos requeridos");
			return;
		}

		const linked = mapLinksToQuotePrices(linkItems, pendingSuppliers);
		if (linked.length === 0) {
			handleRequestWarning(
				"Complete el precio unitario de cada proveedor.",
				"Campos requeridos",
			);
			return;
		}

		onLinked(linked);
		onClose();
	};

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={handleClose}
				variant="form"
				size="5xl"
				title="Precio del proveedor"
				description={
					productLabel
						? `Precio, moneda y unidad de ${productLabel}. El vínculo se crea al guardar la cotización.`
						: "Indique precio unitario, moneda y unidad de medida. El vínculo se crea al guardar la cotización."
				}
				panelClassName={[
					"!mx-2 !my-2 sm:!mx-4 sm:!my-6",
					"rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
				].join(" ")}
				contentClassName="flex min-h-0 flex-1 flex-col"
			>
				<div className="scrollbar-dashboard flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
					<CatalogLinkEditor
						title="Proveedores a cotizar"
						emptyLabel="No hay proveedores pendientes."
						addButtonLabel="Agregar proveedor"
						entityLabel="Proveedor"
						entityPlaceholder="Proveedor"
						options={linkItems.map((item) => ({
							value: item.entity_id,
							label: item.entity_label,
						}))}
						unitMeasureOptions={unitMeasureOptions}
						items={linkItems}
						onChange={handleLinkItemsChange}
						isLoadingUnitMeasures={
							GetUnitMeasurements.isPending || GetUnitMeasurements.isFetching
						}
						lockEntity
						hidePreferentialPrices
						requireUnitMeasure
						onAddClick={
							onRequestAddMore
								? () => {
										onRequestAddMore();
									}
								: undefined
						}
					/>
				</div>

				<div className="-mx-4 -mb-4 mt-4 shrink-0 border-t border-t-slate-300 bg-white px-4 py-4 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
						<Button
							type="button"
							label="Cancelar"
							size="giant"
							onClick={handleClose}
							isHiddenLabelOnMobile
							icon={<XIcon size={20} />}
							className={quoteFormSecondaryButtonClassName}
						/>
						<Button
							type="button"
							label="Continuar"
							size="giant"
							disabled={!canSubmit}
							onClick={handleConfirm}
							isHiddenLabelOnMobile
							icon={<SaveIcon size={20} />}
							className={quoteFormPrimaryButtonClassName}
						/>
					</div>
				</div>
			</Modal>

			{AlertComponent}
		</>
	);
};
