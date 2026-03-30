import { useState } from "react";
import { TabHeader, type TabOption } from "@alpac/design-system";
import type { TabId } from "@app/modules/payroll/ui/pages/collaborator-profile/types/tabs.type";
import { PersonalInformation } from "@app/modules/payroll/ui/pages/collaborator-profile/components/Personal-info";
import { ProfileSummary } from "@app/modules/payroll/ui/pages/collaborator-profile/components/Profile-summary";
import { WorkManagementSection } from "@app/modules/payroll/ui/pages/collaborator-profile/components/Work-info";

export function CollaboratorProfilePage() {
  const [activeTab, setActiveTab] = useState<TabId>("personal");

  const TABS: TabOption<TabId>[] = [
    { id: "personal", label: "Información Personal" },
    { id: "work", label: "Gestiones de Trabajo" },
  ];

  return (
    <div className="dark w-full max-w-full min-h-0 flex flex-col font-sans px-4 py-5 text-slate-100 sm:px-6 sm:py-7 md:px-8 md:py-8 dark:bg-[#363a45]">
      <ProfileSummary />

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
