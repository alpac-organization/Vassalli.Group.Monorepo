import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import { formatIdentificationNumber } from "@app/shared/utils/string.utils";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { parseAdditionalDeductions } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/utils/parse-additional-deductions";
import { formatDate } from "@app/shared/utils/string.utils";
import { VIGILANCIA_EMPRESARIAL_SA_COMPANY_NAME } from "@app/modules/payroll/ui/pages/nomina/constants/payroll.constants";
export type PayrollColumnDef = {
  key: string;
  label: string;
  render: (item: PayrollItemResponse) => string | number;
  getValue?: (item: PayrollItemResponse) => number;
  onlyForCompanyName?: string;
};

// export function isDaemPayrollCompany(
//   companyName: string | null | undefined,
// ): boolean {
//   return (companyName ?? "").trim() === VIGILANCIA_EMPRESARIAL_SA_COMPANY_NAME;
// }

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
    key: "entry_date",
    label: "Fecha de Ingreso",
    render: (item) => formatDate(item.collaborator?.entry_date ?? "") ?? "—",
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
    key: "work_area",
    label: "Área de Trabajo",
    render: (item) => item.collaborator?.work_area ?? "—",
  },
  {
    key: "daem",
    label: "DAEM",
    onlyForCompanyName: VIGILANCIA_EMPRESARIAL_SA_COMPANY_NAME,
    render: (item) => {
      const v = item.DAEM?.trim();
      return v && v.length > 0 ? v : "—";
    },
  },
  {
    key: "biweekly_salary",
    label: "Salario Quincenal",
    render: (item) => formatCurrency(item.biweekly_salary ?? 0, "NIO") ?? "—",
    getValue: (item) => item.biweekly_salary ?? 0,
  },
  {
    key: "antiquity",
    label: "Antigüedad",
    render: (item) => formatCurrency(item.antique ?? 0, "NIO") ?? "—",
    getValue: (item) => item.antique ?? 0,
  },
  {
    key: "comissions",
    label: "Comisiones",
    render: (item) => formatCurrency(item.commissions ?? 0, "NIO") ?? "—",
    getValue: (item) => item.commissions ?? 0,
  },
  //   {
  //     key: "gross_salary",
  //     label: "Ordinario",
  //     render: (item) => formatCurrency(item.gross_salary ?? 0, "NIO") ?? "—",
  //     getValue: (item) => item.gross_salary ?? 0,
  //   },
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
    key: "number_overtime",
    label: "Número de Horas Extras",
    render: (item) => `${item.number_overtime ?? 0} hrs`,
    getValue: (item) => item.number_overtime ?? 0,
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
    key: "total_viaticos",
    label: "Total de Viáticos",
    render: (item) =>
      formatCurrency(item.total_travel_expenses ?? 0, "NIO") ?? "—",
    getValue: (item) => item.total_travel_expenses ?? 0,
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
      const seizureDeduction = parseAdditionalDeductions(
        item.deductions_additional_data,
      );
      const totalSeizure =
        (seizureDeduction?.JudicialSeizures ?? 0) +
        (seizureDeduction?.ChildSupportGarnishment ?? 0);
      return formatCurrency(totalSeizure ?? 0, "NIO") ?? "—";
    },
    getValue: (item) => {
      const seizureDeduction = parseAdditionalDeductions(
        item.deductions_additional_data,
      );
      const totalSeizure =
        (seizureDeduction?.JudicialSeizures ?? 0) +
        (seizureDeduction?.ChildSupportGarnishment ?? 0);
      return totalSeizure ?? 0;
    },
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
    label: "Adelanto de aguinaldo",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.ChristmasBonusAdvance ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)
        ?.ChristmasBonusAdvance ?? 0,
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
    key: "total_income",
    label: "Total de Ingresos",
    render: (item) => formatCurrency(item.total_income ?? 0, "NIO") ?? "—",
    getValue: (item) => item.total_income ?? 0,
  },
  {
    key: "total_to_pay",
    label: "Pago total",
    render: (item) => formatCurrency(item.total_to_pay ?? 0, "NIO") ?? "—",
    getValue: (item) => item.total_to_pay ?? 0,
  },
];

export function getPayrollColumns(
  companyName?: string | null,
): PayrollColumnDef[] {
  const normalized = (companyName ?? "").trim();
  return payrollColumns.filter(
    (col) =>
      !col.onlyForCompanyName || col.onlyForCompanyName.trim() === normalized,
  );
}
