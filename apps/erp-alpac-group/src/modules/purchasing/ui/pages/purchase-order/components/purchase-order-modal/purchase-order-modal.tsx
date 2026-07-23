import { useEffect, useState } from "react";
import { Button, DatePicker, Dropdown, Modal, Textarea } from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import type { PurchaseOrderModalProps } from "./purchase-order-modal.types";
import { QuotesSelectionModal } from "../quote-selection-modal/quote-selection-modal";
import dayjs from "dayjs";
import { CurrencyOptions } from "@app/core/enums/currency.enum";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

type PurchaseOrderFormValues = {
	expected_delivery_date: string;
	currency: number;
	notes: string;
	payment_type: number;
};

const emptyFormValues: PurchaseOrderFormValues = {
	expected_delivery_date: "",
	currency: -1,
	notes: "",
	payment_type: -1
};

export const PurchaseOrderModal = ({
	isOpen,
	onClose,
	onSubmit,
	selectedPurchaseOrder,
}: PurchaseOrderModalProps) => {
	const isEditMode = Boolean(selectedPurchaseOrder?.purchase_order_id);
	const [isQuoteSelectionModalOpen, setIsQuoteSelectionModalOpen] =
		useState(false);

	const { control, handleSubmit, reset, formState: { errors } } = useForm<PurchaseOrderFormValues>({
		defaultValues: emptyFormValues,
	});

	useEffect(() => {
		if (!isOpen) return;

		if (selectedPurchaseOrder) {
			reset({
				notes: "",
			});
			return;
		}

		reset(emptyFormValues);
	}, [isOpen, selectedPurchaseOrder, reset]);

	const handleSelectQuotes = () => {
		setIsQuoteSelectionModalOpen(true);
	};

	const handleFormSubmit = handleSubmit(() => {
		onSubmit?.();
	});

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={isEditMode ? "Editar Orden de Compra" : "Agregar Orden de Compra"}
			variant="form"
			size="5xl"
			description={
				isEditMode
					? "Modifique la información de la orden de compra"
					: "Complete la información de la orden de compra"
			}
		>
			<form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="flex flex-col gap-1.5 w-full max-w-full box-border">
						<span className="text-[14px] font-medium ml-0.5 text-black! dark:text-white!">
							Cotización Origen
						</span>
						<Button
							label="Seleccionar cotización"
							type="button"
							size="giant"
							className="text-[15px]! h-12! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
							onClick={handleSelectQuotes}
						/>
					</div>
				</div>

				<Controller
					name="expected_delivery_date"
					control={control}
					rules={{
						required: "La fecha límite es requerida",
						validate: (value) => {
							if (!value) return "La fecha límite es requerida";

							const selectedDate = dayjs(value).startOf("day");
							if (!selectedDate.isValid()) {
								return "La fecha no es válida";
							}

							if (!selectedDate.isAfter(dayjs().startOf("day"), "day")) {
								return "La fecha límite debe ser una fecha futura";
							}

							return true;
						},
					}}
					render={({ field }) => (
						<DatePicker
							fieldWidth="large"
							label="Fecha de entrega esperada"
							labelAbove
							isRequired
							minDate={dayjs().add(0, "day")}
							className={inputClassName}
							labelClassName={labelClassName}
							value={field.value ? dayjs(field.value) : null}
							onChange={(value) => {
								field.onChange(
									value ? dayjs(value).format("YYYY-MM-DD") : "",
								);
							}}
							error={errors.expected_delivery_date?.message}
						/>
					)}
				/>

				<Controller
					name="currency"
					control={control}
					rules={{
						required: "Debe seleccionar tipo de condiciones de pago",
						validate: (val) => val !== 0 || "Selección inválida",
					}}
					render={({ field }) => (
						<Dropdown
							label="Condiciones de pago"
							isRequired
							options={[{ value: 1, label: "Contado" }, { value: 2, label: "Credito" }]}
							placeholder="Seleccione..."
							onChange={(value) => field.onChange(value)}
							error={errors.currency?.message as string}
							value={field.value}
							appearance="dark"
							labelClassName={labelClassName}
							valueClassName={labelClassName}
							className={inputClassName}
						/>
					)}
				/>

				<Controller
					name="currency"
					control={control}
					rules={{
						required: "Debe seleccionar una moneda",
						validate: (val) => val !== 0 || "Selección inválida",
					}}
					render={({ field }) => (
						<Dropdown
							label="Moneda"
							isRequired
							options={CurrencyOptions ?? []}
							placeholder="Seleccione..."
							onChange={(value) => field.onChange(value)}
							error={errors.currency?.message as string}
							value={field.value}
							appearance="dark"
							labelClassName={labelClassName}
							valueClassName={labelClassName}
							className={inputClassName}
						/>
					)}
				/>

				<Controller
					name="notes"
					control={control}
					render={({ field }) => (
						<Textarea
							label="Notas / Observaciones"
							placeholder="Observaciones de la orden..."
							className={inputClassName}
							labelClassName={labelClassName}
							value={field.value}
							onChange={field.onChange}
							maxLength={500}
							style={{
								resize: "none",
								minHeight: "100px",
							}}
						/>
					)}
				/>

				<div className="flex justify-end gap-3 pt-2">
					<Button
						type="button"
						size="giant"
						label="Cancelar"
						onClick={onClose}
						className="text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
					/>
					<Button
						type="submit"
						size="giant"
						label={isEditMode ? "Guardar cambios" : "Crear orden"}
						className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
					/>
				</div>
			</form>

			<QuotesSelectionModal
				isOpen={isQuoteSelectionModalOpen}
				selectionType="single"
				onClose={() => {
					setIsQuoteSelectionModalOpen(false);
				}}
			/>
		</Modal>
	);
};
