import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import { formatIdentificationNumber } from "@app/shared/utils/string.utils";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { parseAdditionalDeductions } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/utils/parse-additional-deductions";

export type PayrollColumnDef = {
  key: string;
  label: string;
  render: (item: PayrollItemResponse) => string | number;
  getValue?: (item: PayrollItemResponse) => number;
};

export const payrollColumns: PayrollColumnDef[] = [
  {
    key: "collaborator_code",
    label: "Código",
    render: (item) => item.collaborator?.collaborator_code ?? "—",
  },
  {
    key: "full_name",
    label: "Nombre Completo",
    render: (item) => item.collaborator?.full_name ?? "—",
  },
  {
    key: "identification_number",
    label: "Identificación",
    render: (item) => {
      const idNumber = item.collaborator?.identification_number;
      if (!idNumber) return "—";
      if (idNumber.length !== 14) return idNumber;
      return formatIdentificationNumber(idNumber);
    },
  },
  {
    key: "job_position",
    label: "Posición",
    render: (item) => item.collaborator?.job_position ?? "—",
  },
  {
    key: "inss_number",
    label: "Número INSS",
    render: (item) => {
      const inssNumber = item.collaborator?.inss_number;
      if (!inssNumber || !String(inssNumber).trim()) return "—";
      return inssNumber;
    },
  },
  {
    key: "gross_salary",
    label: "Ordinario",
    render: (item) => formatCurrency(item.gross_salary ?? 0, "NIO") ?? "—",
    getValue: (item) => item.gross_salary ?? 0,
  },
  {
    key: "inss",
    label: "INSS",
    render: (item) => formatCurrency(item.inss ?? 0, "NIO") ?? "—",
    getValue: (item) => item.inss ?? 0,
  },
  {
    key: "ir",
    label: "IR",
    render: (item) => formatCurrency(item.ir ?? 0, "NIO") ?? "—",
    getValue: (item) => item.ir ?? 0,
  },
  {
    key: "overtime",
    label: "Horas Extras",
    render: (item) => formatCurrency(item.overtime ?? 0, "NIO") ?? "—",
    getValue: (item) => item.overtime ?? 0,
  },
  {
    key: "number_of_overtime",
    label: "Número de Horas Extras",
    render: (item) => `${item.number_of_overtime ?? 0} hrs`,
    getValue: (item) => item.number_of_overtime ?? 0,
  },
  {
    key: "bonus",
    label: "Bonos",
    render: (item) => formatCurrency(item.bonus ?? 0, "NIO") ?? "—",
    getValue: (item) => item.bonus ?? 0,
  },
  {
    key: "total_legal_deductions",
    label: "Total de Deducciones Legales",
    render: (item) =>
      formatCurrency(item.total_legal_deductions ?? 0, "NIO") ?? "—",
    getValue: (item) => item.total_legal_deductions ?? 0,
  },
  {
    key: "loans",
    label: "Préstamos",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.Loans ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)?.Loans ?? 0,
  },
  {
    key: "absences",
    label: "Ausencias",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.Absences ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)?.Absences ?? 0,
  },
  {
    key: "purisima",
    label: "Purísima",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.Purisima ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)?.Purisima ?? 0,
  },
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
  },
  {
    key: "salary_advance",
    label: "Adelanto de Salario",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.SalaryAdvance ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)
        ?.SalaryAdvance ?? 0,
  },
  {
    key: "food_travel_allowance",
    label: "Total de Viáticos",
    render: (item) =>
      formatCurrency(item.food_travel_allowance ?? 0, "NIO") ?? "—",
    getValue: (item) => item.food_travel_allowance ?? 0,
  },
  {
    key: "vacations",
    label: "Vacaciones",
    render: (item) => formatCurrency(item.vacations ?? 0, "NIO") ?? "—",
    getValue: (item) => item.vacations ?? 0,
  },
  {
    key: "judicial_seizures",
    label: "Embargos Judiciales",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.JudicialSeizures ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)
        ?.JudicialSeizures ?? 0,
  },
  {
    key: "uniform_deduction",
    label: "Deducción por Uniforme",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.UniformDeduction ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)
        ?.UniformDeduction ?? 0,
  },
  {
    key: "christmas_bonus_advance",
    label: "Adelanto de Bono de Navidad",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.ChristmasBonusAdvance ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)
        ?.ChristmasBonusAdvance ?? 0,
  },
  {
    key: "child_support_garnishment",
    label: "Embargo alimenticios",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.ChildSupportGarnishment ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)
        ?.ChildSupportGarnishment ?? 0,
  },
  {
    key: "other_deductions",
    label: "Otras Deducciones",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.OtherDeductions ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)
        ?.OtherDeductions ?? 0,
  },
  {
    key: "total_deducctions",
    label: "Total de Deducciones",
    render: (item) => formatCurrency(item.total_deducctions ?? 0, "NIO") ?? "—",
    getValue: (item) => item.total_deducctions ?? 0,
  },
  {
    key: "total_to_pay",
    label: "Pago total",
    render: (item) => formatCurrency(item.total_to_pay ?? 0, "NIO") ?? "—",
    getValue: (item) => item.total_to_pay ?? 0,
  },
];
