import { Badges, ContextMenu, type TableColumn } from "@alpac/design-system";
import type { PendingAssignmentDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-pending-assignments";
import type { SelectedAssignmentTarget } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/types/assignment.types";
import { resolveDocumentTypeLabel } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/utils/resolveStatus";
import { getDocumentTypeBadgeClass } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-table/utils/merchandise-columns.utils";
import { formatDateToSpanishWords, formatTime } from "@app/shared/utils/string.utils";

type AssignmentColumnsOptions = {
  view?: "pending" | "history";
  onAssignClick?: (target: SelectedAssignmentTarget) => void;
  onDetailClick?: (target: SelectedAssignmentTarget) => void;
  lastItemId?: string;
};

export function getAssignmentColumns({
  view = "pending",
  onAssignClick,
  onDetailClick,
  lastItemId,
}: AssignmentColumnsOptions = {}): TableColumn<PendingAssignmentDto>[] {
  const columns: TableColumn<PendingAssignmentDto>[] = [];

  if (view === "pending") {
    columns.push(
      {
        key: "license_plate",
        label: "Placa",
        render: (item) => item.license_plate || "—",
      },
      {
        key: "driver_name",
        label: "Conductor",
        render: (item) => item.driver_name || "—",
      },
    );
  } else {
    columns.push({
      key: "warehouse_name",
      label: "Bodega",
      render: (item) => item.warehouse_name || "—",
    });
  }

  columns.push(
    {
      key: "arrival_date",
      label: "Fecha de entrada",
      render: (item) => {
        const time = item.entrance_time || item.unloading_start_time;
        return time ? formatDateToSpanishWords(time) : "—";
      },
    },
    {
      key: "entrance_time",
      label: "Hora de entrada",
      render: (item) => {
        const time = item.entrance_time || item.unloading_start_time;
        return time ? formatTime(time) : "—";
      },
    },
    {
      key: "document_type",
      label: "Tipo de documento",
      render: (item) => {
        const rawType = item.document_type || (item.ducat_number ? "DUCA" : undefined);
        if (!rawType) return "—";
        const normalizedType = rawType === "Declaración Aduanera" ? "CustomsDeclaration" : rawType;
        const label = resolveDocumentTypeLabel(normalizedType);
        if (!label) return "—";

        return (
          <Badges
            label={label}
            color="transparent"
            className={`w-fit! min-w-[7.5rem]! px-3! justify-center! ${getDocumentTypeBadgeClass(normalizedType)}`}
          />
        );
      },
    },
    {
      key: "documentos",
      label: "Número de Documento",
      render: (item) => {
        const docNumber = item.document_number || item.ducat_number;
        const rawType = item.document_type || (item.ducat_number ? "DUCA" : undefined);
        if (rawType !== "DUCA") {
          return (
            <Badges
              label={docNumber || "D. Aduanera"}
              color="transparent"
              className="w-fit! min-w-[7.5rem]! justify-center! px-3! bg-[#234A2F]! text-[#D9FBE2]! border border-[#4FA56A]!"
            />
          );
        }
        return (
          <Badges
            label={docNumber || "—"}
            color="transparent"
            className="w-fit! min-w-[7.5rem]! justify-center! px-3! bg-[#123C69]! text-[#D6ECFF]! border border-[#2F6FB2]!"
          />
        );
      },
    },
    {
      key: "service_order_code",
      label: "Orden de Servicio",
      render: (item) => item.service_order_code || "—",
    },
    {
      key: "status",
      label: "Estado",
      render: (item) => (
        <Badges
          label={view === "history" ? (item.status || "Asignado") : "Sin Asignar"}
          color="warning"
          className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-800"
        />
      ),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (item) => {
        const buildTarget = (): SelectedAssignmentTarget => ({
          reception_id: item.reception_id,
          entrance_ducat_id: item.entrance_ducat_id,
          license_plate: item.license_plate,
          driver_name: item.driver_name,
          ducat_number: item.document_number || item.ducat_number || null,
          document_type: item.document_type || (item.ducat_number ? "DUCA" : undefined),
          service_order_code: item.service_order_code,
        });

        const menuItems = [];

        if (view === "pending") {
          menuItems.push({
            label: "Asignar bodega",
            onClick: () => onAssignClick?.(buildTarget()),
          });
        }

        if (view === "history") {
          menuItems.push({
            label: "Ver detalle",
            onClick: () => onDetailClick?.(buildTarget()),
          });
        }

        return (
          <ContextMenu
            items={menuItems}
            triggerClassName="rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!"
            openUpOnMobile={item.reception_id === lastItemId}
          />
        );
      },
    },
  );

  return columns;
}