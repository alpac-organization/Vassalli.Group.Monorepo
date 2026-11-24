import { Badges } from "@alpac/design-system";
import {
  Building2,
  CalendarDays,
  CircleDollarSign,
  IdCard,
  LayoutGrid,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import type { CollaboratorSummary } from "../types/liquidacion.types";

interface CollaboratorSummaryCardProps {
  collaborator: CollaboratorSummary;
}

export function CollaboratorSummaryCard({
  collaborator,
}: CollaboratorSummaryCardProps) {
  const fields: { icon: LucideIcon; label: string; value: string }[] = [
    {
      icon: IdCard,
      label: "Identificación",
      value: collaborator.identification,
    },
    { icon: Building2, label: "Área", value: collaborator.area },
    {
      icon: LayoutGrid,
      label: "Centro de Costo",
      value: collaborator.costCenter,
    },
    {
      icon: CalendarDays,
      label: "Fecha de ingreso",
      value: collaborator.hireDate,
    },
    {
      icon: Wallet,
      label: "Salario base",
      value: formatCurrency(collaborator.baseSalary),
    },
    {
      icon: CircleDollarSign,
      label: "Tipo de salario",
      value: collaborator.salaryType,
    },
  ];

  return (
    <div className="rounded-lg border border-slate-600 bg-white p-5 dark:border-neutral-600 dark:bg-[#272b34]">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-700">
        <div className="min-w-0">
          <p className="m-0 p-0 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
            Colaborador seleccionado
          </p>
          <h4 className="m-0 p-0 mt-1 text-lg font-semibold text-neutral-900 dark:text-white">
            {collaborator.fullName}
          </h4>
        </div>
        <Badges
          label={collaborator.status}
          color="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
        />
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {fields.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <Icon
              size={18}
              className="mt-0.5 shrink-0 text-gray-500 dark:text-gray-300"
              aria-hidden
            />
            <div className="min-w-0">
              <dt className="text-xs text-gray-500 dark:text-gray-300">
                {label}
              </dt>
              <dd className="m-0 wrap-break-word text-sm font-medium text-neutral-900 dark:text-white">
                {value}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
