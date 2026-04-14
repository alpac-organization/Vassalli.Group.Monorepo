import type { AdministratorPanelProps } from "./administrator-panel.types";
import { MainPanel } from "../main-panel/main-panel";

export const AdministratorPanel = ({ application, children }: AdministratorPanelProps) => {


   console.log("Testing: ", application)
   // grid-cols-1 sm:grid-cols-2 md:grid-cols-3
   return (
      <MainPanel application={application} className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
         {/* {
            application.type === 'DonatedVacations' && (
               <div className="flex flex-col gap-1">
                  <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                     Colaborador a recibir
                  </span>
                  <div className="flex flex-col">
                     <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                        {isLoadingBeneficiary ? (
                           <span className="text-slate-400 animate-pulse">Cargando...</span>
                        ) : (
                           beneficiary?.full_name || '—'
                        )}
                     </span>
                  </div>
               </div>
            )
         }

         {
            application.type === 'DonatedVacations' && (
               <div className="flex flex-col gap-1">
                  <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                     Área del Colaborador
                  </span>
                  <div className="flex flex-col">
                     <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                        {isLoadingBeneficiary ? (
                           <span className="text-slate-400 animate-pulse">Cargando...</span>
                        ) : (
                           beneficiary?.working_information?.work_area || '—'
                        )}
                     </span>
                  </div>
               </div>
            )
         }

         {
            application.type === 'DonatedVacations' && (
               <div className="flex flex-col gap-1">
                  <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                     Cargo del Colaborador
                  </span>
                  <div className="flex flex-col">
                     <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                        {isLoadingBeneficiary ? (
                           <span className="text-slate-400 animate-pulse">Cargando...</span>
                        ) : (
                           beneficiary?.work_position || '—'
                        )}
                     </span>
                  </div>
               </div>
            )
         }

         {
            application.type === 'DonatedVacations' && (
               <div className="flex flex-col gap-1">
                  <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                     Días a recibir
                  </span>
                  <div className="flex flex-col">
                     <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100 uppercase">
                        {application.amount_days || '0'} {application.amount_days === 1 ? 'Día' : 'Días'}
                     </span>
                  </div>
               </div>
            )
         } */}

         {children && (<>{children}</>)}
      </MainPanel>
   )
}