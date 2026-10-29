import type { ReactNode } from "react";
import type { SanctionDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-sanctions.response";

export type SanctionsTableProps = {
  data: SanctionDto[];
  pagination?: ReactNode;
  onViewDetail: (row: SanctionDto) => void;
};
