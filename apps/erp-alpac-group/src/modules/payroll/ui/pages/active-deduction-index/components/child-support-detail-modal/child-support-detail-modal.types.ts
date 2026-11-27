import type { DeductionDetailsDto } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deduction-details.response";
import type { DeductionDto } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deductions.response";

export type ChildSupportDetailView =
  | "detail"
  | "payments"
  | "register_official_letter"
  | "edit_child_support";

export type ChildSupportDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  summary: DeductionDto | null;
  detail?: DeductionDetailsDto;
  isLoading: boolean;
  isError: boolean;
  onActionSuccess?: (message: string, closeModal?: boolean) => void;
  onActionError?: (message?: string) => void;
};

export type ChildSupportDetailContentProps = {
  summary: DeductionDto | null;
  detail?: DeductionDetailsDto;
  isLoading: boolean;
  isError: boolean;
  onRequestCease: () => void;
  onActionSuccess?: (message: string, closeModal?: boolean) => void;
  onActionError?: (message?: string) => void;
};

export type ChildSupportDetailBodyProps = {
  summary: DeductionDto;
  detail: DeductionDetailsDto;
  onViewPayments: () => void;
  onOpenRegisterOfficialLetter: () => void;
  onOpenEditChildSupport: () => void;
  onRequestCease: () => void;
};
