import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SaveIcon } from "lucide-react";
import { Button } from "@alpac/design-system";
import { LegendItem } from "@app/shared/components/legend-item/legend-item";
import { SectionShape } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/section-shape/section-shape";
import { SectionShapeMenu } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/section-shape/components/section-shape-menu/section-shape-menu";
import { SectionLegends, SectionTypeBorderColor, SectionTypeColor } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/section-status-badge";
import { WarehouseShape } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-shape/warehouse-shape";
import { useSection } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useSection";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";

import type { EditMode, SectionCoordinate, SectionSize, SectionViewerProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/section-viewer/section-viewer.types";
import type { SectionDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";
import type { SectionMenuState } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/section-shape/components/section-shape-menu/section-shape-menu.types";
import type { UpdateSectionLayoutRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/update-section-layout-req";
import { isInsideAvailableArea } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/layout-bound";

const round2 = (value: number) => Math.round(value * 100) / 100;

const hasNumericChange = (
	current: number | null | undefined,
	next: number,
): boolean => {
	if (current == null) return true;
	return round2(current) !== round2(next);
};

export const SectionViewer = ({
	className,
	warehouse,
	sections = [],
	selectedSection,
	onSelectSection
}: SectionViewerProps) => {

	const { warehouseId = "" } = useParams<{ warehouseId: string }>();
	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();
	const {
		handleRequestError,
		handleRequestSuccess,
		AlertComponent,
	} = useAlertState();
	const { UpdateSectionLayout } = useSection();

	const [editMode, setEditMode] = useState<EditMode>(null);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [coordinates, setCoordinates] = useState<SectionCoordinate>({});
	const [sizes, setSizes] = useState<SectionSize>({});
	const [menu, setMenu] = useState<SectionMenuState | null>(null);
	const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
	const [internalSelectedCode, setInternalSelectedCode] = useState<string | null>(null);

	const activeSelectedId = selectedSection?.section_id ?? internalSelectedId;
	const activeSelectedCode = selectedSection?.section_code ?? internalSelectedCode;
	const resolvedWarehouseId = warehouse?.warehouse_id ?? warehouseId;
	const width = warehouse?.width ?? 0;
	const length = warehouse?.length ?? 0;
	const margins = {
		top: warehouse?.margin_top ?? 0,
		bottom: warehouse?.margin_bottom ?? 0,
		left: warehouse?.margin_left ?? 0,
		right: warehouse?.margin_right ?? 0,
	};

	const sectionWidth = (width - (margins.left + margins.right)) / Math.max(sections.length, 1);
	const sectionLength = length - (margins.top + margins.bottom);

	const getCoordinates = (id: string, index: number) =>
		coordinates[id] ?? { x: index * sectionWidth, y: 0 };
	const getSize = (id: string) =>
		sizes[id] ?? { width: sectionWidth, length: sectionLength };

	const resetEditState = (sectionId?: string | null) => {
		setEditMode(null);
		setEditingId(null);

		if (!sectionId) return;

		setCoordinates((prev) => {
			const { [sectionId]: _, ...rest } = prev;
			return rest;
		});
		setSizes((prev) => {
			const { [sectionId]: _, ...rest } = prev;
			return rest;
		});
	};

	const hasPendingLayoutEdit = editMode === "edit" && editingId != null;

	const notifyPendingLayoutEdit = () => {
		handleRequestError(
			"Guarde o cancele los cambios de la sección actual antes de editar otra.",
		);
	};

	const handleContextMenu = (next: SectionMenuState) => {
		if (hasPendingLayoutEdit && editingId !== next.section.section_id) {
			notifyPendingLayoutEdit();
			return;
		}

		setInternalSelectedId(next.section.section_id);
		setInternalSelectedCode(next.section.section_code);
		onSelectSection?.(next.section);
		setMenu(next);
	};

	const handleEdit = (section: SectionDto) => {
		if (hasPendingLayoutEdit && editingId !== section.section_id) {
			notifyPendingLayoutEdit();
			return;
		}

		setEditingId(section.section_id);
		setEditMode("edit");
		setInternalSelectedId(section.section_id);
		setInternalSelectedCode(section.section_code);
	};

	const handleSelect = (section: SectionDto) => {
		if (hasPendingLayoutEdit && editingId !== section.section_id) {
			notifyPendingLayoutEdit();
			return;
		}

		setInternalSelectedId(section.section_id);
		setInternalSelectedCode(section.section_code);
		onSelectSection?.(section);

		if (!hasPendingLayoutEdit) {
			setEditMode(null);
		}
	};

	const handleUpdateSectionLayout = () => {
		if (!editingId || !companyId || !moduleCode || !resolvedWarehouseId) return;

		const section = sections.find((item) => item.section_id === editingId);
		if (!section) return;

		const nextCoordinate = coordinates[editingId];
		const nextSize = sizes[editingId];

		const payload: UpdateSectionLayoutRequest = {
			company_id: companyId,
			module_code: moduleCode,
			warehouse_id: resolvedWarehouseId,
			section_id: editingId,
		};

		if (nextCoordinate) {
			if (hasNumericChange(section.position_x, nextCoordinate.x)) {
				payload.position_x = round2(nextCoordinate.x);
			}
			if (hasNumericChange(section.position_y, nextCoordinate.y)) {
				payload.position_y = round2(nextCoordinate.y);
			}
		}

		if (nextSize) {
			if (hasNumericChange(section.width, nextSize.width)) {
				payload.width = round2(nextSize.width);
			}
			if (hasNumericChange(section.length, nextSize.length)) {
				payload.length = round2(nextSize.length);
			}
		}

		const hasLayoutChanges =
			payload.position_x != null ||
			payload.position_y != null ||
			payload.width != null ||
			payload.length != null;

		if (!hasLayoutChanges) {
			resetEditState(editingId);
			return;
		}

		const nextX = nextCoordinate?.x ?? section.position_x ?? 0;
		const nextY = nextCoordinate?.y ?? section.position_y ?? 0;
		const nextWidth = nextSize?.width ?? section.width ?? 0;
		const nextLength = nextSize?.length ?? section.length ?? 0;

		if (
			warehouse &&
			!isInsideAvailableArea(
				{ x: nextX, y: nextY, width: nextWidth, length: nextLength },
				{
					width: width - margins.left - margins.right,
					length: length - margins.top - margins.bottom,
					marginTop: 0,
					marginBottom: 0,
					marginLeft: 0,
					marginRight: 0,
				},
			)
		) {
			handleRequestError(
				"La sección debe quedar dentro del área disponible de la bodega.",
			);
			return;
		}

		UpdateSectionLayout.mutate(payload, {
			onSuccess() {
				handleRequestSuccess("Layout de la sección actualizado exitosamente.");
				resetEditState(editingId);
			},
			onError(error) {
				const mappedError = getMappedError(error);
				handleRequestError(mappedError.description);
			},
		});
	};

	useEffect(() => {
		if (!menu) return;
		const close = () => setMenu(null);
		window.addEventListener("click", close);
		return () => window.removeEventListener("click", close);
	}, [menu]);

	useEffect(() => {
		if (editMode == null) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") resetEditState(editingId);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [editMode, editingId]);

	return (
		<section className={`w-full rounded-lg gap-3 p-6 overflow-visible border border-slate-600 hover:border-neutral-600 bg-white dark:bg-[#272b34] ${className}`}>
			{AlertComponent}

			<div className="flex lg:justify-between items-center mb-4 flex-wrap">
				<div>
					<h4 className="font-bold m-0! p-0!">Plano de la bodega</h4>
					<span className="text-sm text-gray-400 m-0! p-0!">Sección seleccionada: {activeSelectedCode}</span>
				</div>
				{editMode == "edit" && (
					<Button
						type="button"
						size="giant"
						label="Guardar cambios"
						icon={<SaveIcon size={20} />}
						className="w-full! lg:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
						onClick={handleUpdateSectionLayout}
						disabled={UpdateSectionLayout.isPending}
						isLoading={UpdateSectionLayout.isPending}
					/>
				)}
			</div>

			<WarehouseShape
				width={width}
				length={length}
				draggable
				marginTop={margins.top}
				marginBottom={margins.bottom}
				marginLeft={margins.left}
				marginRight={margins.right}>

				{sections.map((section, index) => {
					const sectionColor = SectionTypeColor[section.section_type!];
					const sectionBorderColor = SectionTypeBorderColor[section.section_type!];
					const coordinate = coordinates[section.section_id];
					const size = sizes[section.section_id];
					const fallbackCoordinate = getCoordinates(section.section_id, index);
					const fallbackSize = getSize(section.section_id);

					const isEditing = editMode === "edit" && editingId === section.section_id;

					return (
						<SectionShape
							key={section.section_id}
							section={section}
							x={coordinate?.x ?? section.position_x ?? fallbackCoordinate.x}
							y={coordinate?.y ?? section.position_y ?? fallbackCoordinate.y}
							width={size?.width ?? section.width ?? fallbackSize.width}
							length={size?.length ?? section.length ?? fallbackSize.length}
							rotation={section.rotation_y ?? 0}
							fill={sectionColor}
							strokeColor={sectionBorderColor}
							selected={activeSelectedId === section.section_id}
							draggable={isEditing}
							resizable={isEditing}
							onSelect={handleSelect}
							onContextMenu={handleContextMenu}
							onCoordinateChange={(id, x, y) =>
								setCoordinates((prev) => ({ ...prev, [id]: { x, y } }))
							}
							onResizeChange={(id, nextWidth, nextLength) =>
								setSizes((prev) => ({
									...prev,
									[id]: { width: nextWidth, length: nextLength },
								}))
							}
						/>
					);
				})}
			</WarehouseShape>

			<SectionShapeMenu
				menu={menu}
				setMenu={setMenu}
				onEdit={handleEdit}
			/>

			<div className="flex gap-x-4 gap-y-1 items-center justify-between mt-2 flex-wrap">
				<div className="flex gap-x-4 gap-y-1 items-center flex-wrap">
					{SectionLegends.map((item) => (
						<LegendItem key={item.text} text={item.text} color={item.color} />
					))}
				</div>
			</div>
		</section>
	);
};
