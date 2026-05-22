import type { VacationAccruals } from "@app/modules/payroll/domain/ApiContract/Responses/control-vacation-responses/get-control-vacations-response";

import type { PdfSignatory } from "@app/modules/payroll/ui/pages/nomina/types/payroll.types";

export type VacationAccrualPdfProps = {
  data: VacationAccruals[];
  generatedAt: string;
  preparedBy?: PdfSignatory;
  preparedSignatureImageSrc?: string;
};
