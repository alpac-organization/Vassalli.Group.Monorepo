import { Button, type TableColumn } from "@alpac/design-system";
import type { PendingAssignmentItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-pending-assignments";
import { resolveDocumentTypeLabel } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/utils/resolveStatus";
import { getDocumentTypeBadgeClass } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-table/utils/merchandise-columns.utils";
import { Badges } from "@alpac/design-system";
import {
  formatTime,
  formatDateToSpanishWords,
} from "@app/shared/utils/string.utils";

type PendingAssignmentsColumnsOptions = {
  onAssignClick?: (item: PendingAssignmentItem) => void;
};

export function getPendingAssignmentsColumns({
  onAssignClick,
}: PendingAssignmentsColumnsOptions = {}): TableColumn<PendingAssignmentItem>[] {
  return [
    {
      key: "plate_number",
      label: "Placa",
      render: (item) => item.plate_number || "—",
    },
    {
      key: "driver_name",
      label: "Conductor",
      render: (item) => item.driver_name || "—",
    },
    {
      key: "document_type",
      label: "Tipo de documento",
      render: (item) => {
        const label = resolveDocumentTypeLabel(item.document_type);
        if (!label) return "—";

        return (
          <div className="w-[7.5rem]">
            <Badges
              label={label}
              color="transparent"
              className={`w-full! justify-center! ${getDocumentTypeBadgeClass(item.document_type)}`}
            />
          </div>
        );
      },
    },
    {
      key: "document_number",
      label: "Documento",
      render: (item) => item.document_number || "—",
    },
    {
      key: "container_number",
      label: "Contenedor",
      render: (item) => item.container_number || "—",
    },
    {
      key: "arrival_date",
      label: "Fecha de llegada",
      render: (item) => formatDateToSpanishWords(item.arrival_date ?? undefined) || "—",
    },
    {
      key: "arrival_time",
      label: "Hora de llegada",
      render: (item) => formatTime(item.arrival_time ?? undefined) || "—",
    },
    {
      key: "documents_progress",
      label: "Documentos",
      render: (item) =>
        `${item.completed_documents}/${item.total_documents}`,
    },
    {
      key: "actions",
      label: "Acciones",
      render: (item) => (
        <Button
          size="small"
          className="rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
          label="Asignar bodega"
          onClick={() => onAssignClick?.(item)}
        />
      ),
    },
  ];
}