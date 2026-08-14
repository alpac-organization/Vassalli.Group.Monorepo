import type { DetailFieldProps } from "./detail-field.types";

export const DetailField = ({
   label,
   value,
   containerClass,
   icon
}: DetailFieldProps) => (
   <div className={`flex flex-col gap-1 ${containerClass}`}>
      <span className="text-[12px]! font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
         {label}
      </span>
      <div className="flex items-center">

         {
            !!icon &&
               <span className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center ring-1 ring-slate-200 dark:ring-neutral-600 rounded-full">
                  {icon}
               </span>
            }
         {typeof value === "string" || value == null ? (
            <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
               {(typeof value === "string" ? value?.trim() : "") || "—"}
            </span>
         ) : (
            value
         )}
      </div>
   </div>
);
