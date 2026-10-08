import { useCallback, useMemo, useState } from "react";
import {
	Badges,
	Button,
	DataTable,
	Dropdown,
	Modal,
	Pagination,
	type TableColumn,
} from "@alpac/design-system";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";
import { Loader } from "@app/shared/components/loaders/loader";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import type { ProductSupplierPriceHistoryItem } from "@app/modules/product/domain/ApiContract/Responses/product/get-product-supplier-price-history.response";
import {
	SupplierPriceHistoryTypeEnum,
	SupplierPriceHistoryTypeOptions,
	type SupplierPriceHistoryType,
} from "@app/core/enums/supplier-price-history-type.enum";
import type { ProductPriceHistoryModalProps } from "@app/modules/product/ui/views/product-price-history-modal/product-price-history-modal.types";

const PAGE_SIZE = 10;

const dropdownClassName =
	"w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";
const labelClassName = "text-black! dark:text-white!";

const priceTypeBadgeVariants: Record<
	string,
	{ label: string; badgeColor: string }
> = {
	[SupplierPriceHistoryTypeEnum.UnitPrice.stringValue]: {
		label: SupplierPriceHistoryTypeEnum.UnitPrice.label,
		badgeColor:
			"bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
	},
	[SupplierPriceHistoryTypeEnum.PreferentialPrice.stringValue]: {
		label: SupplierPriceHistoryTypeEnum.PreferentialPrice.label,
		badgeColor:
			"bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200",
	},
};

type HistoryFilters = {
	price_type: SupplierPriceHistoryType | null;
	page_number: number;
};

const emptyFilters: HistoryFilters = {
	price_type: null,
	page_number: 1,
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
}: ProductPriceHistoryModalProps) => {
	const { companyId, moduleCode } = useUserStore();
	const [draftFilters, setDraftFilters] = useState<HistoryFilters>(emptyFilters);
	const [appliedFilters, setAppliedFilters] =
		useState<HistoryFilters>(emptyFilters);

	const priceTypeFilter = appliedFilters.price_type || undefined;

	const { GetProductSupplierPriceHistory } = useProduct({
		getPriceHistoryPayload:
			isOpen && productId && supplierId
				? {
						company_id: companyId,
						module_code: moduleCode,
						product_id: productId,
						supplier_id: supplierId,
						page_number: appliedFilters.page_number,
						page_size: PAGE_SIZE,
						price_type: priceTypeFilter,
					}
				: undefined,
	});

	const historyPage = GetProductSupplierPriceHistory.data;
	const history = historyPage?.data ?? [];
	const totalRecords = historyPage?.total ?? 0;
	const isLoading =
		GetProductSupplierPriceHistory.isPending ||
		GetProductSupplierPriceHistory.isFetching;

	const columns: TableColumn<ProductSupplierPriceHistoryItem>[] = useMemo(
		() => [
			{
				key: "price_type",
				label: "Tipo",
				render: (row) => {
					const badge =
						priceTypeBadgeVariants[row.price_type] ??
						priceTypeBadgeVariants[
							SupplierPriceHistoryTypeEnum.UnitPrice.stringValue
						];
					return <Badges label={badge.label} color={badge.badgeColor} />;
				},
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
				render: (row) => formatHistoryDate(row.effective_from) || "—",
			},
			{
				key: "effective_to",
				label: "Hasta",
				render: (row) =>
					row.effective_to ? formatHistoryDate(row.effective_to) || "—" : "Vigente",
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

	const handleApplyFilters = () => {
		setAppliedFilters({
			...draftFilters,
			page_number: 1,
		});
	};

	const handleClearFilters = () => {
		setDraftFilters(emptyFilters);
		setAppliedFilters(emptyFilters);
	};

	const handlePageChange = useCallback((page: number) => {
		setAppliedFilters((prev) => ({
			...prev,
			page_number: page,
		}));
	}, []);

	const handleClose = () => {
		setDraftFilters(emptyFilters);
		setAppliedFilters(emptyFilters);
		onClose();
	};

	return (
		<>
			{isOpen && isLoading && (
				<Loader title="Cargando historial de precios..." />
			)}
			<Modal
				isOpen={isOpen}
				onClose={handleClose}
				title="Historial de precios"
				variant="form"
				size="5xl"
				description={`Proveedor: ${supplierLabel}`}
			>
				<div className="flex flex-col gap-4">
					<form
						className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end"
						onSubmit={(event) => {
							event.preventDefault();
							handleApplyFilters();
						}}
					>
						<Dropdown
							label="Tipo de precio"
							placeholder="Seleccione..."
							appearance="dark"
							options={SupplierPriceHistoryTypeOptions}
							value={draftFilters.price_type}
							onChange={(value) =>
								setDraftFilters((prev) => ({
									...prev,
									price_type:
										value === null || value === undefined || value === ""
											? null
											: (String(value) as SupplierPriceHistoryType),
								}))
							}
							className={dropdownClassName}
							labelClassName={labelClassName}
							valueClassName={labelClassName}
						/>

						<Button
							type="submit"
							size="giant"
							label="Aplicar filtros"
							className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
						/>

						<Button
							type="button"
							size="giant"
							label="Limpiar filtros"
							onClick={handleClearFilters}
							className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
						/>
					</form>

					<DataTable
						title="Movimientos de precio"
						data={history}
						columns={columns}
						pagination={
							<Pagination
								currentPage={appliedFilters.page_number}
								pageSize={PAGE_SIZE}
								totalRecords={totalRecords}
								onPageChange={handlePageChange}
								disabled={GetProductSupplierPriceHistory.isFetching}
							/>
						}
					/>
				</div>
			</Modal>
		</>
	);
};
