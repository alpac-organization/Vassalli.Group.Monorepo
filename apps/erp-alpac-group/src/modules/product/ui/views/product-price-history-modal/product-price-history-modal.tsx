import { useCallback, useMemo, useState } from "react";
import {
	Badges,
	DataTable,
	Modal,
	Pagination,
	Tabs,
	type TabItem,
	type TableColumn,
} from "@alpac/design-system";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";
import { Loader } from "@app/shared/components/loaders/loader";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import type {
	ProductSupplierPriceHistoryItem,
	ProductSupplierPriceHistoryStatus,
} from "@app/modules/product/domain/ApiContract/Responses/product/get-product-supplier-price-history.response";
import {
	SupplierPriceHistoryTypeEnum,
	type SupplierPriceHistoryType,
} from "@app/core/enums/supplier-price-history-type.enum";
import type { ProductPriceHistoryModalProps } from "@app/modules/product/ui/views/product-price-history-modal/product-price-history-modal.types";

const PAGE_SIZE = 10;

type HistoryTab = "unit" | "preferential";

const tabToPriceType: Record<HistoryTab, SupplierPriceHistoryType> = {
	unit: SupplierPriceHistoryTypeEnum.UnitPrice.stringValue,
	preferential: SupplierPriceHistoryTypeEnum.PreferentialPrice.stringValue,
};

const statusBadgeVariants: Record<
	ProductSupplierPriceHistoryStatus,
	{ label: string; badgeColor: string }
> = {
	Current: {
		label: "Vigente",
		badgeColor:
			"bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
	},
	Scheduled: {
		label: "Programado",
		badgeColor:
			"bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
	},
	Historical: {
		label: "Histórico",
		badgeColor:
			"bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
	},
};

const resolveStatusBadge = (row: ProductSupplierPriceHistoryItem) => {
	if (row.status && statusBadgeVariants[row.status]) {
		return statusBadgeVariants[row.status];
	}
	return row.is_current
		? statusBadgeVariants.Current
		: statusBadgeVariants.Historical;
};

const toDateOnly = (value?: string | null) => {
	if (!value?.trim()) return "";
	return value.slice(0, 10);
};

const formatHistoryDate = (value?: string | null) => {
	const dateOnly = toDateOnly(value);
	if (!dateOnly) return "";
	return formatDateToSpanishWords(dateOnly) || "—";
};

export const ProductPriceHistoryModal = ({
	isOpen,
	onClose,
	productId,
	supplierId,
	supplierLabel,
	currency = "USD",
}: ProductPriceHistoryModalProps) => {
	const { companyId, moduleCode } = useUserStore();
	const [activeTab, setActiveTab] = useState<HistoryTab>("unit");
	const [pageNumber, setPageNumber] = useState(1);

	const priceType = tabToPriceType[activeTab];

	const { GetProductSupplierPriceHistory } = useProduct({
		getPriceHistoryPayload:
			isOpen && productId && supplierId
				? {
						company_id: companyId,
						module_code: moduleCode,
						product_id: productId,
						supplier_id: supplierId,
						page_number: pageNumber,
						page_size: PAGE_SIZE,
						price_type: priceType,
					}
				: undefined,
	});

	const historyPage = GetProductSupplierPriceHistory.data;
	const history = historyPage?.data ?? [];
	const totalRecords = historyPage?.total ?? 0;
	const isLoading =
		GetProductSupplierPriceHistory.isPending ||
		GetProductSupplierPriceHistory.isFetching;
	const showMinQuantity = activeTab === "preferential";

	const columns: TableColumn<ProductSupplierPriceHistoryItem>[] = useMemo(
		() => {
			const base: TableColumn<ProductSupplierPriceHistoryItem>[] = [
				{
					key: "price",
					label: "Precio",
					render: (row) =>
						formatCurrency(row.price, row.currency ?? currency),
				},
				{
					key: "currency",
					label: "Moneda",
					render: (row) => row.currency ?? currency ?? "—",
				},
			];

			if (showMinQuantity) {
				base.push({
					key: "min_quantity",
					label: "Cant. mín.",
					render: (row) =>
						row.min_quantity != null ? String(row.min_quantity) : "—",
				});
			}

			base.push(
				{
					key: "effective_from",
					label: "Desde",
					render: (row) => formatHistoryDate(row.effective_from) || "—",
				},
				{
					key: "effective_to",
					label: "Hasta",
					render: (row) =>
						row.effective_to
							? formatHistoryDate(row.effective_to) || "—"
							: "—",
				},
				{
					key: "status",
					label: "Estado",
					render: (row) => {
						const badge = resolveStatusBadge(row);
						return (
							<Badges label={badge.label} color={badge.badgeColor} />
						);
					},
				},
			);

			return base;
		},
		[currency, showMinQuantity],
	);

	const handlePageChange = useCallback((page: number) => {
		setPageNumber(page);
	}, []);

	const handleTabChange = useCallback((id: string) => {
		setActiveTab(id as HistoryTab);
		setPageNumber(1);
	}, []);

	const handleClose = () => {
		setActiveTab("unit");
		setPageNumber(1);
		onClose();
	};

	const renderHistoryTable = () => (
		<div className="min-w-0 overflow-x-auto">
			<DataTable
				title="Movimientos de precio"
				data={history}
				columns={columns}
				pagination={
					<Pagination
						currentPage={pageNumber}
						pageSize={PAGE_SIZE}
						totalRecords={totalRecords}
						onPageChange={handlePageChange}
						disabled={GetProductSupplierPriceHistory.isFetching}
					/>
				}
			/>
		</div>
	);

	const tabItems: TabItem<string>[] = [
		{
			id: "unit",
			label: SupplierPriceHistoryTypeEnum.UnitPrice.label,
			render: renderHistoryTable,
		},
		{
			id: "preferential",
			label: SupplierPriceHistoryTypeEnum.PreferentialPrice.label,
			render: renderHistoryTable,
		},
	];

	return (
		<>
			{isOpen && isLoading ? (
				<Loader title="Cargando historial de precios..." />
			) : null}
			<Modal
				isOpen={isOpen}
				onClose={handleClose}
				title="Historial de precios"
				variant="form"
				size="5xl"
				description={`Proveedor: ${supplierLabel}`}
			>
				<div className="flex min-w-0 flex-col gap-4">
					<Tabs
						tabItems={tabItems}
						activeTab={activeTab}
						animation="slide"
						onTabChange={handleTabChange}
					/>
				</div>
			</Modal>
		</>
	);
};
