import {
  Badges,
  ContextMenu,
  type ContextMenuItem,
  type TableColumn,
} from "@alpac/design-system";
import type { OperationalOrderListItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/operational-orders/get-operational-orders-response";
import { getOperationalOrderStatusLabel } from "@app/modules/warehouse/domain/enums/warehouse-managua/operational-order-status.enum";
import {
  TransportDocuments,
  type TransportDocumentType,
} from "@app/core/enums/document.enum";
import { contextMenuButton } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/utils/styles";


export interface GetAssignmentOrdersColumnsProps {
  onViewAssignments: (order: OperationalOrderListItem) => void;
  onViewOrderDetail?: (order: OperationalOrderListItem) => void;
}

export function getAssignmentOrdersColumns({
  onViewAssignments,
  onViewOrderDetail,
}: GetAssignmentOrdersColumnsProps): TableColumn<OperationalOrderListItem>[] {
  return [
    {
      key: "po_code",
      label: "Código OP",
      render: (row) => (
        <span className="font-semibold text-slate-800 dark:text-slate-100">
          {row.po_code}
        </span>
      ),
    },
    {
      key: "document_number",
      label: "Número Documento",
      render: (row) => row.document_number || "—",
    },
    {
      key: "document_type",
      label: "Tipo Documento",
      render: (row) => {
        const documentType = row?.document_type;
        if (!documentType) return "—";
        return (
          TransportDocuments[documentType as TransportDocumentType]?.label ??
          "—"
        );
      },
    },
    {
      key: "status",
      label: "Estado",
      render: (row) => (
        <Badges
          label={getOperationalOrderStatusLabel(row.status)}
          color="transparent"
          className="bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-800 px-2.5! py-0.5! text-xs font-semibold"
        />
      ),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (row) => {
        const items: ContextMenuItem[] = [
          {
            label: "Ver asignaciones",
            onClick: () => onViewAssignments(row),
          },
        ];

        if (onViewOrderDetail) {
          items.push({
            label: "Detalle de Orden",
            onClick: () => onViewOrderDetail(row),
          });
        }

        return (
          <ContextMenu items={items} triggerClassName={contextMenuButton} />
        );
      },
    },
  ];
}
