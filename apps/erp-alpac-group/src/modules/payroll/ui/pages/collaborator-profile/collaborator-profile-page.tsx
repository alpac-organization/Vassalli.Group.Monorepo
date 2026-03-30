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
    <div className="dark w-full max-w-full flex flex-col font-sans p-6 sm:p-8 bg-[#373b44] text-slate-100 min-h-0">
      <div className="mb-8 border-b border-slate-600/40 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Tu Perfil
        </h1>
        <p className="text-sm md:text-base text-slate-400">
          Gestiona tu información personal y verifica tus datos laborales.
        </p>
      </div>

      <TabHeader tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="relative mt-6 w-full min-h-0 overflow-hidden">
        <div
          className={`w-full transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
            activeTab === "personal"
              ? "relative z-10 translate-y-0 opacity-100"
              : "pointer-events-none absolute inset-0 z-0 -translate-y-2 overflow-hidden opacity-0"
          }`}
          aria-hidden={activeTab !== "personal"}
        >
          <PersonalInformation />
        </div>

        <div
          className={`w-full transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
            activeTab === "work"
              ? "relative z-10 translate-y-0 opacity-100"
              : "pointer-events-none absolute inset-0 z-0 -translate-y-2 overflow-hidden opacity-0"
          }`}
          aria-hidden={activeTab !== "work"}
        >
          <WorkManagementSection />
        </div>
      </div>
    </div>
  );
}
