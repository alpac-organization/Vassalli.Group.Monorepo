import {
	Badges,
	Button,
	DatePicker,
	Dropdown,
	Modal,
} from "@alpac/design-system";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { RegisterFaultRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/register-fault.request";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";
import type { FaultCatalogDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/fault-catalog.response";
import { FaultSeverityEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-severity.enum";
import { FaultSourceEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-source.enum";
import { useFault } from "@app/modules/payroll/ui/hooks/fault/useFault";
import type { RegisterFaultModalProps } from "@app/modules/payroll/ui/pages/disciplinary-management/components/register-fault-modal/register-fault-modal.types";
import {
	disciplinaryDropdownClassName,
	disciplinaryInputClassName,
	disciplinaryLabelClassName,
	disciplinaryPrimaryButtonClassName,
	disciplinarySecondaryButtonClassName,
} from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-managment.variants";
import { toDateOnly } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/date-input";
import { getFaultSourceBadgeClass } from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-labels.utils";
import { CollaboratorSearchForm } from "@app/modules/payroll/ui/pages/permissions/components/collaborator-search-form/collaborator-search-form";
import { CollaboratorSummary } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/collaborator-summary";
import { ImageUploader } from "@app/shared/components/image-uploader/image-uploader";
import type { ImageOutput } from "@app/shared/components/image-uploader/image-uploader.types";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { getMappedOptionList } from "@app/shared/utils/values.utils";
import dayjs from "dayjs";

import { AnimatePresence, m } from "framer-motion";
import { CheckIcon, X, XIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

type RegisterFaultFormValues = {
	fault_catalog_id: string;
	occurrence_date: string;
};

const formTransition = {
	opacity: { duration: 0.35, ease: "easeOut" as const },
	y: { duration: 0.3, ease: "easeOut" as const },
};

const getCatalogPlaceholder = (
	isLoading: boolean,
	isError: boolean,
	hasOptions: boolean,
): string => {
	if (isLoading) return "Cargando catálogo...";
	if (isError) return "Error al cargar el catálogo";
	if (!hasOptions) return "No hay tipos de falta activos";
	return "Seleccionar del catálogo";
};

export const RegisterFaultModal = ({
	isOpen,
	onClose,
	onRequestError,
	onRequestSuccess
}: RegisterFaultModalProps) => {

	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();

	const [foundCollaborator, setFoundCollaborator] = useState<GetCollaboratorProfileDetailsResponse | null>(null);
	const [isSearching, setIsSearching] = useState(false);
	const [evidences, setEvidences] = useState<ImageOutput[]>([]);

	const {
		handleSubmit,
		control,
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
					page_size: 0,
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

			const getLabels = (item: FaultCatalogDto) => {
				const severity = item?.fault_severity ? FaultSeverityEnum[item?.fault_severity].label : "";
				return item.code ? `${item.code} \\ ${severity} \\ ${item.name}` : item.name;
			}

			return getMappedOptionList({
				list: faultCatalogList,
				label: getLabels,
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
			onRequestSuccess?.("Falta disciplinaria registrada exitosamente");
			handleClose();
		} catch (error) {
			const mapped = getMappedError(error as ApiErrorResponse);
			onRequestError?.(
				mapped.description ||
				"No se pudo registrar la falta. Intente de nuevo.",
			);
		}
	};

	const isCatalogLoading = GetFaultCatalog.isLoading || GetFaultCatalog.isFetching;
	const hasCatalogOptions = catalogOptions.length > 0;
	const isCatalogUnavailable = GetFaultCatalog.isError || (!isCatalogLoading && !hasCatalogOptions);
	const canSubmit = !RegisterFaults.isPending && !isCatalogLoading && !isCatalogUnavailable;
	const catalogPlaceholder = getCatalogPlaceholder(isCatalogLoading, GetFaultCatalog.isError, hasCatalogOptions,);

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			variant="form"
			title="Registrar falta disciplinaria"
			size="4xl"
			panelClassName={[
				"!mx-2 !my-2 sm:!mx-4 sm:!my-6",
				"rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
			].join(" ")}
			contentClassName="flex min-h-0 flex-1 flex-col"
		>
			<div className="flex min-h-0 min-w-0 flex-1 flex-col">
				<AnimatePresence mode="wait" initial={false}>
					{!foundCollaborator ? (
						<m.section
							key="register-fault-search"
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -8 }}
							transition={formTransition}
							className="flex flex-col gap-3"
						>
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
						</m.section>
					) : (
						<m.form
							key="register-fault-form"
							id="register-fault-form"
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 8 }}
							transition={formTransition}
							className="relative flex flex-col gap-5 pt-8"
							onSubmit={handleSubmit(onSubmit)}
						>
							<Badges
								label={FaultSourceEnum.Manual.label}
								color="transparent"
								className={`absolute right-0 top-0 z-10 ${getFaultSourceBadgeClass("Manual")}`}
							/>

							<section className="flex flex-col gap-3">
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
								<div className="flex flex-col gap-6">
									<Controller
										name="fault_catalog_id"
										control={control}
										rules={{ required: "El tipo de falta es requerido" }}
										render={({ field }) => (
											<Dropdown
												label="Tipo de falta (catálogo)"
												appearance="dark"
												isRequired
												placeholder={catalogPlaceholder}
												value={field.value}
												onChange={(value) => field.onChange(value)}
												options={catalogOptions}
												labelClassName={disciplinaryLabelClassName}
												valueClassName={disciplinaryLabelClassName}
												className={disciplinaryDropdownClassName}
												error={errors.fault_catalog_id?.message}
												disabled={isCatalogLoading || isCatalogUnavailable}
											/>
										)}
									/>

									<Controller
										control={control}
										name="occurrence_date"
										rules={{
											required: "La fecha es requerida",
											validate: (value) => {
												if (!value) return "La fecha es requerida";
												if (value > dayjs().format("YYYY-MM-DD")) {
													return "La fecha no puede ser futura";
												}
												return true;
											},
										}}
										render={({ field }) => (
											<DatePicker
												label="Fecha de ocurrencia"
												labelAbove
												fieldWidth="large"
												disableFuture
												isRequired
												className={disciplinaryInputClassName}
												labelClassName={disciplinaryLabelClassName}
												value={field.value ? dayjs(field.value) : null}
												onChange={(value) =>
													field.onChange(toDateOnly(value))
												}
												error={errors.occurrence_date?.message}
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
							</section>

							<section className="flex flex-col gap-3 pb-6">
								<ImageUploader
									label="Evidencias (opcional)"
									description="JPG, PNG o WEBP. Se enviarán en base64 al API."
									value={evidences}
									onChange={setEvidences}
									maxFiles={3}
									maxSizeMB={5}
								/>
							</section>
						</m.form>
					)}
				</AnimatePresence>

				{foundCollaborator && (
					<div className="-mx-4 -mb-4 mt-0 shrink-0 border-t border-t-slate-300 bg-white px-4 py-4 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6 rounded-b-xl">
						<div className="flex w-full flex-wrap justify-end gap-3">
							<Button
								type="button"
								size="giant"
								label="Cancelar"
								className={`${disciplinarySecondaryButtonClassName} w-auto!`}
								icon={<XIcon size={20} />}
								isHiddenLabelOnMobile
								disabled={RegisterFaults.isPending}
								onClick={handleClose}
							/>
							<Button
								type="submit"
								size="giant"
								label="Registrar"
								className={`${disciplinaryPrimaryButtonClassName} w-auto!`}
								icon={<CheckIcon size={20} />}
								isHiddenLabelOnMobile
								disabled={!canSubmit}
								isLoading={RegisterFaults.isPending}
								onClick={handleSubmit(onSubmit)}
							/>
						</div>
					</div>
				)}
			</div>
		</Modal>
	);
};
