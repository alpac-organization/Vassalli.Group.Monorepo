import { useCollaborators } from "@app/modules/payroll/ui/hooks/collaborator/useCollaborators";
import type { DonatedVacationPanelProps } from "./donated-vacation-panel.types";
import { useUserStore } from "@app/shared/stores/useUserStore";

export const DonatedVacationPanel = ({
  application,
}: DonatedVacationPanelProps) => {
  const { companyId, moduleCode } = useUserStore();

  const { GetProfileDetails: beneficiaryQuery } = useCollaborators({
    CollaboratorDetailsPayload: {
      company_id: companyId,
      module_code: moduleCode,
      identification_number:
        application.identification_collaborator_to_receive ?? "",
      QueryEnabled: true,
    },
  });

  const beneficiary = beneficiaryQuery.data;
  const isLoadingBeneficiary = beneficiaryQuery.isLoading;

  return (
    <>
      {application.type === "DonatedVacations" && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Colaborador a recibir
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
              {isLoadingBeneficiary ? (
                <span className="text-slate-400 animate-pulse">
                  Cargando...
                </span>
              ) : (
                beneficiary?.full_name || "—"
              )}
            </span>
          </div>
        </div>
      )}

      {application.type === "DonatedVacations" && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Área del Colaborador
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
              {isLoadingBeneficiary ? (
                <span className="text-slate-400 animate-pulse">
                  Cargando...
                </span>
              ) : (
                beneficiary?.working_information?.work_area || "—"
              )}
            </span>
          </div>
        </div>
      )}

      {application.type === "DonatedVacations" && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Cargo del Colaborador
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
              {isLoadingBeneficiary ? (
                <span className="text-slate-400 animate-pulse">
                  Cargando...
                </span>
              ) : (
                beneficiary?.work_position || "—"
              )}
            </span>
          </div>
        </div>
      )}
    </>
  );
};
