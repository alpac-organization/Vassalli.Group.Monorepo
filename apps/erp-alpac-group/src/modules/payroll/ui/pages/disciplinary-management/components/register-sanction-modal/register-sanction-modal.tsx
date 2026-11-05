import {
	Alert,
	Button,
	DatePicker,
	Dropdown,
	Modal,
	Textarea,
	type AlertType,
} from "@alpac/design-system";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { RegisterSanctionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/register-sanction.request";
import type { SuggestedSanctionDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-suggested-sanction.response";
import { FaultSeverityEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-severity.enum";
import {
	SanctionTypeEnum,
	type SanctionTypeEnumMap,
} from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-type.enum";
import { useFault } from "@app/modules/payroll/ui/hooks/fault/useFault";
import { useSanction } from "@app/modules/payroll/ui/hooks/sanction/useSanction";
import { toDateOnly } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/date-input";
import type { RegisterSanctionModalProps } from "@app/modules/payroll/ui/pages/disciplinary-management/components/register-sanction-modal/register-sanction-modal.types";
import {
	disciplinaryDropdownClassName,
	disciplinaryInputClassName,
	disciplinaryLabelClassName,
	disciplinaryPrimaryButtonClassName,
	disciplinarySecondaryButtonClassName,
} from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-managment.variants";
import { ImageUploader } from "@app/shared/components/image-uploader/image-uploader";
import type { ImageOutput } from "@app/shared/components/image-uploader/image-uploader.types";
import { Loader } from "@app/shared/components/loaders/loader";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { getMappedOptionList } from "@app/shared/utils/values.utils";
import dayjs from "dayjs";
import { CheckIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch, type SubmitHandler } from "react-hook-form";

type RegisterSanctionFormValues = {
	sanction_type: SanctionTypeEnumMap | "";
	reason: string;
	suspension_start_date: string;
	suspension_end_date: string;
};

const getSuspensionDayCount = (start: string, end: string): number =>
	dayjs(end).diff(dayjs(start), "day") + 1;

const getSuggestedAlert = (suggested: SuggestedSanctionDto) => {
	if (suggested.is_covered_by_escalation) {
		return {
			type: "error" as AlertType,
			title: "Escalamiento por reincidencia",
			message: `Esta falta fue absorbida por reincidencia. Se sancionará la falta padre.`,
		};
	}

	const severityLabel = FaultSeverityEnum[suggested.severity]?.label ?? suggested.severity;
	const countOccurrenceInMonth = suggested?.count_occurrence_in_month ?? 0;

	return {
		type: "warning" as AlertType,
		title: "Sanción sugerida",
		message: `Sugerencia según severidad ${severityLabel} y ${countOccurrenceInMonth} ocurrencia(s) en el mes.`,
	};
};

export const RegisterSanctionModal = ({
	isOpen,
	onClose,
	faultSummary,
	onRequestSuccess,
	onRequestError,
}: RegisterSanctionModalProps) => {

	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();
	const [evidences, setEvidences] = useState<ImageOutput[]>([]);

	const {
		handleSubmit,
		control,
		reset,
		setValue,
		formState: { errors },
	} = useForm<RegisterSanctionFormValues>({
		defaultValues: {
			sanction_type: "",
			reason: "",
			suspension_start_date: "",
			suspension_end_date: "",
		},
	});

	const sanctionType = useWatch({ control, name: "sanction_type" });
	const isSuspension = sanctionType === "Suspension";
	const requiresEvidence = sanctionType !== "" && sanctionType !== "VerbalWarning";

	const suggestedSanctionFilters = useMemo(() => {
		if (!isOpen || !faultSummary?.fault_id || !companyId || !moduleCode) {
			return undefined;
		}

		return {
			company_id: companyId,
			module_code: moduleCode,
			fault_id: faultSummary.fault_id,
		};
	}, [isOpen, faultSummary?.fault_id, companyId, moduleCode]);

	const { GetSuggestedSanction } = useFault({ suggestedSanctionFilters });
	const { RegisterSanction } = useSanction();

	const suggested = GetSuggestedSanction.data;
	const isSuggestedLoading = GetSuggestedSanction.isLoading || GetSuggestedSanction.isFetching;
	const isSuggestedError = GetSuggestedSanction.isError;
	const hasSuggested = Boolean(suggested);

	const sanctionTypeOptions = useMemo(() => {
		const allowed = suggested?.allowed_sanction_types ?? [];
		return getMappedOptionList({
			list: allowed,
			label: (key) => SanctionTypeEnum[key]?.label ?? key,
			value: (key) => key,
		});
	}, [suggested?.allowed_sanction_types]);

	useEffect(() => {
		if (!suggested?.suggested_sanction_type) return;
		setValue("sanction_type", suggested.suggested_sanction_type);
	}, [suggested?.suggested_sanction_type, setValue]);

	const resetAll = useCallback(() => {
		setEvidences([]);
		reset({
			sanction_type: "",
			reason: "",
			suspension_start_date: "",
			suspension_end_date: "",
		});
	}, [reset]);

	useEffect(() => {
		if (!isOpen) {
			resetAll();
		}
	}, [isOpen, resetAll]);

	const handleClose = () => {
		resetAll();
		onClose();
	};

	const onSubmit: SubmitHandler<RegisterSanctionFormValues> = async (
		values,
	) => {
		if (!suggested?.sanction_target_fault_id || !values.sanction_type) return;

		if (requiresEvidence && evidences.length === 0) {
			onRequestError?.(
				"Debe adjuntar al menos una evidencia para este tipo de sanción.",
			);
			return;
		}

		let suspension_start_date: string | null = null;
		let suspension_end_date: string | null = null;

		if (isSuspension) {
			suspension_start_date = values.suspension_start_date || null;
			suspension_end_date = values.suspension_end_date || null;
		}

		const payload: RegisterSanctionRequest = {
			company_id: companyId,
			module_code: moduleCode,
			fault_id: suggested.sanction_target_fault_id,
			sanction_type: values.sanction_type,
			reason: values.reason.trim(),
			suspension_start_date,
			suspension_end_date,
			evidences: evidences.map((image) => ({
				file_name: image.file.name,
				content_type: image.contentType,
				image_base64: image.base64,
			})),
		};

		try {
			await RegisterSanction.mutateAsync(payload);
			onRequestSuccess?.("Sanción aplicada exitosamente");
			handleClose();
		} catch (error) {
			const mapped = getMappedError(error as ApiErrorResponse);
			onRequestError?.(
				mapped.description ||
				"No se pudo aplicar la sanción. Intente de nuevo.",
			);
		}
	};

	const canSubmit =
		hasSuggested &&
		!isSuggestedLoading &&
		!isSuggestedError &&
		!RegisterSanction.isPending;

	let evidenceLabel = "Evidencias (opcional)";
	if (requiresEvidence) {
		evidenceLabel = "Evidencias (requeridas)";
	}

	const suggestedAlert = suggested ? getSuggestedAlert(suggested) : null;

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			variant="form"
			title="Aplicar sanción"
			size="4xl"
			panelClassName={[
				"!mx-2 !my-2 sm:!mx-4 sm:!my-6",
				"rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
			].join(" ")}
			contentClassName="flex min-h-0 flex-1 flex-col"
		>
			<div className="flex min-h-0 min-w-0 flex-1 flex-col">
				{isSuggestedLoading && (
					<Loader title="Obteniendo sanción sugerida..." />
				)}

				{!isSuggestedLoading && isSuggestedError && (
					<Alert
						type="error"
						title="Error"
						message="No se pudo obtener la sanción sugerida. Cierre e intente de nuevo."
					/>
				)}

				{!isSuggestedLoading && hasSuggested && (
					<form
						id="register-sanction-form"
						className="flex flex-col gap-5"
						onSubmit={handleSubmit(onSubmit)}
					>
						{suggestedAlert && (
							<Alert
								type={suggestedAlert.type}
								title={suggestedAlert.title}
								message={suggestedAlert.message}
							/>
						)}

						<section className="flex flex-col gap-6">
							<Controller
								name="sanction_type"
								control={control}
								rules={{ required: "El tipo de sanción es requerido" }}
								render={({ field }) => (
									<Dropdown
										label="Tipo de sanción"
										appearance="dark"
										placeholder="Seleccionar tipo permitido"
										value={field.value}
										onChange={(value) => field.onChange(value)}
										options={sanctionTypeOptions}
										labelClassName={disciplinaryLabelClassName}
										valueClassName={disciplinaryLabelClassName}
										className={disciplinaryDropdownClassName}
										error={errors.sanction_type?.message}
									/>
								)}
							/>

							<Controller
								name="reason"
								control={control}
								rules={{
									required: "El motivo es requerido",
								}}
								render={({ field }) => (
									<Textarea
										label="Motivo"
										className={disciplinaryInputClassName}
										labelClassName={disciplinaryLabelClassName}
										placeholder="Describe el motivo (máx. 500)"
										enableCharacterCount
										maxLength={500}
										value={field.value ?? ""}
										onChange={field.onChange}
										onBlur={field.onBlur}
										name={field.name}
										ref={field.ref}
										error={errors.reason?.message}
									/>
								)}
							/>

							{isSuspension && (
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<Controller
										control={control}
										name="suspension_start_date"
										rules={{
											required: "La fecha de inicio es requerida",
										}}
										render={({ field }) => (
											<DatePicker
												label="Inicio de suspensión"
												labelAbove
												fieldWidth="large"
												className={disciplinaryInputClassName}
												labelClassName={disciplinaryLabelClassName}
												value={
													field.value ? dayjs(field.value) : null
												}
												onChange={(value) => {
													field.onChange(toDateOnly(value));
												}}
												error={errors.suspension_start_date?.message}
												slotProps={{
													popper: {
														disablePortal: false,
														sx: { zIndex: 2000 },
													},
												}}
											/>
										)}
									/>

									<Controller
										control={control}
										name="suspension_end_date"
										rules={{
											required: "La fecha de fin es requerida",
											validate: (value, formValues) => {
												if (!value || !formValues.suspension_start_date) {
													return true;
												}
												const days = getSuspensionDayCount(
													formValues.suspension_start_date,
													value,
												);
												if (days < 3 || days > 7) {
													return "La suspensión debe ser de 3 a 7 días inclusive";
												}
												return true;
											},
										}}
										render={({ field }) => (
											<DatePicker
												label="Fin de suspensión"
												labelAbove
												fieldWidth="large"
												className={disciplinaryInputClassName}
												labelClassName={disciplinaryLabelClassName}
												value={field.value ? dayjs(field.value) : null}
												onChange={(value) =>
													field.onChange(toDateOnly(value))
												}
												error={errors.suspension_end_date?.message}
												slotProps={{
													popper: {
														disablePortal: false,
														sx: { zIndex: 2000 },
													},
												}}
											/>
										)}
									/>
								</div>
							)}
						</section>

						<section className="flex flex-col gap-3 pb-6">
							<ImageUploader
								label={evidenceLabel}
								description="JPG, PNG o WEBP. Se enviarán en base64 al API."
								value={evidences}
								onChange={setEvidences}
								maxFiles={3}
								maxSizeMB={5}
								isRequired={requiresEvidence}
							/>
						</section>
					</form>
				)}
			</div>

			{hasSuggested && !isSuggestedLoading && (
				<div className="-mx-4 -mb-4 mt-0 shrink-0 border-t border-t-slate-300 bg-white px-4 py-4 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6 rounded-b-xl">
					<div className="flex w-full flex-wrap justify-end gap-3">
						<Button
							type="button"
							size="giant"
							label="Cancelar"
							className={`${disciplinarySecondaryButtonClassName} w-auto!`}
							icon={<XIcon size={20} />}
							isHiddenLabelOnMobile
							disabled={RegisterSanction.isPending}
							onClick={handleClose}
						/>
						<Button
							type="submit"
							size="giant"
							label="Aplicar sanción"
							className={`${disciplinaryPrimaryButtonClassName} w-auto!`}
							icon={<CheckIcon size={20} />}
							isHiddenLabelOnMobile
							disabled={!canSubmit}
							isLoading={RegisterSanction.isPending}
							onClick={handleSubmit(onSubmit)}
						/>
					</div>
				</div>
			)}
		</Modal>
	);
};
