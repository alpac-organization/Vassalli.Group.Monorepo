import { useEffect, useMemo, useState } from "react";
import {
	Button,
	Checkbox,
	Dropdown,
	InputText,
	Modal,
	Textarea,
} from "@alpac/design-system";
import { Controller, useForm, useWatch } from "react-hook-form";
import type {
	CreatedProductDto,
	CreateProductModalProps,
} from "@app/modules/product/ui/views/create-product-modal/create-product-modal.types";
import type {
	ConfigurationStockToInventory,
	CreateProductRequest,
} from "@app/modules/product/domain/ApiContract/Requests/product/create-product.request";
import type { UpdateProductRequest } from "@app/modules/product/domain/ApiContract/Requests/product/update-product.request";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { GetProductCategoryResponse } from "@app/modules/product/domain/ApiContract/Responses/product-category/get-product-category.response";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { useUnitOfMeasurement } from "@app/modules/unit-of-measurement/hooks/useUnitOfMeasurement";
import { CatalogLinkEditor } from "@app/modules/product/ui/components/catalog-link-editor/catalog-link-editor";
import {
	mapCatalogLinkItemsToTierPayload,
	mapTierPricesToCatalogForm,
	resolveLinkCurrency,
	resolveLinkCurrencyPayload,
	resolveLinkUnitMeasureId,
	validateCatalogLinkPreferentialDates,
	type CatalogLinkItemForm,
} from "@app/modules/product/ui/components/catalog-link-editor/catalog-link-editor.types";
import { readPagedRows } from "@app/shared/utils/paged-response.utils";
import { SelectSupplierModal } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/components/select-supplier-modal/select-supplier-modal";
import { Loader } from "@app/shared/components/loaders/loader";
import { GetTitleModalByProductUsageType, GetTitleModalToEditByProductUsageType } from "./create-product-modal.variants";
import { dropdownClassName, inputClassName, labelClassName } from "@app/modules/purchasing/ui/pages/supplier/utils/style";
import { primaryButtonClassName, secondaryButtonClassName } from "../product-price-edit-modal/constants/product-price.constants";

