import { useMemo, useState } from "react";
import { AccordionItem, Button, ContextMenu, Dropdown, InputText } from "@alpac/design-system";
import { PlusIcon, Trash2 } from "lucide-react";
import { quoteFormDangerButtonClassName } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/styles/create-quote-form.styles";
import { SelectSupplierModal } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/components/select-supplier-modal/select-supplier-modal";
import { SupplierModal } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/supplier-modal";
import type { QuoteDetailAccordionProps } from "./quote-detail-accordion.types";
import { Controller } from "react-hook-form";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useUnitOfMeasurement } from "@app/modules/unit-of-measurement/hooks/useUnitOfMeasurement";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName = `${inputClassName} focus:border-blue-600! focus:ring-2! focus:ring-green-50/50!`;
const labelClassName = "text-black! dark:text-white!";

export function QuoteDetailAccordion({
	quoteDetailIndex,
	accordionValue,
	product,
	onRemove,
}: QuoteDetailAccordionProps) {

	const { companyId, moduleCode } = useUserStore();
	const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
	const [isSelectSupplierOpen, setIsSelectSupplierOpen] = useState(false);

	const categoryName = product?.category?.name;

	const { GetUnitMeasurements } = useUnitOfMeasurement({
		payloadUnitOfMeasurement: {
			companie_id: companyId,
			module_code: moduleCode,
		},
	});

	const { data: unitsOfMeasurement, isLoading: isLoadingUnits } = GetUnitMeasurements;

	const unitsOfMeasurementOptions = useMemo(() => {
		if (isLoadingUnits) return [];
		if (!unitsOfMeasurement || !Array.isArray(unitsOfMeasurement)) return [];
		return unitsOfMeasurement.map((item) => ({
			value: item.unit_measure_id,
			label: item.name,
			symbol: item.symbol,
		}));
	}, [unitsOfMeasurement, isLoadingUnits]);

	return (
		<>
			<AccordionItem
				value={accordionValue}
				className="rounded-md! border-slate-300! dark:border-slate-600! dark:bg-[#272b34]!"
				contentClassName="p-4"
				title={
					<div className="flex min-w-0 items-center gap-3">
						<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-alpac-primary-500 text-sm font-semibold text-white dark:bg-alpac-primary-700">
							{quoteDetailIndex + 1}
						</span>
						<span className="flex min-w-0 flex-row items-center justify-center gap-4">
							<span className="block truncate text-[15px] font-semibold text-slate-800 dark:text-white">
								{product?.product_name ?? "Nuevo producto"}
							</span>
							{categoryName ? (
								<span className="block text-[12px] font-normal text-slate-500 dark:text-slate-400">
									{categoryName}
								</span>
							) : null}
						</span>
					</div>
				}
			>
				<div className="flex flex-col gap-1 dark:border-t-neutral-600">

					<div className="flex flex-row gap-3 items-end!">

						<Controller
							name={`testing1`}
							control={undefined}
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
								/>
							)}
						/>

						<Controller
							name={`testing2`}
							control={undefined}
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
									value={field.value}
									appearance="dark"
									labelClassName={labelClassName}
									valueClassName={labelClassName}
									className={dropdownClassName}
								/>
							)}
						/>

						<div className="flex gap-4 h-12">

							<ContextMenu
								items={[
									{
										label: "Agregar Nuevo Proveedor",
										onClick() {
											setIsSupplierModalOpen(true);
										},
									},
									{
										label: "Agregar Proveedor Existente",
										onClick() {
											setIsSelectSupplierOpen(true);
										},
									},
								]}
								triggerLabel="Agregar Proveedor"
								triggerIcon={<PlusIcon size={18} />}
								triggerClassName="text-[14px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
								triggerButtonSize="giant"
							/>
							
							<Button
								type="button"
								size="giant"
								tooltip="Eliminar Ítem"
								icon={<Trash2 size={18} />}
								onClick={onRemove}
								className={`${quoteFormDangerButtonClassName}`}
							/>
						</div>

					</div>
				</div>
			</AccordionItem>

			<SelectSupplierModal
				isOpen={isSelectSupplierOpen}
				onClose={() => setIsSelectSupplierOpen(false)}
				selectionType="multiple"
				onSelect={() => {
					// Pendiente: agregar proveedores seleccionados al detalle
				}}
			/>

			<SupplierModal
				isOpen={isSupplierModalOpen}
				onClose={() => setIsSupplierModalOpen(false)}
				onSubmit={() => {
					// Pendiente: asignar el proveedor creado al detalle
					setIsSupplierModalOpen(false);
				}}
			/>
		</>
	);
}
