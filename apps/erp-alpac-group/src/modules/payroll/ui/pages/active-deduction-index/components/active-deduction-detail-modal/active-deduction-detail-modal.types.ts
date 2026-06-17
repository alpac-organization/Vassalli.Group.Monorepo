import type { DeductionDetailsDto } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deduction-details.response";
import type { DeductionDto } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deductions.response";

export type ActiveDeductionDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  summary: DeductionDto | null;
  detail?: DeductionDetailsDto;
  isLoading: boolean;
  isError: boolean;
};

export type ActiveDeductionView = "detail" | "payments";

export type ActiveDeductionDetailBodyProps = {
  detail: DeductionDetailsDto;
  onViewPayments: () => void;
}

export type ActiveDeductionDetailContentProps = {
   summary: DeductionDto | null;
   detail?: DeductionDetailsDto;
   isLoading: boolean;
   isError: boolean;
};