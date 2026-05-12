import { PAYROLL_SELECTION_STORAGE_KEY } from "@app/modules/payroll/ui/pages/nomina/constants/payroll.constants";

const CONTROL_VACATIONS_SELECTION_STORAGE_PREFIX = "controlVacationsSelection:";

const PAYROLL_SELECTION_STORAGE_PREFIX = `${PAYROLL_SELECTION_STORAGE_KEY}:`;

export const clearControlVacationsSelectionStorage = () => {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(CONTROL_VACATIONS_SELECTION_STORAGE_PREFIX))
    .forEach((key) => localStorage.removeItem(key));
};

export const clearPayrollSelectionStorage = () => {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(PAYROLL_SELECTION_STORAGE_PREFIX))
    .forEach((key) => localStorage.removeItem(key));
};
