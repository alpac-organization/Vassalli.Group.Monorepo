import { Badges } from "@alpac/design-system";
import { statusBadgeColor } from "@app/modules/payroll/ui/pages/permissions/components/permission-table/utils/statusBadgeColor";
import type { PermissionRequestStatus } from "@app/modules/vacations/domain/ApiContract/Requests/permission-history-request";
import type { AdministratorPanelProps } from "./administrator-panel.types";

export const AdministratorPanel = ({
  application,
}: AdministratorPanelProps) => {
  const getStatus = (approved: boolean | null): PermissionRequestStatus => {
    if (approved === null) return "Pending";
    return approved ? "Approved" : "Rejected";
  };

  const status = getStatus(application.second_step_approved);
  const label =
    status === "Pending"
      ? "Pendiente"
      : status === "Approved"
        ? "Aprobado"
        : "Rechazado";

  return (
    <>
      {(application.firts_step_approved ||
        application.second_step_approved) && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Aprobación por el Administrador
          </span>
          <div className="flex flex-col">
            <Badges
              label={label}
              color={statusBadgeColor(status)}
              className="w-fit"
            />
          </div>
        </div>
      )}

      {application.firts_step_approved ||
        (application.second_step_approved && (
          <div className="flex flex-col gap-1">
            <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Nombre del Administrador
            </span>
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                {application.administrator_full_name || "Sin descripción"}
              </span>
            </div>
          </div>
        ))}
    </>
  );
};
