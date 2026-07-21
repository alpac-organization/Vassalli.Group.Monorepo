import type { ReactNode } from "react";

type DetailSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function DetailSection({
  title,
  description,
  children,
}: DetailSectionProps) {
  return (
    <section className="flex flex-col gap-2.5">
      <div className="min-w-0">
        <h3 className="m-0! text-[20px]! font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h3>
        {description ? (
          <p className="m-0! mt-0.5 text-[16px]! text-slate-500 dark:text-slate-400">
            {description}
          </p>
        ) : null}
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4 dark:border-neutral-600 dark:bg-[#272b34]">
        {children}
      </div>
    </section>
  );
}
