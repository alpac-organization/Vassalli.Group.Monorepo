import { useCallback, useMemo, useState } from "react";
import {
	Badges,
	Button,
	ContextMenu,
	DataTable,
	Dropdown,
	InputText,
	Modal,
	Pagination,
	type TableColumn,
} from "@alpac/design-system";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";
import { Loader } from "@app/shared/components/loaders/loader";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { ProductLinkedSupplier } from "@app/modules/product/domain/ApiContract/shared/product-supplier";
import {
	SupplierExclusiveStatusOptions,
	type SupplierExclusiveStatus,
} from "@app/core/enums/supplier-exclusive-status.enum";
import { ProductPriceEditModal } from "@app/modules/product/ui/views/product-price-edit-modal/product-price-edit-modal";
import { ProductPriceHistoryModal } from "@app/modules/product/ui/views/product-price-history-modal/product-price-history-modal";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";
import type { ProductSuppliersModalProps } from "@app/modules/product/ui/views/product-suppliers-modal/product-suppliers-modal.types";

const PAGE_SIZE = 10;

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName = `${inputClassName} focus:border-blue-600! focus:ring-2! focus:ring-green-50/50!`;
const labelClassName = "text-black! dark:text-white!";
const contextMenuButton =
	"rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";
const deleteButtonClass =
	"rounded-md! h-11 px-6! border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/60 hover:text-red-700 dark:hover:text-red-300 shadow-sm transition-all duration-200";
const cancelButtonClass =
	"rounded-md! h-11 px-6! hover:bg-slate-200 bg-slate-500 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600";

const exclusiveStatusBadgeVariants: Record<
	string,
	{ label: string; badgeColor: string }
> = {
	None: {
		label: "Ninguno",
		badgeColor:
			"bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
	},
	PendingReview: {
		label: "Pendiente",
		badgeColor:
			"bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
	},
	Approved: {
		label: "Aprobado",
		badgeColor:
			"bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
	},
	Rejected: {
		label: "Rechazado",
		badgeColor: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
	},
};

type SupplierFilters = {
	identification_number: string;
	commercial_name: string;
	exclusive_status: SupplierExclusiveStatus | null;
	page_number: number;
};

const emptyFilters: SupplierFilters = {
	identification_number: "",
	commercial_name: "",
	exclusive_status: null,
	page_number: 1,
};

