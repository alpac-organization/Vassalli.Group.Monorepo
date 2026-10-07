import { useEffect, useMemo, useState } from "react";
import {
	Button,
	Checkbox,
	Dropdown,
	InputText,
	Modal,
	Textarea,
} from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import type {
	CreatedProductDto,
	CreateProductModalProps,
} from "@app/modules/product/ui/views/create-product-modal/create-product-modal.types";
import type { CreateProductRequest } from "@app/modules/product/domain/ApiContract/Requests/product/create-product.request";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { GetProductCategoryResponse } from "@app/modules/product/domain/ApiContract/Responses/product-category/get-product-category.response";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { useUnitOfMeasurement } from "@app/modules/unit-of-measurement/hooks/useUnitOfMeasurement";
import {
	ProductUsageTypeOptions,
	type ProductUsageType,
} from "@app/core/enums/product-usage-type.enum";
import { useSupplier } from "@app/modules/purchasing/ui/hooks/supplier/useSupplier";
import { CatalogLinkEditor } from "@app/modules/product/ui/components/catalog-link-editor/catalog-link-editor";
import {
	mapCatalogLinkItemsToTierPayload,
	type CatalogLinkItemForm,
} from "@app/modules/product/ui/components/catalog-link-editor/catalog-link-editor.types";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName = `${inputClassName} focus:border-blue-600! focus:ring-2! focus:ring-green-50/50!`;
const labelClassName = "text-black! dark:text-white!";
const primaryButtonClassName =
	"text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!";
const secondaryButtonClassName =
	"text-[15px]! rounded-md! text-slate-500! hover:bg-slate-200! bg-slate-500! dark:bg-slate-700! dark:text-slate-300! dark:hover:bg-slate-600!";

const emptyFormValues = (
	companyId: string,
	moduleCode: string,
): CreateProductRequest => ({
	company_id: companyId,
	module_code: moduleCode,
	product_name: "",
	description: "",
	category_id: "",
	unit_measure_id: "",
	product_usage_type: "Insumo",
	is_tax_exempt: false,
	suppliers: [],
});

