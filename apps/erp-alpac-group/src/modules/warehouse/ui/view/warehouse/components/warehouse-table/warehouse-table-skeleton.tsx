import { CornerDownRight } from "lucide-react";
import type { WarehouseTableRow } from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-table/types/warehouse-table.types";
import { SkeletonBar } from "@app/shared/components/skeleton-bar/skeleton-bar";

export function WarehouseTableSkeletonCell({
  item,
  variant = "text",
}: {
  item: WarehouseTableRow;
  variant?: "text" | "badge" | "capacity" | "action";
}) {
  const isChild = item.depth > 0;

  if (variant === "text" && item.depth === 0) {
    return <SkeletonBar className="h-4 w-32" />;
  }

  if (variant === "text" && isChild) {
    return (
      <span
        className="inline-flex min-w-0 items-center gap-1.5"
        style={{ paddingLeft: `${item.depth * 1.25}rem` }}
      >
        <CornerDownRight
          size={18}
          className="shrink-0 text-slate-300 dark:text-slate-600"
          aria-hidden
        />
        <SkeletonBar className="h-4 w-28" />
      </span>
    );
  }

  if (variant === "badge") {
    return <SkeletonBar className="h-6 w-20 rounded-full" />;
  }

  if (variant === "capacity") {
    return (
      <div className="flex w-[180px] flex-col gap-1.5">
        <div className="flex justify-between gap-3">
          <SkeletonBar className="h-3 w-16" />
          <SkeletonBar className="h-3 w-16" />
        </div>
        <SkeletonBar className="h-2 w-full rounded-full" />
        <SkeletonBar className="h-3 w-20" />
      </div>
    );
  }

  if (variant === "action") {
    return <SkeletonBar className="h-10 w-10 rounded-md" />;
  }

  return <SkeletonBar className="h-4 w-20" />;
}
