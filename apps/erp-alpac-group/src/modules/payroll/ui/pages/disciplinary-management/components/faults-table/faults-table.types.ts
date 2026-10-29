import type { ReactNode } from "react";
import type { FaultDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-faults.response";

export type FaultsTableProps = {
  data: FaultDto[];
  pagination?: ReactNode;
  onViewDetail: (row: FaultDto) => void;
};
