import type { DetailFieldProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/components/detail-field/types/detail-field.props";
export function DetailField({
  label,
  value,
  className = "",
}: DetailFieldProps) {
  return (
    <div className={`min-w-0 ${className}`}>
      <p className="m-0! mb-1! text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="m-0! wrap-break-word text-sm font-medium text-slate-900 dark:text-white">
        {value || "—"}
      </p>
    </div>
  );
}
