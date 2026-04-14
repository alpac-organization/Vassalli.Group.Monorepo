import type { ManagerPanelProps } from "./manager-panel.types";
import { MainPanel } from "../main-panel/main-panel";
import { Button } from "@alpac/design-system";
import { CheckIcon, XIcon } from "lucide-react";

export const ManagerPanel = ({ application, beneficiary, isLoadingBeneficiary, onApprove, onReject }: ManagerPanelProps) => {

   return (
      <MainPanel application={application} className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
         {
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
         }

         <div className="flex flex-row col-span-full gap-4 border-t border-slate-200 dark:border-slate-800">
            <Button
               type="button"
               label="Rechazar Solicitud"
               className="rounded-md! h-11 px-6! border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/60 hover:text-red-700 dark:hover:text-red-300 shadow-sm transition-all duration-200"
               onClick={() => onReject?.(application.permit_apllication_id)}
               icon={<XIcon size={20} />}
               isHiddenLabelOnMobile
            />

            <Button
               type="button"
               label="Aprobar Solicitud"
               className="rounded-md! h-11 px-6! border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:text-emerald-700 dark:hover:text-emerald-300 disabled:opacity-40 shadow-sm transition-all duration-200"
               onClick={() => onApprove?.(application.permit_apllication_id)}
               icon={<CheckIcon size={20} />}
               isHiddenLabelOnMobile
            />
         </div>
      </MainPanel>
   )
}