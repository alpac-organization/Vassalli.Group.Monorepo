import type { DetailFieldProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/components/detail-field/types/detail-field.props";

export function DetailField({
  label,
  value,
  className = "",
}: DetailFieldProps) {
  return (
    <div
      className={`min-w-0 flex flex-row items-center justify-between gap-8 sm:flex-col sm:items-start sm:gap-2 ${className}`}
    >
      <p className="m-0! shrink-0 text-xs tracking-wide text-slate-500 dark:text-slate-400">
        {label}:
      </p>
      <p className="m-0! wrap-break-word text-right text-sm font-semibold text-slate-900 sm:text-left dark:text-white">
        {value?.trim() ? value : "—"}
      </p>
    </div>
  );
}
