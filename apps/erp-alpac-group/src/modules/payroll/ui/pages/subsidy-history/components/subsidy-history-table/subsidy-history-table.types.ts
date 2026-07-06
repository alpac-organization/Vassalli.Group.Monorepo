import type { GetSubsidyHistoryResponse } from "@app/modules/payroll/domain/ApiContract/Responses/subsidy-responses/get-subsidy-history.response";

export type SubsidyHistoryTableProps = {
  data: GetSubsidyHistoryResponse[];
  pagination?: React.ReactNode;
};
