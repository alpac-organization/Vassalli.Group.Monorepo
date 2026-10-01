import { Modal } from "@alpac/design-system";
import {
	BoxIcon,
	HashIcon,
	LayoutGridIcon,
	Maximize2Icon,
	MoveHorizontalIcon,
	MoveVerticalIcon,
	PackageIcon,
	RotateCwIcon,
} from "lucide-react";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { Loader } from "@app/shared/components/loaders/loader";
import { ActiveStatusBadge } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/badges/active-status-badge";
import {
	SectionStorageTypeBadge,
	SectionTypeBadge,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/layout-warehouses-badges";
import { useSection } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useSection";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { GetSectionDetailsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-section-details-res";
import type { SectionDetailModalProps } from "./section-detail-modal.types";
import {
	formatSectionMetric,
	sectionTitleClassName,
} from "./utils/section-detail-modal.utils";

export function SectionDetailModal({
	isOpen,
	onClose,
	warehouseId,
	section,
	isLoading = false,
	title = "Detalle de sección",
	description = "Consulta la información general, capacidad y coordenadas de la sección.",
	footer,
}: SectionDetailModalProps) {
	const { companyId, moduleCode } = useUserStore();

	const { GetSectionDetails } = useSection({
		getSectionDetailsPayload:
			isOpen && section?.section_id
				? {
						company_id: companyId,
						module_code: moduleCode,
						warehouse_id: warehouseId,
						section_id: section.section_id,
					}
				: undefined,
	});

	const details: GetSectionDetailsResponse | undefined = GetSectionDetails.data;
	const capacity = details?.capacity ?? null;
	const coordinates = details?.coordinates ?? null;
	const showLoading =
		isLoading || GetSectionDetails.isPending || GetSectionDetails.isFetching;

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			description={description}
			variant="default"
			size="7xl"
			panelClassName={[
				"flex max-h-[min(94dvh,50rem)] flex-col overflow-hidden",
				"!mx-2 !my-2 sm:!mx-4 sm:!my-6",
				"rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
			].join(" ")}
			contentClassName="flex min-h-0 flex-1 flex-col"
		>
			<div className="flex min-h-0 min-w-0 flex-1 flex-col">
				{showLoading ? (
					<div className="py-8">
						<Loader title="Cargando detalle de la sección..." />
					</div>
				) : !details ? (
					<div className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
						No se encontró información de la sección.
					</div>
				) : (
					<>
						<div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
							<div className="flex flex-col gap-5 pb-2">
								<section className="flex flex-col gap-3">
									<h4 className={sectionTitleClassName}>Información general</h4>

									<div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-3">
										<DetailField
											label="Código"
											value={details.section_code?.trim() || "—"}
											icon={<HashIcon size={18} />}
										/>

										<DetailField
											label="Tipo"
											value={<SectionTypeBadge value={details.section_type} />}
											icon={<LayoutGridIcon size={18} />}
										/>

										<DetailField
											label="Almacenamiento"
											value={
												<SectionStorageTypeBadge
													value={details.section_storage_type}
												/>
											}
											icon={<PackageIcon size={18} />}
										/>

										<DetailField
											label="Estado"
											value={
												<ActiveStatusBadge isActive={Boolean(details.is_active)} />
											}
										/>

										<DetailField
											label="Máx. polines por nivel"
											value={formatSectionMetric(
												details.max_pallets_per_level_aisle,
											)}
											icon={<BoxIcon size={18} />}
										/>
									</div>
								</section>

								<section className="flex flex-col gap-3">
									<h4 className={sectionTitleClassName}>Dimensiones</h4>

									<div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-4">
										<DetailField
											label="Ancho"
											value={formatSectionMetric(capacity?.width, "m")}
											icon={<MoveHorizontalIcon size={18} />}
										/>

										<DetailField
											label="Largo"
											value={formatSectionMetric(capacity?.length, "m")}
											icon={<MoveVerticalIcon size={18} />}
										/>
									</div>
								</section>

								<section className="flex flex-col gap-3">
									<h4 className={sectionTitleClassName}>Capacidad (área)</h4>

									<div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-3">
										<DetailField
											label="Área total"
											value={formatSectionMetric(capacity?.total_area_m2, "m²")}
										/>
										<DetailField
											label="Área inutilizable"
											value={formatSectionMetric(capacity?.unused_area_m2, "m²")}
										/>
										<DetailField
											label="Área disponible"
											value={formatSectionMetric(
												capacity?.available_area_with_margin_m2,
												"m²",
											)}
										/>
										<DetailField
											label="Área ocupada facturable"
											value={formatSectionMetric(
												capacity?.occupied_chargeable_area_m2,
												"m²",
											)}
										/>
										<DetailField
											label="Área libre facturable"
											value={formatSectionMetric(
												capacity?.unoccupied_chargeable_area_m2,
												"m²",
											)}
										/>
										<DetailField
											label="% área disponible"
											value={formatSectionMetric(
												capacity?.percentage_available_area_with_margin_m2,
												"%",
											)}
										/>
									</div>
								</section>

								<section className="flex flex-col gap-3">
									<h4 className={sectionTitleClassName}>Coordenadas</h4>

									<div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-4">
										<DetailField
											label="Posición X"
											value={formatSectionMetric(coordinates?.position_x, "m")}
											icon={<MoveHorizontalIcon size={18} />}
										/>
										<DetailField
											label="Posición Y"
											value={formatSectionMetric(coordinates?.position_y, "m")}
											icon={<MoveVerticalIcon size={18} />}
										/>
										<DetailField
											label="Posición Z"
											value={formatSectionMetric(coordinates?.position_z, "m")}
											icon={<Maximize2Icon size={18} />}
										/>
										<DetailField
											label="Rotación Y"
											value={formatSectionMetric(coordinates?.rotation_y, "°")}
											icon={<RotateCwIcon size={18} />}
										/>
									</div>
								</section>
							</div>
						</div>

						{footer ? (
							<div className="-mx-4 -mb-4 mt-0 shrink-0 border-t border-t-slate-300 bg-white px-4 py-4 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6 rounded-b-xl">
								{footer}
							</div>
						) : null}
					</>
				)}
			</div>
		</Modal>
	);
}
