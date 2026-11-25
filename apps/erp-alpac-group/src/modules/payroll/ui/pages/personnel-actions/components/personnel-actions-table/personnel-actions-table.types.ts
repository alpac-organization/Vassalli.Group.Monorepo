import type { PersonnelActionRequestDto } from "@app/modules/payroll/domain/ApiContract/Responses/personnel-action-responses/get-personnel-actions.response";
import type { ReactNode } from "react";

export interface PersonnelActionsTableProps {
  data: PersonnelActionRequestDto[];
  pagination?: ReactNode;
  isLoading?: boolean;
  canReview?: boolean;
  canApply?: boolean;
  onViewDetail: (request: PersonnelActionRequestDto) => void;
  onReview: (request: PersonnelActionRequestDto) => void;
  onApply: (request: PersonnelActionRequestDto) => void;
}
