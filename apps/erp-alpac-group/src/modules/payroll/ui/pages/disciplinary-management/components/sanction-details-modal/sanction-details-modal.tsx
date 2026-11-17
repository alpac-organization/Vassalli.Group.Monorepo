import { Avatar, Badges, Modal } from "@alpac/design-system";
import { UserStatusEnum } from "@app/core/enums/user-status.enum";
import { FaultSeverityEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-severity.enum";
import { SanctionStatusEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-status.enum";
import { SanctionTypeEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-type.enum";
import type { SanctionDetailsModalProps } from "@app/modules/payroll/ui/pages/disciplinary-management/components/sanction-details-modal/sanction-details-modal.types";
import {
	getFaultSeverityBadgeClass,
	getSanctionStatusBadgeClass,
	getSanctionTypeBadgeClass,
} from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-labels.utils";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { ImagePreviewGallery } from "@app/shared/components/image-preview-gallery/image-preview-gallery";
import { Loader } from "@app/shared/components/loaders/loader";
import {
	formatDateToSpanishWords,
	formatIdentificationNumber,
} from "@app/shared/utils/string.utils";
import {
	CalendarIcon,
	IdCardIcon,
	MailIcon,
	NotebookTextIcon,
	UserIcon,
} from "lucide-react";

const sectionTitleClassName =
	"m-0 pb-2 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-200 border-b border-slate-200 dark:border-neutral-600";

export const SanctionDetailsModal = ({
	isOpen,
	onClose,
	summary,
	detail,
	isDetailLoading = false,
}: SanctionDetailsModalProps) => {
	const view = detail ?? summary;
	const issuedBy = detail?.issued_by_user;
	const approvedBy = detail?.approved_by_user;
	const evidences = detail?.evidences ?? [];

	const faultCatalogLabel =
		detail?.fault_catalog?.code && detail?.fault_catalog?.name
			? `${detail.fault_catalog.code} - ${detail.fault_catalog.name}`
			: detail?.fault_catalog?.name || detail?.fault_catalog?.code || "";

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			variant="default"
			title="Detalle de la sanción"
			size="7xl"
			panelClassName={[
				"flex max-h-[min(94dvh,50rem)] flex-col overflow-hidden",
				"!mx-2 !my-2 sm:!mx-4 sm:!my-6",
				"rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
			].join(" ")}
			contentClassName="flex min-h-0 flex-1 flex-col"
		>
			{isDetailLoading && (
				<Loader title="Cargando detalle de la sanción..." />
			)}

			{!view ? (
				<p className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
					Selecciona una sanción para ver el detalle.
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
									{detail?.identification_number != null && (
										<DetailField
											label="Identificación"
											value={formatIdentificationNumber(
												detail.identification_number ?? "",
											)}
											icon={<IdCardIcon size={18} />}
										/>
									)}
								</div>
							</section>

							<section className="flex flex-col gap-3">
								<h4 className={sectionTitleClassName}>
									Información de la sanción
								</h4>
								<div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-3">
									<DetailField
										label="Código"
										value={view.code?.trim() || "—"}
										icon={<NotebookTextIcon size={18} />}
									/>
									<DetailField
										label="Estado"
										value={
											<Badges
												label={
													SanctionStatusEnum[view.sanction_status]?.label ??
													String(view.sanction_status)
												}
												color="transparent"
												className={getSanctionStatusBadgeClass(
													view.sanction_status,
												)}
											/>
										}
									/>
									<DetailField
										label="Tipo"
										value={
											<Badges
												label={
													SanctionTypeEnum[view.sanction_type]?.label ??
													String(view.sanction_type)
												}
												color="transparent"
												className={getSanctionTypeBadgeClass(view.sanction_type)}
											/>
										}
									/>
									<DetailField
										label="Motivo"
										value={view.reason?.trim() || "—"}
										icon={<NotebookTextIcon size={18} />}
									/>
									<DetailField
										label="Inicio suspensión"
										value={
											view.suspension_start_date
												? formatDateToSpanishWords(view.suspension_start_date)
												: "—"
										}
										icon={<CalendarIcon size={18} />}
									/>
									<DetailField
										label="Fin suspensión"
										value={
											view.suspension_end_date
												? formatDateToSpanishWords(view.suspension_end_date)
												: "—"
										}
										icon={<CalendarIcon size={18} />}
									/>
									{view.created_at && (
										<DetailField
											label="Fecha de registro"
											value={formatDateToSpanishWords(view.created_at)}
											icon={<CalendarIcon size={18} />}
										/>
									)}
									{detail?.payroll_id && (
										<DetailField
											label="Nómina"
											value={detail.payroll_id}
											icon={<NotebookTextIcon size={18} />}
										/>
									)}
									{detail?.cancellation_reason && (
										<DetailField
											label="Motivo de anulación"
											value={detail.cancellation_reason}
											icon={<NotebookTextIcon size={18} />}
										/>
									)}
								</div>
							</section>

							{detail && (
								<section className="flex flex-col gap-3">
									<h4 className={sectionTitleClassName}>Falta asociada</h4>
									<div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-3">
										{faultCatalogLabel && (
											<DetailField
												label="Tipo de falta"
												value={faultCatalogLabel}
												icon={<NotebookTextIcon size={18} />}
											/>
										)}
										{detail.fault_severity && (
											<DetailField
												label="Severidad"
												value={
													<Badges
														label={
															FaultSeverityEnum[detail.fault_severity]?.label ??
															String(detail.fault_severity)
														}
														color="transparent"
														className={getFaultSeverityBadgeClass(
															detail.fault_severity,
														)}
													/>
												}
											/>
										)}
										{detail.occurrence_date && (
											<DetailField
												label="Fecha de ocurrencia"
												value={formatDateToSpanishWords(detail.occurrence_date)}
												icon={<CalendarIcon size={18} />}
											/>
										)}
									</div>
								</section>
							)}

							{issuedBy && (
								<section className="flex flex-col gap-3">
									<h4 className={sectionTitleClassName}>Propuesta por</h4>
									<div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-3">
										<DetailField
											label="Nombre"
											value={issuedBy.full_name ?? ""}
											icon={
												<Avatar
													label={issuedBy.full_name ?? ""}
													hasLabel={false}
												/>
											}
										/>
										<DetailField
											label="Email"
											value={issuedBy.email ?? ""}
											icon={<MailIcon size={18} />}
										/>
										{issuedBy.status && (
											<DetailField
												label="Estado usuario"
												value={
													UserStatusEnum[issuedBy.status]?.label ??
													issuedBy.status
												}
												icon={<UserIcon size={18} />}
											/>
										)}
									</div>
								</section>
							)}

							{(approvedBy || detail?.approved_at) && (
								<section className="flex flex-col gap-3">
									<h4 className={sectionTitleClassName}>Aprobada por</h4>
									<div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-3">
										{approvedBy && (
											<>
												<DetailField
													label="Nombre"
													value={approvedBy.full_name ?? ""}
													icon={
														<Avatar
															label={approvedBy.full_name ?? ""}
															hasLabel={false}
														/>
													}
												/>
												<DetailField
													label="Email"
													value={approvedBy.email ?? ""}
													icon={<MailIcon size={18} />}
												/>
												{approvedBy.status && (
													<DetailField
														label="Estado usuario"
														value={
															UserStatusEnum[approvedBy.status]?.label ??
															approvedBy.status
														}
														icon={<UserIcon size={18} />}
													/>
												)}
											</>
										)}
										{detail?.approved_at && (
											<DetailField
												label="Fecha de aprobación"
												value={formatDateToSpanishWords(detail.approved_at)}
												icon={<CalendarIcon size={18} />}
											/>
										)}
									</div>
								</section>
							)}

							<section className="flex flex-col gap-3">
								<h4 className={sectionTitleClassName}>Evidencias</h4>
								{evidences.length > 0 ? (
									<ImagePreviewGallery
										images={evidences}
										title=""
										imageAlt="Evidencia de sanción"
									/>
								) : (
									<p className="m-0 p-1 text-sm text-slate-500 dark:text-slate-400">
										Sin evidencias
									</p>
								)}
							</section>
						</div>
					</div>
				</div>
			)}
		</Modal>
	);
};
