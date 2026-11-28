import {
  ContextMenu,
  type ContextMenuItem,
  type TableColumn,
} from "@alpac/design-system";
import type { TerminationDto } from "@app/modules/payroll/domain/ApiContract/Responses/termination-responses/get-terminations.response";
import type { TerminationsTableMode } from "@app/modules/payroll/ui/pages/proceso-baja/components/terminations-table/terminations-table.types";
import { procesoBajaContextMenuButtonClassName } from "@app/modules/payroll/ui/pages/proceso-baja/utils/proceso-baja.constants";
import {
  getTerminationStatusLabel,
  getTerminationTypeLabel,
} from "@app/modules/payroll/ui/pages/proceso-baja/utils/proceso-baja.labels";
import { formatDate } from "@app/shared/utils/string.utils";

export type BuildTerminationColumnsParams = {
  mode: TerminationsTableMode;
  onViewDetail?: (row: TerminationDto) => void;
  onClose?: (row: TerminationDto) => void;
  onCancel?: (row: TerminationDto) => void;
  onCalculateLiquidation?: (row: TerminationDto) => void;
  canCalculateLiquidation?: (row: TerminationDto) => boolean;
};

export const buildTerminationColumns = ({
  mode,
  onViewDetail,
  onClose,
  onCancel,
  onCalculateLiquidation,
  canCalculateLiquidation,
}: BuildTerminationColumnsParams): TableColumn<TerminationDto>[] => [
  {
    key: "identification_number",
    label: "Cédula",
    render: (row) => row.identification_number?.trim() || "—",
  },
  {
    key: "collaborator_name",
    label: "Colaborador",
    render: (row) => row.collaborator_name?.trim() || "—",
  },
  {
    key: "termination_type",
    label: "Tipo",
    render: (row) => getTerminationTypeLabel(row.termination_type),
  },
  {
    key: "termination_status",
    label: "Estado",
    render: (row) => getTerminationStatusLabel(row.termination_status),
  },
  {
    key: "departure_date",
    label: "Fecha egreso",
    render: (row) => (row.departure_date ? formatDate(row.departure_date) : "—"),
  },
  {
    key: "actions",
    label: "Acciones",
    render: (row) => {
      const items: ContextMenuItem[] = [];

      if (onViewDetail) {
        items.push({ label: "Ver detalle", onClick: () => onViewDetail(row) });
      }
      if (mode === "pending" && onClose) {
        items.push({ label: "Cerrar baja", onClick: () => onClose(row) });
      }
      if (mode === "pending" && onCancel) {
        items.push({ label: "Cancelar", onClick: () => onCancel(row) });
      }
      if (
        mode === "closed" &&
        onCalculateLiquidation &&
        canCalculateLiquidation?.(row)
      ) {
        items.push({
          label: "Calcular liquidación",
          onClick: () => onCalculateLiquidation(row),
        });
      }

      if (items.length === 0) return "—";

      return (
        <ContextMenu
          items={items}
          triggerClassName={procesoBajaContextMenuButtonClassName}
        />
      );
    },
  },
];
