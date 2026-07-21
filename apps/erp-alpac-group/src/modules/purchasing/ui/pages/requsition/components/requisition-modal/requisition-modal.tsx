import { useEffect } from "react";
import { Button, Dropdown, InputText, Modal, Textarea } from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import type { RequisitionModalProps } from "./requisition-modal.types";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName =
	`${inputClassName} focus:border-blue-600! focus:ring-2! focus:ring-green-50/50!`;
const labelClassName = "text-black! dark:text-white!";

const statusOptions = [
	{ label: "Borrador", value: "draft" },
	{ label: "Pendiente", value: "pending" },
	{ label: "Aprobada", value: "approved" },
	{ label: "Rechazada", value: "rejected" },
	{ label: "Cancelada", value: "cancelled" },
];

type RequisitionFormValues = {
	requisition_number: string;
	requester_name: string;
	area_name: string;
	request_date: string;
	status: string;
	notes: string;
};

const emptyFormValues: RequisitionFormValues = {
	requisition_number: "",
	requester_name: "",
	area_name: "",
	request_date: "",
	status: "draft",
	notes: "",
};

export const RequisitionModal = ({
	isOpen,
	onClose,
	onSubmit,
	selectedRequisition,
}: RequisitionModalProps) => {
	const isEditMode = Boolean(selectedRequisition?.requisition_id);

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<RequisitionFormValues>({
		defaultValues: emptyFormValues,
	});

	useEffect(() => {
		if (!isOpen) return;

		if (selectedRequisition) {
			reset({
				requisition_number: selectedRequisition.requisition_number,
				requester_name: selectedRequisition.requester_name,
				area_name: selectedRequisition.area_name,
				request_date: selectedRequisition.request_date,
				status: selectedRequisition.status,
				notes: "",
			});
			return;
		}

		reset(emptyFormValues);
	}, [isOpen, selectedRequisition, reset]);

	const handleFormSubmit = handleSubmit(() => {
		onSubmit?.();
	});

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={isEditMode ? "Editar Requisición" : "Agregar Requisición"}
			variant="form"
			size="5xl"
			description={
				isEditMode
					? "Modifique la información de la requisición"
					: "Complete la información de la requisición"
			}
		>
			<form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Controller
						name="requisition_number"
						control={control}
						rules={{ required: "El número de requisición es requerido" }}
						render={({ field }) => (
							<InputText
								label="N° Requisición"
								placeholder="Ej. REQ-2026-001"
								className={inputClassName}
								labelClassName={labelClassName}
								value={field.value}
								onChange={field.onChange}
								error={errors.requisition_number?.message}
							/>
						)}
					/>

					<Controller
						name="requester_name"
						control={control}
						rules={{ required: "El solicitante es requerido" }}
						render={({ field }) => (
							<InputText
								label="Solicitante"
								placeholder="Ej. Juan Pérez"
								className={inputClassName}
								labelClassName={labelClassName}
								value={field.value}
								onChange={field.onChange}
								error={errors.requester_name?.message}
							/>
						)}
					/>

					<Controller
						name="area_name"
						control={control}
						rules={{ required: "El área es requerida" }}
						render={({ field }) => (
							<InputText
								label="Área"
								placeholder="Ej. Operaciones"
								className={inputClassName}
								labelClassName={labelClassName}
								value={field.value}
								onChange={field.onChange}
								error={errors.area_name?.message}
							/>
						)}
					/>

					<Controller
						name="request_date"
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
								error={errors.request_date?.message}
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
							placeholder="Observaciones de la requisición..."
							className={inputClassName}
							labelClassName={labelClassName}
							value={field.value}
							onChange={field.onChange}
							maxLength={500}
							style={{
								resize: "none",
								minHeight: "100px"
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
						label={isEditMode ? "Guardar cambios" : "Crear requisición"}
						className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
					/>
				</div>
			</form>
		</Modal>
	);
};
