import type { MedicalAppointmentPanelProps } from "./medical-appointment-panel.types";

export const MedicalAppointmentPanel = ({ application }: MedicalAppointmentPanelProps) => {

   return (
      <>
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