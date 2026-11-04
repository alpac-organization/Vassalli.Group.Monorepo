import { Avatar, Badges, Button, Modal } from "@alpac/design-system";
import { UserStatusEnum } from "@app/core/enums/user-status.enum";
import { FaultSeverityEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-severity.enum";
import { FaultSourceEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-source.enum";
import { FaultStatusEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-status.enum";
import type { FaultDetailsModalProps } from "@app/modules/payroll/ui/pages/disciplinary-management/components/fault-details-modal/fault-details-modal.types";
import {
	disciplinaryApproveButtonClassName,
	disciplinaryRejectButtonClassName,
} from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-form.constants";
import {
	getFaultSeverityBadgeClass,
	getFaultSourceBadgeClass,
	getFaultStatusBadgeClass,
} from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-labels.utils";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { ImagePreviewGallery } from "@app/shared/components/image-preview-gallery/image-preview-gallery";
import { Loader } from "@app/shared/components/loaders/loader";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import {
	BanIcon,
	CalendarIcon,
	GavelIcon,
	HashIcon,
	IdCardIcon,
	MailIcon,
	NotebookTextIcon,
	UserIcon,
} from "lucide-react";

const sectionTitleClassName =
	"m-0 pb-2 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-200 border-b border-slate-200 dark:border-neutral-600";

export const FaultDetailsModal = ({
	isOpen,
	onClose,
	summary,
	detail,
	isDetailLoading = false,
	canWrite = false,
	onCancelFault,
	onApplySanction,
}: FaultDetailsModalProps) => {
	const view = detail ?? summary;
	const isOpenStatus =
		view?.status === "Open" || String(view?.status) === "1";
	const showFooter = Boolean(canWrite && isOpenStatus);

	const registeredBy = detail?.registered_by;
	const parentFault = detail?.parent_fault;
	const evidences = detail?.evidences ?? [];

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			variant="default"
			title="Detalle de la falta"
			size="7xl"
			panelClassName={[
				"flex max-h-[min(94dvh,50rem)] flex-col overflow-hidden",
				"!mx-2 !my-2 sm:!mx-4 sm:!my-6",
				"rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
			].join(" ")}
			contentClassName="flex min-h-0 flex-1 flex-col"
		>
			{isDetailLoading && (
				<Loader title="Cargando detalle de la falta..." />
			)}

			{!view ? (
				<p className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
					Selecciona una falta para ver el detalle.
				</p>
			) : (
				<div className="flex min-h-0 min-w-0 flex-1 flex-col">
					<div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
						<div className="flex flex-col gap-5 pb-2">
							<section className="flex flex-col gap-3">
								<h4 className={sectionTitleClassName}>Colaborador</h4>
								<div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-3">
									<DetailField
										label="Nombre"
										value={view.collaborator_name ?? ""}
										icon={
											<Avatar
												label={view.collaborator_name ?? ""}
												hasLabel={false}
											/>
										}
									/>
									<DetailField
										label="Identificación"
										value={detail?.identification_number ?? ""}
										icon={<IdCardIcon size={18} />}
									/>
								</div>
							</section>

							<section className="flex flex-col gap-3">
								<h4 className={sectionTitleClassName}>
									Información de la falta
								</h4>
								<div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-3">
									<DetailField
										label="Estado"
										value={
											<Badges
												label={
													FaultStatusEnum[view.status]?.label ?? String(view.status)
												}
												color="transparent"
												className={getFaultStatusBadgeClass(view.status)}
											/>
										}
									/>
									<DetailField
										label="Severidad"
										value={
											<Badges
												label={
													FaultSeverityEnum[view.severity]?.label ?? String(view.severity)
												}
												color="transparent"
												className={getFaultSeverityBadgeClass(view.severity)}
											/>
										}
									/>
									<DetailField
										label="Origen"
										value={
											<Badges
												label={
													FaultSourceEnum[view.source]?.label ?? String(view.source)
												}
												color="transparent"
												className={getFaultSourceBadgeClass(view.source)}
											/>
										}
									/>
									<DetailField
										label="Código"
										value={view.fault_catalog?.code ?? ""}
										icon={<HashIcon size={18} />}
									/>
									<DetailField
										label="Tipo de falta"
										value={view.fault_catalog?.name ?? ""}
										icon={<NotebookTextIcon size={18} />}
									/>
									<DetailField
										label="Fecha de ocurrencia"
										value={formatDateToSpanishWords(
											view.occurrence_date ?? "",
										)}
										icon={<CalendarIcon size={18} />}
									/>
									{detail?.created_at && (
										<DetailField
											label="Fecha de registro"
											value={formatDateToSpanishWords(detail.created_at)}
											icon={<CalendarIcon size={18} />}
										/>
									)}
								</div>
							</section>

							{registeredBy && (
								<section className="flex flex-col gap-3">
									<h4 className={sectionTitleClassName}>Registrado por</h4>
									<div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-3">
										<DetailField
											label="Nombre"
											value={registeredBy.full_name ?? ""}
											icon={
												<Avatar
													label={registeredBy.full_name ?? ""}
													hasLabel={false}
												/>
											}
										/>
										<DetailField
											label="Email"
											value={registeredBy.email ?? ""}
											icon={<MailIcon size={18} />}
										/>
										{registeredBy.status && (
											<DetailField
												label="Estado usuario"
												value={
													UserStatusEnum[registeredBy.status]?.label ?? registeredBy.status
												}
												icon={<UserIcon size={18} />}
											/>
										)}
									</div>
								</section>
							)}

							{parentFault && (
								<section className="flex flex-col gap-3">
									<h4 className={sectionTitleClassName}>
										Falta padre (reincidencia)
									</h4>
									<div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-3">
										<DetailField
											label="Fecha de ocurrencia"
											value={formatDateToSpanishWords(
												parentFault.occurrence_date,
											)}
											icon={<CalendarIcon size={18} />}
										/>
										<DetailField
											label="Severidad"
											value={
												<Badges
													label={
														FaultSeverityEnum[parentFault.severity]?.label ?? String(parentFault.severity)
													}
													color="transparent"
													className={getFaultSeverityBadgeClass(
														parentFault.severity,
													)}
												/>
											}
										/>
										<DetailField
											label="Estado"
											value={
												<Badges
													label={
														FaultStatusEnum[parentFault.status]?.label ?? String(parentFault.status)
													}
													color="transparent"
													className={getFaultStatusBadgeClass(
														parentFault.status,
													)}
												/>
											}
										/>
									</div>
								</section>
							)}

							<section className="flex flex-col gap-3">
								<h4 className={sectionTitleClassName}>Evidencias</h4>
								{evidences.length > 0 ? (
									<ImagePreviewGallery
										images={evidences}
										title=""
										imageAlt="Evidencia disciplinaria"
									/>
								) : (
									<p className="m-0 p-1 text-sm text-slate-500 dark:text-slate-400">
										Sin evidencias
									</p>
								)}
							</section>
						</div>
					</div>

					{showFooter && (
						<div className="-mx-4 -mb-4 mt-0 shrink-0 border-t border-t-slate-300 bg-white px-4 py-4 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6 rounded-b-xl">
							<div className="grid w-full grid-cols-4 gap-2 sm:flex sm:flex-wrap sm:justify-end sm:gap-3">
								<Button
									type="button"
									label="Anular falta"
									className={`${disciplinaryRejectButtonClassName} w-full min-w-0 sm:w-auto`}
									icon={<BanIcon size={20} />}
									isHiddenLabelOnMobile
									onClick={onCancelFault}
								/>
								<Button
									type="button"
									label="Aplicar sanción"
									className={`${disciplinaryApproveButtonClassName} w-full min-w-0 sm:w-auto`}
									icon={<GavelIcon size={20} />}
									isHiddenLabelOnMobile
									onClick={onApplySanction}
								/>
							</div>
						</div>
					)}
				</div>
			)}
		</Modal>
	);
};
