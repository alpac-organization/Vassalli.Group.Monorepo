import { useState } from "react";
import type { TabId } from "@app/modules/payroll/ui/pages/collaborator-profile/types/tabs.type";
import { PersonalInformation } from "@app/modules/payroll/ui/pages/collaborator-profile/components/Personal-info";
import { WorkManagementSection } from "@app/modules/payroll/ui/pages/collaborator-profile/components/Work-info";

export const ProfileCard = () => {
  const [activeTab, setActiveTab] = useState<TabId>("personal");
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 md:p-12 overflow-hidden">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Tu Perfil
          </h1>
          <p className="text-sm md:text-base text-slate-500">
            Gestiona tu información y preferencias de trabajo.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 rounded-xl w-max max-w-full mb-8">
          <button
            onClick={() => setActiveTab("personal")}
            className={`px-6 py-2.5 text-sm font-medium rounded-[10px] transition-all duration-300 ${
              activeTab === "personal"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
          >
            Información Personal
          </button>
          <button
            onClick={() => setActiveTab("work")}
            className={`px-6 py-2.5 text-sm font-medium rounded-[10px] transition-all duration-300 ${
              activeTab === "work"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
          >
            Gestiones de Trabajo
          </button>
        </div>

        <div className="relative w-full min-h-0 overflow-hidden">
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
    </div>
  );
};
