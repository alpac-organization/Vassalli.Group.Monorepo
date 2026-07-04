import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { parseAdditionalDeductions } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/utils/parse-additional-deductions";

export type DeductionConcept = {
  key: string;
  label: string;
  render: (item: PayrollItemResponse) => string | number;
  getValue: (item: PayrollItemResponse) => number;
  unit?: string;
};

export const DEDUCTION_CONCEPTS: DeductionConcept[] = [
  {
    key: "late_arrivals",
    label: "Llegadas Tardías",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.LateArrivals ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)
        ?.LateArrivals ?? 0,
    unit: "Día",
  },
  {
    key: "Purísima",
    label: "Purísima",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.Purisima ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)?.Purisima ?? 0,
  },
  {
    key: "Ausencias",
    label: "Ausencias",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.Absences ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)?.Absences ?? 0,
    unit: "Dia",
  },
  {
    key: "Préstamos",
    label: "Préstamos",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.Loans ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)?.Loans ?? 0,
  },
  {
    key: "Otras deducciones",
    label: "Otras deducciones",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.OtherDeductions ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)
        ?.OtherDeductions ?? 0,
  },
  {
    key: "Deducción por uniforme",
    label: "Deducción por uniforme",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.UniformDeduction ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)
        ?.UniformDeduction ?? 0,
  },
  {
    key: "Embargos judiciales",
    label: "Embargos judiciales",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.JudicialSeizures ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)
        ?.JudicialSeizures ?? 0,
  },
];
