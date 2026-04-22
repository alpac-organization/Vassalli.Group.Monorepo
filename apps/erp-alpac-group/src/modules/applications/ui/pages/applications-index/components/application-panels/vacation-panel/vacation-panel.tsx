import { formatDateToSpanishWords, formatTime } from "@app/shared/utils/string.utils";
import type { VacationPanelProps } from "./vacation-panel.types";
import { formatRequestedDays } from "@app/shared/utils/vacation.utils";

export const VacationPanel = ({ application }: VacationPanelProps) => {

   const { start_date, end_date, start_time, end_time } = application;

   return (
      <>
         {
            application.type === 'Vacation' && !!start_date && (
               <div className="flex flex-col gap-1">
                  <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                     Fecha de Inicio
                  </span>
                  <div className="flex flex-col">
                     <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                        {start_date ? formatDateToSpanishWords(start_date) : '—'}
                     </span>
                  </div>
               </div>
            )
         }

         {
            application.type === 'Vacation' && !!end_date && (
               <div className="flex flex-col gap-1">
                  <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                     Fecha de Fin
                  </span>
                  <div className="flex flex-col">
                     <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                        {end_date ? formatDateToSpanishWords(end_date) : '—'}
                     </span>
                  </div>
               </div>
            )
         }

         {
            application.type === 'Vacation' && !!start_time && (
               <div className="flex flex-col gap-1">
                  <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                     Hora de Inicio
                  </span>
                  <div className="flex flex-col">
                     <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                        {start_time ? formatTime(start_time) : '—'}
                     </span>
                  </div>
               </div>
            )
         }

         {
            application.type === 'Vacation' && !!end_time && (
               <div className="flex flex-col gap-1">
                  <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                     Hora Final
                  </span>
                  <div className="flex flex-col">
                     <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                        {end_time ? formatTime(end_time) : '—'}
                     </span>
                  </div>
               </div>
            )
         }

         {
            application.type === 'Vacation' && !!application.amount_days && (
               <div className="flex flex-col gap-1">
                  <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                     Cantidad a Recibir
                  </span>
                  <div className="flex flex-col">
                     <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                        {formatRequestedDays(application.amount_days)}
                     </span>
                  </div>
               </div>
            )
         }
      </>
   )
}