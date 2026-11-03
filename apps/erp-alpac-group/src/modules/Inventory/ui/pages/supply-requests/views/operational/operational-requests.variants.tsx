import { Badges } from "@alpac/design-system";

import { ReasonUse } from "@app/core/enums/reason-use.enum";
import { OutflowStatus } from "@app/core/enums/outflow-status.enum";

import type { TableColumn } from "@alpac/design-system";
import type { SupplyRequestDto } from "@app/modules/Inventory/domain/api-contract/responses/supply-requests.response";

export const GetOperationalSupplyRequestColumnsToTable = function (): TableColumn<SupplyRequestDto>[] {
  return [
    {
      key: "supply_request_code",
      label: "Codigo",
      render(item) {
        return <span>{item.supply_request_code}</span>;
      },
    },
    {
      key: "reason_use",
      label: "Motivo",
      render(item) {
        return (
          <Badges
            color="info"
            className="bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
            label={ReasonUse[item.reason_use].label}
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
            className="bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            label={OutflowStatus[item.outflow_status].label}
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
  ];
};
