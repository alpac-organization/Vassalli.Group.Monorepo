import type { TabHeaderProps } from "@app/modules/payroll/ui/pages/collaborator-profile/types/tabs.type";
export const TabHeader = <T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: TabHeaderProps<T>) => {
  return (
    <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-[#272b34]  rounded-xl w-max max-w-full mb-8 border border-transparent dark:border-white/5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-2.5 text-sm font-medium rounded-[10px] transition-all duration-300 ${
            activeTab === tab.id
              ? "bg-white text-blue-600 shadow-sm dark:bg-blue-600 dark:text-white" // Intuitivo: Azul vibrante para el activo
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
