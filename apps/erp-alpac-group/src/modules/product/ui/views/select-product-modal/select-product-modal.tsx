import { useCallback, useEffect, useMemo, useState } from "react";
import {
	Button,
	Checkbox,
	DataTable,
	Dropdown,
	Modal,
	Pagination,
	RadioButton,
	type TableColumn,
} from "@alpac/design-system";
import type {
	SelectableCatalogProduct,
	SelectProductModalProps,
} from "./select-product-modal.types";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Loader } from "@app/shared/components/loaders/loader";
import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";
import { Controller, useForm } from "react-hook-form";
import type { GetProductCategoryResponse } from "@app/modules/product/domain/ApiContract/Responses/product-category/get-product-category.response";
import type { GetProductRequest } from "@app/modules/product/domain/ApiContract/Requests/product/get-product.request";

const PAGE_SIZE = 5;

const primaryButtonClassName = "text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!";
const secondaryButtonClassName = "text-[15px]! rounded-md! text-slate-500! hover:bg-slate-200! bg-slate-500! dark:bg-slate-700! dark:text-slate-300! dark:hover:bg-slate-600!";

function normalizeProducts(
	data: GetProductResponse | GetProductResponse[] | null | undefined
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
}: SelectProductModalProps) {

	const { companyId, moduleCode } = useUserStore();

	const [error, setError] = useState("");
	const [pageNumber, setPageNumber] = useState(1);
	const [tempSelected, setTempSelected] = useState<SelectableCatalogProduct | null>(null);
	const [tempSelectedMultiple, setTempSelectedMultiple] = useState<SelectableCatalogProduct[]>([]);
	const [filters, setFilters] = useState<GetProductRequest>({
		company_id: companyId,
		module_code: moduleCode,
		category_product_id: "",
		page_number: 1,
		page_size: PAGE_SIZE,
	} as GetProductRequest);

	const { GetProductCategories, GetProducts } = useProduct({
		getProductPayload: filters,
		getProductCategoryPayload: {
			company_id: companyId,
			module_code: moduleCode,
		}
	});

	const productCategories = useMemo(() => {
		if (!GetProductCategories.data || !Array.isArray(GetProductCategories.data)) return []
		const categories: GetProductCategoryResponse[] = GetProductCategories.data;
		return categories.map(item => {
			return {
				value: item.id,
				label: item.name
			}
		})
	}, [GetProductCategories.data]);

	const registeredProducts = useMemo(() => {

		const products = normalizeProducts(
			GetProducts.data?.data as
			| GetProductResponse
			| GetProductResponse[]
			| null
			| undefined,
		);

		return products;

	}, [GetProducts.data]);

	const totalRecords = useMemo(() => {
		return GetProducts.data?.total ?? 0
	}, [GetProducts.data]);

	const { control, handleSubmit, reset } = useForm<GetProductRequest>({
		defaultValues: {
			company_id: companyId,
			module_code: moduleCode,
			category_product_id: "",
			page_number: 1,
			page_size: PAGE_SIZE,
		}
	});

	useEffect(() => {
		if (!isOpen) {
			setError("");
			setPageNumber(1);
			setTempSelected(null);
			setTempSelectedMultiple([]);
			return;
		}

		const initial: GetProductRequest = {
			company_id: companyId,
			module_code: moduleCode,
			category_product_id: "",
			page_number: 1,
			page_size: PAGE_SIZE,
		};

		reset(initial);
		setFilters(initial);

	}, [isOpen, companyId, moduleCode, reset]);

	const onApplyFilters = handleSubmit((values) => {
		setPageNumber(1);
		setFilters({
			company_id: companyId,
			module_code: moduleCode,
			category_product_id: values.category_product_id || "",
			page_number: 1,
			page_size: PAGE_SIZE,
		});
	});

	const handlePageChange = useCallback((page: number) => {
		setPageNumber(page);
		setFilters((prev) => ({
			...prev,
			page_number: page,
			page_size: PAGE_SIZE,
		}));
	}, []);

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

	const onClearFilters = () => {

		reset({
			company_id: companyId,
			module_code: moduleCode,
			category_product_id: "",
			page_number: 1,
			page_size: PAGE_SIZE,
		});

		setPageNumber(1);
		setFilters({
			company_id: companyId,
			module_code: moduleCode,
			category_product_id: "",
			page_number: 1,
			page_size: PAGE_SIZE,
		});
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
			}
		],
		[selectionType, tempSelected, tempSelectedMultiple],
	);

	const isLoadingProducts = GetProducts.isPending || GetProducts.isFetching;

	const isConfirmDisabled =
		isLoadingProducts ||
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
			{isLoadingProducts && <Loader title="Cargando productos..." />}

			<div className="flex flex-col gap-6">
				{error ? (
					<p className="m-0 text-sm text-red-500 dark:text-red-400">{error}</p>
				) : null}

				<div className="flex justify-between items-center">
					<div className="flex flex-col justify-center">
						<form onSubmit={onApplyFilters} className="flex items-end gap-4">
							<Controller
								name="category_product_id"
								control={control}
								rules={{
									required: false,
								}}
								render={({ field }) => {
									return (
										<Dropdown
											value={field.value}
											onChange={(value) => field.onChange(value)}
											label="Filtrar por Categoría"
											placeholder="Seleccione una categoría"
											appearance="dark"
											labelClassName="text-black! dark:text-white!"
											valueClassName="text-black! dark:text-white!"
											className="w-75! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
											options={productCategories ?? []}
										/>
									);
								}}
							/>

							<div className="flex flex-col">
								<Button
									type="submit"
									size="giant"
									disabled={false}
									className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
									label="Aplicar filtros"
								/>
							</div>

							<div className="flex flex-col">
								<Button
									type="button"
									size="giant"
									className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
									label="Limpiar filtros"
									onClick={onClearFilters}
								/>
							</div>
						</form>
					</div>
				</div>

				<DataTable
					title={
						selectedCount > 0
							? `Productos (${selectedCount} ${selectedCount === 1 ? "seleccionado" : "seleccionados"})`
							: "Productos"
					}
					data={registeredProducts}
					columns={columnConfig}
					pagination={
						<Pagination
							currentPage={pageNumber}
							pageSize={PAGE_SIZE}
							totalRecords={totalRecords}
							onPageChange={handlePageChange}
						/>
					}
				/>

				<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<Button
						type="button"
						size="giant"
						label="Cancelar"
						className={secondaryButtonClassName}
						onClick={handleClose}
					/>
					<Button
						type="button"
						size="giant"
						label="Agregar a la lista"
						disabled={isConfirmDisabled}
						className={primaryButtonClassName}
						onClick={handleConfirm}
					/>
				</div>
			</div>
		</Modal>
	);
}