export const ProductSuppliersModal = ({
	isOpen,
	onClose,
	selectedProduct,
	onRequestSuccess,
	onRequestError,
}: ProductSuppliersModalProps) => {
	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();
	const [draftFilters, setDraftFilters] =
		useState<SupplierFilters>(emptyFilters);
	const [appliedFilters, setAppliedFilters] =
		useState<SupplierFilters>(emptyFilters);
	const [selectedSupplier, setSelectedSupplier] =
		useState<ProductLinkedSupplier | null>(null);
	const [pendingUnlink, setPendingUnlink] =
		useState<ProductLinkedSupplier | null>(null);
	const [isPriceEditOpen, setIsPriceEditOpen] = useState(false);
	const [isPriceHistoryOpen, setIsPriceHistoryOpen] = useState(false);

	const identificationFilter =
		appliedFilters.identification_number.trim() || undefined;
	const commercialNameFilter =
		appliedFilters.commercial_name.trim() || undefined;
	const exclusiveStatusFilter = appliedFilters.exclusive_status || undefined;

	const { GetProductDetails, DeleteProductSupplierLink } = useProduct({
		getProductDetailsPayload:
			isOpen && selectedProduct?.product_id
				? {
						company_id: companyId,
						module_code: moduleCode,
						product_id: selectedProduct.product_id,
						page_number: appliedFilters.page_number,
						page_size: PAGE_SIZE,
						identification_number: identificationFilter,
						commercial_name: commercialNameFilter,
						exclusive_status: exclusiveStatusFilter,
					}
				: undefined,
	});

	const { data: productDetails, isPending, isFetching } = GetProductDetails;

	const suppliersPage = productDetails?.suppliers;
	const suppliers = suppliersPage?.data ?? [];
	const totalRecords = suppliersPage?.total ?? 0;

	const productName =
		productDetails?.product_name ??
		selectedProduct?.product_name ??
		"producto";
	const productId =
		productDetails?.product_id ?? selectedProduct?.product_id ?? "";

	const supplierColumns: TableColumn<ProductLinkedSupplier>[] = useMemo(
		() => [
			{
				key: "identification_number",
				label: "Número de identificación",
				render: (row) => row.identification_number?.trim() || "—",
			},
			{
				key: "commercial_name",
				label: "Nombre comercial",
				render: (row) =>
					row.commercial_name?.trim() ||
					row.supplier_legal_name ||
					row.supplier_id,
			},
			{
				key: "exclusive_status",
				label: "Exclusividad",
				render: (row) => {
					const status = row.exclusive_status ?? "None";
					const propValue =
						exclusiveStatusBadgeVariants[status] ??
						exclusiveStatusBadgeVariants.None;
					return (
						<Badges label={propValue.label} color={propValue.badgeColor} />
					);
				},
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
						? formatDateToSpanishWords(row.last_price_update)
						: "—",
			},
			{
				key: "tier_prices",
				label: "Precio preferencial",
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
								onClick: () => setPendingUnlink(row),
							},
						]}
					/>
				),
			},
		],
		[],
	);

	const handleApplyFilters = () => {
		setAppliedFilters({
			...draftFilters,
			identification_number: draftFilters.identification_number.trim(),
			commercial_name: draftFilters.commercial_name.trim(),
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
		setSelectedSupplier(null);
		setPendingUnlink(null);
		setIsPriceEditOpen(false);
		setIsPriceHistoryOpen(false);
		onClose();
	};

	const pendingUnlinkLabel = pendingUnlink
		? pendingUnlink.commercial_name?.trim() ||
			pendingUnlink.supplier_legal_name ||
			pendingUnlink.identification_number ||
			pendingUnlink.supplier_id
		: "";

	const isUnlinking = DeleteProductSupplierLink.isPending;

	const handleCloseUnlinkConfirm = () => {
		if (isUnlinking) return;
		setPendingUnlink(null);
	};

	const handleConfirmUnlink = () => {
		if (!pendingUnlink || !productId) return;

		DeleteProductSupplierLink.mutate(
			{
				company_id: companyId,
				module_code: moduleCode,
				product_id: productId,
				supplier_id: pendingUnlink.supplier_id,
			},
			{
				onSuccess: () => {
					setPendingUnlink(null);
					onRequestSuccess?.("Vínculo proveedor-producto eliminado.");
				},
				onError: (error) => {
					const mapped = getMappedError(error as ApiErrorResponse);
					onRequestError?.(
						mapped.description || "No se pudo eliminar el vínculo.",
					);
				},
			},
		);
	};

	const isLoading = isOpen && (isPending || isFetching);

	return (
		<>
			{isLoading && <Loader title="Cargando proveedores del producto..." />}

			<Modal
				isOpen={isOpen}
				onClose={handleClose}
				title="Proveedores del producto"
				variant="form"
				size="5xl"
				description={`Catálogo vinculado a ${productName}`}
			>
				<div className="flex flex-col gap-4">
					<form
						className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 items-end"
						onSubmit={(event) => {
							event.preventDefault();
							handleApplyFilters();
						}}
					>
						<InputText
							label="Número de identificación"
							placeholder="Ej. J0310000000000"
							className={inputClassName}
							labelClassName={labelClassName}
							value={draftFilters.identification_number}
							onChange={(event) =>
								setDraftFilters((prev) => ({
									...prev,
									identification_number: event.target.value,
								}))
							}
						/>

						<InputText
							label="Nombre comercial"
							placeholder="Ej. Proveedor ABC"
							className={inputClassName}
							labelClassName={labelClassName}
							value={draftFilters.commercial_name}
							onChange={(event) =>
								setDraftFilters((prev) => ({
									...prev,
									commercial_name: event.target.value,
								}))
							}
						/>

						<Dropdown
							label="Estado de exclusividad"
							placeholder="Seleccione..."
							appearance="dark"
							options={SupplierExclusiveStatusOptions}
							value={draftFilters.exclusive_status}
							onChange={(value) =>
								setDraftFilters((prev) => ({
									...prev,
									exclusive_status:
										value === null || value === undefined || value === ""
											? null
											: (String(value) as SupplierExclusiveStatus),
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
						title="Proveedores vinculados"
						data={suppliers}
						columns={supplierColumns}
						pagination={
							<Pagination
								currentPage={appliedFilters.page_number}
								pageSize={PAGE_SIZE}
								totalRecords={totalRecords}
								onPageChange={handlePageChange}
								disabled={isFetching}
							/>
						}
					/>
				</div>
			</Modal>

			<ProductPriceEditModal
				isOpen={isPriceEditOpen}
				onClose={() => {
					setIsPriceEditOpen(false);
					setSelectedSupplier(null);
				}}
				productId={productId}
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
				productId={productId}
				supplierId={selectedSupplier?.supplier_id ?? ""}
				supplierLabel={
					selectedSupplier?.commercial_name?.trim() ||
					selectedSupplier?.supplier_legal_name ||
					selectedSupplier?.supplier_id ||
					"—"
				}
			/>

			<ConfirmModal
				type="DELETE"
				variant="warning"
				title={`¿Está seguro que desea quitar el vínculo con el proveedor${pendingUnlinkLabel ? ` (${pendingUnlinkLabel})` : ""}?`}
				isOpen={Boolean(pendingUnlink)}
				handleFinalAction={(actionType) => {
					if (actionType === "DELETE") handleConfirmUnlink();
				}}
				onClose={handleCloseUnlinkConfirm}
				buttonActionLabel="Quitar vínculo"
				buttonActionClass={deleteButtonClass}
				buttonCancelClass={cancelButtonClass}
				isLoading={isUnlinking}
				disabled={isUnlinking}
			/>
		</>
	);
};
