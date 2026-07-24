import { useMemo, useState } from "react";
import { Button, Dropdown, InputText } from "@alpac/design-system";
import { PlusIcon, X } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useUnitOfMeasurement } from "@app/modules/unit-of-measurement/hooks/useUnitOfMeasurement";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useProduct } from "@app/modules/product/hooks/useProduct";
import type {
	RequisitionItems,
} from "../requisition-modal/requisition-modal.types";
import { RequisitionItemSelectionModal } from "../requisition-item-selection-modal/requisition-item-selection-modal";
import type { SelectableRequisitionProduct } from "../requisition-item-selection-modal/requisition-item-selection-modal.types";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName = `${inputClassName} focus:border-blue-600! focus:ring-2! focus:ring-green-50/50!`;
const labelClassName = "text-black! dark:text-white!";

export const RequisitionDetail = () => {
	const { companyId, moduleCode } = useUserStore();
	const [isItemSelectionOpen, setIsItemSelectionOpen] = useState(false);

	const {
		control,
		setValue,
		watch,
		formState: { errors },
	} = useForm<RequisitionItems>({
		defaultValues: {
			requisition_items: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "requisition_items",
	});

	const { GetUnitMeasurements } = useUnitOfMeasurement({
		payloadUnitOfMeasurement: {
			companie_id: companyId,
			module_code: moduleCode,
		},
	});

	const { GetProductCategories } = useProduct({
		productCategoryPayload: {
			company_id: companyId,
			module_code: moduleCode,
		},
	});

	const { data: unitsOfMeasurement, isLoading: isLoadingUnits } =
		GetUnitMeasurements;

	const {
		data: productCategories,
		isLoading: isLoadingProductCategories,
	} = GetProductCategories;

	const unitsOfMeasurementOptions = useMemo(() => {
		if (isLoadingUnits) return [];
		if (!unitsOfMeasurement || !Array.isArray(unitsOfMeasurement)) return [];
		return unitsOfMeasurement.map((item) => ({
			value: item.unit_measure_id,
			label: item.name,
			symbol: item.symbol,
		}));
	}, [unitsOfMeasurement, isLoadingUnits]);

	const productCategoryOptions = useMemo(() => {
		if (isLoadingProductCategories) return [];
		if (!productCategories || !Array.isArray(productCategories)) return [];
		return productCategories.map((item) => ({
			value: String(item.id),
			label: item.name,
		}));
	}, [productCategories, isLoadingProductCategories]);

	const handleSelectProduct = (products: SelectableRequisitionProduct[]) => {
		products.forEach((product) => {
			append({
				product_id: product.product_id,
				description: product.product_name,
				quantity: 0,
				unit: product.unit_measure_id || product.unit_measure_name,
				product_category:
					product.product_category_id || product.product_category_name,
				quantity_by_presentation: 0
			});
		});
	};

	return (
		<div className="flex flex-col gap-3 pt-2 border-t border-t-slate-300 dark:border-t-neutral-600">
			<div className="flex justify-between items-center gap-3">
				<div className="flex flex-col">
					<span className="text-[15px] font-medium text-black dark:text-white">
						Detalle de Insumos
					</span>
					<small className="text-gray-500 dark:text-gray-300">
						Seleccione los insumos solicitados y complete cantidad y unidad
					</small>
				</div>
				<Button
					type="button"
					size="giant"
					label="Agregar insumo"
					icon={<PlusIcon size={18} />}
					onClick={() => setIsItemSelectionOpen(true)}
					className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
				/>
			</div>

			{fields.map((item, index) => {
				const selectedUnitId = watch(`requisition_items.${index}.unit`);
				const selectedUnit = unitsOfMeasurementOptions.find(
					(option) => option.value === selectedUnitId,
				);
				const unitLabel = selectedUnit?.label?.toLowerCase() ?? "";
				const unitSymbol = selectedUnit?.symbol?.toLowerCase() ?? "";
				const isBoxOrPackage =
					unitLabel.includes("caja") ||
					unitLabel.includes("paquete") ||
					unitSymbol.includes("caja") ||
					unitSymbol.includes("paquete") ||
					unitSymbol === "cj" ||
					unitSymbol === "paq";

				return (
					<div
						key={item.id}
						className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_12rem_7rem_12rem_12rem_2.75rem] gap-3 items-end w-full dark:border-neutral-600"
					>
						<div>
							<Controller
								name={`requisition_items.${index}.description`}
								control={control}
								rules={{ required: "El insumo es requerido" }}
								render={({ field }) => (
									<InputText
										label={`Insumo #${index + 1}`}
										placeholder="Ej. Toner HP 85A"
										className={inputClassName}
										labelClassName={labelClassName}
										value={field.value}
										onChange={field.onChange}
										error={
											errors.requisition_items?.[index]?.description?.message
										}
									/>
								)}
							/>
						</div>

						<div>
							<Controller
								name={`requisition_items.${index}.product_category`}
								control={control}
								rules={{ required: "La categoría de producto es requerida" }}
								render={({ field }) => (
									<Dropdown
										label="Categoría de Producto"
										isRequired
										options={productCategoryOptions}
										placeholder={
											isLoadingProductCategories
												? "Cargando categorías..."
												: "Seleccione..."
										}
										onChange={(value) => field.onChange(String(value))}
										error={
											errors.requisition_items?.[index]?.product_category
												?.message
										}
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
								name={`requisition_items.${index}.quantity`}
								control={control}
								rules={{
									required: "La cantidad es requerida",
									validate: (value) => {
										const quantity = Number(value);
										if (!value || Number.isNaN(quantity)) {
											return "Ingrese una cantidad válida";
										}
										if (quantity <= 0) {
											return "La cantidad debe ser mayor a 0";
										}
										return true;
									},
								}}
								render={({ field }) => (
									<InputText
										label="Cantidad"
										type="number"
										placeholder="0"
										className={inputClassName}
										labelClassName={labelClassName}
										value={field.value}
										onChange={field.onChange}
										error={errors.requisition_items?.[index]?.quantity?.message}
									/>
								)}
							/>
						</div>

						<div>
							<Controller
								name={`requisition_items.${index}.unit`}
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
										onChange={(value) => field.onChange(String(value))}
										error={errors.requisition_items?.[index]?.unit?.message}
										value={field.value}
										appearance="dark"
										labelClassName={labelClassName}
										valueClassName={labelClassName}
										className={dropdownClassName}
									/>
								)}
							/>
						</div>

						{isBoxOrPackage ? (
							<div>
								<Controller
									name={`requisition_items.${index}.quantity_by_presentation`}
									control={control}
									rules={{
										required: "Agregue las unidades por presentación",
										validate: (value) => {
											const quantity = Number(value);
											if (!value || Number.isNaN(quantity)) {
												return "Ingrese una cantidad válida";
											}
											if (quantity <= 0) {
												return "La cantidad debe ser mayor a 0";
											}
											return true;
										},
									}}
									render={({ field }) => (
										<InputText
											label="Unidades por presentación"
											type="number"
											placeholder="0"
											className={inputClassName}
											labelClassName={labelClassName}
											value={field.value}
											onChange={field.onChange}
											error={
												errors.requisition_items?.[index]
													?.quantity_by_presentation?.message
											}
										/>
									)}
								/>
							</div>
						) : <span></span>
					}

						<div className="flex md:justify-end md:items-center h-11">
							<div className="group relative flex items-center">
								<button
									type="button"
									className="rounded-full p-1 transition-all text-white! bg-red-500! dark:bg-red-700!"
									onClick={() => {
										if (fields.length === 1) {
											setValue(`requisition_items.${index}.product_id`, "");
											setValue(`requisition_items.${index}.description`, "");
											setValue(`requisition_items.${index}.quantity`, 0);
											setValue(`requisition_items.${index}.unit`, "");
											setValue(`requisition_items.${index}.quantity_by_presentation`, 0);
											setValue(
												`requisition_items.${index}.product_category`,
												"",
											);
											return;
										}
										remove(index);
									}}
									aria-label="Quitar insumo"
								>
									<X size={16} />
								</button>

								<div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-slate-800 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
									Quitar insumo
								</div>
							</div>
						</div>
					</div>
				);
			})}

			<RequisitionItemSelectionModal
				isOpen={isItemSelectionOpen}
				onClose={() => setIsItemSelectionOpen(false)}
				onSubmit={handleSelectProduct}
				selectionType="multiple"
			/>
		</div>
	);
};
