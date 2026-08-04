import type { DucatListProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/components/ducat-list/types/ducat-list.props";
export function DucatList({ items }: DucatListProps) {
  const ducats = items.filter(Boolean);
  if (ducats.length === 0) {
    return (
      <p className="m-0! text-sm font-medium text-slate-500 dark:text-slate-400">
        —
      </p>
    );
  }

  return (
    <ul className="m-0! list-none p-0! flex flex-col gap-2">
      {ducats.map((ducat, index) => (
        <li
          key={`${ducat}-${index}`}
          className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2.5 dark:border-neutral-600 dark:bg-[#1f232b]"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-alpac-primary-500/15 text-[11px] font-semibold text-alpac-primary-600 dark:bg-alpac-primary-500/20 dark:text-alpac-primary-300">
            {index + 1}
          </span>
          <span className="min-w-0 wrap-break-word text-sm font-medium text-slate-900 dark:text-white">
            {ducat}
          </span>
        </li>
      ))}
    </ul>
  );
}
