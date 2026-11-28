import type { TerminationDto } from "@app/modules/payroll/domain/ApiContract/Responses/termination-responses/get-terminations.response";
import type { ReactNode } from "react";

export type TerminationsTableMode = "pending" | "closed";

export type TerminationsTableProps = {
  data: TerminationDto[];
  pagination?: ReactNode;
  mode: TerminationsTableMode;
  onViewDetail?: (row: TerminationDto) => void;
  onClose?: (row: TerminationDto) => void;
  onCancel?: (row: TerminationDto) => void;
  onCalculateLiquidation?: (row: TerminationDto) => void;
  canCalculateLiquidation?: (row: TerminationDto) => boolean;
};
