import { useMemo, useState } from "react";
import { Button, Dropdown, InputText } from "@alpac/design-system";
import { PlusIcon, X } from "lucide-react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useUnitOfMeasurement } from "@app/modules/unit-of-measurement/hooks/useUnitOfMeasurement";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { SelectProductModal } from "@app/modules/product/ui/views/select-product-modal/select-product-modal";

import type { CreatePurchaseRequestFormValues } from "../purchase-request-modal/purchase-request-modal.types";
import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";
import {
	formatAmount,
	validateIntegerNumber,
	validatePositiveNumber,
} from "@app/shared/utils/number.utils";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName = `${inputClassName} focus:border-blue-600! focus:ring-2! focus:ring-green-50/50!`;
const labelClassName = "text-black! dark:text-white!";

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

export const PurchaseRequestDetail = () => {
	const { companyId, moduleCode } = useUserStore();
	const [isSelectProductOpen, setIsSelectProductOpen] = useState(false);

	const {
		control,
		watch,
		setValue,		
		clearErrors,
		formState: { errors },
	} = useFormContext<CreatePurchaseRequestFormValues>();

	const { fields, append, remove } = useFieldArray({
		control,
		name: "requested_products",
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
				description: product.product_name,
				quantity: "",
				quantity_unit: "",
				unit_measure_id: "",
				justification: "",
			});
		});
	};

	const assignedProductIds = useMemo(
		() =>
			fields
				.map((field) => field.product_id)
				.filter((id): id is string => Boolean(id)),
		[fields],
	);

	return (
		<div className="flex flex-col gap-3 border-t border-t-slate-300 pt-2 dark:border-t-neutral-600">
			<div className="flex items-center justify-between gap-3">
				<div className="flex flex-col">
					<span className="text-[15px] font-medium text-black dark:text-white">
						Productos solicitados
					</span>
					<small className="text-gray-500 dark:text-gray-300">
						Seleccione los productos y complete cantidad y unidad de medida
					</small>
				</div>
				<Button
					type="button"
					size="giant"
					label="Agregar producto"
					icon={<PlusIcon size={18} />}
					onClick={() => {
						setIsSelectProductOpen(true);
						clearErrors();
					}}
					className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
				/>
			</div>

			{errors.requested_products?.root?.message ||
			errors.requested_products?.message ? (
				<p className="m-0 text-sm text-red-500 dark:text-red-400">
					{errors.requested_products?.root?.message ||
						errors.requested_products?.message}
				</p>
			) : null}

			{fields.length === 0 ? (
				<p className="m-0 text-sm text-slate-500 dark:text-slate-400">
					Aún no hay productos agregados a esta requisición.
				</p>
			) : null}

			{fields.map((item, index) => {
				const selectedUnitId = watch(
					`requested_products.${index}.unit_measure_id`,
				);
				const selectedUnit = unitsOfMeasurementOptions.find(
					(option) => option.value === selectedUnitId,
				);
				const isBoxOrPackage = hasUnitsPerPackage(
					selectedUnit?.label,
					selectedUnit?.symbol,
				);

				return (
					<div
						key={item.id}
						className="grid w-full grid-cols-1 items-end gap-3 md:grid-cols-[minmax(0,1fr)_7rem_12rem_12rem_minmax(0,1fr)_2.75rem] dark:border-neutral-600"
					>
						<div>
							<InputText
								label={`Producto #${index + 1}`}
								placeholder="Producto seleccionado"
								className={inputClassName}
								labelClassName={labelClassName}
								value={item.description ?? ""}
								disabled
							/>
						</div>

						<div>
							<Controller
								name={`requested_products.${index}.quantity`}
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
											errors.requested_products?.[index]?.quantity?.message
										}
										errorVariant="tooltip"
									/>
								)}
							/>
						</div>

						<div>
							<Controller
								name={`requested_products.${index}.unit_measure_id`}
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

											const nextUnit = unitsOfMeasurementOptions.find(
												(option) => option.value === nextUnitId,
											);
											const nextIsBoxOrPackage = hasUnitsPerPackage(
												nextUnit?.label,
												nextUnit?.symbol,
											);

											if (!nextIsBoxOrPackage) {
												setValue(
													`requested_products.${index}.quantity_unit`,
													"",
													{ shouldValidate: true },
												);
											}
										}}
										error={
											errors.requested_products?.[index]?.unit_measure_id
												?.message
										}
										errorVariant="tooltip"
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
								name={`requested_products.${index}.quantity_unit`}
								control={control}
								rules={
									isBoxOrPackage
										? {
												required: "Agregue las unidades por presentación",
												validate: {
													validateInteger: (value) =>
														validateIntegerNumber(value),
													validatePositive: (value) =>
														validatePositiveNumber(value),
												},
											}
										: undefined
								}
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
										value={formatIntegerDisplay(field.value)}
										onChange={(e) =>
											field.onChange(parseIntegerInput(e.target.value))
										}
										error={
											errors.requested_products?.[index]?.quantity_unit
												?.message
										}
										errorVariant="tooltip"
									/>
								)}
							/>
						</div>

						<div>
							<Controller
								name={`requested_products.${index}.justification`}
								control={control}
								rules={{
									required: "La justificación de compra es requerida",
								}}
								render={({ field }) => (
									<InputText
										label="Justificación"
										isRequired
										placeholder="Justificación del producto"
										className={inputClassName}
										labelClassName={labelClassName}
										value={field.value ?? ""}
										onChange={field.onChange}
										error={
											errors.requested_products?.[index]?.justification
												?.message
										}
										errorVariant="tooltip"
									/>
								)}
							/>
						</div>

						<div className="flex h-11 md:items-center md:justify-end">
							<div className="group relative flex items-center">
								<button
									type="button"
									className="rounded-full bg-red-500! p-1 text-white! transition-all dark:bg-red-700!"
									onClick={() => remove(index)}
									aria-label="Quitar producto"
								>
									<X size={16} />
								</button>
							</div>
						</div>
					</div>
				);
			})}

			<Controller
				name="requested_products"
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
		</div>
	);
};
