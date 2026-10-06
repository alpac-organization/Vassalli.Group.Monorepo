import { useEffect, useMemo, useState } from "react";
import { Building2, ChevronRight, Layers } from "lucide-react";
import { LegendItem } from "@app/shared/components/legend-item/legend-item";
import { RACK_STATUS_LEGEND } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/rack-status-badge";
import { RackShape } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/rack-shape/rack-shape";
import { Group, Rect } from "react-konva";
import type { RackViewerProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/rack-viewer/rack-viewer.types";
import type { RackDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/racks/get-racks-res";
import { PIXELS_PER_METER } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/warehouse-config";
import { WarehouseShape } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-shape/warehouse-shape";
import { createMockGaleron } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/galeron-shape/galeron-shape.types";

export const RackViewer = ({
	className = "",
	warehouse,
	racks = [],
	selectedRackId = null,
	sectionCode,
	warehouseName,
	sectionWidth = 0,
	sectionLength = 0,
	sectionPositionX = 0,
	sectionPositionY = 0,
	onSelectRack,
}: RackViewerProps) => {

	const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
	const activeSelectedId = selectedRackId ?? internalSelectedId;
	const [activeLevelFilter, setActiveLevelFilter] = useState<number | null>(null);

	const availableLevels = useMemo(() => {
		const set = new Set(racks.map((r) => r.level_number).filter(Boolean));
		return Array.from(set).sort((a, b) => a - b);
	}, [racks]);

	useEffect(() => {
		if (activeLevelFilter !== null && !availableLevels.includes(activeLevelFilter)) {
			setActiveLevelFilter(null);
		}
	}, [availableLevels, activeLevelFilter]);

	const displayedRacks = useMemo(() => {
		if (activeLevelFilter == null) return racks;
		return racks.filter((r) => r.level_number === activeLevelFilter);
	}, [racks, activeLevelFilter]);

	const handleSelect = (rack: RackDto) => {
		const id = rack.rack_id || null;
		setInternalSelectedId(id);
		onSelectRack?.(rack);
	};



	const warehouseWidth = warehouse?.width ?? 0;
	const warehouseLength = warehouse?.length ?? 0;
	const margins = {
		top: warehouse?.margin_top ?? 0,
		bottom: warehouse?.margin_bottom ?? 0,
		left: warehouse?.margin_left ?? 0,
		right: warehouse?.margin_right ?? 0,
	};

	const secX = sectionPositionX * PIXELS_PER_METER;
	const secY = sectionPositionY * PIXELS_PER_METER;
	const secWidthPx = sectionWidth * PIXELS_PER_METER;
	const secLengthPx = sectionLength * PIXELS_PER_METER;

	return (
		<section
			className={`w-full rounded-lg gap-3 p-6 overflow-visible border border-slate-600 hover:border-neutral-600 bg-white dark:bg-[#272b34] ${className}`}
		>
			{availableLevels.length > 1 && (
				<div className="flex items-center gap-2 mb-3">
					<span className="text-xs text-slate-400">Ver nivel en plano:</span>
					<div className="flex items-center gap-1.5 flex-wrap">
						<button
							type="button"
							onClick={() => setActiveLevelFilter(null)}
							className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${activeLevelFilter === null
									? "bg-alpac-primary-500! text-white!"
									: "bg-slate-700 text-slate-300 hover:bg-slate-600"
								}`}
						>
							Todos
						</button>
						{availableLevels.map((lvl) => (
							<button
								key={lvl}
								type="button"
								onClick={() => setActiveLevelFilter(lvl)}
								className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${activeLevelFilter === lvl
										? "bg-alpac-primary-500! text-white!"
										: "bg-slate-700 text-slate-300 hover:bg-slate-600"
									}`}
							>
								Nivel {lvl}
							</button>
						))}
					</div>
				</div>
			)}

			<WarehouseShape
				title={
					<nav className="flex items-center gap-2 text-xs text-slate-400 font-medium flex-wrap">
						<span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-semibold">
							<Building2 size={15} className="text-slate-500" />
							{warehouseName || "Bodega"}
						</span>
						<ChevronRight size={13} className="text-slate-500" />
						<span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-semibold">
							<Layers size={12} />
							{sectionCode}
						</span>
						<ChevronRight size={13} className="text-slate-500" />
						{sectionWidth > 0 && sectionLength > 0 && (
							<span className="text-[11px] text-slate-500 font-normal">
								({sectionWidth}m × {sectionLength}m)
							</span>
						)}

					</nav>
				}
				draggable
				width={warehouseWidth}
				length={warehouseLength}
				galerons={
					warehouseWidth > 0 && warehouseLength > 0
						? [createMockGaleron(warehouseWidth, warehouseLength)]
						: []
				}
				marginTop={margins.top}
				marginBottom={margins.bottom}
				marginLeft={margins.left}
				marginRight={margins.right}
			>
				{/* Única sección visualizada dentro de la bodega: la sección activa seleccionada */}
				<Group x={secX} y={secY}>
					{/* Fondo y borde perimetral de la sección */}
					<Rect
						width={secWidthPx}
						height={secLengthPx}
						fill="rgba(56, 189, 248, 0.06)"
						stroke="#38bdf8"
						strokeWidth={1}
						cornerRadius={1}
					/>

					{/* Racks dentro de la sección activa */}
					{displayedRacks.map((rack) => {
						const currentId = rack.rack_id;
						const isVertical = (sectionLength || 0) >= (sectionWidth || 0);
						return (
							<RackShape
								key={currentId}
								rack={rack}
								selected={activeSelectedId === currentId}
								pixelsPerMeter={PIXELS_PER_METER}
								canvasWidth={sectionWidth}
								isVertical={isVertical}
								onSelect={handleSelect}
							/>
						);
					})}

				</Group>

			</WarehouseShape>

			<div className="flex gap-x-4 gap-y-1 items-center mt-3 flex-wrap">
				{RACK_STATUS_LEGEND.map((item) => (
					<LegendItem key={item.text} text={item.text} color={item.color} />
				))}
			</div>
		</section>
	);
};