export const CreateProductModal = ({
	isOpen,
	onClose,
	onSubmit,
	onRequestSuccess,
	onRequestError,
}: CreateProductModalProps) => {
	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();

	const [selectedProductCategory, setSelectedProductCategory] = useState("");
	const [supplierLinks, setSupplierLinks] = useState<CatalogLinkItemForm[]>([]);

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateProductRequest>({
		defaultValues: emptyFormValues(companyId, moduleCode),
		mode: "onSubmit",
	});

	const { GetProductCategories, CreateProduct } = useProduct({
		getProductCategoryPayload: {
			company_id: companyId,
			module_code: moduleCode,
		},
	});

	const { GetUnitMeasurements } = useUnitOfMeasurement({
		payloadUnitOfMeasurement: {
			companie_id: companyId,
			module_code: moduleCode,
		},
		enabled: isOpen,
	});

	const { GetSuppliers } = useSupplier({
		suppliersFilters: isOpen
			? {
					company_id: companyId,
					module_code: moduleCode,
					page_number: 1,
					page_size: 100,
				}
			: undefined,
	});

	const productCategories = useMemo(() => {
		if (!GetProductCategories.data || !Array.isArray(GetProductCategories.data)) {
			return [];
		}

		const categories: GetProductCategoryResponse[] = GetProductCategories.data;
		return categories.map((item) => ({
			value: item.id,
			label: item.name,
		}));
	}, [GetProductCategories.data]);

	const unitMeasureOptions = useMemo(() => {
		const data = GetUnitMeasurements.data;
		if (!data || !Array.isArray(data)) return [];
		return data.map((item) => ({
			value: item.unit_measure_id,
			label: `${item.name}${item.symbol ? ` (${item.symbol})` : ""}`,
		}));
	}, [GetUnitMeasurements.data]);

	const supplierOptions = useMemo(() => {
		const data = GetSuppliers.data?.data ?? [];
		return data.map((supplier) => ({
			value: supplier.supplier_id,
			label:
				supplier.commercial_name?.trim() ||
				supplier.supplier_legal_name ||
				supplier.supplier_id,
		}));
	}, [GetSuppliers.data?.data]);

	const isSaving = CreateProduct.isPending;

	useEffect(() => {
		reset(emptyFormValues(companyId, moduleCode));
		setSupplierLinks([]);
		setSelectedProductCategory("");
	}, [isOpen, companyId, moduleCode, reset]);

	const handleClose = () => {
		reset(emptyFormValues(companyId, moduleCode));
		setSupplierLinks([]);
		setSelectedProductCategory("");
		onClose();
	};

	const handleCreateProduct = (values: CreateProductRequest) => {
		const invalidLink = supplierLinks.find(
			(link) => !link.entity_id || !link.unit_price.trim(),
		);

		if (invalidLink) {
			onRequestError?.(
				"Cada proveedor vinculado debe tener selección y precio unitario.",
			);
			return;
		}

		const payload: CreateProductRequest = {
			...values,
			company_id: companyId,
			module_code: moduleCode,
			product_name: values.product_name?.trim(),
			description: values.description?.trim() || undefined,
			is_tax_exempt: Boolean(values.is_tax_exempt),
			suppliers:
				supplierLinks.length > 0
					? supplierLinks.map((link) => ({
							supplier_id: link.entity_id,
							unit_price: Number(link.unit_price),
							tier_prices: mapCatalogLinkItemsToTierPayload(link.tier_prices),
						}))
					: undefined,
		};

		CreateProduct.mutate(payload, {
			onSuccess(product) {
				const createdProduct: CreatedProductDto = {
					data: product,
					product_name: payload.product_name,
					category_name: selectedProductCategory ?? "",
				};

				onRequestSuccess?.("Producto registrado correctamente.");
				onSubmit?.(createdProduct);
				handleClose();
			},
			onError(error) {
				const mappedError = getMappedError(error as ApiErrorResponse);
				onRequestError?.(
					mappedError.description || "No se pudo registrar el producto.",
				);
			},
		});
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title="Registro de producto"
			variant="form"
			size="7xl"
			description="Complete el formulario para registrar un nuevo producto."
		>
			<form
				onSubmit={handleSubmit(handleCreateProduct)}
				className="flex flex-col gap-6"
				noValidate
			>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<InputText
						label="Nombre del producto"
						placeholder="Ej: Aceite Motor 15W40"
						isRequired
						error={errors.product_name?.message}
						className={inputClassName}
						labelClassName={labelClassName}
						{...register("product_name", {
							required: "El nombre del producto es obligatorio.",
							validate: (value) =>
								value.trim().length > 0 ||
								"El nombre del producto es obligatorio.",
							maxLength: {
								value: 80,
								message:
									"El nombre del producto no puede exceder los 80 caracteres.",
							},
						})}
					/>

					<Controller
						control={control}
						name="category_id"
						rules={{ required: "La categoría es obligatoria." }}
						render={({ field, fieldState }) => (
							<Dropdown
								label="Categoría"
								placeholder={
									GetProductCategories.isPending ||
									GetProductCategories.isFetching
										? "Cargando categorías..."
										: "Seleccione una categoría"
								}
								appearance="dark"
								isRequired
								value={field.value}
								onChange={(value) => {
									field.onChange(value);
									const [category] = productCategories.filter(
										(item) => item.value === value,
									);
									setSelectedProductCategory(category?.label ?? "");
								}}
								options={productCategories ?? []}
								error={fieldState.error?.message}
								labelClassName={labelClassName}
								className={dropdownClassName}
							/>
						)}
					/>

					<Controller
						control={control}
						name="unit_measure_id"
						rules={{ required: "La unidad de medida es obligatoria." }}
						render={({ field, fieldState }) => (
							<Dropdown
								label="Unidad de medida"
								placeholder={
									GetUnitMeasurements.isPending || GetUnitMeasurements.isFetching
										? "Cargando unidades..."
										: "Seleccione una unidad"
								}
								appearance="dark"
								isRequired
								value={field.value}
								onChange={(value) => field.onChange(String(value ?? ""))}
								options={unitMeasureOptions}
								error={fieldState.error?.message}
								labelClassName={labelClassName}
								className={dropdownClassName}
							/>
						)}
					/>

					<Controller
						control={control}
						name="product_usage_type"
						rules={{ required: "El tipo de uso es obligatorio." }}
						render={({ field, fieldState }) => (
							<Dropdown
								label="Tipo de uso"
								placeholder="Seleccione..."
								appearance="dark"
								isRequired
								value={field.value}
								onChange={(value) =>
									field.onChange(String(value ?? "") as ProductUsageType)
								}
								options={ProductUsageTypeOptions}
								error={fieldState.error?.message}
								labelClassName={labelClassName}
								className={dropdownClassName}
							/>
						)}
					/>
				</div>

				<Controller
					control={control}
					name="is_tax_exempt"
					render={({ field }) => (
						<Checkbox
							label="Producto exento de impuestos"
							checked={Boolean(field.value)}
							onChange={(event) => field.onChange(event.target.checked)}
						/>
					)}
				/>

				<Textarea
					label="Descripción"
					placeholder="Descripción opcional del producto..."
					rows={4}
					className={`${inputClassName} resize-none`}
					labelClassName={labelClassName}
					{...register("description")}
					maxLength={500}
					enableCharacterCount
				/>

				<CatalogLinkEditor
					title="Proveedores vinculados"
					emptyLabel="No ha vinculado proveedores. Puede hacerlo ahora o más adelante."
					addButtonLabel="Agregar proveedor"
					entityLabel="Proveedor"
					entityPlaceholder="Seleccione un proveedor"
					options={supplierOptions}
					items={supplierLinks}
					onChange={setSupplierLinks}
					isLoadingOptions={GetSuppliers.isPending || GetSuppliers.isFetching}
					disabled={isSaving}
				/>

				<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<Button
						type="button"
						size="giant"
						label="Cancelar"
						disabled={isSaving}
						className={secondaryButtonClassName}
						onClick={handleClose}
					/>
					<Button
						type="submit"
						size="giant"
						label="Guardar producto"
						isLoading={isSaving}
						disabled={isSaving}
						className={primaryButtonClassName}
					/>
				</div>
			</form>
		</Modal>
	);
};
