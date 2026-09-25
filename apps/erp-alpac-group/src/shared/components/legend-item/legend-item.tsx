import type { LegendItemProps } from "./legend-item.types";

export const LegendItem = ({ text, color }: LegendItemProps) => {
   return (
      <span className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
         <span
            className="size-3 shrink-0 rounded-xs ring-1 ring-black/10 dark:ring-white/15"
            style={{ backgroundColor: color }}
            aria-hidden
         />
         {text}
      </span>
   );
};
