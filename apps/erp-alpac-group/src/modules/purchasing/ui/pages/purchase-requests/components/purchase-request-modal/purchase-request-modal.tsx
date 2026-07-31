import { useEffect } from "react";
import { Button, DatePicker, Modal, Textarea } from "@alpac/design-system";
import { Controller, FormProvider, useForm } from "react-hook-form";
import dayjs from "dayjs";
import type {
	CreatePurchaseRequestFormValues,
	PurchaseRequestModalProps,
} from "./purchase-request-modal.types";
import { RequisitionDetail } from "../requisition-detail/requisition-detail";
import { toDateOnly } from "@app/shared/utils/date.utils";
import type { CreatePurchaseApplicationRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase-applications/create-purchase-application-request";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

const emptyFormValues = (): CreatePurchaseRequestFormValues => ({
	request_date: "",
	justification: "",
	requested_products: [],
});

export const PurchaseRequestModal = ({
	isOpen,
	onClose,
	onSubmit,
	currentBranchId,
	requestType,
}: PurchaseRequestModalProps) => {
	const methods = useForm<CreatePurchaseRequestFormValues>({
		defaultValues: emptyFormValues(),
		mode: "onSubmit",
	});

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = methods;

	useEffect(() => {
		reset(emptyFormValues());
	}, [isOpen, reset]);

	const handleClose = () => {
		reset(emptyFormValues());
		onClose();
	};

	const handleFormSubmit = handleSubmit((values) => {
		if (!currentBranchId) return;

		const payload: CreatePurchaseApplicationRequest = {
			branch_id: currentBranchId,
			request_date: values.request_date,
			request_type: Number(requestType.value),
			justification: values.justification.trim(),
			requested_products: values.requested_products.map((item) => {
				const productJustification = item.justification?.trim() ?? "";

				return {
					product_id: item.product_id,
					quantity: Number(item.quantity),
					unit_measure_id: item.unit_measure_id,
					...(productJustification
						? { justification: productJustification }
						: {}),
					...(item.quantity_unit != null && Number(item.quantity_unit) > 0
						? { quantity_unit: Number(item.quantity_unit) }
						: {}),
				};
			}),
		};

		console.log("Probando payload : ", payload)

		onSubmit?.(payload);
	});

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title={`Registrar ${requestType.label}`}
			variant="form"
			size="9xl"
			description="Complete la información de la solicitud de compra"
		>
			<FormProvider {...methods}>
				<form
					onSubmit={handleFormSubmit}
					className="flex flex-col gap-4"
					noValidate
				>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<Controller
							name="request_date"
							control={control}
							rules={{
								required: "La fecha de solicitud es requerida",
								validate: (value) => {
									if (!value) return "La fecha de solicitud es requerida";
									const selectedDate = dayjs(value);
									if (!selectedDate.isValid()) return "La fecha no es válida";
									return true;
								},
							}}
							render={({ field }) => (
								<DatePicker
									fieldWidth="large"
									label="Fecha de solicitud"
									labelAbove
									isRequired
									className={inputClassName}
									labelClassName={labelClassName}
									value={field.value ? dayjs(field.value) : null}
									onChange={(value) => {
										field.onChange(toDateOnly(value));
									}}
									error={errors.request_date?.message}									
								/>
							)}
						/>
					</div>

					<Controller
						name="justification"
						control={control}
						rules={{
							required: "La justificación es requerida",
							validate: (value) =>
								value.trim().length > 0 || "La justificación es requerida",
						}}
						render={({ field }) => (
							<Textarea
								label="Justificación"
								placeholder="Justificación de la solicitud..."
								isRequired
								className={inputClassName}
								labelClassName={labelClassName}
								value={field.value}
								onChange={field.onChange}
								error={errors.justification?.message}
								maxLength={500}
								enableCharacterCount
								style={{
									resize: "none",
									minHeight: "100px",
								}}
							/>
						)}
					/>

					<RequisitionDetail />

					<div className="flex justify-end gap-3 pt-2">
						<Button
							type="button"
							size="giant"
							label="Cancelar"
							onClick={handleClose}
							className="text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
						/>
						<Button
							type="submit"
							size="giant"
							label="Crear Solicitud"
							className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
						/>
					</div>
				</form>
			</FormProvider>
		</Modal>
	);
};
