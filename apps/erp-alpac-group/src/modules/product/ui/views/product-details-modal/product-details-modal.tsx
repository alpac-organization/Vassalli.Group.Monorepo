import { useMemo, useState } from "react";
import {
	ContextMenu,
	DataTable,
	Modal,
	type TableColumn,
} from "@alpac/design-system";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";
import { Loader } from "@app/shared/components/loaders/loader";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { ProductUsageTypeEnum } from "@app/core/enums/product-usage-type.enum";
import type { ProductLinkedSupplier } from "@app/modules/product/domain/ApiContract/shared/product-supplier";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { ProductPriceEditModal } from "@app/modules/product/ui/views/product-price-edit-modal/product-price-edit-modal";
import { ProductPriceHistoryModal } from "@app/modules/product/ui/views/product-price-history-modal/product-price-history-modal";
import type { ProductDetailsModalProps } from "@app/modules/product/ui/views/product-details-modal/product-details-modal.types";

const sectionTitleClassName =
	"m-0 pb-2 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-200 border-b border-slate-200 dark:border-neutral-600";
const contextMenuButton =
	"rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

const resolveUsageLabel = (value?: string) => {
	const found = Object.values(ProductUsageTypeEnum).find(
		(item) => item.stringValue === value,
	);
	return found?.label ?? value ?? "—";
};

export const ProductDetailsModal = ({
	isOpen,
	onClose,
	selectedProduct,
	onRequestSuccess,
	onRequestError,
}: ProductDetailsModalProps) => {
	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();
	const [selectedSupplier, setSelectedSupplier] =
		useState<ProductLinkedSupplier | null>(null);
	const [isPriceEditOpen, setIsPriceEditOpen] = useState(false);
	const [isPriceHistoryOpen, setIsPriceHistoryOpen] = useState(false);

	const { GetProductDetails, DeleteProductSupplierLink } = useProduct({
		getProductDetailsPayload:
			isOpen && selectedProduct?.product_id
				? {
						company_id: companyId,
						module_code: moduleCode,
						product_id: selectedProduct.product_id,
					}
				: undefined,
	});

	const details = GetProductDetails.data;
	const isLoading =
		GetProductDetails.isPending || GetProductDetails.isFetching;
	const productName =
		details?.product_name ?? selectedProduct?.product_name ?? "producto";

	const linkedSuppliers = details?.suppliers ?? [];

	const columns: TableColumn<ProductLinkedSupplier>[] = useMemo(
		() => [
			{
				key: "supplier_legal_name",
				label: "Proveedor",
				render: (row) =>
					row.commercial_name?.trim() ||
					row.supplier_legal_name ||
					row.supplier_id,
			},
			{
				key: "unit_price",
				label: "Precio unitario",
				render: (row) => formatCurrency(row.unit_price, "USD"),
			},
			{
				key: "last_price_update",
				label: "Última actualización",
				render: (row) =>
					row.last_price_update
						? new Date(row.last_price_update).toLocaleString()
						: "—",
			},
			{
				key: "tier_prices",
				label: "Tiers",
				render: (row) => String(row.tier_prices?.length ?? 0),
			},
			{
				key: "actions",
				label: "Acciones",
				render: (row) => (
					<ContextMenu
						triggerClassName={contextMenuButton}
						items={[
							{
								label: "Editar precios",
								onClick: () => {
									setSelectedSupplier(row);
									setIsPriceEditOpen(true);
								},
							},
							{
								label: "Ver historial",
								onClick: () => {
									setSelectedSupplier(row);
									setIsPriceHistoryOpen(true);
								},
							},
							{
								label: "Quitar vínculo",
								onClick: () => {
									if (!details?.product_id) return;
									DeleteProductSupplierLink.mutate(
										{
											company_id: companyId,
											module_code: moduleCode,
											product_id: details.product_id,
											supplier_id: row.supplier_id,
										},
										{
											onSuccess: () =>
												onRequestSuccess?.(
													"Vínculo proveedor-producto eliminado.",
												),
											onError: (error) => {
												const mapped = getMappedError(
													error as ApiErrorResponse,
												);
												onRequestError?.(
													mapped.description ||
														"No se pudo eliminar el vínculo.",
												);
											},
										},
									);
								},
							},
						]}
					/>
				),
			},
		],
		[
			DeleteProductSupplierLink,
			companyId,
			details?.product_id,
			getMappedError,
			moduleCode,
			onRequestError,
			onRequestSuccess,
		],
	);

	return (
		<>
			{isOpen && isLoading && (
				<Loader title="Cargando detalle del producto..." />
			)}

			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Detalle del producto"
				variant="form"
				size="7xl"
				description={`Información registrada de ${productName}`}
			>
				<div className="flex flex-col gap-6">
					<section className="flex flex-col gap-3">
						<h5 className={sectionTitleClassName}>Información general</h5>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
							<DetailField label="Código" value={details?.code || "—"} />
							<DetailField label="Nombre" value={productName} />
							<DetailField
								label="Categoría"
								value={details?.category?.name || "—"}
							/>
							<DetailField
								label="Tipo de uso"
								value={resolveUsageLabel(details?.product_usage_type)}
							/>
							<DetailField
								label="Exento de impuestos"
								value={details?.is_tax_exempt ? "Sí" : "No"}
							/>
							<DetailField
								label="Descripción"
								value={details?.description || "—"}
								containerClass="sm:col-span-2 xl:col-span-3"
							/>
						</div>
					</section>

					<section className="flex flex-col gap-3">
						<h5 className={sectionTitleClassName}>Proveedores vinculados</h5>
						<DataTable
							title="Relaciones activas"
							data={linkedSuppliers}
							columns={columns}
						/>
					</section>
				</div>
			</Modal>

			<ProductPriceEditModal
				isOpen={isPriceEditOpen}
				onClose={() => {
					setIsPriceEditOpen(false);
					setSelectedSupplier(null);
				}}
				productId={details?.product_id ?? selectedProduct?.product_id ?? ""}
				supplier={selectedSupplier}
				onRequestSuccess={onRequestSuccess}
				onRequestError={onRequestError}
			/>

			<ProductPriceHistoryModal
				isOpen={isPriceHistoryOpen}
				onClose={() => {
					setIsPriceHistoryOpen(false);
					setSelectedSupplier(null);
				}}
				productId={details?.product_id ?? selectedProduct?.product_id ?? ""}
				supplierId={selectedSupplier?.supplier_id ?? ""}
				supplierLabel={
					selectedSupplier?.commercial_name?.trim() ||
					selectedSupplier?.supplier_legal_name ||
					selectedSupplier?.supplier_id ||
					"—"
				}
			/>
		</>
	);
};
