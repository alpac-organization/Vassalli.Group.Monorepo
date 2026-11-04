import { Badges, Button } from "@alpac/design-system";

import { ReasonUse } from "@app/core/enums/reason-use.enum";
import { OutflowStatus } from "@app/core/enums/outflow-status.enum";

import type { TableColumn } from "@alpac/design-system";
import type { SupplyRequestDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/supply-requests/supply-requests.response";

const getReasonBadgeClassName = (reasonUse: SupplyRequestDto["reason_use"]) => {
  if (reasonUse === "Sale") {
    return "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";
  }

  return "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
};

const getStatusBadgeClassName = (status: SupplyRequestDto["outflow_status"]) => {
  switch (status) {
    case "PendingReview":
      return "bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800";
    case "Approved":
      return "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
    case "Annuled":
      return "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
    case "PendingDispatch":
      return "bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800";
    case "DispatchCancelled":
      return "bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
  }
};

export const GetOperationalSupplyRequestColumnsToTable = function (
  onViewDetail?: (item: SupplyRequestDto) => void,
): TableColumn<SupplyRequestDto>[] {
  return [
    {
      key: "supply_request_code",
      label: "Codigo",
      render(item) {
        return <span>{item.supply_request_code}</span>;
      },
    },
    {
      key: "po_code",
      label: "Codigo PO",
      render(item) {
        return <span>{item.po_code ?? "—"}</span>;
      },
    },
    {
      key: "work_area_name",
      label: "Area de trabajo",
      render(item) {
        return <span>{item.work_area_name ?? "—"}</span>;
      },
    },
    {
      key: "reason_use",
      label: "Motivo",
      render(item) {
        return (
          <Badges
            color="info"
            className={getReasonBadgeClassName(item.reason_use)}
            label={ReasonUse[item.reason_use]?.label ?? String(item.reason_use)}
          />
        );
      },
    },
    {
      key: "outflow_status",
      label: "Estado",
      render(item) {
        return (
          <Badges
            color="info"
            className={getStatusBadgeClassName(item.outflow_status)}
            label={OutflowStatus[item.outflow_status]?.label ?? String(item.outflow_status)}
          />
        );
      },
    },
    {
      key: "requested_by_user_name",
      label: "Solicitante",
      render(item) {
        return <span>{item.requested_by_user_name}</span>;
      },
    },
    {
      key: "items_count",
      label: "Items",
      render(item) {
        return <span>{item.items_count}</span>;
      },
    },
    {
      key: "actions",
      label: "Acciones",
      render(item) {
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