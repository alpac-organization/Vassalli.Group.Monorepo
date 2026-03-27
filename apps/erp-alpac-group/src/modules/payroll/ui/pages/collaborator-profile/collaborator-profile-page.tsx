import { useState } from "react";
import type {
  TabId,
  TabOption,
} from "@app/modules/payroll/ui/pages/collaborator-profile/types/tabs.type";
import { TabHeader } from "@app/modules/payroll/ui/pages/collaborator-profile/components/Tabs-header";
import { PersonalInformation } from "@app/modules/payroll/ui/pages/collaborator-profile/components/Personal-info";
import { WorkManagementSection } from "@app/modules/payroll/ui/pages/collaborator-profile/components/Work-info";

export default function CollaboratorProfilePage() {
  const [activeTab, setActiveTab] = useState<TabId>("personal");

  const TABS: TabOption<TabId>[] = [
    { id: "personal", label: "Información Personal" },
    { id: "work", label: "Gestiones de Trabajo" },
  ];

  return (
    <div className="w-full h-full flex flex-col font-sans p-6 sm:p-8">
      <div className="mb-8 border-b dark:border-white/10 border-slate-200 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold dark:text-white text-slate-900 mb-2">
          Tu Perfil
        </h1>
        <p className="text-sm md:text-base dark:text-slate-400 text-slate-500">
          Gestiona tu información personal y verifica tus datos laborales.
        </p>
      </div>

      <TabHeader tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="relative grid mt-6 w-full">
        <div
          className={`col-start-1 row-start-1 w-full transition-all duration-500 ease-in-out transform ${
            activeTab === "personal"
              ? "opacity-100 translate-y-0 z-10 pointer-events-auto"
              : "opacity-0 translate-y-4 z-0 pointer-events-none"
          }`}
        >
          <PersonalInformation />
        </div>

        <div
          className={`col-start-1 row-start-1 w-full transition-all duration-500 ease-in-out transform ${
            activeTab === "work"
              ? "opacity-100 translate-y-0 z-10 pointer-events-auto"
              : "opacity-0 translate-y-4 z-0 pointer-events-none"
          }`}
        >
          <WorkManagementSection />
        </div>
      </div>
    </div>
  );
}
