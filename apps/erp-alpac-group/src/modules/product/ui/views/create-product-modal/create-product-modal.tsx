import { useMemo, useState } from "react";
import {
	Button,
	Checkbox,
	Dropdown,
	InputText,
	Modal,
	SectionHeader,
	Textarea,
} from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import { Loader } from "@app/shared/components/loaders/loader";

import type {
	CreatedProductDto,
	CreateProductDraft,
	CreateProductDraftSource,
	CreateProductModalProps,
} from "@app/modules/product/ui/views/create-product-modal/create-product-modal.types";

import type { ProductUsageType } from "@app/core/enums/product-usage-type.enum";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { CatalogLinkItemForm } from "@app/modules/product/ui/components/catalog-link-editor/catalog-link-editor.types";
import type { CreateProductRequest } from "@app/modules/product/domain/ApiContract/Requests/product/create-product.request";
import type { UpdateProductRequest } from "@app/modules/product/domain/ApiContract/Requests/product/update-product.request";
import type { GetSuppliersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";
import type { GetProductCategoryResponse } from "@app/modules/product/domain/ApiContract/Responses/product-category/get-product-category.response";

import { useUserStore } from "@app/shared/stores/useUserStore";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUnitOfMeasurement } from "@app/modules/unit-of-measurement/hooks/useUnitOfMeasurement";
import { CatalogLinkEditor } from "@app/modules/product/ui/components/catalog-link-editor/catalog-link-editor";
import {
	mapCatalogLinkItemsToTierPayload,
	mapTierPricesToCatalogForm,
	resolveLinkCurrency,
	resolveLinkCurrencyPayload,
	resolveLinkUnitMeasureId,
	validateCatalogLinkPreferentialDates,
} from "@app/modules/product/ui/components/catalog-link-editor/catalog-link-editor.types";
import { readPagedRows } from "@app/shared/utils/paged-response.utils";
import { SelectSupplierModal } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/components/select-supplier-modal/select-supplier-modal";
import {
   buildStockConfiguration,
	GetTitleModalByProductUsageType,
	GetTitleModalToEditByProductUsageType,
} from "./create-product-modal.variants";
import {
	dropdownClassName,
	inputClassName,
	labelClassName,
} from "@app/modules/purchasing/ui/pages/supplier/utils/style";
import { toOptionalNumber } from "@app/shared/utils/globals.utils";

const primaryButtonClassName =
	"text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!";
const secondaryButtonClassName =
	"text-[15px]! rounded-md! text-slate-500! hover:bg-slate-200! bg-slate-500! dark:bg-slate-700! dark:text-slate-300! dark:hover:bg-slate-600!";

const emptyFormValues = (
	companyId: string,
	moduleCode: string,
	usageType: ProductUsageType,
): CreateProductRequest => ({
	company_id: companyId,
	module_code: moduleCode,
	product_name: "",
	description: "",
	category_id: "",
	unit_measure_id: "",
	product_usage_type: usageType,
	is_tax_exempt: false,
	suppliers: [],
	configuration_stock: null,
});

const resolveCreateProductDraft = (source: CreateProductDraftSource): CreateProductDraft | null => {
	if (!source.isOpen || !source.isEditMode) {
		return {
			formValues: emptyFormValues(
				source.companyId,
				source.moduleCode,
				source.usageType,
			),
			supplierLinks: [],
			categoryName: "",
		};
	}

	const productDetails = source.productDetails;
	if (!productDetails) return null;

	return {
		formValues: {
			company_id: source.companyId,
			module_code: source.moduleCode,
			product_name: productDetails.product_name ?? "",
			description: productDetails.description ?? "",
			category_id: productDetails.category_id ?? "",
			unit_measure_id: productDetails.unit_measure_id ?? "",
			product_usage_type: source.usageType,
			is_tax_exempt: Boolean(productDetails.is_tax_exempt),
			suppliers: []
		},
		categoryName: productDetails.category?.name ?? "",
		supplierLinks: readPagedRows(productDetails.suppliers).rows.map(
			(supplier) => ({
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
			}),
		),
	};
};

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
				link.unit_measure_id,
			),
		}));

