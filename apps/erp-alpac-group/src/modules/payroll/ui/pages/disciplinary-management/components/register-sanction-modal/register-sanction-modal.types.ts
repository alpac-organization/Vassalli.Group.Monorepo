import type { FaultDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-faults.response";

export type RegisterSanctionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  faultSummary: FaultDto | null;
  onRequestSuccess?: (message: string) => void;
  onRequestError?: (message?: string) => void;
};
