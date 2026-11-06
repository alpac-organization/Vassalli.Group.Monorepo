import { Badges, Button } from "@alpac/design-system";

import { ReasonUse } from "@app/core/enums/reason-use.enum";
import { OutflowStatus } from "@app/core/enums/outflow-status.enum";

import type { TableColumn } from "@alpac/design-system";
import type { SupplyRequestDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/supply-requests/supply-requests.response";

import { getReasonBadgeClassName, getStatusBadgeClassName } from "../../utils/request-status";

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
      key: "warehouse_code",
      label: "Almacén",
      render(item) {
        return <span>{item.warehouse_code ?? "—"}</span>;
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
      key: "created_at",
      label: "Fecha de solicitud",
      render(item) {
        return <span>{new Date(item.created_at).toLocaleDateString()}</span>;
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