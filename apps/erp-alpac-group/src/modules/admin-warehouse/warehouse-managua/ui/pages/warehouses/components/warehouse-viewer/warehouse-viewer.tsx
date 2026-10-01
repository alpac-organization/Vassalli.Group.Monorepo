import { Spinner } from "@alpac/design-system";
import { LegendItem } from "@app/shared/components/legend-item/legend-item";
import { WarehouseShape } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-shape/warehouse-shape";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import { useUserStore } from "@app/shared/stores/useUserStore";
import {
	getWarehouseOccupancyPercentage,
	mapWarehouseDetailsToLayout,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/utils/warehouse-details.mapper";
import { getWarehouseTypeLabel } from "@app/modules/warehouse/domain/enums/warehouse.enum";
import type { WarehouseViewerProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-viewer/warehouse-viewer.types";

export const WarehouseViewer = ({
	className,
	warehouse,
}: WarehouseViewerProps) => {
	const { companyId, moduleCode } = useUserStore();
	const warehouseId = warehouse?.warehouse_id?.trim() ?? "";

	const { GetWarehouseDetails } = useWarehouse({
		getWarehouseDetailsPayload: warehouseId
			? {
					company_id: companyId,
					module_code: moduleCode,
					warehouse_id: warehouseId,
				}
			: undefined,
	});

	const details = GetWarehouseDetails.data;
	const layout = details ? mapWarehouseDetailsToLayout(details) : undefined;
	const isLoading = GetWarehouseDetails.isPending || GetWarehouseDetails.isFetching;

	const width = layout?.width ?? 0;
	const length = layout?.length ?? 0;
	const margins = {
		top: layout?.margin_top ?? 0,
		bottom: layout?.margin_bottom ?? 0,
		left: layout?.margin_left ?? 0,
		right: layout?.margin_right ?? 0,
	};

	const locationName = details?.location?.location_name?.trim() || "—";
	const totalArea = details?.capacity?.total_area_m2 ?? 0;
	const occupancy = getWarehouseOccupancyPercentage(details);
	const warehouseCode = details?.code?.trim() || warehouse?.code?.trim() || "—";
	const warehouseType = getWarehouseTypeLabel(
		details?.warehouse_type ?? warehouse?.warehouse_type,
	);
	const headerSubtitle = isLoading
		? "Cargando detalle..."
		: `${warehouseCode} · ${warehouseType} · ${locationName}`;
	const metricsSummary =
		!isLoading && details
			? `Área ${totalArea} m² · Ocupación ${occupancy}%`
			: null;

	if (!warehouseId) {
		return (
			<section
				className={`w-full rounded-lg gap-3 p-6 overflow-visible border border-slate-600 hover:border-neutral-600 bg-white dark:bg-[#272b34] ${className ?? ""}`}
			>
				<div className="flex lg:justify-between items-center mb-4 flex-wrap">
					<div>
						<h4 className="font-bold m-0! p-0!">Plano de la bodega</h4>
						<small className="text-slate-500 dark:text-slate-400">
							Seleccione una bodega para ver su plano
						</small>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section
			className={`w-full rounded-lg gap-3 p-6 overflow-visible border border-slate-600 hover:border-neutral-600 bg-white dark:bg-[#272b34] ${className ?? ""}`}
		>
			<div className="flex lg:justify-between items-center mb-4 flex-wrap gap-2">
				<div>
					<h4 className="font-bold m-0! p-0!">Plano de la bodega</h4>
					<small className="text-slate-500 dark:text-slate-400">
						{headerSubtitle}
					</small>
				</div>
				{metricsSummary ? (
					<small className="text-slate-500 dark:text-slate-400">
						{metricsSummary}
					</small>
				) : null}
			</div>

			{isLoading ? (
				<div className="flex flex-col items-center justify-center gap-3 py-10">
					<Spinner
						size="large"
						className="text-slate-700! dark:text-white!"
					/>
					<p className="m-0 text-sm text-slate-500 dark:text-slate-400">
						Cargando plano de la bodega...
					</p>
				</div>
			) : (
				<WarehouseShape
					width={width}
					length={length}
					draggable
					marginTop={margins.top}
					marginBottom={margins.bottom}
					marginLeft={margins.left}
					marginRight={margins.right}
				/>
			)}

			<div className="flex gap-x-4 gap-y-1 items-center justify-between mt-2 flex-wrap">
				<div className="flex gap-x-4 gap-y-1 items-center flex-wrap">
					{[].map(() => (
						<LegendItem key="" text="" color="" />
					))}
				</div>
			</div>
		</section>
	);
};
