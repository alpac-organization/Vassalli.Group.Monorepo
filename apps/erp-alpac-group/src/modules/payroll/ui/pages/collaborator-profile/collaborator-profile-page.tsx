import { Loader } from "@app/shared/components/loaders/loader";
import { useState, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Banner, TabHeader } from "@alpac/design-system";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { getErrorMessage } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/get-error-message";
import { useCollaborators } from "../../hooks/useCollaborators";

//Componentes seccionales del perfil del colaborador
import { ProfileSummary } from "./components/profile-summary/profile-summary";
import { PersonalInformation } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/personal-information";
import { WorkManagementSection } from "@app/modules/payroll/ui/pages/collaborator-profile/components/working-information/Work-info";
import type { TabId } from "@app/modules/payroll/ui/pages/collaborator-profile/types/tabs.type";
import type { TabOption } from "@alpac/design-system";
import type { CollaboratorProfileLocationState } from "@app/modules/payroll/ui/pages/collaborator-profile/types/collaborator-profile-navigation.types";
import { WorkManagementSection } from "./components/Work-info";

export function CollaboratorProfilePage() {
  //Tabs De navegación
  const [activeTab, setActiveTab] = useState<TabId>("Personal");

  const { identification_number } = useParams();
  const { companyId, moduleCode, identificationNumber } = useUserStore();

  const location = useLocation();
  const state = location.state as CollaboratorProfileLocationState | undefined;

  const targetIdentification = (
    state?.identification_number ??
    identification_number ??
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

  const { GetProfileDetails } = useCollaborators({
    ColllaboratorDetailsPayload: {
      ...payload,
      QueryEnabled: queryEnabled,
    },
  });

  const {
    data: CollaboratorDetails,
    isPending,
    isError,
    error,
  } = GetProfileDetails;

  //Definición de las pestañas de navegación para el perfil del colaborador
  const TABS: TabOption<TabId>[] = [
    { id: "Personal", label: "Información Personal" },
    { id: "Working", label: "Información de Trabajo" },
  ];

  if (!targetIdentification) {
    return (
      <Banner
        variant="warning"
        title="Número de identificación no proporcionado"
        description="No se ha proporcionado un número de identificación para el colaborador. Por favor, regresa al panel de inicio y selecciona un colaborador para ver su perfil."
      />
    );
  }

  if (!companyId?.trim() || !moduleCode?.trim()) {
    return (
      <Banner
        variant="error"
        title="Información de contexto insuficiente"
        description="No se ha proporcionado la información de contexto necesaria (ID de empresa o código de módulo) para cargar el perfil del colaborador. Por favor, regresa al panel de inicio y selecciona un colaborador para ver su perfil."
      />
    );
  }

  if (isPending) {
    return <Loader title="Cargando perfil del colaborador..." />;
  }

  if (isError) {
    return (
      <Banner
        variant="error"
        title="Error al cargar el perfil"
        description={getErrorMessage(error)}
      />
    );
  }

  return (
    <div className="dark w-full max-w-full min-h-0 flex flex-col font-sans text-slate-100 dark:bg-[#363a45]">
      <ProfileSummary profile={CollaboratorDetails} />

      <TabHeader tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="relative w-full min-w-0 overflow-hidden sm:mt-6">
        <div
          className={`w-full transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
            activeTab === "Personal"
              ? "relative z-10 translate-y-0 opacity-100"
              : "pointer-events-none absolute inset-0 z-0 -translate-y-2 overflow-hidden opacity-0"
          }`}
          aria-hidden={activeTab !== "Personal"}
        >
          <PersonalInformation profile={CollaboratorDetails} />
        </div>

        <div
          className={`w-full transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
            activeTab === "Working"
              ? "relative z-10 translate-y-0 opacity-100"
              : "pointer-events-none absolute inset-0 z-0 -translate-y-2 overflow-hidden opacity-0"
          }`}
          aria-hidden={activeTab !== "Working"}
        >
          <WorkManagementSection profile={CollaboratorDetails} />
        </div>
      </div>
    </div>
  );
				<div
					className={`w-full transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
						activeTab === "Working"
						? "relative z-10 translate-y-0 opacity-100"
						: "pointer-events-none absolute inset-0 z-0 -translate-y-2 overflow-hidden opacity-0"
					}`}
					aria-hidden={activeTab !== "Working"}
				>
					<WorkManagementSection 
                  profile={CollaboratorDetails} 
               />
				</div>
			</div>
		</div>
	);
}
