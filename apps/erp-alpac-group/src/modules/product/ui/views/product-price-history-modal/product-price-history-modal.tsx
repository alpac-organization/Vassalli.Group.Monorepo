import { Badges, DataTable, Modal, type TableColumn } from "@alpac/design-system";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";
import { Loader } from "@app/shared/components/loaders/loader";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import type { ProductSupplierPriceHistoryItem } from "@app/modules/product/domain/ApiContract/Responses/product/get-product-supplier-price-history.response";
import { SupplierPriceHistoryTypeEnum } from "@app/core/enums/supplier-price-history-type.enum";
import type { ProductPriceHistoryModalProps } from "@app/modules/product/ui/views/product-price-history-modal/product-price-history-modal.types";
import { useMemo } from "react";

const resolvePriceTypeLabel = (priceType: string) => {
	const found = Object.values(SupplierPriceHistoryTypeEnum).find(
		(item) => item.stringValue === priceType,
	);
	return found?.label ?? priceType;
};

export const ProductPriceHistoryModal = ({
	isOpen,
	onClose,
	productId,
	supplierId,
	supplierLabel,
}: ProductPriceHistoryModalProps) => {
	const { companyId, moduleCode } = useUserStore();

	const { GetProductSupplierPriceHistory } = useProduct({
		getPriceHistoryPayload:
			isOpen && productId && supplierId
				? {
						company_id: companyId,
						module_code: moduleCode,
						product_id: productId,
						supplier_id: supplierId,
					}
				: undefined,
	});

	const history = GetProductSupplierPriceHistory.data ?? [];
	const isLoading =
		GetProductSupplierPriceHistory.isPending ||
		GetProductSupplierPriceHistory.isFetching;

	const columns: TableColumn<ProductSupplierPriceHistoryItem>[] = useMemo(
		() => [
			{
				key: "price_type",
				label: "Tipo",
				render: (row) => resolvePriceTypeLabel(row.price_type),
			},
			{
				key: "price",
				label: "Precio",
				render: (row) => formatCurrency(row.price, "USD"),
			},
			{
				key: "min_quantity",
				label: "Cant. mín.",
				render: (row) =>
					row.min_quantity != null ? String(row.min_quantity) : "—",
			},
			{
				key: "effective_from",
				label: "Desde",
				render: (row) =>
					row.effective_from
						? new Date(row.effective_from).toLocaleString()
						: "—",
			},
			{
				key: "effective_to",
				label: "Hasta",
				render: (row) =>
					row.effective_to
						? new Date(row.effective_to).toLocaleString()
						: "Vigente",
			},
			{
				key: "is_current",
				label: "Estado",
				render: (row) => (
					<Badges
						label={row.is_current ? "Vigente" : "Histórico"}
						color={
							row.is_current
								? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
								: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
						}
					/>
				),
			},
		],
		[],
	);

	return (
		<>
			{isOpen && isLoading && <Loader title="Cargando historial de precios..." />}
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				title="Historial de precios"
				variant="form"
				size="7xl"
				description={`Proveedor: ${supplierLabel}`}
			>
				<DataTable
					title="Movimientos de precio"
					data={history}
					columns={columns}
				/>
			</Modal>
		</>
	);
};
