import type { TabHeaderProps } from "@app/modules/payroll/ui/pages/collaborator-profile/types/tabs.type";
export const TabHeader = <T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: TabHeaderProps<T>) => {
  return (
    <div className="flex flex-wrap gap-8 w-full max-w-full mb-8 border-b border-slate-600/40">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`pb-3 -mb-px text-sm font-medium border-b-2 transition-colors duration-200 ${
            activeTab === tab.id
              ? "border-cyan-500 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
