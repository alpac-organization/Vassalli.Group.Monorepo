import {
  ContextMenu,
  type ContextMenuItem,
  type TableColumn,
} from "@alpac/design-system";
import type { LiquidationDto } from "@app/modules/payroll/domain/ApiContract/Responses/liquidation-responses/get-liquidations.response";
import type { LiquidationsTableMode } from "@app/modules/payroll/ui/pages/proceso-baja/components/liquidations-table/liquidations-table.types";
import { procesoBajaContextMenuButtonClassName } from "@app/modules/payroll/ui/pages/proceso-baja/utils/proceso-baja.constants";
import { getLiquidationStatusLabel } from "@app/modules/payroll/ui/pages/proceso-baja/utils/proceso-baja.labels";
import { formatCurrency } from "@app/shared/utils/currency.utils";

export type BuildLiquidationColumnsParams = {
  mode: LiquidationsTableMode;
  onViewDetail: (row: LiquidationDto) => void;
  onApprove?: (row: LiquidationDto) => void;
  onPay?: (row: LiquidationDto) => void;
  onCancel?: (row: LiquidationDto) => void;
};

export const buildLiquidationColumns = ({
  mode,
  onViewDetail,
  onApprove,
  onPay,
  onCancel,
}: BuildLiquidationColumnsParams): TableColumn<LiquidationDto>[] => [
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
    key: "status",
    label: "Estado",
    render: (row) => getLiquidationStatusLabel(row.status),
  },
  {
    key: "gross_total",
    label: "Bruto",
    render: (row) => formatCurrency(row.gross_total),
  },
  {
    key: "deductions_total",
    label: "Deducciones",
    render: (row) => formatCurrency(row.deductions_total),
  },
  {
    key: "net_total",
    label: "Neto",
    render: (row) => formatCurrency(row.net_total),
  },
  {
    key: "actions",
    label: "Acciones",
    render: (row) => {
      const items: ContextMenuItem[] = [
        { label: "Ver detalle", onClick: () => onViewDetail(row) },
      ];

      if (mode === "in-progress" && row.status === "Calculated" && onApprove) {
        items.push({ label: "Aprobar", onClick: () => onApprove(row) });
      }
      if (mode === "in-progress" && row.status === "Calculated" && onCancel) {
        items.push({ label: "Cancelar", onClick: () => onCancel(row) });
      }
      if (mode === "approved" && row.status === "Approved" && onPay) {
        items.push({ label: "Pagar", onClick: () => onPay(row) });
      }

      return (
        <ContextMenu
          items={items}
          triggerClassName={procesoBajaContextMenuButtonClassName}
        />
      );
    },
  },
];
