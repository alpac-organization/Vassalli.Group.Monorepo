import type { VacationReportType } from "@app/modules/payroll/domain/ApiContract/Requests/control-vacation-requests/control-vacations-request";

export interface ControlVacationDirectActionsProps {
  reportOptions: { label: string; value: VacationReportType }[];
  selectedReportAction: VacationReportType | null;
  onReportActionChange: (value: VacationReportType) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
  onOpenChangeSelection: () => void;
  canChangeSelection?: boolean;
}
