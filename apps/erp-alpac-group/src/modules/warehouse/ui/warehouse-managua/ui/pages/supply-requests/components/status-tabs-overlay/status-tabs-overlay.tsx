import type { StatusTabsOverlayProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/supply-requests/components/status-tabs-overlay/types/status-tabs-overlay.types";

export function StatusTabsOverlay({ tabs, activeTab, onChange }: StatusTabsOverlayProps) {
  return (
    <div className="pointer-events-none absolute left-0 right-0 top-0 hidden h-[4.5rem] items-center justify-center overflow-hidden md:flex">
      <div className="pointer-events-auto flex items-center gap-1">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className="min-h-0 shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors text-slate-300 hover:text-white"
              style={{ borderColor: active ? tab.color : "transparent" }}
            >
              <span
                className="rounded px-2 py-1"
                style={{ backgroundColor: active ? `${tab.color}22` : "transparent" }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}