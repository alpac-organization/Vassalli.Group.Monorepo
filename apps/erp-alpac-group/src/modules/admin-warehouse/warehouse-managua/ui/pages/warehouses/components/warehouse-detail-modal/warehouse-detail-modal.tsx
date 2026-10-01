import { Modal } from "@alpac/design-system";
import {
	BoxIcon,
	HashIcon,
	MapPinIcon,
	Maximize2Icon,
	MoveHorizontalIcon,
	MoveVerticalIcon,
	RulerIcon,
	WarehouseIcon,
} from "lucide-react";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { Loader } from "@app/shared/components/loaders/loader";
import { getWarehouseTypeLabel } from "@app/modules/warehouse/domain/enums/warehouse.enum";
import { ActiveStatusBadge } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/badges/active-status-badge";
import type { WarehouseDetailModalProps } from "./warehouse-detail-modal.types";
import {
	formatWarehouseBoolean,
	formatWarehouseMetric,
	sectionTitleClassName,
} from "./utils/warehouse-detail-modal.utils";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { GetWarehouseDetailsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouse-details-response";

export function WarehouseDetailModal({
	isOpen,
	onClose,
	warehouse,
	isLoading = false,
	title = "Detalle de bodega",
	description = "Consulta la información general y capacidad del almacén.",
	footer
}: WarehouseDetailModalProps) {

	const { companyId, moduleCode } = useUserStore();

	const { GetWarehouseDetails } = useWarehouse({
		getWarehouseDetailsPayload:
			isOpen && warehouse?.warehouse_id
				? {
						company_id: companyId,
						module_code: moduleCode,
						warehouse_id: warehouse.warehouse_id,
					}
				: undefined,
	});

	const details: GetWarehouseDetailsResponse | undefined = GetWarehouseDetails.data;

	const capacity = details?.capacity ?? null;
	const locationName = details?.location?.location_name?.trim() || "—";
	const showLoading =
		isLoading || GetWarehouseDetails.isPending || GetWarehouseDetails.isFetching;

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
						<Loader title="Cargando detalle de la bodega..." />
					</div>
				) : !details ? (
					<div className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
						No se encontró información de la bodega.
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
											value={details.code?.trim() || "—"}
											icon={<HashIcon size={18} />}
										/>

										<DetailField
											label="Tipo"
											value={getWarehouseTypeLabel(details.warehouse_type)}
											icon={<WarehouseIcon size={18} />}
										/>

										<DetailField
											label="Estado"
											value={<ActiveStatusBadge isActive={Boolean(details.is_active)} />}
										/>

										<DetailField
											label="Ubicación"
											value={locationName}
											containerClass="sm:col-span-2 lg:col-span-3"
											icon={<MapPinIcon size={18} />}
										/>
									</div>
								</section>

								<section className="flex flex-col gap-3">
									<h4 className={sectionTitleClassName}>Dimensiones</h4>

									<div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-4">
										<DetailField
											label="Ancho"
											value={formatWarehouseMetric(capacity?.width, "m")}
											icon={<MoveHorizontalIcon size={18} />}
										/>

										<DetailField
											label="Largo"
											value={formatWarehouseMetric(capacity?.length, "m")}
											icon={<MoveVerticalIcon size={18} />}
										/>

										<DetailField
											label="Altura mínima"
											value={formatWarehouseMetric(capacity?.minimum_height, "m")}
											icon={<RulerIcon size={18} />}
										/>

										<DetailField
											label="Altura máxima"
											value={formatWarehouseMetric(capacity?.maximum_height, "m")}
											icon={<Maximize2Icon size={18} />}
										/>

										<DetailField
											label="Aplica márgenes"
											value={formatWarehouseBoolean(capacity?.has_margins)}
											icon={<BoxIcon size={18} />}
										/>

										<DetailField
											label="Margen superior"
											value={formatWarehouseMetric(capacity?.margin_top, "m")}
										/>

										<DetailField
											label="Margen inferior"
											value={formatWarehouseMetric(capacity?.margin_bottom, "m")}
										/>

										<DetailField
											label="Margen izquierdo"
											value={formatWarehouseMetric(capacity?.margin_left, "m")}
										/>

										<DetailField
											label="Margen derecho"
											value={formatWarehouseMetric(capacity?.margin_right, "m")}
										/>
									</div>
								</section>

								<section className="flex flex-col gap-3">
									<h4 className={sectionTitleClassName}>Capacidad (área)</h4>

									<div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-3">
										<DetailField
											label="Área total"
											value={formatWarehouseMetric(capacity?.total_area_m2, "m²")}
										/>
										<DetailField
											label="Área inutilizable"
											value={formatWarehouseMetric(capacity?.unused_area_m2, "m²")}
										/>
										<DetailField
											label="Área disponible"
											value={formatWarehouseMetric(
												capacity?.available_area_with_margin_m2,
												"m²",
											)}
										/>
										<DetailField
											label="Área ocupada facturable"
											value={formatWarehouseMetric(
												capacity?.occupied_chargeable_area_m2,
												"m²",
											)}
										/>
										<DetailField
											label="Área libre facturable"
											value={formatWarehouseMetric(
												capacity?.unoccupied_chargeable_area_m2,
												"m²",
											)}
										/>
										<DetailField
											label="% área disponible"
											value={formatWarehouseMetric(
												capacity?.percentage_available_area_with_margin_m2,
												"%",
											)}
										/>
									</div>
								</section>

								<section className="flex flex-col gap-3">
									<h4 className={sectionTitleClassName}>Capacidad (volumen)</h4>

									<div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-3">
										<DetailField
											label="Volumen total"
											value={formatWarehouseMetric(capacity?.total_volumen_m3, "m³")}
										/>
										<DetailField
											label="Volumen inutilizable"
											value={formatWarehouseMetric(capacity?.unused_volumen_m3, "m³")}
										/>
										<DetailField
											label="Volumen disponible"
											value={formatWarehouseMetric(
												capacity?.available_volumen_with_margin_m3,
												"m³",
											)}
										/>
										<DetailField
											label="Volumen ocupado facturable"
											value={formatWarehouseMetric(
												capacity?.occupied_chargeable_volumen_m3,
												"m³",
											)}
										/>
										<DetailField
											label="Volumen libre facturable"
											value={formatWarehouseMetric(
												capacity?.unoccupied_chargeable_volumen_m3,
												"m³",
											)}
										/>
										<DetailField
											label="% volumen disponible"
											value={formatWarehouseMetric(
												capacity?.percentage_available_volumen_with_margin_m3,
												"%",
											)}
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
