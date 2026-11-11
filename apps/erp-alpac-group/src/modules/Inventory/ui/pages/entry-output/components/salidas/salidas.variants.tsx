import { Badges, Button, type TableColumn } from "@alpac/design-system";

import { InventoryOutputsStatus } from "@app/core/enums/inventory-output-status.enum";
import type { InventoryOutputDto } from "@app/modules/Inventory/domain/api-contract/responses/inventory-outputs.response";

const STATUS_BADGE_CLASS_NAME: Record<InventoryOutputsStatus, string> = {
  OutputPending:
    "bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  Dispatched:
    "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  InProgress:
    "bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
  Rejected:
    "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
};

const STATUS_LABEL: Record<InventoryOutputsStatus, string> = {
  OutputPending: "Pendiente",
  Dispatched: "Despachado",
  InProgress: "En progreso",
  Rejected: "Rechazado",
};

const REQUEST_TYPE_BADGE_CLASS_NAME: Record<string, string> = {
  Supply:
    "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  Fuel:
    "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
};

const REQUEST_TYPE_LABEL: Record<string, string> = {
  Supply: "Insumos",
  Fuel: "Combustibles",
};

export const GetInventoryOutputsColumnsToTable = function (
  onViewDetail?: (item: InventoryOutputDto) => void,
): TableColumn<InventoryOutputDto>[] {
  return [
    {
      key: "output_code",
      label: "Código de salida",
      render: (item) => <span>{item.output_code}</span>,
    },
    {
      key: "status",
      label: "Estado",
      render: (item) => (
        <Badges
          color="info"
          className={STATUS_BADGE_CLASS_NAME[item.status]}
          label={STATUS_LABEL[item.status]}
        />
      ),
    },
    {
      key: "request_code",
      label: "Código de solicitud",
      render: (item) => <span>{item.request_code ?? "—"}</span>,
    },
    {
      key: "request_type",
      label: "Tipo",
      render: (item) => {
        const type = item.request_type ?? "";
        if (!type) return <span>—</span>;
        return (
          <Badges
            color="info"
            className={REQUEST_TYPE_BADGE_CLASS_NAME[type] ?? "bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"}
            label={REQUEST_TYPE_LABEL[type] ?? type}
          />
        );
      },
    },
    {
      key: "reason",
      label: "Motivo de salida",
      render: (item) => <span>{item.reasons_inventory_removal_description ?? "—"}</span>,
    },
    {
      key: "work_area",
      label: "Área",
      render: (item) => <span>{item.work_area_name ?? "—"}</span>,
    },
    {
      key: "cost_center",
      label: "Centro de costo",
      render: (item) => <span>{item.cost_center_name ?? "—"}</span>,
    },
    {
      key: "request_date",
      label: "Fecha de solicitud",
      render: (item) => (
        <span>
          {item.request_date ? new Date(item.request_date).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (item) => {
        if (!onViewDetail) return null;
        return (
          <Button
            label="Ver detalle"
            size="small"
            onClick={() => onViewDetail(item)}
          />
        );
      },
    },
  ];
};
