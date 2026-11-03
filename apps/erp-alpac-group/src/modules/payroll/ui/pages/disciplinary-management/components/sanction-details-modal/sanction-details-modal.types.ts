import type { SanctionDetailDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-sanction-details.response";
import type { SanctionDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-sanctions.response";

export type SanctionDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  summary: SanctionDto | null;
  detail?: SanctionDetailDto;
  isDetailLoading?: boolean;
};
