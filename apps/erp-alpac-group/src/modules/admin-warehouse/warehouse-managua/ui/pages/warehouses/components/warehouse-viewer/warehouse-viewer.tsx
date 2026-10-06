import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { SaveIcon } from "lucide-react";
import { Button, Spinner } from "@alpac/design-system";
import { LegendItem } from "@app/shared/components/legend-item/legend-item";
import { WarehouseShape } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-shape/warehouse-shape";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import {
	getWarehouseOccupancyPercentage,
	mapWarehouseDetailsToLayout,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/utils/warehouse-details.mapper";
import { getWarehouseTypeLabel } from "@app/modules/warehouse/domain/enums/warehouse.enum";
import type {
	GaleronLayoutUpdate,
	GaleronSectionLayoutUpdate,
	WarehouseViewerHandle,
	WarehouseViewerProps,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-viewer/warehouse-viewer.types";
import { WarehouseLegends } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-table/utils/warehouse-status";
import { GALERON_FILL } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/galeron-shape/galeron-shape";
import {
	createMockGaleron,
	type GaleronDto,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/galeron-shape/galeron-shape.types";
import { GaleronShapeMenu } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/galeron-shape/components/galeron-shape-menu";
import type { GaleronMenuState } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/galeron-shape/components/galeron-shape-menu.types";
import { GaleronSectionShape } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/galeron-section-shape/galeron-section-shape";
import {
	createMockGaleronSections,
	GALERON_SECTION_FILL,
	type GaleronSectionDto,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/galeron-section-shape/galeron-section-shape.types";
import { GaleronSectionShapeMenu } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/galeron-section-shape/components/galeron-section-shape-menu";
import type { GaleronSectionMenuState } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/galeron-section-shape/components/galeron-section-shape-menu.types";
import { isInsideAvailableArea } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/layout-bound";
import type Konva from "konva";
import { bringToFront, sendToBack } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/utils/warehouse-utils";

const GALERON_OFFSET_METRES = 2;
const SECTION_INSET_METRES = 0.25;
const DEFAULT_SECTION_SIZE_METRES = 2;

type EditMode = "edit" | null;
type EditTarget = "galeron" | "section" | null;

type LayoutCoordinate = Record<string, { x: number; y: number }>;
type LayoutSize = Record<string, { width: number; length: number }>;
type LayoutBaseline = { x: number; y: number; width: number; length: number };

const round2 = (value: number) => Math.round(value * 100) / 100;

const hasNumericChange = (
	current: number | null | undefined,
	next: number,
): boolean => {
	if (current == null) return true;
	return round2(current) !== round2(next);
};

const isSectionInsideGaleron = (
	section: { x: number; y: number; width: number; length: number },
	galeron: GaleronDto,
) =>
	isInsideAvailableArea(
		{
			x: section.x,
			y: section.y,
			width: section.width,
			length: section.length,
		},
		{
			width: galeron.x + galeron.width,
			length: galeron.y + galeron.length,
			marginLeft: galeron.x,
			marginTop: galeron.y,
			marginRight: 0,
			marginBottom: 0,
		},
	);

export const WarehouseViewer = forwardRef<WarehouseViewerHandle, WarehouseViewerProps>(
	function WarehouseViewer(
		{ className, warehouse, onSaveGaleronLayout, onSaveGaleronSectionLayout },
		ref,
	) {
		const { companyId, moduleCode } = useUserStore();
		const { handleRequestError, AlertComponent } = useAlertState();

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

		const [galeronsByWarehouse, setGaleronsByWarehouse] = useState<
			Record<string, GaleronDto[]>
		>({});
		const [sectionsByWarehouse, setSectionsByWarehouse] = useState<
			Record<string, GaleronSectionDto[]>
		>({});
		const [selectedGaleronId, setSelectedGaleronId] = useState<string | null>(null);
		const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
		const [galeronMenu, setGaleronMenu] = useState<GaleronMenuState | null>(null);
		const [sectionMenu, setSectionMenu] = useState<GaleronSectionMenuState | null>(null);
		const [editMode, setEditMode] = useState<EditMode>(null);
		const [editTarget, setEditTarget] = useState<EditTarget>(null);
		const [editingId, setEditingId] = useState<string | null>(null);
		const [coordinates, setCoordinates] = useState<LayoutCoordinate>({});
		const [sizes, setSizes] = useState<LayoutSize>({});
		const [editBaseline, setEditBaseline] = useState<LayoutBaseline | null>(null);

		const hasPendingLayoutEdit = editMode === "edit" && editingId != null;

		const resetEditState = useCallback((entityId?: string | null) => {
			setEditMode(null);
			setEditTarget(null);
			setEditingId(null);
			setEditBaseline(null);

			if (!entityId) {
				setCoordinates({});
				setSizes({});
				return;
			}

			setCoordinates((prev) => {
				const { [entityId]: _, ...rest } = prev;
				return rest;
			});
			setSizes((prev) => {
				const { [entityId]: _, ...rest } = prev;
				return rest;
			});
		}, []);

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

		const galerons = warehouseId ? (galeronsByWarehouse[warehouseId] ?? []) : [];
		const sections = warehouseId ? (sectionsByWarehouse[warehouseId] ?? []) : [];

		const layoutGalerons =
			width > 0 && length > 0
				? [createMockGaleron(width, length), ...galerons]
				: galerons;

		const layoutSections =
			width > 0 && length > 0
				? [...createMockGaleronSections(width, length), ...sections]
				: sections;

		const displayGalerons = useMemo(
			() =>
				layoutGalerons.map((galeron) => {
					if (editTarget !== "galeron" || galeron.id !== editingId) return galeron;

					const coordinate = coordinates[editingId];
					const size = sizes[editingId];

					return {
						...galeron,
						x: coordinate?.x ?? galeron.x,
						y: coordinate?.y ?? galeron.y,
						width: size?.width ?? galeron.width,
						length: size?.length ?? galeron.length,
					};
				}),
			[coordinates, editTarget, editingId, layoutGalerons, sizes],
		);

		const displaySections = useMemo(
			() =>
				layoutSections.map((section) => {
					if (editTarget !== "section" || section.id !== editingId) return section;

					const coordinate = coordinates[editingId];
					const size = sizes[editingId];

					return {
						...section,
						x: coordinate?.x ?? section.x,
						y: coordinate?.y ?? section.y,
						width: size?.width ?? section.width,
						length: size?.length ?? section.length,
					};
				}),
			[coordinates, editTarget, editingId, layoutSections, sizes],
		);

		const addGaleron = useCallback(
			(galeronWidth: number, galeronLength: number) => {
				if (!warehouseId) return;

				const areaId = crypto.randomUUID();

				setGaleronsByWarehouse((current) => {
					const list = current[warehouseId] ?? [];
					const offset = list.length * GALERON_OFFSET_METRES;

					const area: GaleronDto = {
						id: areaId,
						name: `Galerón ${list.length + 1}`,
						x: offset,
						y: offset,
						width: galeronWidth,
						length: galeronLength,
					};

					return { ...current, [warehouseId]: [...list, area] };
				});

				setSelectedGaleronId(areaId);
			},
			[warehouseId],
		);

		const updateLayoutCoordinate = useCallback(
			(id: string, x: number, y: number) => {
				if (editMode !== "edit" || editingId !== id) return;

				setCoordinates((prev) => ({
					...prev,
					[id]: { x, y },
				}));
			},
			[editMode, editingId],
		);

		const updateLayoutSize = useCallback(
			(id: string, nextWidth: number, nextLength: number) => {
				if (editMode !== "edit" || editingId !== id) return;

				setSizes((prev) => ({
					...prev,
					[id]: { width: nextWidth, length: nextLength },
				}));
			},
			[editMode, editingId],
		);

		const handleGaleronContextMenu = useCallback(
			(menu: GaleronMenuState) => {
				if (hasPendingLayoutEdit && !(editTarget === "galeron" && editingId === menu.galeronData.id)) {
					return;
				}

				setSelectedGaleronId(menu.galeronData.id);
				setSelectedSectionId(null);
				setSectionMenu(null);
				setGaleronMenu(menu);
			},
			[editTarget, editingId, hasPendingLayoutEdit],
		);

		const handleSectionContextMenu = useCallback(
			(menu: GaleronSectionMenuState) => {
				if (hasPendingLayoutEdit && !(editTarget === "section" && editingId === menu.section.id)) {
					return;
				}

				setSelectedSectionId(menu.section.id);
				setSelectedGaleronId(menu.section.galeron_id);
				setGaleronMenu(null);
				setSectionMenu(menu);
			},
			[editTarget, editingId, hasPendingLayoutEdit],
		);

		const handleEditGaleron = useCallback(
			(galeron: GaleronDto) => {
				if (hasPendingLayoutEdit && !(editTarget === "galeron" && editingId === galeron.id)) {
					return;
				}

				setGaleronMenu(null);
				setSectionMenu(null);
				setEditTarget("galeron");
				setEditingId(galeron.id);
				setEditMode("edit");
				setSelectedGaleronId(galeron.id);
				setSelectedSectionId(null);
				setEditBaseline({
					x: galeron.x,
					y: galeron.y,
					width: galeron.width,
					length: galeron.length,
				});
			},
			[editTarget, editingId, hasPendingLayoutEdit],
		);

		const handleEditSection = useCallback(
			(section: GaleronSectionDto) => {
				if (hasPendingLayoutEdit && !(editTarget === "section" && editingId === section.id)) {
					return;
				}

				setSectionMenu(null);
				setGaleronMenu(null);
				setEditTarget("section");
				setEditingId(section.id);
				setEditMode("edit");
				setSelectedSectionId(section.id);
				setSelectedGaleronId(section.galeron_id);
				setEditBaseline({
					x: section.x,
					y: section.y,
					width: section.width,
					length: section.length,
				});
			},
			[editTarget, editingId, hasPendingLayoutEdit],
		);

		const handleAddGaleronSection = useCallback(
			(galeron: GaleronDto) => {
				if (!warehouseId) return;

				if (hasPendingLayoutEdit) {
					handleRequestError(
						"Guarde o cancele los cambios actuales antes de agregar una sección.",
					);
					return;
				}

				const sectionWidth = Math.min(
					DEFAULT_SECTION_SIZE_METRES,
					Math.max(0.5, galeron.width - SECTION_INSET_METRES * 2),
				);
				const sectionLength = Math.min(
					DEFAULT_SECTION_SIZE_METRES,
					Math.max(0.5, galeron.length - SECTION_INSET_METRES * 2),
				);

				const section: GaleronSectionDto = {
					id: crypto.randomUUID(),
					galeron_id: galeron.id,
					code: `SG-${(layoutSections.filter((item) => item.galeron_id === galeron.id).length + 1)
						.toString()
						.padStart(2, "0")}`,
					x: galeron.x + SECTION_INSET_METRES,
					y: galeron.y + SECTION_INSET_METRES,
					width: sectionWidth,
					length: sectionLength,
				};

				if (!isSectionInsideGaleron(section, galeron)) {
					handleRequestError(
						"La sección no cabe dentro del galerón seleccionado.",
					);
					return;
				}

				setSectionsByWarehouse((current) => ({
					...current,
					[warehouseId]: [...(current[warehouseId] ?? []), section],
				}));
				setSelectedGaleronId(galeron.id);
				setSelectedSectionId(section.id);
			},
			[handleRequestError, hasPendingLayoutEdit, layoutSections, warehouseId],
		);

		const handleSaveGaleronLayout = useCallback(() => {
			if (!editingId || !editBaseline || !warehouseId || editTarget !== "galeron") return;

			const pendingCoordinate = coordinates[editingId];
			const pendingSize = sizes[editingId];

			const positionX = pendingCoordinate?.x ?? editBaseline.x;
			const positionY = pendingCoordinate?.y ?? editBaseline.y;
			const nextWidth = pendingSize?.width ?? editBaseline.width;
			const nextLength = pendingSize?.length ?? editBaseline.length;

			const hasChanges =
				hasNumericChange(editBaseline.x, positionX) ||
				hasNumericChange(editBaseline.y, positionY) ||
				hasNumericChange(editBaseline.width, nextWidth) ||
				hasNumericChange(editBaseline.length, nextLength);

			if (!hasChanges) {
				resetEditState(editingId);
				return;
			}

			const layoutUpdate: GaleronLayoutUpdate = {
				galeron_id: editingId,
				position_x: round2(positionX),
				position_y: round2(positionY),
				width: round2(nextWidth),
				length: round2(nextLength),
			};

			setGaleronsByWarehouse((galeronsByWarehouse) => {
				const warehouseGalerons = galeronsByWarehouse[warehouseId] ?? [];
				if (!warehouseGalerons.some((galeron) => galeron.id === editingId)) {
					return galeronsByWarehouse;
				}

				return {
					...galeronsByWarehouse,
					[warehouseId]: warehouseGalerons.map((galeron) =>
						galeron.id === editingId
							? {
								...galeron,
								x: layoutUpdate.position_x,
								y: layoutUpdate.position_y,
								width: layoutUpdate.width,
								length: layoutUpdate.length,
							}
							: galeron,
					),
				};
			});

			onSaveGaleronLayout?.(layoutUpdate);
			resetEditState(editingId);
		}, [
			coordinates,
			editBaseline,
			editTarget,
			editingId,
			onSaveGaleronLayout,
			resetEditState,
			sizes,
			warehouseId,
		]);

		const handleSaveGaleronSectionLayout = useCallback(() => {
			if (!editingId || !editBaseline || !warehouseId || editTarget !== "section") return;

			const section = layoutSections.find((item) => item.id === editingId);
			if (!section) return;

			const parentGaleron =
				displayGalerons.find((item) => item.id === section.galeron_id) ??
				galerons.find((item) => item.id === section.galeron_id);

			if (!parentGaleron) {
				handleRequestError("No se encontró el galerón de la sección.");
				return;
			}

			const pendingCoordinate = coordinates[editingId];
			const pendingSize = sizes[editingId];

			const positionX = pendingCoordinate?.x ?? editBaseline.x;
			const positionY = pendingCoordinate?.y ?? editBaseline.y;
			const nextWidth = pendingSize?.width ?? editBaseline.width;
			const nextLength = pendingSize?.length ?? editBaseline.length;

			if (
				!isSectionInsideGaleron(
					{
						x: positionX,
						y: positionY,
						width: nextWidth,
						length: nextLength,
					},
					parentGaleron,
				)
			) {
				handleRequestError(
					"La sección debe quedar dentro del galerón seleccionado.",
				);
				return;
			}

			const hasChanges =
				hasNumericChange(editBaseline.x, positionX) ||
				hasNumericChange(editBaseline.y, positionY) ||
				hasNumericChange(editBaseline.width, nextWidth) ||
				hasNumericChange(editBaseline.length, nextLength);

			if (!hasChanges) {
				resetEditState(editingId);
				return;
			}

			const layoutUpdate: GaleronSectionLayoutUpdate = {
				section_id: editingId,
				galeron_id: section.galeron_id,
				position_x: round2(positionX),
				position_y: round2(positionY),
				width: round2(nextWidth),
				length: round2(nextLength),
			};

			setSectionsByWarehouse((current) => {
				const warehouseSections = current[warehouseId] ?? [];
				if (!warehouseSections.some((item) => item.id === editingId)) {
					return current;
				}

				return {
					...current,
					[warehouseId]: warehouseSections.map((item) =>
						item.id === editingId
							? {
								...item,
								x: layoutUpdate.position_x,
								y: layoutUpdate.position_y,
								width: layoutUpdate.width,
								length: layoutUpdate.length,
							}
							: item,
					),
				};
			});

			onSaveGaleronSectionLayout?.(layoutUpdate);
			resetEditState(editingId);
		}, [
			coordinates,
			displayGalerons,
			editBaseline,
			editTarget,
			editingId,
			galerons,
			handleRequestError,
			layoutSections,
			onSaveGaleronSectionLayout,
			resetEditState,
			sizes,
			warehouseId,
		]);

		const handleSaveLayout = useCallback(() => {
			if (editTarget === "section") {
				handleSaveGaleronSectionLayout();
				return;
			}

			handleSaveGaleronLayout();
		}, [editTarget, handleSaveGaleronLayout, handleSaveGaleronSectionLayout]);

		const handleSelectGaleron = useCallback(
			(galeron: GaleronDto) => {
				if (hasPendingLayoutEdit && !(editTarget === "galeron" && editingId === galeron.id)) {
					return;
				}

				setSelectedGaleronId(galeron.id);
				setSelectedSectionId(null);

				if (!hasPendingLayoutEdit) {
					setEditMode(null);
					setEditTarget(null);
					setEditingId(null);
					setEditBaseline(null);
				}
			},
			[editTarget, editingId, hasPendingLayoutEdit],
		);

		const handleSelectSection = useCallback(
			(section: GaleronSectionDto) => {
				if (hasPendingLayoutEdit && !(editTarget === "section" && editingId === section.id)) {
					return;
				}

				setSelectedSectionId(section.id);
				setSelectedGaleronId(section.galeron_id);

				if (!hasPendingLayoutEdit) {
					setEditMode(null);
					setEditTarget(null);
					setEditingId(null);
					setEditBaseline(null);
				}
			},
			[editTarget, editingId, hasPendingLayoutEdit],
		);

		const handleBringToFront = useCallback((galeronNode: Konva.Node) => {
			bringToFront(galeronNode);
		}, [])

		const handleSendToBack = useCallback((galeronNode: Konva.Node) => {
			sendToBack(galeronNode);
		}, [])

		useEffect(() => {
			if (!galeronMenu) return;

			const closeMenu = () => setGaleronMenu(null);
			const timeoutId = window.setTimeout(() => {
				window.addEventListener("click", closeMenu);
			}, 0);

			return () => {
				window.clearTimeout(timeoutId);
				window.removeEventListener("click", closeMenu);
			};
		}, [galeronMenu]);

		useEffect(() => {
			if (!sectionMenu) return;

			const closeMenu = () => setSectionMenu(null);
			const timeoutId = window.setTimeout(() => {
				window.addEventListener("click", closeMenu);
			}, 0);

			return () => {
				window.clearTimeout(timeoutId);
				window.removeEventListener("click", closeMenu);
			};
		}, [sectionMenu]);

		useEffect(() => {
			resetEditState();
			setSelectedGaleronId(null);
			setSelectedSectionId(null);
			setGaleronMenu(null);
			setSectionMenu(null);
		}, [warehouseId, resetEditState]);

		useEffect(() => {
			if (editMode == null) return;

			const onKeyDown = (event: KeyboardEvent) => {
				if (event.key === "Escape") {
					resetEditState(editingId);
				}
			};

			window.addEventListener("keydown", onKeyDown);
			return () => window.removeEventListener("keydown", onKeyDown);
		}, [editMode, editingId, resetEditState]);

		useImperativeHandle(ref, () => ({ addGaleron }), [addGaleron]);

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
				{AlertComponent}

				<div className="flex lg:justify-between items-center mb-4 flex-wrap gap-2">
					<div>
						<h4 className="font-bold m-0! p-0!">Plano de la bodega</h4>
						<small className="text-slate-500 dark:text-slate-400">
							{isLoading
								? "Cargando detalle..."
								: [
									details?.code?.trim() || warehouse?.code?.trim() || "—",
									getWarehouseTypeLabel(
										details?.warehouse_type ?? warehouse?.warehouse_type,
									),
									details?.location?.location_name?.trim() || "—",
								].join(" · ")}
						</small>
					</div>
					<div className="flex items-center gap-2 flex-wrap">
						{editMode === "edit" ? (
							<Button
								type="button"
								size="giant"
								label="Guardar cambios"
								icon={<SaveIcon size={20} />}
								className="w-full! lg:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
								onClick={handleSaveLayout}
							/>
						) : null}
						{!isLoading && details ? (
							<small className="text-slate-500 dark:text-slate-400">
								{`Área ${details.capacity?.total_area_m2 ?? 0} m² · Ocupación ${getWarehouseOccupancyPercentage(details)}%`}
							</small>
						) : null}
					</div>
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
						galerons={displayGalerons}
						selectedGaleronId={selectedGaleronId}
						editingGalerongId={editTarget === "galeron" ? editingId : null}
						onGaleronContextMenu={handleGaleronContextMenu}
						onSelectGaleron={handleSelectGaleron}
						onGaleronCoordinateChange={updateLayoutCoordinate}
						onGaleronResizeChange={updateLayoutSize}
						marginTop={margins.top}
						marginBottom={margins.bottom}
						marginLeft={margins.left}
						marginRight={margins.right}
					>
						{displaySections.map((section) => {
							const isEditing =
								editTarget === "section" && editingId === section.id;

							return (
								<GaleronSectionShape
									key={section.id}
									section={section}
									x={section.x}
									y={section.y}
									width={section.width}
									length={section.length}
									selected={selectedSectionId === section.id || isEditing}
									draggable={isEditing}
									resizable={isEditing}
									onSelect={handleSelectSection}
									onContextMenu={handleSectionContextMenu}
									onCoordinateChange={updateLayoutCoordinate}
									onResizeChange={updateLayoutSize}
								/>
							);
						})}
					</WarehouseShape>
				)}

				<GaleronShapeMenu
					menu={galeronMenu}
					setMenu={setGaleronMenu}
					onEdit={handleEditGaleron}
					onAddGaleronSection={handleAddGaleronSection}
					bringToFront={handleBringToFront}
					sendToBack={handleSendToBack}
				/>

				<GaleronSectionShapeMenu
					menu={sectionMenu}
					setMenu={setSectionMenu}
					onEdit={handleEditSection}
				/>

				<div className="flex gap-x-4 gap-y-1 items-center justify-between mt-2 flex-wrap">
					<div className="flex gap-x-4 gap-y-1 items-center flex-wrap">
						{WarehouseLegends.map((item, index) => (
							<LegendItem key={index} text={item.text} color={item.color} />
						))}
						<LegendItem text="Galerón" color={GALERON_FILL} />
						<LegendItem text="Sección de galerón" color={GALERON_SECTION_FILL} />
					</div>
				</div>
			</section>
		);
	},
);
