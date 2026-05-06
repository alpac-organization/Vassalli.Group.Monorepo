import { useState, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Banner, TabHeader, type TabOption } from "@alpac/design-system";

import { ProfileSummary } from "@app/modules/payroll/ui/pages/collaborator-profile/components/profile-summary/profile-summary";
import type { TabId } from "@app/modules/payroll/ui/pages/collaborator-profile/types/tabs.type";
import { PersonalInformation } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/personal-information";
import { useCollaborators } from "@app/modules/payroll/ui/hooks/collaborator/useCollaborators";
import { WorkManagementSection } from "@app/modules/payroll/ui/pages/collaborator-profile/components/working-information/Work-info";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Loader } from "@app/shared/components/loaders/loader";
import { getErrorMessage } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/get-error-message";
import type { GeneratedDocumentType } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/generated-document.request";
import { GenerateDocumentsSection } from "@app/modules/payroll/ui/pages/collaborator-profile/components/generate-documents/generate-documents-section";
import { VacationManagementSection } from "./components/vacation-management/vacation-management-section";

export function CollaboratorProfilePage() {
   const [activeTab, setActiveTab] = useState<TabId>("Personal");

   const { identification_number } = useParams();
   const { companyId, moduleCode, identificationNumber } = useUserStore();

   const location = useLocation();
   const state = location.state;

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

   const { GetProfileDetails, GenerateCollaboratorProfileDocument } =
      useCollaborators({
         CollaboratorDetailsPayload: {
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

   const handleGenerateProfileDocument = (
      documentType: GeneratedDocumentType,
   ) => {
      if (!companyId || !moduleCode || !targetIdentification) return;
      GenerateCollaboratorProfileDocument.mutate({
         company_id: companyId,
         module_code: moduleCode,
         identification_number: targetIdentification,
         document_type: documentType,
      });
   };

   //Definición de las pestañas de navegación para el perfil del colaborador
   const TABS: TabOption<TabId>[] = [
      { id: "Personal", label: "Información Personal" },
      { id: "Working", label: "Información de Trabajo" },
      //  { id: "Generar-documentos", label: "Generar documentos" },
      { id: "vacation-management", label: "Gestión de Vacaciones" },
      { id: "subsidy-management", label: "Gestión de Subsidio" },
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
               className={`w-full transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${activeTab === "Personal"
                  ? "relative z-10 translate-y-0 opacity-100"
                  : "pointer-events-none absolute inset-0 z-0 -translate-y-2 overflow-hidden opacity-0"
                  }`}
               aria-hidden={activeTab !== "Personal"}
            >
               <PersonalInformation profile={CollaboratorDetails} />
            </div>

            <div
               className={`w-full transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${activeTab === "Working"
                  ? "relative z-10 translate-y-0 opacity-100"
                  : "pointer-events-none absolute inset-0 z-0 -translate-y-2 overflow-hidden opacity-0"
                  }`}
               aria-hidden={activeTab !== "Working"}
            >
               <WorkManagementSection profile={CollaboratorDetails} />
            </div>

            <div
               className={`w-full transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${activeTab === "Generar-documentos"
                  ? "relative z-10 translate-y-0 opacity-100"
                  : "pointer-events-none absolute inset-0 z-0 -translate-y-2 overflow-hidden opacity-0"
                  }`}
               aria-hidden={activeTab !== "Generar-documentos"}
            >
               <GenerateDocumentsSection
                  onGenerateDocument={handleGenerateProfileDocument}
                  isGenerating={GenerateCollaboratorProfileDocument.isPending}
                  isSuccess={GenerateCollaboratorProfileDocument.isSuccess}
                  isError={GenerateCollaboratorProfileDocument.isError}
                  error={GenerateCollaboratorProfileDocument.error}
               />
            </div>

            <div
               className={`w-full transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${activeTab === "vacation-management"
                  ? "relative z-10 translate-y-0 opacity-100"
                  : "pointer-events-none absolute inset-0 z-0 -translate-y-2 overflow-hidden opacity-0"
                  }`}
               aria-hidden={activeTab !== "vacation-management"}
            >
               <VacationManagementSection profile={CollaboratorDetails} />
            </div>

            {/*             <div
               className={`w-full transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${activeTab === "subsidy-management"
                  ? "relative z-10 translate-y-0 opacity-100"
                  : "pointer-events-none absolute inset-0 z-0 -translate-y-2 overflow-hidden opacity-0"
                  }`}
               aria-hidden={activeTab !== "subsidy-management"}
            >
               <SubsidyManagementSection profile={CollaboratorDetails} />
            </div> */}

         </div>
      </div>
   );
}
