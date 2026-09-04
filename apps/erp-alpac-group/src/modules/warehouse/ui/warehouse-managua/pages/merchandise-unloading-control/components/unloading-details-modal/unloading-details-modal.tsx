import { Badges, Button, Modal } from "@alpac/design-system";
import {
	BuildingIcon,
	CalendarIcon,
	CheckIcon,
	ContainerIcon,
	FileTextIcon,
	ForkliftIcon,
	GlobeIcon,
	IdCardIcon,
	LayoutListIcon,
	StampIcon,
	TruckIcon,
	UserIcon,
	UsersIcon,
} from "lucide-react";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { Loader } from "@app/shared/components/loaders/loader";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useMerchandiseUnloading } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useMerchandiseUnloading";
import type { GetAssignmentDetailsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/merchandise-unloading/get-assignment-details.response";
import {
	getUnloadingStatusBadgeClass,
	getUnloadingStatusLabel,
} from "../../merchandise-unloading-control.utils";
import type { UnloadingDetailsModalProps } from "./unloading-details-modal.types";
import { useAccessControl } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useAccessControl";
import type { GetReceptionEntranceDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/get-access-control-detail";
import type { ReceptionEntranceDetail } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control-detail";
import {
	getStatusBadgeClass,
	getStatusBadgeLabel,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/utils/movements.utils";
import { TransportUnit } from "@app/modules/warehouse/domain/enums/warehouse-managua/transport-unit";
import { DocumentEnum } from "@app/core/enums/document.enum";
import { ImagePreview } from "@app/shared/components/image-preview/image-preview";
import { UnloadingStatus } from "@app/modules/warehouse/domain/enums/warehouse-managua/unloading-status";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { StartUnloadingRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/merchandise-unloading/start-unloading-process.request";
import { StartUnloadingConfirmModal } from "../start-unloading-confirm-modal/start-unloading-confirm-modal";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";

const sectionTitleClassName = "m-0 pb-2 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-200 border-b border-slate-200 dark:border-neutral-600";
const startUnloadingButtonClass = "rounded-md! h-11 px-6! border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:text-emerald-700 dark:hover:text-emerald-300 disabled:opacity-40 shadow-sm transition-all duration-200";

export const UnloadingDetailsModal = ({
	isOpen,
	onClose,
	pendingAssignment,
	onRequestSuccess,
	onRequestError,
}: UnloadingDetailsModalProps) => {

	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();

	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	const { GetUnloadingAssignmentDetailsQuery, StartUnloadingProcess } = useMerchandiseUnloading({
		payloadGetUnloadingAssignmentDetails: {
			company_id: companyId,
			module_code: moduleCode,
			assignment_id: isOpen ? (pendingAssignment?.assignment_id ?? "") : "",
		},
	});

	const filter: GetReceptionEntranceDetailRequest = {
		company_id: companyId,
		module_code: moduleCode,
		reception_id: isOpen ? (pendingAssignment?.record_entrance_id ?? "") : "",
	};

	const { GetAccessControlDetail } = useAccessControl({
		detailPayload: filter,
	});

	const details = GetUnloadingAssignmentDetailsQuery.data ?? {} as GetAssignmentDetailsResponse;
	const reception = GetAccessControlDetail.data ?? {} as ReceptionEntranceDetail;
	const isLoading = GetUnloadingAssignmentDetailsQuery.isPending || GetAccessControlDetail.isPending;

	const machinery = details.machinery ?? [];
	const memberNames = details.crew?.member_names ?? [];
	const evidenceUrls = reception.evidence_urls ?? [];
	const assignmentId = pendingAssignment?.assignment_id || details.assignment_id;
	const isStarting = StartUnloadingProcess.isPending;
	const currentStatus = details.unloading_status ?? pendingAssignment?.unloading_status;
	const canStartUnloading =
		Boolean(assignmentId) &&
		(
			Number(currentStatus) === UnloadingStatus.Pending.value ||
			String(currentStatus).toLowerCase() === UnloadingStatus.Pending.textValue.toLowerCase()
		);

	const handleOpenConfirm = useCallback(() => {
		if (!canStartUnloading) return;
		setIsConfirmOpen(true);
	}, [canStartUnloading]);

	useEffect(() => {
		if (!isOpen) setIsConfirmOpen(false);
	}, [isOpen]);

	const handleCloseDetails = useCallback(() => {
		setIsConfirmOpen(false);
		onClose();
	}, [onClose]);

	const handleStartUnloading = useCallback((merchandiseType: number) => {
		if (!assignmentId) return;

		const now = dayjs();
		const payload: StartUnloadingRequest = {
			company_id: companyId,
			module_code: moduleCode,
			assignment_id: assignmentId,
			start_date: now.format("YYYY-MM-DD"),
			start_time: now.format("HH:mm:ss"),
			merchandise_type: merchandiseType,
			pallets: [],
			supplies: [],
		};

		StartUnloadingProcess.mutate(payload, {
			onSuccess() {
				setIsConfirmOpen(false);
				onRequestSuccess?.("El proceso de descargue se inició correctamente.");
				onClose();
			},
			onError(error) {
				const mappedError = getMappedError(error);
				onRequestError?.(mappedError.description);
			},
		});
	}, [
		assignmentId,
		companyId,
		getMappedError,
		moduleCode,
		onClose,
		onRequestError,
		onRequestSuccess,
		StartUnloadingProcess,
	]);

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={handleCloseDetails}
				title="Detalle de descarga"
				variant="default"
				size="7xl"
				panelClassName={[
					"flex max-h-[min(94dvh,50rem)] min-h-0 flex-col overflow-hidden",
					"!mx-2 !my-2 sm:!mx-4 sm:!my-6",
					"rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
				].join(" ")}
				contentClassName="flex min-h-0 flex-1 flex-col"
			>
				{isLoading && <Loader title="Cargando detalle de la descarga..." />}

				<div className="flex min-h-0 min-w-0 flex-1 flex-col">
					<div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
						<div className="flex flex-col gap-5 pb-2">

							<section className="flex flex-col gap-3">
								<h4 className={sectionTitleClassName}>Maquinaria</h4>
								{machinery.length > 0 ? (
									<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
										{machinery.map((item, index) => (
											<div
												key={`${item.code ?? "machinery"}-${index}`}
												className="rounded-lg border border-slate-200 dark:border-neutral-600 p-3 flex items-center gap-2"
											>
												<ForkliftIcon size={16} className="text-slate-500 dark:text-slate-300" />
												<span className="text-sm font-medium text-slate-700 dark:text-slate-200">
													{item.code || "—"}
												</span>
											</div>
										))}
									</div>
								) : (
									<p className="text-sm text-slate-500 dark:text-slate-400">
										No hay maquinaria asignada.
									</p>
								)}
							</section>

							<section className="flex flex-col gap-3">
								<h4 className={sectionTitleClassName}>Cuadrilla</h4>
								<div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
									<DetailField
										label="Tipo"
										value={details.crew ? (details.crew.is_outsourced ? "Externa" : "Interna") : ""}
										icon={<UsersIcon size={18} />}
									/>
									<DetailField
										label="Cantidad de personas"
										value={details.crew ? String(details.crew.person_count ?? 0) : ""}
										icon={<LayoutListIcon size={18} />}
									/>
								</div>

								{memberNames.length > 0 && (
									<div className="flex flex-col gap-2">
										<p className="text-xs font-semibold text-slate-500 dark:text-slate-300">
											Integrantes
										</p>
										<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
											{memberNames.map((name) => (
												<div
													key={name}
													className="rounded-lg border border-slate-200 dark:border-neutral-600 p-3 flex items-center gap-2"
												>
													<UserIcon size={16} className="text-slate-500 dark:text-slate-300" />
													<span className="text-sm font-medium text-slate-700 dark:text-slate-200">
														{name}
													</span>
												</div>
											))}
										</div>
									</div>
								)}
							</section>


							<section className="flex flex-col gap-3">
								<h4 className={sectionTitleClassName}>Información de la asignación</h4>
								<div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
									<DetailField
										label="Estado"
										value={
											<Badges
												label={getUnloadingStatusLabel(details?.unloading_status) || "—"}
												color="transparent"
												className={getUnloadingStatusBadgeClass(details?.unloading_status)}
											/>
										}
									/>
									<DetailField
										label="Bodega"
										value={details?.warehouse_name ?? ""}
										icon={<BuildingIcon size={18} />}
									/>
									<DetailField
										label="Fecha de asignación"
										value={formatDateToSpanishWords(details?.assigned_at)}
										icon={<CalendarIcon size={18} />}
									/>
									<DetailField
										label="Bodeguero"
										value={details?.warehouse_keeper_user_name ?? ""}
										icon={<UserIcon size={18} />}
									/>
								</div>
							</section>

							<section className="flex flex-col gap-3">
								<h4 className={sectionTitleClassName}>Recepción e ingreso</h4>
								<div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
									<DetailField
										label="Estado de recepción"
										value={
											<Badges
												label={getStatusBadgeLabel(reception.status ?? "") || "—"}
												color="transparent"
												className={getStatusBadgeClass(reception.status ?? "")}
											/>
										}
									/>
									<DetailField
										label="Tipo de documento"
										value={DocumentEnum[String(reception.document_type ?? "")]?.label ?? ""}
										icon={<FileTextIcon size={18} />}
									/>
									<DetailField
										label="Consolidado"
										value={reception?.is_consolidated ? "Sí" : "No"}
									/>
									<DetailField
										label="País de origen"
										value={reception?.country_of_origin ?? ""}
										icon={<GlobeIcon size={18} />}
									/>
									<DetailField
										label="Aduana"
										value={reception?.custom_branch ?? ""}
										icon={<BuildingIcon size={18} />}
									/>
									<DetailField
										label="Ingreso"
										value={formatDateToSpanishWords(reception?.execution_log?.start_date)}
										icon={<CalendarIcon size={18} />}
									/>
								</div>
							</section>

							<section className="flex flex-col gap-3">
								<h4 className={sectionTitleClassName}>Unidad y conductor</h4>
								<div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
									<DetailField
										label="Unidad"
										value={TransportUnit[reception.transport_unit]?.label ?? ""}
										icon={<TruckIcon size={18} />}
									/>
									<DetailField
										label="Placa"
										value={reception?.plate_number ?? ""}
										icon={<TruckIcon size={18} />}
									/>
									<DetailField
										label="Chasis"
										value={reception?.trailer_chassis ?? ""}
									/>
									<DetailField
										label="Contenedor"
										value={reception?.container_number ?? ""}
										icon={<ContainerIcon size={18} />}
									/>
									<DetailField
										label="Precinto"
										value={reception?.seal_number ?? ""}
										icon={<StampIcon size={18} />}
									/>
									<DetailField
										label="Transportista"
										value={reception?.transportista ?? ""}
									/>
									<DetailField
										label="Conductor"
										value={reception?.driver_name ?? ""}
										icon={<UserIcon size={18} />}
									/>
									<DetailField
										label="Licencia"
										value={reception?.driver_license ?? ""}
										icon={<IdCardIcon size={18} />}
									/>
								</div>
							</section>

							<section className="flex flex-col gap-3">
								<h4 className={sectionTitleClassName}>Información de Duca</h4>
								<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">


								</div>
							</section>

							{evidenceUrls.length > 0 && (
								<section className="flex flex-col gap-3">
									<h4 className={sectionTitleClassName}>Evidencias</h4>
									<div className="grid grid-cols-2 gap-2">
										<ImagePreview images={evidenceUrls}
											title="Imagenes de Evidencia de Descargue"
											alt="Imagenes de Evidencias de Descargue en Bodega"
										/>
									</div>
								</section>
							)}
						</div>
					</div>

					<div className="-mx-4 -mb-4 mt-0 shrink-0 border-t border-t-slate-300 bg-white px-4 py-4 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6 rounded-b-xl">
						<div className="flex justify-end gap-3">
							<Button
								type="button"
								label="Iniciar Descargue"
								className={startUnloadingButtonClass}
								icon={<CheckIcon size={20} />}
								isHiddenLabelOnMobile
								disabled={isLoading || !canStartUnloading}
								isLoading={false}
								onClick={handleOpenConfirm}
							/>
						</div>
					</div>
				</div>

			</Modal>

			<StartUnloadingConfirmModal
				isOpen={isConfirmOpen}							
				onClose={() => setIsConfirmOpen(false)}
				onConfirm={handleStartUnloading}
			/>
		</>
	);
};