import type { GetSuppliersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";

type ConditionalStockField =
	| "configuration_stock.available_quantity"
	| "configuration_stock.weighted_average_cost";

/**
 * Los campos arrancan vacíos (undefined) para poder saber si el usuario
 * ya ingresó un valor. Se van desbloqueando a medida que se llenan.
 */
const emptyStockConfiguration = {
	minimum_stock: 		   undefined,
	maximum_stock: 		   undefined,
	available_quantity:    undefined,
	weighted_average_cost: undefined,
} as unknown as ConfigurationStockToInventory;

const hasNumber = (value: unknown): value is number =>
	typeof value === "number" && !Number.isNaN(value);

const toNumber = (value: unknown): number => (hasNumber(value) ? value : 0);

const toNumberOrNull = (value: unknown): number | null =>
	hasNumber(value) ? value : null;

const emptyFormValues = (
	companyId: string,
	moduleCode: string,
	hasStockConfig = false,
): CreateProductRequest => ({
	company_id: 		 companyId,
	module_code: 		 moduleCode,
	product_name: 		 "",
	description: 		 "",
	category_id: 		 "",
	unit_measure_id: 	 "",
	product_usage_type:  "Administrative",
	configuration_stock: hasStockConfig ? { ...emptyStockConfiguration } : null,
	is_tax_exempt: 		 false,
	suppliers: 			 [],
});

const mapSupplierLinksToPayload = (links: CatalogLinkItemForm[]) =>
	links
		.filter((link) => link.entity_id && link.unit_price.trim())
		.map((link) => ({
			supplier_id: link.entity_id,
			unit_price: Number(link.unit_price),
			currency: resolveLinkCurrencyPayload(link.currency),
			unit_measure_id: resolveLinkUnitMeasureId(link.unit_measure_id),
			tier_prices: mapCatalogLinkItemsToTierPayload(
				link.tier_prices,
				link.currency,
			),
		}));

export const CreateProductModal = ({
	isOpen,
	onClose,
	selectedProduct = null,
	onSubmit,
	onRequestSuccess,
	typeProductToRegister,
	onRequestError,
}: CreateProductModalProps) => {
	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();
	const isEditMode = Boolean(selectedProduct?.product_id);

	const isOperational = typeProductToRegister === "Operational";

	// El control de stock solo aplica al crear productos operacionales.
	// En modo edición no se muestra, no se valida y no se envía.
	const hasStockConfig = isOperational && !isEditMode;

	const [selectedProductCategory, setSelectedProductCategory] = useState("");
	const [supplierLinks, setSupplierLinks] = useState<CatalogLinkItemForm[]>([]);
	const [supplierLinksDirty, setSupplierLinksDirty] = useState(false);
	const [isSelectSupplierOpen, setIsSelectSupplierOpen] = useState(false);

	const {
		control,
		register,
		handleSubmit,
		reset,
		getValues,
		setValue,
		clearErrors,
		formState: { errors },
	} = useForm<CreateProductRequest>({
		defaultValues: emptyFormValues(companyId, moduleCode, hasStockConfig),
		mode: "onSubmit",
	});

	const [minimumStock, maximumStock, availableQuantity] = useWatch({
		control,
		name: [
			"configuration_stock.minimum_stock",
			"configuration_stock.maximum_stock",
			"configuration_stock.available_quantity",
		],
	});

	// 1) Cantidad inicial (opcional): se habilita solo si hay stock mínimo y máximo.
	const canEditAvailableQuantity =
		hasStockConfig && hasNumber(minimumStock) && hasNumber(maximumStock);

	// 2) Costo promedio: se habilita y pasa a ser obligatorio solo cuando
	//    se escribe una cantidad inicial mayor a 0.
	const canEditAverageCost =
		canEditAvailableQuantity &&
		hasNumber(availableQuantity) &&
		availableQuantity > 0;

	const {
		GetProductCategories,
		CreateProduct,
		UpdateProduct,
		GetProductDetails,
	} = useProduct({
		getProductCategoryPayload: {
			company_id: companyId,
			module_code: moduleCode,
		},
		getProductDetailsPayload:
			isOpen && selectedProduct?.product_id
				? {
						company_id: companyId,
						module_code: moduleCode,
						product_id: selectedProduct.product_id,
						page_number: 1,
						page_size: 100,
					}
				: undefined,
	});

	const { GetUnitMeasurements } = useUnitOfMeasurement({
		payloadUnitOfMeasurement: {
			companie_id: companyId,
			module_code: moduleCode,
		},
		enabled: isOpen,
	});

	const productDetails = GetProductDetails.data;
	const isLoadingDetails =
		isEditMode &&
		(GetProductDetails.isPending || GetProductDetails.isFetching);

	const productCategories = useMemo(() => {
		if (!GetProductCategories.data || !Array.isArray(GetProductCategories.data)) {
			return [];
		}

		const categories: GetProductCategoryResponse[] = GetProductCategories.data;

		return categories.map((item) => ({
			value: item.category_id,
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

	const assignedSupplierIds = useMemo(
		() => supplierLinks.map((link) => link.entity_id).filter(Boolean),
		[supplierLinks],
	);

	const isSaving = CreateProduct.isPending || UpdateProduct.isPending;

	const handleSupplierLinksChange = (items: CatalogLinkItemForm[]) => {
		setSupplierLinks(items);
		if (isEditMode) setSupplierLinksDirty(true);
	};

	const clearStockField = (name: ConditionalStockField) => {
		setValue(name, "" as unknown as number);
		clearErrors(name);
	};

	// Si se borra el stock mínimo o máximo, se limpia la cantidad inicial.
	useEffect(() => {
		if (!hasStockConfig || canEditAvailableQuantity) return;
		if (availableQuantity === undefined || availableQuantity === ("" as unknown)) {
			return;
		}
		clearStockField("configuration_stock.available_quantity");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasStockConfig, canEditAvailableQuantity]);

	// Si se borra la cantidad inicial (o es 0), se limpia el costo promedio.
	useEffect(() => {
		if (!hasStockConfig || canEditAverageCost) return;
		clearStockField("configuration_stock.weighted_average_cost");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasStockConfig, canEditAverageCost]);

	useEffect(() => {
		if (!isOpen) {
			reset(emptyFormValues(companyId, moduleCode, hasStockConfig));
			setSupplierLinks([]);
			setSupplierLinksDirty(false);
			setSelectedProductCategory("");
			setIsSelectSupplierOpen(false);
			return;
		}

		if (!isEditMode) {
			reset(emptyFormValues(companyId, moduleCode, hasStockConfig));
			setSupplierLinks([]);
			setSupplierLinksDirty(false);
			setSelectedProductCategory("");
			setIsSelectSupplierOpen(false);
			return;
		}

		if (!productDetails) return;

		reset({
			company_id: companyId,
			module_code: moduleCode,
			product_name: productDetails.product_name ?? "",
			description: productDetails.description ?? "",
			category_id: productDetails.category_id ?? "",
			unit_measure_id: productDetails.unit_measure_id ?? "",
			product_usage_type: typeProductToRegister,
			configuration_stock: null,
			is_tax_exempt: Boolean(productDetails.is_tax_exempt),
			suppliers: [],
		});

		setSelectedProductCategory(productDetails.category?.name ?? "");
		setSupplierLinks(
			readPagedRows(productDetails.suppliers).rows.map((supplier) => ({
				entity_id: supplier.supplier_id,
				entity_label:
					supplier.commercial_name?.trim() ||
					supplier.supplier_legal_name ||
					supplier.supplier_id,
				unit_price: String(supplier.unit_price ?? ""),
				currency: resolveLinkCurrency(supplier.currency),
				unit_measure_id:
					supplier.unit_measure_id ?? productDetails.unit_measure_id ?? "",
				tier_prices: mapTierPricesToCatalogForm(
					supplier.tier_prices,
					supplier.currency,
				),
			})),
		);
		setSupplierLinksDirty(false);
		setIsSelectSupplierOpen(false);
	}, [
		isOpen,
		isEditMode,
		hasStockConfig,
		productDetails,
		companyId,
		moduleCode,
		typeProductToRegister,
		reset,
	]);

	const handleClose = () => {
		reset(emptyFormValues(companyId, moduleCode, hasStockConfig));
		setSupplierLinks([]);
		setSupplierLinksDirty(false);
		setSelectedProductCategory("");
		setIsSelectSupplierOpen(false);
		onClose();
	};

	const handleSelectSuppliers = (suppliers: GetSuppliersResponse[]) => {
		const defaultUnitMeasureId = getValues("unit_measure_id")?.trim() ?? "";
		setSupplierLinks((prev) => {
			const existingIds = new Set(
				prev.map((link) => link.entity_id).filter(Boolean),
			);
			const nextItems = suppliers
				.filter((supplier) => !existingIds.has(supplier.supplier_id))
				.map((supplier) => ({
					entity_id: supplier.supplier_id,
					entity_label:
						supplier.commercial_name?.trim() ||
						supplier.supplier_legal_name ||
						supplier.supplier_id,
					unit_price: "",
					currency: "USD" as const,
					unit_measure_id: defaultUnitMeasureId,
					tier_prices: [],
				}));
			return [...prev, ...nextItems];
		});
		if (isEditMode) setSupplierLinksDirty(true);
		setIsSelectSupplierOpen(false);
	};

	const validateSupplierLinks = () => {
		const invalidLink = supplierLinks.find(
			(link) => !link.entity_id || !link.unit_price.trim(),
		);
		if (invalidLink) {
			onRequestError?.(
				"Cada proveedor vinculado debe tener selección y precio unitario.",
			);
			return false;
		}
		const preferentialError =
			validateCatalogLinkPreferentialDates(supplierLinks);
		if (preferentialError) {
			onRequestError?.(preferentialError);
			return false;
		}
		return true;
	};

	const buildConfigurationStock = (
		values: CreateProductRequest,
	): ConfigurationStockToInventory | null => {
		if (!hasStockConfig) return null;

		const stock = values.configuration_stock;

		return {
			minimum_stock: toNumber(stock?.minimum_stock),
			maximum_stock: toNumber(stock?.maximum_stock),
			available_quantity: canEditAvailableQuantity
				? toNumberOrNull(stock?.available_quantity)
				: null,
			weighted_average_cost: canEditAverageCost
				? toNumberOrNull(stock?.weighted_average_cost)
				: null,
		};
	};

	const handleCreateProduct = (values: CreateProductRequest) => {
		if (!validateSupplierLinks()) return;

		const payload: CreateProductRequest = {
			...values,
			company_id: companyId,
			module_code: moduleCode,
			product_name: values.product_name?.trim(),
			description: values.description?.trim() || undefined,
			is_tax_exempt: Boolean(values.is_tax_exempt),
			product_usage_type: typeProductToRegister,
			configuration_stock: buildConfigurationStock(values),
			suppliers:
				supplierLinks.length > 0
					? mapSupplierLinksToPayload(supplierLinks)
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

	const handleUpdateProduct = (values: CreateProductRequest) => {
		if (!selectedProduct?.product_id) return;
		if (supplierLinksDirty && !validateSupplierLinks()) return;

		const payload: UpdateProductRequest = {
			company_id: companyId,
			module_code: moduleCode,
			product_id: selectedProduct.product_id,
			product_name: values.product_name?.trim(),
			description: values.description?.trim() || undefined,
			category_id: values.category_id,
			unit_measure_id: values.unit_measure_id || null,
			product_usage_type: values.product_usage_type,
			is_tax_exempt: Boolean(values.is_tax_exempt),
		};

		if (supplierLinksDirty) {
			payload.suppliers = mapSupplierLinksToPayload(supplierLinks);
		}

		UpdateProduct.mutate(payload, {
			onSuccess() {
				onRequestSuccess?.("Producto actualizado correctamente.");
				handleClose();
			},
			onError(error) {
				const mappedError = getMappedError(error as ApiErrorResponse);
				onRequestError?.(
					mappedError.description || "No se pudo actualizar el producto.",
				);
			},
		});
	};

	const handleProduct = (values: CreateProductRequest) => {
		if (isEditMode) {
			handleUpdateProduct(values);
			return;
		}
		handleCreateProduct(values);
	};

	return (
		<>
			{isOpen && isLoadingDetails && (
				<Loader title="Cargando detalle del producto..." />
			)}

			<Modal
				isOpen={isOpen}
				onClose={handleClose}
				title={GetTitleModalByProductUsageType[typeProductToRegister]}
				variant="form"
				size="7xl"
				description={
					isEditMode
						? GetTitleModalToEditByProductUsageType[typeProductToRegister]
						: "Complete el formulario para registrar un nuevo producto."
				}
			>
				<form
					onSubmit={handleSubmit(handleProduct)}
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
							disabled={isSaving || isLoadingDetails}
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
									disabled={isSaving || isLoadingDetails}
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
										GetUnitMeasurements.isPending ||
										GetUnitMeasurements.isFetching
											? "Cargando unidades..."
											: "Seleccione una unidad"
									}
									appearance="dark"
									isRequired
									value={field.value}
									disabled={isSaving || isLoadingDetails}
									onChange={(value) => field.onChange(String(value ?? ""))}
									options={unitMeasureOptions}
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
								disabled={isSaving || isLoadingDetails}
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
						disabled={isSaving || isLoadingDetails}
						{...register("description")}
						maxLength={500}
						enableCharacterCount
					/>

					{hasStockConfig && (
						<section className="flex flex-col gap-4">
							<div className="flex flex-col gap-2">
								<h4 className="m-0! text-sm font-semibold text-slate-800 dark:text-white">
									Control de stocks de inventario
								</h4>
								<small className="text-slate-500 dark:text-slate-300">
									Ingrese el stock mínimo y máximo para habilitar la cantidad
									inicial. Si indica una cantidad inicial, el costo promedio
									ponderado será obligatorio.
								</small>
							</div>

							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<InputText
									label="Stock mínimo"
									type="number"
									min={0}
									step="any"
									placeholder="0"
									error={errors.configuration_stock?.minimum_stock?.message}
									className={inputClassName}
									labelClassName={labelClassName}
									disabled={isSaving || isLoadingDetails}
									{...register("configuration_stock.minimum_stock", {
										valueAsNumber: true,
										validate: (value) => {
											if (!hasNumber(value)) return true;
											return (
												value >= 0 || "El stock mínimo no puede ser negativo."
											);
										},
									})}
								/>

								<InputText
									label="Stock máximo"
									type="number"
									min={0}
									step="any"
									placeholder="0"
									error={errors.configuration_stock?.maximum_stock?.message}
									className={inputClassName}
									labelClassName={labelClassName}
									disabled={isSaving || isLoadingDetails}
									{...register("configuration_stock.maximum_stock", {
										valueAsNumber: true,
										validate: (value) => {
											if (!hasNumber(value)) return true;
											if (value < 0) {
												return "El stock máximo no puede ser negativo.";
											}
											const min = getValues(
												"configuration_stock.minimum_stock",
											);
											return (
												!hasNumber(min) ||
												value >= min ||
												"El stock máximo no puede ser menor al stock mínimo."
											);
										},
									})}
								/>

								<InputText
									label="Cantidad disponible inicial"
									type="number"
									min={0}
									step="any"
									placeholder="0"
									error={errors.configuration_stock?.available_quantity?.message}
									className={inputClassName}
									labelClassName={labelClassName}
									disabled={
										isSaving || isLoadingDetails || !canEditAvailableQuantity
									}
									{...register("configuration_stock.available_quantity", {
										valueAsNumber: true,
										validate: (value) => {
											if (!hasNumber(value)) return true;
											return (
												value >= 0 ||
												"La cantidad disponible no puede ser negativa."
											);
										},
									})}
								/>

								<InputText
									label="Costo promedio ponderado"
									type="number"
									min={0}
									step="any"
									isRequired={canEditAverageCost}
									placeholder="0.00"
									error={
										errors.configuration_stock?.weighted_average_cost?.message
									}
									className={inputClassName}
									labelClassName={labelClassName}
									disabled={
										isSaving || isLoadingDetails || !canEditAverageCost
									}
									{...register("configuration_stock.weighted_average_cost", {
										valueAsNumber: true,
										required: canEditAverageCost
											? "El costo promedio ponderado es obligatorio."
											: false,
										validate: (value) => {
											if (!canEditAverageCost) return true;
											return (
												(hasNumber(value) && value >= 0) ||
												"El costo debe ser un número mayor o igual a 0."
											);
										},
									})}
								/>
							</div>
						</section>
					)}

					<CatalogLinkEditor
						title="Proveedores vinculados (opcional)"
						emptyLabel="No ha vinculado proveedores. Puede hacerlo ahora o más adelante."
						addButtonLabel="Agregar proveedor"
						entityLabel="Proveedor"
						entityPlaceholder="Proveedor"
						options={[]}
						unitMeasureOptions={unitMeasureOptions}
						isLoadingUnitMeasures={
							GetUnitMeasurements.isPending || GetUnitMeasurements.isFetching
						}
						items={supplierLinks}
						onChange={handleSupplierLinksChange}
						lockEntity
						canRemove={!isEditMode}
						onAddClick={() => setIsSelectSupplierOpen(true)}
						disabled={isSaving || isLoadingDetails}
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
							label={isEditMode ? "Actualizar producto" : "Guardar producto"}
							isLoading={isSaving}
							disabled={isSaving || isLoadingDetails}
							className={primaryButtonClassName}
						/>
					</div>
				</form>
			</Modal>

			<SelectSupplierModal
				isOpen={isSelectSupplierOpen}
				onClose={() => setIsSelectSupplierOpen(false)}
				onSelect={handleSelectSuppliers}
				selectionType="multiple"
				excludeSupplierIds={assignedSupplierIds}
			/>
		</>
	);
};