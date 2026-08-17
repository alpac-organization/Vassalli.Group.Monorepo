import { RackStatusEnum } from "@app/modules/warehouse/domain/enums/rack-status.enum";
import { SectionStorageTypeEnum } from "@app/modules/warehouse/domain/enums/section-storage-type.enum";
import { SectionTypeEnum } from "@app/modules/warehouse/domain/enums/section-type.enum";

const normalizeEnumKey = (value: string | number) =>
	String(value).replace(/[_\s-]/g, "").toLowerCase();

export const resolveRackStatus = (value: string | number | null) => {
	if (value === null || value === undefined || value === "") return null;

	const normalized = normalizeEnumKey(value);

	return (
		Object.values(RackStatusEnum).find(
			(option) =>
				normalizeEnumKey(option.textValue) === normalized ||
				String(option.value) === String(value),
		) ?? null
	);
};

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

export const getRackStatusLabel = (value: string | number | null) => {
	return resolveRackStatus(value)?.label ?? (value ? String(value) : "-");
};