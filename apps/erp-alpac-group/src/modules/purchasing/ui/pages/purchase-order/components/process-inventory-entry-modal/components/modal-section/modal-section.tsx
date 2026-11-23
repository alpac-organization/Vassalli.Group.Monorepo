import { useId } from "react";

import { SECTION_TITLE_CLASS } from "../../process-inventory-entry-modal.constants";

import type { ModalSectionProps } from "./modal-section.types";

export const ModalSection = function ({
  title,
  description,
  icon,
  action,
  children,
  contentClassName,
}: ModalSectionProps) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-[#303846]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-neutral-700 dark:bg-[#272b34]/60">
        <div className="flex min-w-0 items-center gap-2.5">
          {icon && (
            <span
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200 dark:bg-neutral-800 dark:text-slate-300 dark:ring-neutral-600"
            >
              {icon}
            </span>
          )}
          <div className="min-w-0">
            <h3 id={titleId} className={SECTION_TITLE_CLASS}>
              {title}
            </h3>
            {description && (
              <p className="m-0 text-xs text-slate-500 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>

      <div className={contentClassName ?? "p-4"}>{children}</div>
    </section>
  );
};
