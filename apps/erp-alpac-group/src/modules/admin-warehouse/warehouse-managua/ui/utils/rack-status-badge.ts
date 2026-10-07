import { RackStatusEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-status";
import { RackUsageProfileEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-usage-profile";

export const RACK_STATUS_COLORS = {
	Available: "#4ade80",
	Occupied: "#38bdf8",
	UnderMaintenance: "#fbbf24",
	Blocked: "#f87171",
} as const;

export const RACK_STATUS_LEGEND = [
	{ text: "Disponible", color: RACK_STATUS_COLORS.Available },
	{ text: "Ocupado", color: RACK_STATUS_COLORS.Occupied },
	{ text: "En mantenimiento", color: RACK_STATUS_COLORS.UnderMaintenance },
	{ text: "Bloqueado", color: RACK_STATUS_COLORS.Blocked },
] as const;

const normalizeEnumKey = (value: string | number) =>
	String(value)
		.replace(/[_\s-]/g, "")
		.toLowerCase();

export const resolveRackStatus = (value: string | number | null | undefined) => {
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

export const getRackStatusLabel = (value: string | number | null | undefined) => {
	return resolveRackStatus(value)?.label ?? (value ? String(value) : "-");
};

export const resolveRackUsageProfile = (value: string | number | null | undefined) => {
	if (value === null || value === undefined || value === "") return null;

	const normalized = normalizeEnumKey(value);

	return (
		Object.values(RackUsageProfileEnum).find(
			(option) =>
				normalizeEnumKey(option.textValue) === normalized ||
				String(option.value) === String(value),
		) ?? null
	);
};

export const getRackUsageProfileLabel = (value: string | number | null | undefined) => {
	return resolveRackUsageProfile(value)?.label ?? (value ? String(value) : "-");
};
