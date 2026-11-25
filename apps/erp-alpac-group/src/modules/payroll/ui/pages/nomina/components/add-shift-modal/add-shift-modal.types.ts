import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";

export type ShiftValue = 12 | 24 | "TE" | "Vac";
export type ShiftSelections = Record<string, ShiftValue | null>;
export type TeCarryOverFlags = Record<string, boolean>;

export interface AddShiftDateColumn {
  key: string;
  weekday: string;
  day: string;
  fullLabel: string;
  month: string;
}

export interface AddShiftCollaborator {
  id: string;
  fullName: string;
  identificationNumber: string;
  workArea: string;
  contractType: string;
}

export interface AddShiftCell {
  collaborator: AddShiftCollaborator;
  date: AddShiftDateColumn;
}

export interface AddShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  selections: ShiftSelections;
  onSelectionsChange: (selections: ShiftSelections) => void;
  carryOverFlags: TeCarryOverFlags;
  onCarryOverFlagsChange: (flags: TeCarryOverFlags) => void;
  items: PayrollItemResponse[];
  startDate?: string;
  endDate?: string;
  branchName?: string;
  companyName?: string;
  payrollType?: string | null;
}
