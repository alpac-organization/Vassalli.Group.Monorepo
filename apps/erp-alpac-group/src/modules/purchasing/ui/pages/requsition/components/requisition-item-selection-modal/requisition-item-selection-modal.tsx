import { useEffect, useMemo, useState } from "react";
import {
	Button,
	DataTable,
	Dropdown,
	InputText,
	Modal,
	Pagination,
	RadioButton,
	type TableColumn,
} from "@alpac/design-system";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useProduct } from "@app/modules/product/hooks/useProduct";
import type {
	RequisitionItemSelectionModalProps,
	SelectableRequisitionProduct,
} from "./requisition-item-selection-modal.types";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName = `${inputClassName} focus:border-blue-600! focus:ring-2! focus:ring-green-50/50!`;
const labelClassName = "text-black! dark:text-white!";
const PAGE_SIZE = 5;

/** Mock temporal hasta conectar el endpoint de productos. */
const MOCK_PRODUCTS: SelectableRequisitionProduct[] = [
	{
		product_id: "1",
		product_code: "INS-001",
		product_name: "Toner HP 85A",
		product_category_id: "",
		product_category_name: "Oficina",
		unit_measure_id: "",
		unit_measure_name: "Unidad",
	},
	{
		product_id: "2",
		product_code: "INS-002",
		product_name: "Resma de papel carta",
		product_category_id: "",
		product_category_name: "Oficina",
		unit_measure_id: "",
		unit_measure_name: "Paquete",
	},
	{
		product_id: "3",
		product_code: "INS-003",
		product_name: "Guantes de latex",
		product_category_id: "",
		product_category_name: "Seguridad",
		unit_measure_id: "",
		unit_measure_name: "Caja",
	},
	{
		product_id: "4",
		product_code: "INS-004",
		product_name: "Aceite hidráulico",
		product_category_id: "",
		product_category_name: "Mantenimiento",
		unit_measure_id: "",
		unit_measure_name: "Galón",
	},
	{
		product_id: "5",
		product_code: "INS-005",
		product_name: "Cinta de embalaje",
		product_category_id: "",
		product_category_name: "Almacén",
		unit_measure_id: "",
		unit_measure_name: "Unidad",
	},
	{
		product_id: "6",
		product_code: "INS-006",
		product_name: "Marcadores permanentes",
		product_category_id: "",
		product_category_name: "Oficina",
		unit_measure_id: "",
		unit_measure_name: "Caja",
	},
];

export const RequisitionItemSelectionModal = ({
	isOpen,
	onClose,
	onSubmit,
	onRequestError,
	selectedProductId = null,
}: RequisitionItemSelectionModalProps) => {
	const { companyId, moduleCode } = useUserStore();

	const [search, setSearch] = useState("");
	const [categoryId, setCategoryId] = useState("");
	const [pageNumber, setPageNumber] = useState(1);
	const [tempSelected, setTempSelected] =
		useState<SelectableRequisitionProduct | null>(null);

	const { GetProductCategories } = useProduct({
		productCategoryPayload: {
			company_id: companyId,
			module_code: moduleCode,
		},
	});

	const {
		data: productCategories,
		isLoading: isLoadingCategories,
	} = GetProductCategories;

	const categoryOptions = useMemo(() => {
		if (!productCategories || !Array.isArray(productCategories)) {
			return [{ value: "", label: "Todas las categorías" }];
		}
		return [
			{ value: "", label: "Todas las categorías" },
			...productCategories.map((item) => ({
				value: String(item.id),
				label: item.name,
			})),
		];
	}, [productCategories]);

	const filteredProducts = useMemo(() => {
		const term = search.trim().toLowerCase();
		const selectedCategoryLabel =
			categoryOptions
				.find((option) => option.value === categoryId)
				?.label.toLowerCase() ?? "";

		return MOCK_PRODUCTS.filter((product) => {
			const matchesCategory =
				!categoryId ||
				product.product_category_id === categoryId ||
				product.product_category_name.toLowerCase() === selectedCategoryLabel;

			if (!matchesCategory) return false;
			if (!term) return true;

			return (
				product.product_name.toLowerCase().includes(term) ||
				product.product_code.toLowerCase().includes(term) ||
				product.product_category_name.toLowerCase().includes(term)
			);
		});
	}, [search, categoryId, categoryOptions]);

	const totalRecords = filteredProducts.length;

	const paginatedProducts = useMemo(() => {
		const start = (pageNumber - 1) * PAGE_SIZE;
		return filteredProducts.slice(start, start + PAGE_SIZE);
	}, [filteredProducts, pageNumber]);

	useEffect(() => {
		if (!isOpen) {
			setSearch("");
			setCategoryId("");
			setPageNumber(1);
			setTempSelected(null);
			return;
		}

		if (!selectedProductId) {
			setTempSelected(null);
			return;
		}

		const matched = MOCK_PRODUCTS.find(
			(product) => product.product_id === selectedProductId,
		);
		setTempSelected(matched ?? null);
	}, [isOpen, selectedProductId]);

	useEffect(() => {
		setPageNumber(1);
	}, [search, categoryId]);

	const handleClose = () => {
		onClose();
	};

	const handleConfirm = () => {
		if (!tempSelected) {
			onRequestError?.("Debe seleccionar un insumo o producto");
			return;
		}

		onSubmit?.(tempSelected);
		onClose();
	};

	const columnConfig: TableColumn<SelectableRequisitionProduct>[] = useMemo(
		() => [
			{
				key: "select",
				label: "",
				render: (row) => (
					<RadioButton
						name="requisition-item-selection"
						checked={tempSelected?.product_id === row.product_id}
						onChange={() => setTempSelected(row)}
						aria-label={`Seleccionar ${row.product_name}`}
					/>
				),
			},
			{ key: "product_code", label: "Código" },
			{ key: "product_name", label: "Producto / Insumo" },
			{ key: "product_category_name", label: "Categoría" },
			{ key: "unit_measure_name", label: "Unidad" },
		],
		[tempSelected],
	);

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title="Seleccionar insumo / producto"
			variant="form"
			size="5xl"
			description="Busque y seleccione el insumo o producto para la requisición"
		>
			<div className="flex flex-col gap-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<InputText
						label="Buscar"
						placeholder="Código, nombre o categoría"
						className={inputClassName}
						labelClassName={labelClassName}
						value={search}
						onChange={(event) => setSearch(event.target.value)}
					/>

					<Dropdown
						label="Categoría"
						placeholder={
							isLoadingCategories
								? "Cargando categorías..."
								: "Todas las categorías"
						}
						options={categoryOptions}
						value={categoryId}
						onChange={(value) => setCategoryId(String(value ?? ""))}
						appearance="dark"
						labelClassName={labelClassName}
						valueClassName={labelClassName}
						className={dropdownClassName}
					/>
				</div>

				<DataTable
					title="Insumos / productos disponibles"
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

				<div className="flex justify-end gap-3 pt-2">
					<Button
						type="button"
						size="giant"
						label="Cancelar"
						onClick={handleClose}
						className="text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
					/>
					<Button
						type="button"
						size="giant"
						label="Seleccionar"
						onClick={handleConfirm}
						disabled={!tempSelected}
						className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! disabled:opacity-50!"
					/>
				</div>
			</div>
		</Modal>
	);
};
