import { ContextMenu, type ContextMenuItem, type TableColumn } from "@alpac/design-system";
import type { SectionDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";
import {
	ActiveStatusBadge,
	SectionStorageTypeBadge,
	SectionTypeBadge,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/layout-warehouses-badges";
import type { SectionsColumnsOptions } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-table/sections-table.types";
import { SectionStorageTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import { resolveSectionStorageType } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/section-status-badge";

const contextMenuButton =
	"rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

function getSectionActionItems(
	item: SectionDto,
	onViewLots: SectionsColumnsOptions["onViewLots"],
	onViewRacks: SectionsColumnsOptions["onViewRacks"],
	onUpdateSection: SectionsColumnsOptions["onUpdateSection"],
	onDeleteSection: SectionsColumnsOptions["onDeleteSection"],
) {

	let options: ContextMenuItem[] = [];

	const updateSectionOption: ContextMenuItem = {
		label: "Actualizar",
		onClick: () => onUpdateSection(item)
	};

	const deleteSectionOption: ContextMenuItem = {
		label: "Eliminar",
		onClick: () => onDeleteSection(item)
	};

	const storageType = resolveSectionStorageType(
		item.section_storage_type ?? "",
	);

	if (storageType?.textValue === SectionStorageTypeEnum.Racks.textValue) {
		options.push({ label: "Ver racks", onClick: () => onViewRacks(item) });		
	}

	if (storageType?.textValue === SectionStorageTypeEnum.Lots.textValue) {
		options.push({ label: "Ver tramos", onClick: () => onViewLots(item) });		
	}

	options.push(updateSectionOption);
	options.push(deleteSectionOption);

	return options;
}

export function getSectionsColumns({
	onViewLots,
	onViewRacks,
	onUpdateSection,
	onDeleteSection,
	lastItemId,
}: SectionsColumnsOptions): TableColumn<SectionDto>[] {
	return [
		{
			key: "section_code",
			label: "Código",
			render: (item) => item.section_code || "—",
		},
		{
			key: "section_type",
			label: "Tipo",
			render: (item) => <SectionTypeBadge value={item.section_type ?? ""} />,
		},
		{
			key: "section_storage_type",
			label: "Almacenamiento",
			render: (item) => (
				<SectionStorageTypeBadge value={item.section_storage_type ?? ""} />
			),
		},
		{
			key: "occupancy",
			label: "Ocupación",
			render: () => "Ocupación",
		},
		{
			key: "is_active",
			label: "Estado",
			render: (item) => <ActiveStatusBadge isActive={item.is_active} />,
		},
		{
			key: "action",
			label: "Acciones",
			render: (item) => {
				const items = getSectionActionItems(
					item,
					onViewLots,
					onViewRacks,
					onUpdateSection,
					onDeleteSection,
				);

				return (
					<ContextMenu
						items={items}
						triggerClassName={contextMenuButton}
						openUpOnMobile={item.section_id === lastItemId}
					/>
				);
			},
		},
	];
}
