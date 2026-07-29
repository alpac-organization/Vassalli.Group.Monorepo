import { useEffect, useMemo, useState } from "react";
import {
	Button,
	Checkbox,
	DataTable,
	Modal,
	Pagination,
	RadioButton,
	type TableColumn,
} from "@alpac/design-system";
import {
	quoteFormPrimaryButtonClassName,
	quoteFormSecondaryButtonClassName,
} from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/create-quote-form.styles";
import type {
	SelectableCatalogProduct,
	SelectProductModalProps,
} from "./select-product-modal.types";
import { useProduct } from "@app/modules/product/hooks/useProduct";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";

const PAGE_SIZE = 5;

function normalizeProducts(
	data: GetProductResponse | GetProductResponse[] | null | undefined,
): SelectableCatalogProduct[] {
	if (!data) return [];
	if (Array.isArray(data)) return data;
	if ("product_id" in data) return [data];
	return [];
}

export function SelectProductModal({
	isOpen,
	onClose,
	onSelect,
	selectionType = "single",
	excludeProductIds = [],
}: SelectProductModalProps) {
	const { companyId, moduleCode } = useUserStore();

	const [error, setError] = useState("");
	const [pageNumber, setPageNumber] = useState(1);
	const [tempSelected, setTempSelected] =
		useState<SelectableCatalogProduct | null>(null);
	const [tempSelectedMultiple, setTempSelectedMultiple] = useState<
		SelectableCatalogProduct[]
	>([]);

	const { GetProducts } = useProduct({
		productPayload: {
			company_id: companyId,
			module_code: moduleCode,
		},
	});

	const registeredProducts = useMemo(() => {
		const products = normalizeProducts(
			GetProducts.data as
				| GetProductResponse
				| GetProductResponse[]
				| null
				| undefined,
		);

		if (excludeProductIds.length === 0) return products;

		const excluded = new Set(excludeProductIds);
		return products.filter((product) => !excluded.has(product.product_id));
	}, [GetProducts.data, excludeProductIds]);

	const totalRecords = registeredProducts.length;

	const paginatedProducts = useMemo(() => {
		const start = (pageNumber - 1) * PAGE_SIZE;
		return registeredProducts.slice(start, start + PAGE_SIZE);
	}, [registeredProducts, pageNumber]);

	useEffect(() => {
		if (!isOpen) {
			setError("");
			setPageNumber(1);
			setTempSelected(null);
			setTempSelectedMultiple([]);
		}
	}, [isOpen]);

	useEffect(() => {
		const maxPage = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE) || 1);
		if (pageNumber > maxPage) setPageNumber(maxPage);
	}, [totalRecords, pageNumber]);

	const handleClose = () => {
		setError("");
		setPageNumber(1);
		setTempSelected(null);
		setTempSelectedMultiple([]);
		onClose();
	};

	const handleToggleMultipleSelection = (product: SelectableCatalogProduct) => {
		setError("");
		setTempSelectedMultiple((prev) => {
			const alreadySelected = prev.some(
				(item) => item.product_id === product.product_id,
			);

			if (alreadySelected) {
				return prev.filter((item) => item.product_id !== product.product_id);
			}

			return [...prev, product];
		});
	};

	const handleConfirm = () => {
		if (selectionType === "multiple") {
			if (tempSelectedMultiple.length === 0) {
				setError("Seleccione al menos un producto registrado.");
				return;
			}

			onSelect(tempSelectedMultiple);
			handleClose();
			return;
		}

		if (!tempSelected) {
			setError("Seleccione un producto registrado.");
			return;
		}

		onSelect([tempSelected]);
		handleClose();
	};

	const columnConfig: TableColumn<SelectableCatalogProduct>[] = useMemo(
		() => [
			{
				key: "select",
				label: "",
				render: (row) => {
					return selectionType === "single" ? (
						<RadioButton
							name="select-product-single"
							checked={tempSelected?.product_id === row.product_id}
							onChange={() => {
								setError("");
								setTempSelected(row);
							}}
							aria-label={`Seleccionar ${row.product_name}`}
						/>
					) : (
						<Checkbox
							name="select-product-multiple"
							checked={tempSelectedMultiple.some(
								(item) => item.product_id === row.product_id,
							)}
							onChange={() => handleToggleMultipleSelection(row)}
							aria-label={`Seleccionar ${row.product_name}`}
						/>
					);
				},
			},
			{ key: "product_name", label: "Producto" },
			{ key: "description", label: "Descripción" },
			{
				key: "category",
				label: "Categoría",
				render: (row) => row.category?.name ?? "—",
			},
			{ key: "usage_type", label: "Tipo de uso" },
		],
		[selectionType, tempSelected, tempSelectedMultiple],
	);

	const isConfirmDisabled =
		GetProducts.isPending ||
		GetProducts.isFetching ||
		registeredProducts.length === 0 ||
		(selectionType === "multiple"
			? tempSelectedMultiple.length === 0
			: !tempSelected);

	const selectedCount =
		selectionType === "multiple"
			? tempSelectedMultiple.length
			: tempSelected
				? 1
				: 0;

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			variant="form"
			size="5xl"
			title="Seleccionar producto"
			description={
				selectionType === "multiple"
					? "Elija uno o más productos registrados para agregarlos a la cotización."
					: "Elija un producto registrado para agregarlo a la cotización."
			}
		>
			<div className="flex flex-col gap-6">
				{error ? (
					<p className="m-0 text-sm text-red-500 dark:text-red-400">{error}</p>
				) : null}

				<DataTable
					title={
						selectedCount > 0
							? `Productos (${selectedCount} ${selectedCount === 1 ? "seleccionado" : "seleccionados"})`
							: "Productos"
					}
					data={paginatedProducts}
					columns={columnConfig}
					pagination={
						<Pagination
							currentPage={pageNumber}
							pageSize={PAGE_SIZE}
							totalRecords={totalRecords}
							onPageChange={setPageNumber}
						/>
					}
				/>

				<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<Button
						type="button"
						size="giant"
						label="Cancelar"
						className={quoteFormSecondaryButtonClassName}
						onClick={handleClose}
					/>
					<Button
						type="button"
						size="giant"
						label="Agregar a la lista"
						disabled={isConfirmDisabled}
						className={quoteFormPrimaryButtonClassName}
						onClick={handleConfirm}
					/>
				</div>
			</div>
		</Modal>
	);
}
