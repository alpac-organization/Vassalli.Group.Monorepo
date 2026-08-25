import { useMemo, useState } from "react";
import { Button, ContextMenu, Dropdown, InputText, Textarea } from "@alpac/design-system";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useUnitOfMeasurement } from "@app/modules/unit-of-measurement/hooks/useUnitOfMeasurement";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { SelectProductModal } from "@app/modules/product/ui/views/select-product-modal/select-product-modal";
import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";
import {
	formatAmount,
	validateIntegerNumber,
	validatePositiveNumber,
} from "@app/shared/utils/number.utils";
import { CreateProductModal } from "@app/modules/product/ui/views/create-product-modal/create-product-modal";
import type { PurchaseRequestDetailProps } from "./purchase-request-detail.types";
import type { CreatedProductDto } from "@app/modules/product/ui/views/create-product-modal/create-product-modal.types";
import { PurchaseRequestImageUploader } from "../purchase-request-image-uploader/purchase-request-image-uploader";
import type { CreatePurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/create-purchase-request-payload";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName = `${inputClassName} focus:border-blue-600! focus:ring-2! focus:ring-green-50/50!`;
const labelClassName = "text-black! dark:text-white!";
const contextMenuButton = "text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!";

const parseIntegerInput = (value: string): number | "" => {
	const formatted = formatAmount(value, 10, 0);
	const raw = formatted.replace(/,/g, "");
	return raw === "" ? "" : Number(raw);
};

const formatIntegerDisplay = (value: number | "" | undefined): string => {
	if (value === "" || value === undefined || value === null) return "";
	return formatAmount(String(value), 10, 0);
};

const hasUnitsPerPackage = (label?: string, symbol?: string) => {
	const unitLabel = label?.toLowerCase() ?? "";
	const unitSymbol = symbol?.toLowerCase() ?? "";

	return (
		unitLabel.includes("caja") ||
		unitLabel.includes("paquete") ||
		unitSymbol.includes("caja") ||
		unitSymbol.includes("paquete") ||
		unitSymbol === "cj" ||
		unitSymbol === "paq"
	);
};

export const PurchaseRequestDetail = (
	{ disableActions, onRequestError, onRequestSuccess }: PurchaseRequestDetailProps
) => {

	const { companyId, moduleCode } = useUserStore();
	const [isSelectProductOpen, setIsSelectProductOpen] = useState(false);
	const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);

	const {
		control,
		watch,
		setValue,
		clearErrors,
		formState: { errors },
	} = useFormContext<CreatePurchaseRequestPayload>();

	const { fields, append, remove } = useFieldArray({
		control,
		name: "purchase_request_items",
	});

	const { GetUnitMeasurements } = useUnitOfMeasurement({
		payloadUnitOfMeasurement: {
			companie_id: companyId,
			module_code: moduleCode,
		},
	});

	const { data: unitsOfMeasurement, isLoading: isLoadingUnits } =
		GetUnitMeasurements;

	const unitsOfMeasurementOptions = useMemo(() => {
		if (isLoadingUnits) return [];
		if (!unitsOfMeasurement || !Array.isArray(unitsOfMeasurement)) return [];
		return unitsOfMeasurement.map((item) => ({
			value: item.unit_measure_id,
			label: item.name,
			symbol: item.symbol,
		}));
	}, [unitsOfMeasurement, isLoadingUnits]);

	const handleSelectProduct = (products: GetProductResponse[]) => {

		const existingIds = new Set(fields.map((item) => item.product_id));

		products.forEach((product) => {
			if (existingIds.has(product.product_id)) return;

			append({
				product_id: product.product_id,
				product_name: product.product_name,
				description: "",
				quantity: 0,
				quantity_unit: 0,
				unit_measure_id: "",
				justification: "",
				images: {
					images_product_to_changed: [],
				},
			});
		});
	};

	const handleCreateProduct = (product: CreatedProductDto) => {

		const existingIds = new Set(fields.map((item) => item.product_id));

		if (existingIds.has(product?.data?.product_id)) return;

		append({
			product_id: product?.data?.product_id,
			product_name: product?.product_name,
			description: "",
			quantity: 0,
			quantity_unit: 0,
			unit_measure_id: "",
			justification: "",
			images: {
				images_product_to_changed: [],
			},
		});
	}

	const assignedProductIds = useMemo(
		() =>
			fields
				.map((field) => field.product_id)
				.filter((id): id is string => Boolean(id)),
		[fields],
	);

	return (
		<div className="flex flex-col gap-3 border-t border-t-slate-300 pt-2 dark:border-t-neutral-600">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="min-w-0 flex flex-col">
					<span className="text-[15px] font-medium text-black dark:text-white">
						Productos solicitados
					</span>
					<small className="text-gray-500 dark:text-gray-300">
						Seleccione los productos y complete cantidad y unidad de medida
					</small>
				</div>

				<div className="shrink-0 self-stretch sm:self-auto">
					<ContextMenu
						triggerClassName={contextMenuButton}
						triggerLabel="Agregar Producto"
						triggerIcon={<PlusIcon size={18} />}
						disabled={disableActions}
						items={[
							{
								label: "Agregar Producto Existente",
								onClick: () => {
									setIsSelectProductOpen(true);
									clearErrors();
								}
							},
							{
								label: "Crear Nuevo Producto",
								onClick: () => {
									setIsCreateProductOpen(true);
									clearErrors();
								}
							},
						]}
					/>
				</div>
			</div>

			{errors.purchase_request_items?.root?.message ||
				errors.purchase_request_items?.message ? (
				<p className="m-0 text-sm text-red-500 dark:text-red-400">
					{errors.purchase_request_items?.root?.message ||
						errors.purchase_request_items?.message}
				</p>
			) : null}

			{fields.length === 0 ? (
				<p className="m-0 text-sm text-slate-500 dark:text-slate-400">
					Aún no hay productos agregados a esta requisición.
				</p>
			) : null}

			{fields.map((item, index) => {
				const selectedUnitId = watch(
					`purchase_request_items.${index}.unit_measure_id`,
				);
				const selectedUnit = unitsOfMeasurementOptions.find(
					(option) => String(option.value) === String(selectedUnitId),
				);
				const isBoxOrPackage = hasUnitsPerPackage(
					selectedUnit?.label,
					selectedUnit?.symbol,
				);

				return (
					<div
						key={item.id}
						className="flex w-full flex-col gap-5 rounded-md border border-slate-200 p-4 dark:border-neutral-600 dark:bg-[#1e2229]"
					>
						<div className="flex min-w-0 items-center justify-between gap-3">
							<span className="min-w-0 truncate text-[15px] font-semibold text-slate-700 dark:text-slate-200">
								{index + 1} · Producto · {item.product_name || `#${index + 1}`}
							</span>
							<Button
								type="button"
								size="small"
								tooltip="Quitar producto"
								icon={<Trash2Icon size={18} />}
								onClick={() => remove(index)}
								className="h-10 w-10! shrink-0 rounded-md! bg-red-500! text-[13px]! text-white! hover:bg-red-800! dark:bg-red-900!"
							/>
						</div>


						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

							<div>
								<InputText
									label={`Producto #${index + 1}`}
									placeholder="Producto seleccionado"
									className={inputClassName}
									labelClassName={labelClassName}
									value={item.product_name ?? ""}
									disabled
								/>
							</div>
							<div>
								<Controller
									name={`purchase_request_items.${index}.quantity`}
									control={control}
									rules={{
										required: "La cantidad es requerida",
										validate: {
											validateInteger: (value) => validateIntegerNumber(value),
											validatePositive: (value) => validatePositiveNumber(value),
										},
									}}
									render={({ field }) => (
										<InputText
											label="Cantidad"
											type="text"
											inputMode="numeric"
											placeholder="0"
											isRequired

											className={inputClassName}
											labelClassName={labelClassName}
											value={formatIntegerDisplay(field.value)}
											onChange={(e) =>
												field.onChange(parseIntegerInput(e.target.value))
											}
											error={
												errors.purchase_request_items?.[index]?.quantity?.message
											}
											errorVariant="text"
										/>
									)}
								/>
							</div>

							<div>
								<Controller
									name={`purchase_request_items.${index}.unit_measure_id`}
									control={control}
									rules={{ required: "La unidad es requerida" }}
									render={({ field }) => (
										<Dropdown
											label="Unidad de Medida"
											isRequired
											options={unitsOfMeasurementOptions}
											placeholder={
												isLoadingUnits ? "Cargando unidades..." : "Seleccione..."
											}
											onChange={(value) => {
												const nextUnitId = String(value ?? "");
												field.onChange(nextUnitId);

												const nextUnit = unitsOfMeasurementOptions
													.find((option) => String(option.value) === nextUnitId);

												const nextIsBoxOrPackage = hasUnitsPerPackage(
													nextUnit?.label,
													nextUnit?.symbol,
												);

												if (!nextIsBoxOrPackage) {
													setValue(
														`purchase_request_items.${index}.quantity_unit`,
														0,
														{ shouldValidate: false },
													);
													clearErrors(
														`purchase_request_items.${index}.quantity_unit`,
													);
												}
											}}
											error={
												errors.purchase_request_items?.[index]?.unit_measure_id
													?.message
											}
											errorVariant="text"
											value={field.value}
											appearance="dark"
											labelClassName={labelClassName}
											valueClassName={labelClassName}
											className={dropdownClassName}
										/>
									)}
								/>
							</div>

							<div>
								<Controller
									name={`purchase_request_items.${index}.quantity_unit`}
									control={control}
									rules={{
										validate: (value, formValues) => {
											const unitId =
												formValues.purchase_request_items?.[index]
													?.unit_measure_id;
											const unit = unitsOfMeasurementOptions.find(
												(option) => String(option.value) === String(unitId),
											);
											const requiresUnitsPerPackage = hasUnitsPerPackage(
												unit?.label,
												unit?.symbol,
											);

											if (!requiresUnitsPerPackage) return true;

											if (value === 0 || value === undefined || value === null) {
												return "Agregue las unidades por presentación";
											}

											const integerResult = validateIntegerNumber(value);
											if (integerResult !== true) return integerResult;

											return validatePositiveNumber(value);
										},
									}}
									render={({ field }) => (
										<InputText
											label="Unidades por presentación"
											type="text"
											inputMode="numeric"
											placeholder="0"
											isRequired={isBoxOrPackage}
											disabled={!isBoxOrPackage}
											className={inputClassName}
											labelClassName={labelClassName}
											value={formatIntegerDisplay(field.value ?? 0)}
											onChange={(e) =>
												field.onChange(parseIntegerInput(e.target.value))
											}
											error={
												errors.purchase_request_items?.[index]?.quantity_unit
													?.message
											}
											errorVariant="text"
										/>
									)}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4">
							<div>
								<Controller
									name={`purchase_request_items.${index}.description`}
									control={control}
									rules={{
										required: false,
									}}
									render={({ field }) => (
										<Textarea
											label="Descripción"
											placeholder="Ej. Resma de papel bond carta, 75 g, paquete de 500 hojas."
											className={inputClassName}
											labelClassName={labelClassName}
											value={field.value ?? ""}
											onChange={field.onChange}
											enableCharacterCount
										/>
									)}
								/>
							</div>

							<div>
								<Controller
									name={`purchase_request_items.${index}.justification`}
									control={control}
									rules={{
										required: "La justificación de compra es requerida",
									}}
									render={({ field }) => (
										<Textarea
											label="Justificación"
											isRequired
											placeholder="Ej. Se requiere para reponer el inventario de papelería del área, el stock actual no cubre la demanda."
											className={inputClassName}
											labelClassName={labelClassName}
											value={field.value ?? ""}
											onChange={field.onChange}
											enableCharacterCount
											error={
												errors.purchase_request_items?.[index]?.justification
													?.message
											}
										/>
									)}
								/>
							</div>
						</div>

						<Controller
							name={`purchase_request_items.${index}.images.images_product_to_changed`}
							control={control}
							render={({ field }) => (
								<PurchaseRequestImageUploader
									value={field.value ?? []}
									onChange={(value) => field.onChange(value)}
								/>
							)}
						/>
					</div>
				);
			})}

			<Controller
				name="purchase_request_items"
				control={control}
				rules={{
					validate: (value) =>
						(value?.length ?? 0) > 0 ||
						"Debe agregar al menos un producto a la requisición",
				}}
				render={({ field }) => (
					<input
						type="hidden"
						ref={field.ref}
						name={field.name}
						value={JSON.stringify(field.value ?? [])}
						readOnly
					/>
				)}
			/>

			<SelectProductModal
				isOpen={isSelectProductOpen}
				onClose={() => setIsSelectProductOpen(false)}
				onSelect={handleSelectProduct}
				selectionType="multiple"
				excludeProductIds={assignedProductIds}
			/>

			<CreateProductModal
				isOpen={isCreateProductOpen}
				onClose={() => setIsCreateProductOpen(false)}
				onRequestSuccess={onRequestSuccess}
				onRequestError={onRequestError}
				onSubmit={handleCreateProduct}
			/>
		</div>
	);
};
