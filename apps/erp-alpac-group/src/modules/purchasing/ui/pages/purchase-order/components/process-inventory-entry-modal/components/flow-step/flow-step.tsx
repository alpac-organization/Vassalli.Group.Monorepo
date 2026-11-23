import { memo } from "react";
import type { FlowStepProps } from "./flow-step.types";

export const FlowStep = memo(function FlowStep(props: FlowStepProps) {
   const { icon, caption, title, highlighted = false } = props;

   return (
      <div
         className={`flex items-center gap-3 rounded-lg bg-white/80 p-3 shadow-sm ring-1 dark:bg-neutral-900/40 ${
            highlighted
               ? "ring-amber-300 dark:ring-amber-500/40"
               : "ring-amber-200/70 dark:ring-amber-500/20"
            }`
         }
      >
         <span
            aria-hidden="true"
            className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
               highlighted
                  ? "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300"
                  : "bg-slate-100 text-slate-600 dark:bg-neutral-700 dark:text-slate-200"
            }`}
         >
            {icon}
         </span>

         <div className="min-w-0">
            <p className="text-xs text-slate-500 dark:text-slate-300">
               {caption}
            </p>

            <p className="m-0 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
               {title}
            </p>
         </div>
      </div>
   );
});