export const CreateProductModal = ({
	isOpen,
	onClose,
	selectedProduct = null,
	onSubmit,
	onRequestSuccess,
	onRequestError,
	typeProductToRegister,
}: CreateProductModalProps) => {
	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();
	const isEditMode = Boolean(selectedProduct?.product_id);
	const isOperational = typeProductToRegister === "Operational";

	const { GetProductCategories, CreateProduct, UpdateProduct, GetProductDetails } =
		useProduct({
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

	const draftSource: CreateProductDraftSource = {
		isOpen,
		isEditMode,
		productDetails,
		companyId,
		moduleCode,
		usageType: typeProductToRegister,
	};

	const mountedDraft = resolveCreateProductDraft(draftSource);

	const [selectedProductCategory, setSelectedProductCategory] = useState(
		mountedDraft?.categoryName ?? "",
	);
	const [supplierLinks, setSupplierLinks] = useState<CatalogLinkItemForm[]>(
		mountedDraft?.supplierLinks ?? [],
	);
	const [supplierLinksDirty, setSupplierLinksDirty] = useState(false);
	const [isSelectSupplierOpen, setIsSelectSupplierOpen] = useState(false);
	const [appliedFormValues, setAppliedFormValues] = useState<CreateProductRequest>(
		() =>
			mountedDraft?.formValues ??
			emptyFormValues(companyId, moduleCode, typeProductToRegister),
	);
	const [syncedDraftSource, setSyncedDraftSource] =
		useState<CreateProductDraftSource>(draftSource);

	if (
		syncedDraftSource.isOpen !== draftSource.isOpen ||
		syncedDraftSource.isEditMode !== draftSource.isEditMode ||
		syncedDraftSource.productDetails !== draftSource.productDetails ||
		syncedDraftSource.companyId !== draftSource.companyId ||
		syncedDraftSource.moduleCode !== draftSource.moduleCode ||
		syncedDraftSource.usageType !== draftSource.usageType
	) {
		setSyncedDraftSource(draftSource);
		const nextDraft = resolveCreateProductDraft(draftSource);
		if (nextDraft) {
			setAppliedFormValues(nextDraft.formValues);
			setSupplierLinks(nextDraft.supplierLinks);
			setSupplierLinksDirty(false);
			setSelectedProductCategory(nextDraft.categoryName);
			setIsSelectSupplierOpen(false);
		}
	}

	const {
		control,
		register,
		handleSubmit,
		reset,
		getValues,
		formState: { errors },
	} = useForm<CreateProductRequest>({
		defaultValues: emptyFormValues(companyId, moduleCode, typeProductToRegister),
		values: appliedFormValues,
		mode: "onSubmit",
	});

	const isLoadingDetails =
		isEditMode && (GetProductDetails.isPending || GetProductDetails.isFetching);

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

	const assignedSupplierIds = useMemo(
		() => supplierLinks.map((link) => link.entity_id).filter(Boolean),
		[supplierLinks],
	);

	const isSaving = CreateProduct.isPending || UpdateProduct.isPending;

	const handleSupplierLinksChange = (items: CatalogLinkItemForm[]) => {
		setSupplierLinks(items);
		if (isEditMode) setSupplierLinksDirty(true);
	};

	const handleClose = () => {
		reset(emptyFormValues(companyId, moduleCode, typeProductToRegister));
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
		const preferentialError = validateCatalogLinkPreferentialDates(supplierLinks);
		if (preferentialError) {
			onRequestError?.(preferentialError);
			return false;
		}
		return true;
	};

	const handleCreateProduct = (values: CreateProductRequest) => {
		if (!validateSupplierLinks()) return;

		const payload: CreateProductRequest = {
			...values,
			company_id: companyId,
			module_code: moduleCode,
			product_name: values.product_name?.trim(),
			description: values.description?.trim() || undefined,
			product_usage_type: typeProductToRegister,
			is_tax_exempt: Boolean(values.is_tax_exempt),
			configuration_stock: buildStockConfiguration(values, typeProductToRegister),
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
			product_usage_type: typeProductToRegister,
			is_tax_exempt: Boolean(values.is_tax_exempt)
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
				title={
					isEditMode
						? GetTitleModalToEditByProductUsageType[typeProductToRegister]
						: GetTitleModalByProductUsageType[typeProductToRegister]
				}
				variant="form"
				size="7xl"
				description={
					isEditMode
						? "Modifique la información del producto y sus proveedores vinculados."
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

					{/* Configuración de stock: solo para productos Operacionales */}
					{
                  isOperational && !isEditMode && (
                     <>
                        <SectionHeader
                           title="Datos dentro del stock de inventario"
                           subtitle="Controla el máximo y mínimo de stock que puedes mantener en tu inventario de este producto."
                           headerClassName="text-[15px!]"
                        />

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                           <InputText
                              label="Stock mínimo"
                              type="number"
                              min={0}
                              placeholder="Ej: 10"
                              isRequired
                              error={errors.configuration_stock?.maximum_stock?.message}
                              className={inputClassName}
                              labelClassName={labelClassName}
                              disabled={isSaving || isLoadingDetails}
                              {
                                 ...register("configuration_stock.minimum_stock", {
                                    required: "El stock mínimo es obligatorio.",
                                    setValueAs: toOptionalNumber,
                                    validate: (value) => {
                                       const number = toOptionalNumber(value);
                                       if (number === undefined || Number.isNaN(number))
                                          return "Ingrese un número válido.";
                                       if (number < 0) return "El stock mínimo no puede ser negativo.";
                                       return true;
                                    },
                                 })
                              }
                           />

                           <InputText
                              label="Stock máximo"
                              type="number"
                              min={0}
                              placeholder="Ej: 100"
                              isRequired
                              error={errors.configuration_stock?.maximum_stock?.message}
                              className={inputClassName}
                              labelClassName={labelClassName}
                              disabled={isSaving || isLoadingDetails}
                              {...register("configuration_stock.maximum_stock", {
                                 required: "El stock máximo es obligatorio.",
                                 setValueAs: toOptionalNumber,
                                 validate: (value) => {
                                    const max = toOptionalNumber(value);

                                    if (max === undefined || Number.isNaN(max))
                                       return "Ingrese un número válido.";

                                    if (max < 0) return "El stock máximo no puede ser negativo.";

                                    const min = toOptionalNumber(
                                       getValues("configuration_stock.minimum_stock"),
                                    );

                                    if (min !== undefined && max < min)
                                       return "El stock máximo no puede ser menor al mínimo.";
                                    return true;
                                 },
                              })}
                           />
                        </div>
                     </>
					   )
               }

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