import type { AbsenceDto } from "@app/modules/payroll/domain/ApiContract/Responses/absence-responses/get-absences.response";
import type { ReactNode } from "react";

export type AbsencesTableProps = {
  data: AbsenceDto[];
  pagination?: ReactNode;
  onViewDetail: (row: AbsenceDto) => void;
  onApply?: (row: AbsenceDto) => void;
  onCancel?: (row: AbsenceDto) => void;
  onDelete?: (row: AbsenceDto) => void;
  canWrite?: boolean;
};
