import { RackStatusEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-status";
import { RackUsageProfileEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-usage-profile";

export const RACK_STATUS_COLORS = {
	Available: "#4ade80",
	Occupied: "#38bdf8",
	UnderMaintenance: "#fbbf24",
	Blocked: "#f87171",
	Reserved: "#a78bfa",
} as const;

export const RACK_STATUS_LEGEND = [
	{ text: "Disponible", color: RACK_STATUS_COLORS.Available },
	{ text: "Ocupado", color: RACK_STATUS_COLORS.Occupied },
	{ text: "En mantenimiento", color: RACK_STATUS_COLORS.UnderMaintenance },
	{ text: "Bloqueado", color: RACK_STATUS_COLORS.Blocked },
	{ text: "Reservado", color: RACK_STATUS_COLORS.Reserved },
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

export const getEffectiveRackStatus = (
	rawStatus: string | number | null | undefined,
	occupiedPositions = 0,
	positions?: { status: string; current_stock?: unknown }[],
): { statusKey: keyof typeof RACK_STATUS_COLORS; label: string } => {
	// 1. Si existen posiciones hijas registradas en BD, evaluar su estado prioritario
	if (positions && positions.length > 0) {
		const hasMaintenance = positions.some(
			(p) => resolveRackStatus(p.status)?.textValue === "UnderMaintenance",
		);
		if (hasMaintenance) {
			return { statusKey: "UnderMaintenance", label: "En mantenimiento" };
		}

		const hasBlocked = positions.some(
			(p) => resolveRackStatus(p.status)?.textValue === "Blocked",
		);
		if (hasBlocked) {
			return { statusKey: "Blocked", label: "Bloqueado" };
		}

		const hasReserved = positions.some(
			(p) => resolveRackStatus(p.status)?.textValue === "Reserved",
		);
		if (hasReserved) {
			return { statusKey: "Reserved", label: "Reservado" };
		}

		const hasOccupied = positions.some(
			(p) =>
				resolveRackStatus(p.status)?.textValue === "Occupied" ||
				Boolean(p.current_stock && typeof p.current_stock === "object"),
		);
		if (hasOccupied) {
			return { statusKey: "Occupied", label: "Ocupado" };
		}

		return { statusKey: "Available", label: "Disponible" };
	}

	// 2. Si el estado del rack/nivel es explícito de advertencia o no-disponible
	const resolved = resolveRackStatus(rawStatus);
	if (resolved && resolved.textValue !== "Available") {
		return {
			statusKey: resolved.textValue as keyof typeof RACK_STATUS_COLORS,
			label: resolved.label,
		};
	}

	// 3. Si tiene posiciones ocupadas (> 0), su estado es Ocupado
	if (occupiedPositions > 0) {
		return { statusKey: "Occupied", label: "Ocupado" };
	}

	return { statusKey: "Available", label: "Disponible" };
};
