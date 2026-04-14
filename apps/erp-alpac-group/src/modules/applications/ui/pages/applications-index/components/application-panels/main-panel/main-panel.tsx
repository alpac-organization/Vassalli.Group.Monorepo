import { PermitApplicationTypeEnum } from "@app/modules/applications/domain/enums/permit-application-type.enum";
import { PermitApplicationStatusEnum } from "@app/modules/applications/domain/enums/permit-application-status.enum";
import { statusBadgeColor } from "../../application-table/utils/status-badge.utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { Badges } from "@alpac/design-system";
import type { MainPanelProps } from "./main-panel.types";

export const MainPanel = ({ application, children, className }: MainPanelProps) => {

   const panelClassName = `grid gap-6 p-5 rounded-md border border-slate-600 bg-white dark:bg-[#272b34] ${className}`;

   return (
      <div
         key={application.permit_apllication_id}
         className={panelClassName}>

         <div className="flex flex-col gap-1">
            <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
               Código del Colaborador
            </span>
            <div className="flex flex-col">
               <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                  {application.collaborator_code || '—'}
               </span>
            </div>
         </div>

         <div className="flex flex-col gap-1">
            <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
               Colaborador
            </span>
            <div className="flex flex-col">
               <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                  {application.requested_by || '—'}
               </span>
            </div>
         </div>

         <div className="flex flex-col gap-1">
            <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
               Estado de la Solicitud
            </span>
            <div className="flex flex-col">
               <Badges
                  label={PermitApplicationStatusEnum[application.status]?.label ?? "Pendiente"}
                  color={statusBadgeColor(application.status)}
                  className="w-fit! font-semibold"
               />
            </div>
         </div>

         <div className="flex flex-col gap-1">
            <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
               Tipo de Solicitud
            </span>
            <div className="flex flex-col">
               <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                  {PermitApplicationTypeEnum[application.type]?.label ?? "Pendiente"}
               </span>
            </div>
         </div>

         <div className="flex flex-col gap-1">
            <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
               Fecha de Solicitud
            </span>
            <div className="flex flex-col">
               <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                  {formatDateToSpanishWords(application.created_at)}
               </span>
            </div>
         </div>

         <div className="flex flex-col gap-1">
            <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
               Motivo o Descripción
            </span>
            <div className="flex flex-col">
               <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                  {application.description || 'Sin descripción'}
               </span>
            </div>
         </div>

         {children && (<>{children}</>)}

      </div>
   )
}