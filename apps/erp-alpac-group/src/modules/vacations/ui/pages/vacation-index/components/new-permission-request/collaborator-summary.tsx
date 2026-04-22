import type { NewPermissionCollaboratorSummaryProps } from "./types/collaborator-summary.type";
export function NewPermissionCollaboratorSummary({
   fullName,
   workPosition,
   isFullNameLoading = false,
   isWorkPositionLoading = false,
   title = "Nombre del Colaborador",
   subtitle = "Cargo",
}: NewPermissionCollaboratorSummaryProps) {
   return (
      <div
         className="mb-1 min-w-0 rounded-xl dark:bg-[#272b34]"
         aria-live="polite"
      >
         <dl className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
            <div className="min-w-0">
               <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-black dark:text-slate-400">
                  {title}
               </dt>
               <dd className="mt-1 min-h-5.5 text-[15px] font-semibold leading-snug text-slate-900 dark:text-white">
                  {isFullNameLoading ? (
                     <span
                        className="inline-block h-4.5 w-[min(100%,14rem)] max-w-full animate-pulse rounded-md bg-slate-300/80 dark:bg-slate-600/60"
                        aria-hidden
                     />
                  ) : fullName.trim() ? (
                     <span className="wrap-break-word">{fullName}</span>
                  ) : (
                     <span className="text-slate-400 dark:text-slate-500">—</span>
                  )}
               </dd>
            </div>
            <div className="min-w-0">
               <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-black dark:text-slate-400">
                  {subtitle}
               </dt>
               <dd className="mt-1 min-h-5.5 text-[15px] font-semibold leading-snug text-slate-900 dark:text-white">
                  {isWorkPositionLoading ? (
                     <span
                        className="inline-block h-4.5 w-[min(100%,12rem)] max-w-full animate-pulse rounded-md bg-alpac-primary-500/20 dark:bg-alpac-primary-500/15"
                        aria-hidden
                     />
                  ) : workPosition.trim() ? (
                     <span className="wrap-break-word">{workPosition}</span>
                  ) : (
                     <span className="font-medium text-slate-400 dark:text-slate-500">
                        —
                     </span>
                  )}
               </dd>
            </div>
         </dl>
      </div>
   );
}
