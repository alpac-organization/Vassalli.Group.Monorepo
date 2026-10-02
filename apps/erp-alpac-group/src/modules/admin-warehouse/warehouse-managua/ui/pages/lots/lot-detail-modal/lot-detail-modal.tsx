import { Modal } from "@alpac/design-system";
import {
	HashIcon,
	LayersIcon,
	Maximize2Icon,
	MoveHorizontalIcon,
	MoveVerticalIcon,
	RotateCwIcon,
} from "lucide-react";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { Loader } from "@app/shared/components/loaders/loader";
import {
	RackStatusBadge,
	StackingBadge,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/layout-warehouses-badges";
import { useLot } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useLot";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { LotDetailModalProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/lot-detail-modal/types/lot-detail-modal.types";
import {
	formatLotBoolean,
	formatLotMetric,
	sectionTitleClassName,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/lot-detail-modal/utils/lot-detail-modal.utils";

export function LotDetailModal({
	isOpen,
	onClose,
	warehouseId,
	sectionId,
	lot,
	isLoading = false,
	title = "Detalle de tramo",
	description = "Consulta la información general, capacidad y coordenadas del tramo.",
	footer,
}: LotDetailModalProps) {
	const { companyId, moduleCode } = useUserStore();

	const canFetchDetails = Boolean(isOpen && lot?.id && warehouseId && sectionId);

	const { GetLotCapacities, GetLotCoordinates } = useLot({
		getLotCapacitiesPayload: canFetchDetails
			? {
					company_id: companyId,
					module_code: moduleCode,
					warehouse_id: warehouseId,
					section_id: sectionId,
					lot_id: lot!.id,
				}
			: undefined,
		getLotCoordinatesPayload: canFetchDetails
			? {
					company_id: companyId,
					module_code: moduleCode,
					warehouse_id: warehouseId,
					section_id: sectionId,
					lot_id: lot!.id,
				}
			: undefined,
	});

	const capacity = GetLotCapacities.data ?? null;
	const coordinates = GetLotCoordinates.data ?? null;

	const showLoading =
		isLoading ||
		(canFetchDetails &&
			(GetLotCapacities.isPending ||
				GetLotCapacities.isFetching ||
				GetLotCoordinates.isPending ||
				GetLotCoordinates.isFetching));

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
						<Loader title="Cargando detalle del tramo..." />
					</div>
				) : !lot ? (
					<div className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
						No se encontró información del tramo.
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
											value={lot.code?.trim() || "—"}
											icon={<HashIcon size={18} />}
										/>

										<DetailField
											label="Estado"
											value={<RackStatusBadge value={lot.status ?? ""} />}
										/>

										<DetailField
											label="Permite estibado"
											value={
												lot.allows_stacking ? (
													<span className="inline-flex items-center gap-2">
														{formatLotBoolean(lot.allows_stacking)}
														<StackingBadge allowsStacking={lot.allows_stacking} />
													</span>
												) : (
													formatLotBoolean(lot.allows_stacking)
												)
											}
											icon={<LayersIcon size={18} />}
										/>

										{lot.unavailable_reason ? (
											<DetailField
												label="Motivo no disponible"
												value={lot.unavailable_reason}
												containerClass="sm:col-span-2 lg:col-span-3"
											/>
										) : null}
									</div>
								</section>

								<section className="flex flex-col gap-3">
									<h4 className={sectionTitleClassName}>Dimensiones</h4>

									<div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-4">
										<DetailField
											label="Ancho"
											value={formatLotMetric(
												capacity?.width ?? lot.width,
												"m",
											)}
											icon={<MoveHorizontalIcon size={18} />}
										/>

										<DetailField
											label="Largo"
											value={formatLotMetric(
												capacity?.length ?? lot.length,
												"m",
											)}
											icon={<MoveVerticalIcon size={18} />}
										/>
									</div>
								</section>

								<section className="flex flex-col gap-3">
									<h4 className={sectionTitleClassName}>Capacidad (área)</h4>

									<div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-3">
										<DetailField
											label="Área total"
											value={formatLotMetric(
												capacity?.total_area_m2 ?? lot.area,
												"m²",
											)}
										/>
										<DetailField
											label="Área inutilizable"
											value={formatLotMetric(capacity?.unused_area_m2, "m²")}
										/>
										<DetailField
											label="Área disponible"
											value={formatLotMetric(
												capacity?.available_area_with_margin_m2,
												"m²",
											)}
										/>
										<DetailField
											label="Área ocupada facturable"
											value={formatLotMetric(
												capacity?.occupied_chargeable_area_m2,
												"m²",
											)}
										/>
										<DetailField
											label="Área libre facturable"
											value={formatLotMetric(
												capacity?.unoccupied_chargeable_area_m2,
												"m²",
											)}
										/>
										<DetailField
											label="% área disponible"
											value={formatLotMetric(
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
											value={formatLotMetric(
												coordinates?.position_x ?? lot.position_x,
												"m",
											)}
											icon={<MoveHorizontalIcon size={18} />}
										/>
										<DetailField
											label="Posición Y"
											value={formatLotMetric(
												coordinates?.position_y ?? lot.position_y,
												"m",
											)}
											icon={<MoveVerticalIcon size={18} />}
										/>
										<DetailField
											label="Posición Z"
											value={formatLotMetric(
												coordinates?.position_z ?? lot.position_z,
												"m",
											)}
											icon={<Maximize2Icon size={18} />}
										/>
										<DetailField
											label="Rotación Y"
											value={formatLotMetric(
												coordinates?.rotation_y ?? lot.rotation_y,
												"°",
											)}
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
