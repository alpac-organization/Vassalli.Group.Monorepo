import { Badges } from "@alpac/design-system";
import type { TableColumn } from "@alpac/design-system";
import type { Option } from "@alpac/design-system";
import { UnloadingStatus } from "@app/modules/warehouse/domain/enums/warehouse-managua/unloading-status";
import type { PendingAssignment } from "@app/modules/warehouse/domain/ApiContract/Responses/merchandise-unloading-responses/get-pending-assignments.response";

const FALLBACK_STATUS_BADGE_CLASS =
    "bg-slate-100 text-slate-900 border border-slate-300 dark:bg-slate-600/60 dark:text-slate-200 dark:border-slate-600";

const UNLOADING_STATUS_BADGE_CLASS: Record<string, string> = {
    pending: "bg-amber-100 text-amber-900 border border-amber-200 dark:bg-[#4A2D00] dark:text-amber-200 dark:border-[#C97A14]",
    inprogress: "bg-blue-100 text-blue-900 border border-blue-200 dark:bg-[#09365C] dark:text-[#93C5FD] dark:border-[#3B82F6]",
    paused: "bg-orange-100 text-orange-900 border border-orange-200 dark:bg-orange-900/50 dark:text-orange-200 dark:border-orange-600",
    completed: "bg-green-100 text-green-900 border border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-700/50",
    cancelled: "bg-red-100 text-red-900 border border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700/50",
};

const normalizeStatusKey = (status: string | number | null | undefined): string => {
    if (status == null) return "";
    return String(status).replace(/[_\s-]/g, "").toLowerCase();
};

interface ResolvedUnloadingStatus {
    key: string;
    label: string;
}

const resolveUnloadingStatus = (status: string | number | null | undefined): ResolvedUnloadingStatus => {
    const normalized = normalizeStatusKey(status);

    const byKey = Object.entries(UnloadingStatus).find(([key]) => normalizeStatusKey(key) === normalized);
    if (byKey) return { key: normalizeStatusKey(byKey[0]), label: byKey[1].label };

    const byValue = Object.entries(UnloadingStatus).find(([, entry]) => String(entry.value) === String(status));
    if (byValue) return { key: normalizeStatusKey(byValue[0]), label: byValue[1].label };

    return { key: normalized, label: String(status ?? "—") };
};

export const getUnloadingStatusBadgeClass = (status: string | number | null | undefined): string =>
    UNLOADING_STATUS_BADGE_CLASS[resolveUnloadingStatus(status).key] ?? FALLBACK_STATUS_BADGE_CLASS;

export const getUnloadingStatusLabel = (status: string | number | null | undefined): string =>
    resolveUnloadingStatus(status).label;

export const getUnloadingStatusOptions = (): Option[] =>
    Object.values(UnloadingStatus).map((entry) => ({ value: entry.value, label: entry.label }));

export const getMerchandiseUnloadingColumns = (): TableColumn<PendingAssignment>[] => [
    {
        key: "ducat_number",
        label: "N°. de ducado",
        render: (row) => row.ducat_number || "—",
    },
    {
        key: "service_order_code",
        label: "Orden de servicio",
        render: (row) => row.service_order_code || "—",
    },
    {
        key: "warehouse_name",
        label: "Bodega",
        render: (row) => row.warehouse_name || "—",
    },
    {
        key: "record_entrance_id",
        label: "Registro de ingreso",
        render: (row) => row.record_entrance_id || "—",
    },
    {
        key: "unloading_status",
        label: "Estado",
        render: (row) => (
            <Badges
                label={getUnloadingStatusLabel(row.unloading_status)}
                color="transparent"
                className={getUnloadingStatusBadgeClass(row.unloading_status)}
            />
        ),
    },
];
