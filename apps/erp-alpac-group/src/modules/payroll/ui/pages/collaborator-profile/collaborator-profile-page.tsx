import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { TabHeader, type TabOption } from "@alpac/design-system";
import type { TabId } from "@app/modules/payroll/ui/pages/collaborator-profile/types/tabs.type";
import type { CollaboratorProfileLocationState } from "@app/modules/payroll/ui/pages/collaborator-profile/types/collaborator-profile-navigation.types";
import { PersonalInformation } from "@app/modules/payroll/ui/pages/collaborator-profile/components/Personal-info";
import { ProfileSummary } from "@app/modules/payroll/ui/pages/collaborator-profile/components/Profile-summary";
import { WorkManagementSection } from "@app/modules/payroll/ui/pages/collaborator-profile/components/Work-info";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCollaboratorProfileDetails } from "@app/modules/payroll/ui/hooks/useCollaboratorProfile";
import { Loader } from "@app/shared/components/loaders/loader";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "error" in err) {
    const e = err as ApiErrorResponse;
    return e.error?.description ?? "Ocurrió un error al cargar el perfil.";
  }
  return "Ocurrió un error al cargar el perfil.";
}

export function CollaboratorProfilePage() {
  const [activeTab, setActiveTab] = useState<TabId>("personal");
  const location = useLocation();
  const state = location.state as CollaboratorProfileLocationState | null;

  const { companyId, moduleCode, identificationNumber } = useUserStore();

  const targetIdentification = (
    state?.identification_number ??
    identificationNumber ??
    ""
  ).trim();

  const payload = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      identification_number: targetIdentification,
    }),
    [companyId, moduleCode, targetIdentification],
  );

  const queryEnabled = Boolean(
    targetIdentification && companyId?.trim() && moduleCode?.trim(),
  );

  const { GetProfileDetails } = useCollaboratorProfileDetails(
    payload,
    queryEnabled,
  );
  const { data: profile, isPending, isError, error } = GetProfileDetails;

  const TABS: TabOption<TabId>[] = [
    { id: "personal", label: "Información Personal" },
    { id: "work", label: "Gestiones de Trabajo" },
  ];

  if (!targetIdentification) {
    return (
      <div className="dark w-full max-w-full min-h-0 flex flex-col px-4 py-8 text-slate-100 dark:bg-[#363a45]">
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          No se pudo determinar la identificación del colaborador. Accede desde
          la lista de colaboradores o asegúrate de tener sesión con identificación
          registrada.
        </p>
      </div>
    );
  }

  if (!companyId?.trim() || !moduleCode?.trim()) {
    return (
      <div className="dark w-full max-w-full min-h-0 flex flex-col px-4 py-8 text-slate-100 dark:bg-[#363a45]">
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Falta empresa o módulo activo. Entra a Nómina desde el panel de inicio
          para asociar el módulo, o vuelve a iniciar sesión.
        </p>
      </div>
    );
  }

  if (isPending) {
    return <Loader title="Cargando perfil del colaborador..." />;
  }

  if (isError) {
    return (
      <div className="dark w-full max-w-full min-h-0 flex flex-col px-4 py-8 text-slate-100 dark:bg-[#363a45]">
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {getErrorMessage(error)}
        </p>
      </div>
    );
  }

  return (
    <div className="dark w-full max-w-full min-h-0 flex flex-col font-sans px-4 py-5 text-slate-100 sm:px-6 sm:py-7 md:px-8 md:py-8 dark:bg-[#363a45]">
      <ProfileSummary profile={profile} />

      <TabHeader tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="relative mt-4 w-full min-w-0 overflow-hidden sm:mt-6">
        <div
          className={`w-full transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
            activeTab === "personal"
              ? "relative z-10 translate-y-0 opacity-100"
              : "pointer-events-none absolute inset-0 z-0 -translate-y-2 overflow-hidden opacity-0"
          }`}
          aria-hidden={activeTab !== "personal"}
        >
          <PersonalInformation profile={profile} />
        </div>
        <div
          className={`w-full transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
            activeTab === "work"
              ? "relative z-10 translate-y-0 opacity-100"
              : "pointer-events-none absolute inset-0 z-0 -translate-y-2 overflow-hidden opacity-0"
          }`}
          aria-hidden={activeTab !== "work"}
        >
          <WorkManagementSection profile={profile} />
        </div>
      </div>
    </div>
  );
}
