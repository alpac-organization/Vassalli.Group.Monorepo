import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import { formatCurrency } from "@app/shared/utils/currency.utils";

export type IncomeConcept = {
  key: string;
  label: string;
  render: (item: PayrollItemResponse) => string | number;
  getValue: (item: PayrollItemResponse) => number;
  unit?: string;
};

export const INCOME_CONCEPTS: IncomeConcept[] = [
  {
    key: "transport",
    label: "TRANSPORTE",
    render: (item) => formatCurrency(item.transport ?? 0, "NIO") ?? "—",
    getValue: (item) => item.transport ?? 0,
    unit: "Día",
  },
  {
    key: "feeding",
    label: "ALIMENTACION",
    render: (item) => formatCurrency(item.feeding ?? 0, "NIO") ?? "—",
    getValue: (item) => item.feeding ?? 0,
    unit: "Día",
  },
  {
    key: "overtime",
    label: "HORAS EXTRAS",
    render: (item) => formatCurrency(item.overtime ?? 0, "NIO") ?? "—",
    getValue: (item) => item.overtime ?? 0,
    unit: "Hora",
  },
  {
    key: "vacations",
    label: "VACACIONES",
    render: (item) => formatCurrency(item.vacations ?? 0, "NIO") ?? "—",
    getValue: (item) => item.vacations ?? 0,
    unit: "Día",
  },
  {
    key: "bonus",
    label: "BONOS",
    render: (item) => formatCurrency(item.bonus ?? 0, "NIO") ?? "—",
    getValue: (item) => item.bonus ?? 0,
  },
  {
    key: "commissions",
    label: "COMISIONES",
    render: (item) => formatCurrency(item.commissions ?? 0, "NIO") ?? "—",
    getValue: (item) => item.commissions ?? 0,
  },
  {
    key: "antique",
    label: "ANTIGÜEDAD",
    render: (item) => formatCurrency(item.antique ?? 0, "NIO") ?? "—",
    getValue: (item) => item.antique ?? 0,
  },
];
