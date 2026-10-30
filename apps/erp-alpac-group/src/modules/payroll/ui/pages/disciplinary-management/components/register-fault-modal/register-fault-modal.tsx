import {
	Button,
	Dropdown,
	InputText,
	Modal,
} from "@alpac/design-system";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { RegisterFaultRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/register-fault.request";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";
import { FaultSourceEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-source.enum";
import { useFault } from "@app/modules/payroll/ui/hooks/fault/useFault";
import type { RegisterFaultModalProps } from "@app/modules/payroll/ui/pages/disciplinary-management/components/register-fault-modal/register-fault-modal.types";
import {
	disciplinaryApproveButtonClassName,
	disciplinaryDropdownClassName,
	disciplinaryInputClassName,
	disciplinaryLabelClassName,
	disciplinaryRejectButtonClassName,
} from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-form.constants";
import { CollaboratorSearchForm } from "@app/modules/payroll/ui/pages/permissions/components/collaborator-search-form/collaborator-search-form";
import { CollaboratorSummary } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/collaborator-summary";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { ImageUploader } from "@app/shared/components/image-uploader/image-uploader";
import type { ImageOutput } from "@app/shared/components/image-uploader/image-uploader.types";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { getMappedOptionList } from "@app/shared/utils/values.utils";

import { BanIcon, CheckIcon, NotebookTextIcon, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

const sectionTitleClassName =
	"m-0 pb-2 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-200 border-b border-slate-200 dark:border-neutral-600";

type RegisterFaultFormValues = {
	fault_catalog_id: string;
	occurrence_date: string;
};

const todayIsoDate = () => new Date().toISOString().slice(0, 10);

export const RegisterFaultModal = ({
	isOpen,
	onClose,
}: RegisterFaultModalProps) => {

	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();

	const [foundCollaborator, setFoundCollaborator] = useState<GetCollaboratorProfileDetailsResponse | null>(null);
	const [isSearching, setIsSearching] = useState(false);
	const [evidences, setEvidences] = useState<ImageOutput[]>([]);

	const { AlertComponent, handleRequestSuccess, handleRequestError } = useAlertState();

	const {
		handleSubmit,
		control,
		register,
		reset,
		formState: { errors },
	} = useForm<RegisterFaultFormValues>({
		defaultValues: {
			fault_catalog_id: "",
			occurrence_date: "",
		},
	});

	const faultCatalogFilters = useMemo(
		() =>
			isOpen && foundCollaborator && companyId && moduleCode
				? {
					company_id: companyId,
					module_code: moduleCode,
					page_number: 1,
				}
				: undefined,
		[isOpen, foundCollaborator, companyId, moduleCode],
	);

	const { GetFaultCatalog, RegisterFaults } = useFault({
		faultCatalogFilters,
	});

	const catalogOptions = useMemo(
		() => {
			const faultCatalogList = (GetFaultCatalog.data?.data ?? [])
				.filter((item) => item.is_active !== false);

			return getMappedOptionList({
				list: faultCatalogList,
				label: (item) => item.code ? `${item.code} — ${item.name}` : item.name,
				value: (item) => item.fault_catalog_id
			})
		},
		[GetFaultCatalog.data?.data],
	);

	const resetAll = useCallback(() => {
		setFoundCollaborator(null);
		setIsSearching(false);
		setEvidences([]);

		reset({
			fault_catalog_id: "",
			occurrence_date: "",
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

	const handleClearCollaborator = () => {
		setFoundCollaborator(null);
		setIsSearching(false);
		setEvidences([]);

		reset({
			fault_catalog_id: "",
			occurrence_date: "",
		});
	};

	const onSubmit: SubmitHandler<RegisterFaultFormValues> = async (values) => {
		if (!foundCollaborator?.collaborator_id) return;


		const payload: RegisterFaultRequest = {
			company_id: companyId,
			module_code: moduleCode,
			faults: [
				{
					collaborator_id: foundCollaborator.collaborator_id,
					fault_catalog_id: values.fault_catalog_id,
					occurrence_date: values.occurrence_date,
					source: FaultSourceEnum.Manual.value,
					parent_fault_id: null,
					evidences: evidences.map((image) => ({
						file_name: image.file.name,
						content_type: image.contentType,
						image_base64: image.base64,
					})),
				},
			],
		};

		try {
			await RegisterFaults.mutateAsync(payload);
			handleRequestSuccess("Falta registrada exitosamente");
			handleClose();
		} catch (error) {
			const mapped = getMappedError(error as ApiErrorResponse);
			handleRequestError(mapped.description || "No se pudo registrar la falta. Intente de nuevo.");
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			variant="form"
			title="Registrar falta disciplinaria"
			size="4xl"
			panelClassName={[
				"flex max-h-[min(94dvh,50rem)] flex-col overflow-hidden",
				"!mx-2 !my-2 sm:!mx-4 sm:!my-6",
				"rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
			].join(" ")}
			contentClassName="flex min-h-0 flex-1 flex-col"
		>
			<div className="flex min-h-0 min-w-0 flex-1 flex-col">

				{!foundCollaborator ? (
					<section className="flex flex-col gap-3">

						<CollaboratorSearchForm
							label="Buscar por número de cédula"

							onSuccess={(collaborator) => {
								setFoundCollaborator(collaborator);
								setIsSearching(false);
							}}
							onError={() => {
								setIsSearching(false);
								setFoundCollaborator(null);
							}}
							onSearchStart={() => {
								setIsSearching(true);
							}}
						/>
					</section>
				) : (
					<form
						id="register-fault-form"
						className="flex flex-col gap-5"
						onSubmit={handleSubmit(onSubmit)}
					>
						<section className="flex flex-col gap-3">
							<h4 className={sectionTitleClassName}>Colaborador</h4>
							<div className="relative flex w-full flex-row items-center gap-4">
								<div className="min-w-0 flex-1">
									<CollaboratorSummary
										fullName={foundCollaborator.full_name ?? ""}
										workPosition={foundCollaborator.work_position ?? ""}
										isFullNameLoading={isSearching}
										isWorkPositionLoading={isSearching}
									/>
								</div>
								<div className="group flex items-center">
									<button
										type="button"
										className="rounded-full p-1.5 text-slate-700 transition-all hover:bg-slate-300 hover:text-slate-900 dark:text-white dark:hover:bg-white/15 dark:hover:text-white"
										onClick={handleClearCollaborator}
										aria-label="Quitar colaborador"
									>
										<X size={20} />
									</button>
									<div className="pointer-events-none absolute -top-10 right-0 z-50 mt-2 rounded bg-slate-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
										Quitar colaborador
									</div>
								</div>
							</div>
						</section>

						<section className="flex flex-col gap-3">
							<h4 className={sectionTitleClassName}>Datos de la falta</h4>
							<div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2">
								<Controller
									name="fault_catalog_id"
									control={control}
									rules={{ required: "El tipo de falta es requerido" }}
									render={({ field }) => (
										<Dropdown
											label="Tipo de falta (catálogo)"
											appearance="dark"
											placeholder={
												GetFaultCatalog.isLoading
													? "Cargando catálogo..."
													: "Seleccionar del catálogo"
											}
											value={field.value}
											onChange={(value) => field.onChange(value)}
											options={catalogOptions}
											labelClassName={disciplinaryLabelClassName}
											valueClassName={disciplinaryLabelClassName}
											className={disciplinaryDropdownClassName}
											error={errors.fault_catalog_id?.message}
										/>
									)}
								/>

								<InputText
									label="Fecha de ocurrencia"
									type="date"
									max={todayIsoDate()}
									className={disciplinaryInputClassName}
									labelClassName={disciplinaryLabelClassName}
									errorVariant="tooltip"
									error={errors.occurrence_date?.message}
									{...register("occurrence_date", {
										required: "La fecha es requerida",
										validate: (value) => {
											if (!value) return "La fecha es requerida";
											if (value > todayIsoDate()) {
												return "La fecha no puede ser futura";
											}
											return true;
										},
									})}
								/>

								<DetailField
									label="Origen"
									value={FaultSourceEnum.Manual.label}
									icon={<NotebookTextIcon size={18} />}
									containerClass="sm:col-span-2"
								/>
							</div>
						</section>

						<section className="flex flex-col gap-3">
							<h4 className={sectionTitleClassName}>Evidencias</h4>
							<ImageUploader
								label="Evidencias (opcional)"
								description="JPG, PNG o WEBP. Se enviarán en base64 al API."
								value={evidences}
								onChange={setEvidences}
								maxFiles={5}
								maxSizeMB={5}
							/>
						</section>
					</form>
				)}

				{AlertComponent}

				{foundCollaborator && (
					<div className="-mx-4 -mb-4 mt-0 shrink-0 border-t border-t-slate-300 bg-white px-4 py-4 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6 rounded-b-xl">
						<div className="grid w-full grid-cols-4 gap-2 sm:flex sm:flex-wrap sm:justify-end sm:gap-3">
							<Button
								type="button"
								label="Cancelar"
								className={`${disciplinaryRejectButtonClassName} w-full min-w-0 sm:w-auto`}
								icon={<BanIcon size={20} />}
								isHiddenLabelOnMobile
								disabled={RegisterFaults.isPending}
								onClick={handleClose}
							/>
							<Button
								type="submit"
								label="Registrar"
								className={`${disciplinaryApproveButtonClassName} w-full min-w-0 sm:w-auto`}
								icon={<CheckIcon size={20} />}
								isHiddenLabelOnMobile
								disabled={RegisterFaults.isPending}
								isLoading={RegisterFaults.isPending}
							/>
						</div>
					</div>
				)}
			</div>
		</Modal>
	);
};
