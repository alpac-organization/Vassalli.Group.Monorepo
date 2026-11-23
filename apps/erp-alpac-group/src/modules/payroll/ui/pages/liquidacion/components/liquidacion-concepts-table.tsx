import { Badges, DataTable, type TableColumn } from "@alpac/design-system";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import type { LiquidacionConcept } from "../types/liquidacion.types";

interface LiquidacionConceptsTableProps {
  concepts: LiquidacionConcept[];
}

const columns: TableColumn<LiquidacionConcept>[] = [
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
    key: "tipo",
    label: "Tipo",
    render: (row) =>
      row.tipo === "ingreso" ? (
        <Badges
          label="Ingreso"
          color="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
        />
      ) : (
        <Badges
          label="Deducción"
          color="bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
        />
      ),
  },
  {
    key: "monto",
    label: "Monto",
    render: (row) => (
      <span className="font-semibold text-neutral-900 dark:text-white">
        {formatCurrency(row.monto)}
      </span>
    ),
  },
  {
    key: "estado",
    label: "Estado",
    render: (row) =>
      row.estado === "Aplicado" ? (
        <Badges
          label="Aplicado"
          color="bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300"
        />
      ) : (
        <Badges
          label="Pendiente"
          color="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
        />
      ),
  },
];

export function LiquidacionConceptsTable({
  concepts,
}: LiquidacionConceptsTableProps) {
  return (
    <DataTable
      title="Conceptos de liquidación"
      data={concepts}
      columns={columns}
    />
  );
}
