import type { ReasonUse } from "@app/core/enums/reason-use.enum";
import type { OutflowStatus } from "@app/core/enums/outflow-status.enum";

export interface OperationalRequestsFilters {
  code?: string;
  po_code?: string;
  branch_id?: string;
  reason_use?: ReasonUse;
  status?: OutflowStatus;

  page_number?: number;
  page_size?: number;
}

export const DEFAULT_OPERATIONAL_FILTERS: OperationalRequestsFilters = {
  page_number: 1,
  page_size: 10,
};
