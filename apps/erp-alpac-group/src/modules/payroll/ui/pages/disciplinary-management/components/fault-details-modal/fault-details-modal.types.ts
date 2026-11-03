import type { FaultDetailDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-fault-details.response";
import type { FaultDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-faults.response";

export type FaultDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  summary: FaultDto | null;
  detail?: FaultDetailDto;
  isDetailLoading?: boolean;
  canWrite?: boolean;
  onCancelFault?: () => void;
  onApplySanction?: () => void;
};
