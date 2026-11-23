import { StatsCard } from "@alpac/design-system";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import type { LiquidacionConcept } from "../types/liquidacion.types";

interface LiquidacionSummaryCardsProps {
  concepts: LiquidacionConcept[];
}

export function LiquidacionSummaryCards({
  concepts,
}: LiquidacionSummaryCardsProps) {
  const incomeCount = concepts.filter((item) => item.tipo === "ingreso").length;
  const deductionCount = concepts.filter(
    (item) => item.tipo === "deduccion",
  ).length;

  const totalIncome = concepts.reduce(
    (total, item) =>
      item.tipo === "ingreso" ? total + item.monto : total,
    0,
  );
  const totalDeductions = concepts.reduce(
    (total, item) =>
      item.tipo === "deduccion" ? total + item.monto : total,
    0,
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatsCard
        title="Total ingresos"
        value={formatCurrency(totalIncome)}
        icon={<ArrowUpRight size={20} />}
        trend={`${incomeCount} conceptos de ingreso`}
        trendType="up"
        borderColor="border-emerald-500/60"
      />
      <StatsCard
        title="Total deducciones"
        value={formatCurrency(totalDeductions)}
        icon={<ArrowDownRight size={20} />}
        trend={`${deductionCount} conceptos de deducción`}
        trendType="down"
        borderColor="border-rose-500/60"
      />
      <StatsCard
        title="Neto a pagar"
        value={formatCurrency(totalIncome - totalDeductions)}
        icon={<Wallet size={20} />}
        borderColor="border-alpac-primary-500"
      />
    </div>
  );
}
