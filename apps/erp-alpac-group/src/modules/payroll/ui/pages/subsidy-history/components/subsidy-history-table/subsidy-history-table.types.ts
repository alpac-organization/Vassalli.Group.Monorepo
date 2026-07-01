import type { SubsidyHistoryResponse } from "@app/modules/payroll/domain/ApiContract/Responses/subsidy-responses/get-subsidy-history.response";

export type SubsidyHistoryTableProps = {
  data: SubsidyHistoryResponse[];
  pagination?: React.ReactNode;
};
