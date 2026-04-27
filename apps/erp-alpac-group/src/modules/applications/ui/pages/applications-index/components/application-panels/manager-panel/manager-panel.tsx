import { Badges } from "@alpac/design-system";
import { statusBadgeColor } from "@app/modules/payroll/ui/pages/permissions/components/permission-table/utils/statusBadgeColor";
import type { PermissionRequestStatus } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/permission-history-request";
import type { ManagerPanelProps } from "./manager-panel.types";

export const ManagerPanel = ({ application }: ManagerPanelProps) => {
   const getStatus = (approved: boolean | null): PermissionRequestStatus => {
      if (approved === null) return "Pending";
      return approved ? "Approved" : "Rejected";
   };

   const status = getStatus(application.firts_step_approved);
   const label =
      status === "Pending"
         ? "Pendiente"
         : status === "Approved"
            ? "Aprobado"
            : "Rechazado";

   return (
      <>
         <div className="flex flex-col gap-1">
            <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
               Aprobación por el Jefe Directo
            </span>
            <div className="flex flex-col">
               <Badges
                  label={label}
                  color={statusBadgeColor(status)}
                  className="w-fit"
               />
            </div>
         </div>

         {application.firts_step_approved !== null && (
            <div className="flex flex-col gap-1">
               <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Nombre del Jefe Directo
               </span>
               <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                     {application.manager_fullname || "Sin descripción"}
                  </span>
               </div>
            </div>
         )}
      </>
   );
};
