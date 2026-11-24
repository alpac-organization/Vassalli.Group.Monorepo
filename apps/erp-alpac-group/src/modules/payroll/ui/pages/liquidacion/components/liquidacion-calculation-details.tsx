import {
  DataTable,
  SectionHeader,
  type TableColumn,
} from "@alpac/design-system";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import type { LiquidacionCalculationDetail } from "../types/liquidacion.types";

interface LiquidacionCalculationDetailsProps {
  details: LiquidacionCalculationDetail[];
}

const columns: TableColumn<LiquidacionCalculationDetail>[] = [
  {
    key: "concepto",
    label: "Concepto",
    render: (row) => (
      <span className="font-medium text-neutral-900 dark:text-white">
        {row.concepto}
      </span>
    ),
  },
  {
    key: "valor",
    label: "Valor",
    render: (row) =>
      row.valor === null ? (
        <span className="text-gray-500 dark:text-gray-400">—</span>
      ) : (
        <span className="font-semibold text-neutral-900 dark:text-white">
          {formatCurrency(row.valor)}
        </span>
      ),
  },
  {
    key: "parametro",
    label: "Parámetro",
    render: (row) => row.parametro ?? "—",
  },
  { key: "cantidad", label: "Cantidad", render: (row) => row.cantidad ?? "—" },
];

export function LiquidacionCalculationDetails({
  details,
}: LiquidacionCalculationDetailsProps) {
  return (
    <>
      <SectionHeader
        title="Detalle de cálculo de liquidación"
        subtitle="Desglose de ingresos, deducciones y conceptos adicionales de la liquidación"
        hasBorder
      />

      <DataTable
        title="Detalle de cálculo"
        data={details}
        columns={columns}
      />
    </>
  );
}
