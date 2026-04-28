import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import { formatIdentificationNumber } from "@app/shared/utils/string.utils";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { parseAdditionalDeductions } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/utils/parse-additional-deductions";

export const payrollColumns = [
  {
    key: "collaborator_code",
    label: "Código",
    render: (item: PayrollItemResponse) =>
      item.collaborator?.collaborator_code ?? "—",
  },
  {
    key: "full_name",
    label: "Nombre Completo",
    render: (item: PayrollItemResponse) =>
      item.collaborator?.full_name ?? "—",
  },
  {
    key: "identification_number",
    label: "Identificación",
    render: (item: PayrollItemResponse) => {
      const idNumber = item.collaborator?.identification_number;
      if (!idNumber) return "—";
      if (idNumber.length !== 14) return idNumber;
      return formatIdentificationNumber(idNumber);
    },
  },
  {
    key: "branch_name",
    label: "Area de Trabajo",
  },
  {
    key: "biweekly_salary",
    label: "Salario Quincenal",
    render: (item: PayrollItemResponse) =>
      formatCurrency(item.biweekly_salary ?? 0, "NIO") ?? "—",
  },
  {
    key: "overtime",
    label: "Horas Extras",
    render: (item: PayrollItemResponse) =>
      formatCurrency(item.overtime ?? 0, "NIO") ?? "—",
  },
  {
    key: "bonus",
    label: "Bonos",
    render: (item: PayrollItemResponse) =>
      formatCurrency(item.bonus ?? 0, "NIO") ?? "—",
  },
  {
    key: "total_travel_expenses",
    label: "Gastos de Viaje",
    render: (item: PayrollItemResponse) =>
      formatCurrency(item.travel_expenses ?? 0, "NIO") ?? "—",
  },
  {
    key: "gross_salary",
    label: "Ordinario",
    render: (item: PayrollItemResponse) =>
      formatCurrency(item.gross_salary ?? 0, "NIO") ?? "—",
  },
  {
    key: "inss",
    label: "INSS",
    render: (item: PayrollItemResponse) =>
      formatCurrency(item.inss ?? 0, "NIO") ?? "—",
  },
  {
    key: "ir",
    label: "IR",
    render: (item: PayrollItemResponse) =>
      formatCurrency(item.ir ?? 0, "NIO") ?? "—",
  },
  {
    key: "total_legal_deductions",
    label: "Total de Deducciones Legales",
    render: (item: PayrollItemResponse) =>
      formatCurrency(item.total_legal_deductions ?? 0, "NIO") ?? "—",
  },
  {
    key: "loans",
    label: "Préstamos",
    render: (item: PayrollItemResponse) => {
      const data = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(data?.Loans ?? 0, "NIO") ?? "—";
    },
  },
  {
    key: "absences",
    label: "Ausencias",
    render: (item: PayrollItemResponse) => {
      const data = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(data?.Absences ?? 0, "NIO") ?? "—";
    },
  },
  {
    key: "purisima",
    label: "Purísima",
    render: (item: PayrollItemResponse) => {
      const data = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(data?.Purisima ?? 0, "NIO") ?? "—";
    },
  },
  {
    key: "sanction",
    label: "Sanciones",
    render: (item: PayrollItemResponse) => {
      const data = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(data?.Sanction ?? 0, "NIO") ?? "—";
    },
  },
  {
    key: "cash_shortage",
    label: "Faltante de Caja",
    render: (item: PayrollItemResponse) => {
      const data = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(data?.CashShortage ?? 0, "NIO") ?? "—";
    },
  },
  {
    key: "late_arrivals",
    label: "Llegadas Tardías",
    render: (item: PayrollItemResponse) => {
      const data = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(data?.LateArrivals ?? 0, "NIO") ?? "—";
    },
  },
  {
    key: "salary_advance",
    label: "Adelanto de Salario",
    render: (item: PayrollItemResponse) => {
      const data = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(data?.SalaryAdvance ?? 0, "NIO") ?? "—";
    },
  },
  {
    key: "judicial_seizures",
    label: "Embargos Judiciales",
    render: (item: PayrollItemResponse) => {
      const data = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(data?.JudicialSeizures ?? 0, "NIO") ?? "—";
    },
  },
  {
    key: "other_deductions",
    label: "Otras Deducciones",
    render: (item: PayrollItemResponse) => {
      const data = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(data?.OtherDeductions ?? 0, "NIO") ?? "—";
    },
  },
  {
    key: "total_deducctions",
    label: "Total de Deducciones",
    render: (item: PayrollItemResponse) =>
      formatCurrency(item.total_deducctions ?? 0, "NIO") ?? "—",
  },
  {
    key: "total_to_pay",
    label: "Pago total",
    render: (item: PayrollItemResponse) =>
      formatCurrency(item.total_to_pay ?? 0, "NIO") ?? "—",
  },
];
