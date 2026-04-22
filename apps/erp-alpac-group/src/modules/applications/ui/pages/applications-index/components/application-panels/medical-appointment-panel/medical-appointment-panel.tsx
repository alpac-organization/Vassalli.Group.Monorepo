import { formatRequestedDays } from "@app/shared/utils/vacation.utils";
import type { MedicalAppointmentPanelProps } from "./medical-appointment-panel.types";
import { formatDateToSpanishWords, formatTime } from "@app/shared/utils/string.utils";

export const MedicalAppointmentPanel = ({ application }: MedicalAppointmentPanelProps) => {

   return (
      <>
         {
            application.type === 'MedicalAppointment' && !!application.start_date && (
               <div className="flex flex-col gap-1">
                  <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                     Fecha de la Cita Médica
                  </span>
                  <div className="flex flex-col">
                     <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                        {application.start_date ? formatDateToSpanishWords(application.start_date) : '—'}
                     </span>
                  </div>
               </div>
            )
         }

         {
            application.type === 'MedicalAppointment' && !!application.start_time && (
               <div className="flex flex-col gap-1">
                  <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                     Hora de Inicio
                  </span>
                  <div className="flex flex-col">
                     <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                        {application.start_time ? formatTime(application.start_time) : '—'}
                     </span>
                  </div>
               </div>
            )
         }

         {
            application.type === 'MedicalAppointment' && !!application.end_time && (
               <div className="flex flex-col gap-1">
                  <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                     Hora Final
                  </span>
                  <div className="flex flex-col">
                     <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                        {application.end_time ? formatTime(application.end_time) : '—'}
                     </span>
                  </div>
               </div>
            )
         }

         {
            application.type === 'MedicalAppointment' && !!application.amount_days && (
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

         {
            application.type === 'MedicalAppointment' && (
               <div className="flex flex-col gap-1">
                  <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                     Archivo adjunto
                  </span>
                  <div className="flex flex-col">
                     <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                        <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-400 hover:underline">
                           Archivo adjunto
                        </a>
                     </span>
                  </div>
               </div>
            )
         }
      </>
   )
}