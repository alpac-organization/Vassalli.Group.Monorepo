import { Badges, Button, type TableColumn } from "@alpac/design-system";
import { Edit3, Eye } from "lucide-react";
import type { OperationalOrderListItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/operational-orders/get-operational-orders-response";
import { getOperationalOrderStatusLabel } from "@app/modules/warehouse/domain/enums/warehouse-managua/operational-order-status.enum";

interface GetOperationsColumnsProps {
  onViewDetail: (order: OperationalOrderListItem) => void;
  onUpdateInfo: (order: OperationalOrderListItem) => void;
}

export function getOperationsColumns({
  onViewDetail,
  onUpdateInfo,
}: GetOperationsColumnsProps): TableColumn<OperationalOrderListItem>[] {
  return [
    {
      key: "po_code",
      label: "Código PO",
      render: (row) => (
        <span className="font-semibold text-slate-800 dark:text-slate-100">
          {row.po_code}
        </span>
      ),
    },
    {
      key: "document_number",
      label: "No. Documento",
      render: (row) => row.document_number || "—",
    },
    {
      key: "customer",
      label: "Cliente",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-800 dark:text-slate-200">
            {row.customer_information?.customer_name || "—"}
          </span>
          {row.customer_information?.cif && (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              CIF: {row.customer_information.cif}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "cost_center",
      label: "Centro de Costos",
      render: (row) => row.cost_center_information?.cost_center_name || "—",
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
      key: "is_alerted",
      label: "Alerta",
      render: (row) =>
        row.is_alerted ? (
          <Badges
            label="Alerta"
            color="transparent"
            className="bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-800 px-2! py-0.5! text-xs"
          />
        ) : (
          <Badges
            label="Normal"
            color="transparent"
            className="bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-800 px-2! py-0.5! text-xs"
          />
        ),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            size="small"
            tooltip="Ver detalle"
            ariaLabel={`Ver detalle ${row.po_code}`}
            icon={<Eye size={15} />}
            onClick={() => onViewDetail(row)}
            className="h-8! w-8! p-0! rounded-lg! bg-slate-100! dark:bg-[#1e2229]! text-slate-600! dark:text-slate-300! hover:bg-slate-200! dark:hover:bg-slate-700! border border-slate-200! dark:border-slate-700!"
          />
          <Button
            type="button"
            size="small"
            tooltip="Registrar / Actualizar información"
            ariaLabel={`Actualizar ${row.po_code}`}
            icon={<Edit3 size={15} />}
            onClick={() => onUpdateInfo(row)}
            className="h-8! w-8! p-0! rounded-lg! bg-blue-50! dark:bg-blue-900/30! text-blue-600! dark:text-blue-300! hover:bg-blue-100! dark:hover:bg-blue-900/50! border border-blue-200! dark:border-blue-700/50!"
          />
        </div>
      ),
    },
  ];
}
