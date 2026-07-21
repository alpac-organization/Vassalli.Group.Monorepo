import { useEffect, useState } from "react";
import { Button, Dropdown, InputText, Modal, Textarea } from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import type { PurchaseOrderModalProps } from "./purchase-order-modal.types";
import { QuotesSelectionModal } from "../quote-selection-modal/quote-selection-modal";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName =
	`${inputClassName} focus:border-blue-600! focus:ring-2! focus:ring-green-50/50!`;
const labelClassName = "text-black! dark:text-white!";

const statusOptions = [
	{ label: "Borrador", value: "draft" },
	{ label: "Pendiente", value: "pending" },
	{ label: "Aprobada", value: "approved" },
	{ label: "Recibida", value: "received" },
	{ label: "Cancelada", value: "cancelled" },
];

type PurchaseOrderFormValues = {
	order_number: string;
	supplier_name: string;
	order_date: string;
	total_amount: string;
	status: string;
	notes: string;
};

const emptyFormValues: PurchaseOrderFormValues = {
	order_number: "",
	supplier_name: "",
	order_date: "",
	total_amount: "",
	status: "draft",
	notes: "",
};

export const PurchaseOrderModal = ({
	isOpen,
	onClose,
	onSubmit,
	selectedPurchaseOrder,
}: PurchaseOrderModalProps) => {

	const isEditMode = Boolean(selectedPurchaseOrder?.purchase_order_id);
	const [isQuoteSelectionModalOpen, setIsQuoteSelectionModalOpen] = useState(false);

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<PurchaseOrderFormValues>({
		defaultValues: emptyFormValues,
	});

	useEffect(() => {
		if (!isOpen) return;

		if (selectedPurchaseOrder) {
			reset({
				order_number: selectedPurchaseOrder.order_number,
				supplier_name: selectedPurchaseOrder.supplier_name,
				order_date: selectedPurchaseOrder.order_date,
				total_amount: selectedPurchaseOrder.total_amount,
				status: selectedPurchaseOrder.status,
				notes: "",
			});
			return;
		}

		reset(emptyFormValues);
	}, [isOpen, selectedPurchaseOrder, reset]);

	const handleSelectQuotes = () => {
		setIsQuoteSelectionModalOpen(true)
	}

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
					<Controller
						name="order_number"
						control={control}
						rules={{ required: "El número de orden es requerido" }}
						render={({ field }) => (
							<InputText
								label="N° Orden"
								placeholder="Ej. OC-2026-001"
								className={inputClassName}
								labelClassName={labelClassName}
								value={field.value}
								onChange={field.onChange}
								error={errors.order_number?.message}
							/>
						)}
					/>

					<div className="flex flex-col gap-1.5 w-full max-w-full box-border">
						<span className="text-[14px] font-medium  ml-0.5 text-black! dark:text-white!">Asociar cotización</span>
						<Button
							label="Seleccionar cotización"
							type="button"
							size="giant"
							className="text-[15px]! h-12! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
							onClick={handleSelectQuotes}
						/>
					</div>

					<Controller
						name="order_date"
						control={control}
						rules={{ required: "La fecha es requerida" }}
						render={({ field }) => (
							<InputText
								label="Fecha"
								type="date"
								className={inputClassName}
								labelClassName={labelClassName}
								value={field.value}
								onChange={field.onChange}
								error={errors.order_date?.message}
							/>
						)}
					/>

					<Controller
						name="status"
						control={control}
						render={({ field }) => (
							<Dropdown
								label="Estado"
								placeholder="Seleccione..."
								appearance="dark"
								options={statusOptions}
								value={field.value}
								onChange={(value) => field.onChange(String(value))}
								className={dropdownClassName}
								labelClassName={labelClassName}
								valueClassName={labelClassName}
							/>
						)}
					/>
				</div>

				<Controller
					name="notes"
					control={control}
					render={({ field }) => (
						<Textarea
							label="Notas"
							placeholder="Observaciones de la orden..."
							className={inputClassName}
							labelClassName={labelClassName}
							value={field.value}
							onChange={field.onChange}
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
					setIsQuoteSelectionModalOpen(false)
				}}
			/>
		</Modal>
	);
};
