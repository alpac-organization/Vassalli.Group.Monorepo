import type { ReactNode } from "react";
import type { FaultDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-faults.response";


export type FaultTableActions = {
  onViewDetail: (row: FaultDto) => void;
  onCancel: (row: FaultDto) => void;
  canWrite?: boolean;
};

export type FaultsTableProps = FaultTableActions & {
  data: FaultDto[];
  pagination?: ReactNode;
};
