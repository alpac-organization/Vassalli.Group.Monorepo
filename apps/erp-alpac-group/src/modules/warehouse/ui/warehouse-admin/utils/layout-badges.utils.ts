import { RackStatusEnum } from "@app/modules/warehouse/domain/enums/rack-status.enum";
import { SectionStorageTypeEnum } from "@app/modules/warehouse/domain/enums/section-storage-type.enum";
import { SectionTypeEnum } from "@app/modules/warehouse/domain/enums/section-type.enum";

export const getSectionTypeLabel = (value: string | null) => {
	if (!value) return "-";
	return (
		Object.values(SectionTypeEnum).find((option) => option.textValue === value)?.label ??
		value
	);
};

export const getSectionStorageTypeLabel = (value: string | null) => {
	if (!value) return "-";
	return (
		Object.values(SectionStorageTypeEnum).find((option) => option.textValue === value)
			?.label ?? value
	);
};

export const getRackStatusLabel = (value: string | null) => {
	if (!value) return "-";
	return Object.values(RackStatusEnum).find((option) => option.textValue === value)?.label ?? value;
};