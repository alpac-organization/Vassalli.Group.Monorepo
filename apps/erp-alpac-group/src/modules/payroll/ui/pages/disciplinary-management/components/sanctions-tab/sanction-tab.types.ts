import type { SanctionDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-sanctions.response";
import type { ConfirmActionType } from "@app/shared/components/confirm-modal/confirm-modal.types";

export type ProcessSanctionAction = Extract<ConfirmActionType, "APPROVE" | "REJECT">;

export type ProcessSanctionConfirmCopy = {
  variant: "warning";
  title: string;
  suspensionTitle: string;
  actionLabel: string;
  actionClass: string;
  successMessage: string;
  fallbackError: string;
};

export type ProcessSanctionConfirmState = {
  isOpen: boolean;
  type: ProcessSanctionAction;
  sanction: SanctionDto | null;
};