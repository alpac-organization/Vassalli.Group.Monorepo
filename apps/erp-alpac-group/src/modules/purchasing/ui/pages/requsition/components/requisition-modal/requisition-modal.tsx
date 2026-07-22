import { useEffect, useMemo } from "react";
import {
	Button,
	DatePicker,
	Dropdown,
	Modal,
	Textarea,
} from "@alpac/design-system";
import { Controller, useForm, useWatch } from "react-hook-form";
import dayjs from "dayjs";
import type {
	RequisitionItem,
	RequisitionModalProps,
} from "./requisition-modal.types";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAreas } from "@app/modules/admin/ui/hooks/areas/useAreas";
import { useCostCenters } from "@app/modules/admin/ui/hooks/cost-centers/useCostCenters";
import { RequisitionDetail } from "../requisition-detail/requisition-detail";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName = `${inputClassName} focus:border-blue-600! focus:ring-2! focus:ring-green-50/50!`;
const labelClassName = "text-black! dark:text-white!";

const emptyItem: RequisitionItem = {
	product_id: "",
	description: "",
	quantity: "",
	unit: "",
	product_category: "",
};

type RequisitionFormValues = {
	requisition_number: string;
	requester_name: string;
	area_id: string;
	cost_center_id: string;
	request_date: string;
	required_date: string;
	status: string;
	notes: string;
	items: RequisitionItem[];
};

const emptyFormValues: RequisitionFormValues = {
	requisition_number: "",
	requester_name: "",
	area_id: "",
	cost_center_id: "",
	request_date: "",
	required_date: "",
	status: "draft",
	notes: "",
	items: [{ ...emptyItem }],
};

export const RequisitionModal = ({
	isOpen,
	onClose,
	onSubmit,
	selectedRequisition,
}: RequisitionModalProps) => {
	const { companyId } = useUserStore();

	const isEditMode = Boolean(selectedRequisition?.requisition_id);

	const { GetAreasByCompany: GetAreasQuery } = useAreas({
		company_id: companyId ?? "",
	});

	const areasOptions = useMemo(
		() =>
			(GetAreasQuery.data ?? []).map((area) => ({
				label: area.work_area_name,
				value: area.work_area_id,
			})),
		[GetAreasQuery.data],
	);

	const {
		control,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = useForm<RequisitionFormValues>({
		defaultValues: emptyFormValues,
	});



	const selectedAreaId = useWatch({ control, name: "area_id" });

	const costCentersPayload = useMemo(() => {
		if (!companyId || !selectedAreaId) return undefined;
		return {
			company_id: companyId,
			area_id: selectedAreaId,
		};
	}, [companyId, selectedAreaId]);

	const { GetCostCenters } = useCostCenters(costCentersPayload);

	const costCenterOptions = useMemo(
		() =>
			(GetCostCenters.data ?? []).map((costCenter) => ({
				label: costCenter.cost_center_name,
				value: costCenter.cost_center_id,
			})),
		[GetCostCenters.data],
	);

	useEffect(() => {
		if (!isOpen) return;

		if (selectedRequisition) {
			reset({
				requisition_number: selectedRequisition.requisition_number,
				requester_name: selectedRequisition.requester_name,
				area_id: selectedRequisition.area_id,
				cost_center_id: selectedRequisition.cost_center_id,
				request_date: selectedRequisition.request_date,
				required_date: selectedRequisition.required_date,
				status: selectedRequisition.status,
				notes: "",
				items:
					selectedRequisition.items?.length > 0
						? selectedRequisition.items
						: [{ ...emptyItem }],
			});
			return;
		}

		reset({
			...emptyFormValues,
			items: [{ ...emptyItem }],
		});
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
			size="7xl"
			description={
				isEditMode
					? "Modifique la información de la requisición"
					: "Complete la información de la requisición"
			}
		>
			<form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Controller
						name="area_id"
						control={control}
						rules={{
							required: "Debe seleccionar un área de trabajo",
							validate: (val) => !!val || "Selección inválida",
						}}
						render={({ field }) => (
							<Dropdown
								label="Área de Trabajo"
								isRequired
								options={areasOptions ?? []}
								placeholder="Seleccione..."
								onChange={(value) => {
									field.onChange(value);
									setValue("cost_center_id", "");
								}}
								error={errors.area_id && errors.area_id?.message}
								value={field.value}
								appearance="dark"
								labelClassName="text-black! dark:text-white!"
								valueClassName="text-black! dark:text-white!"
								className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
							/>
						)}
					/>

					<Controller
						name="cost_center_id"
						control={control}
						rules={{
							required: "Debe seleccionar un centro de costo",
							validate: (val) => !!val || "Selección inválida",
						}}
						render={({ field }) => (
							<Dropdown
								label="Centro de Costo"
								isRequired
								options={costCenterOptions}
								placeholder={
									selectedAreaId
										? "Seleccione..."
										: "Seleccione un área primero"
								}
								onChange={(value) => field.onChange(value)}
								error={
									errors.cost_center_id && errors.cost_center_id?.message
								}
								value={field.value}
								appearance="dark"
								labelClassName="text-black! dark:text-white!"
								valueClassName="text-black! dark:text-white!"
								className={dropdownClassName}
							/>
						)}
					/>

					<Controller
						name="required_date"
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
								label="Fecha límite requerida"
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
								error={errors.required_date?.message}
							/>
						)}
					/>
				</div>

				<RequisitionDetail />

				<Controller
					name="notes"
					control={control}
					render={({ field }) => (
						<Textarea
							label="Motivos / Observación"
							placeholder="Motivos u Observación de la requisición..."
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
						label={isEditMode ? "Guardar cambios" : "Crear requisición"}
						className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
					/>
				</div>
			</form>
		</Modal>
	);
};
