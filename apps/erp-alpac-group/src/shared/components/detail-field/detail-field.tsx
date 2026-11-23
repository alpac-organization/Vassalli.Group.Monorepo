import { Avatar } from "@alpac/design-system";
import type { DetailFieldProps } from "@app/shared/components/detail-field/detail-field.types";

export const DetailField = ({
   label,
   value,
   containerClass,
   icon,
   avatar,
   description
}: DetailFieldProps) => {
   const isTextValue = typeof value === "string" || value == null;

   return (
      <div className={`flex w-full max-w-full min-w-0 flex-col gap-1 ${containerClass ?? ""}`}>
         <span className="text-[12px]! font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {label}
         </span>
         <div className="flex w-full min-w-0 max-w-full items-center overflow-hidden">

            {avatar ? (
               <span className="my-1 mx-1 mr-3! flex shrink-0">
                  <Avatar
                     hasLabel={false}
                     label={avatar.label}
                     pictureUrl={avatar.pictureUrl}
                  />
               </span>
            ) : (
               !!icon && (
                  <span className="my-1 mx-1 mr-3! m flex h-9 w-9 shrink-0 items-center justify-center ring-1 ring-slate-200 dark:ring-neutral-600 rounded-full">
                     {icon}
                  </span>
               )
            )}

            {isTextValue ? (
               description ? (
                  <div className="flex min-w-0 flex-1 flex-col leading-tight">
                     <span className="overflow-hidden break-all whitespace-normal text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                        {(typeof value === "string" ? value.trim() : "") || "—"}
                     </span>
                     <span className="overflow-hidden break-all text-xs text-slate-500 dark:text-slate-400">
                        {description}
                     </span>
                  </div>
               ) : (
                  <span className="min-w-0 flex-1 overflow-hidden break-all whitespace-normal text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                     {(typeof value === "string" ? value.trim() : "") || "—"}
                  </span>
               )
            ) : (
               value
            )}
         </div>
      </div>
   );
};