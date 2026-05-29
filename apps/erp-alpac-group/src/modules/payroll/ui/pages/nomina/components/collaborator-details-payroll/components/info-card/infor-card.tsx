import type { InfoCardProps } from "@app/modules/payroll/ui/pages/nomina/components/collaborator-details-payroll/components/info-card/infor-card.types";
export function InfoCard({
  icon,
  label,
  value,
  mono,
}: InfoCardProps): React.ReactNode {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 dark:border-neutral-700 dark:bg-[#1e2229]">
      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p
        className={`truncate text-sm font-semibold text-slate-900 dark:text-white ${mono ? "font-mono" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
