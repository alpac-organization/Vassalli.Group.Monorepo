import {
  Badges,
  ContextMenu,
  type ContextMenuItem,
  type TableColumn,
} from "@alpac/design-system";
import type { AbsenceDto } from "@app/modules/payroll/domain/ApiContract/Responses/absence-responses/get-absences.response";
import {
  getAbsenceSourceLabel,
  getAbsenceStatusLabel,
} from "@app/modules/payroll/domain/enums/absence-enums/absence.enum";
import { contextMenuButton } from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-form.constants";
import {
  getAbsenceSourceBadgeClass,
  getAbsenceStatusBadgeClass,
} from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-labels.utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

export const buildColumns = (
  onViewDetail: (row: AbsenceDto) => void,
  onApply?: (row: AbsenceDto) => void,
  onCancel?: (row: AbsenceDto) => void,
  onDelete?: (row: AbsenceDto) => void,
  canWrite = false,
): TableColumn<AbsenceDto>[] => [
  {
    key: "fullname",
    label: "Colaborador",
    render: (row) => row.fullname?.trim() || "—",
  },
  {
    key: "identification_number",
    label: "Identificación",
    render: (row) => row.identification_number || "—",
  },
  {
    key: "branch_name",
    label: "Sucursal",
    render: (row) => (
      <span className="text-neutral-700 dark:text-neutral-300">
        {row.branch_name || "—"}
      </span>
    ),
  },
  {
    key: "date",
    label: "Fecha",
    render: (row) => formatDateToSpanishWords(row.date) || "—",
  },
  {
    key: "source",
    label: "Origen",
    render: (row) => (
      <Badges
        label={getAbsenceSourceLabel(row.source)}
        color="transparent"
        className={getAbsenceSourceBadgeClass(row.source)}
      />
    ),
  },
  {
    key: "status",
    label: "Estado",
    render: (row) => (
      <Badges
        label={getAbsenceStatusLabel(row.status)}
        color="transparent"
        className={getAbsenceStatusBadgeClass(row.status)}
      />
    ),
  },
  {
    key: "actions",
    label: "Acciones",
    render: (row: AbsenceDto) => {
      const isPending =
        row.status === "Pending" ||
        String(row.status) === "1" ||
        row.status === 1;

      const isCancelled =
        row.status === "Cancelled" ||
        String(row.status) === "3" ||
        row.status === 3;

      const items: ContextMenuItem[] = [
        {
          label: "Ver detalle",
          onClick: () => onViewDetail?.(row),
        },
      ];

      if (canWrite && isPending) {
        items.push({
          label: "Aplicar inasistencia",
          onClick: () => onApply?.(row),
        });
      }

      if (canWrite && !isCancelled) {
        items.push({
          label: "Cancelar inasistencia",
          onClick: () => onCancel?.(row),
        });
      }

      if (canWrite) {
        items.push({
          label: "Anular registro",
          onClick: () => onDelete?.(row),
        });
      }

      return (
        <ContextMenu items={items} triggerClassName={contextMenuButton} />
      );
    },
  },
];
