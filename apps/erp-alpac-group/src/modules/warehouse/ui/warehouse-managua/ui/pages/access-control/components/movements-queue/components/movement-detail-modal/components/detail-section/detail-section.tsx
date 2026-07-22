import type { DetailSectionProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/components/detail-section/types/detail-section.props";

export function DetailSection({
  title,
  description,
  children,
}: DetailSectionProps) {
  return (
    <section className="flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-neutral-600 dark:bg-[#272b34]">
      <div className="min-w-0 px-3 pt-3 sm:px-4 sm:pt-4">
        <h3 className="m-0! text-[20px]! font-semibold capitalize tracking-wide text-slate-500 dark:text-slate-400">
          {title}
        </h3>
        {description ? (
          <p className="m-0! mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        ) : null}
      </div>

      <div className="mt-3 h-0.5 w-full bg-slate-200 dark:bg-slate-600" />

      <div className="flex min-w-0 flex-1 flex-col gap-6 px-3 py-3 sm:px-4 sm:py-4">
        {children}
      </div>
    </section>
  );
}
