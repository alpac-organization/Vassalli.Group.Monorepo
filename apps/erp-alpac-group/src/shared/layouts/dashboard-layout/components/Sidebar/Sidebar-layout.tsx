import { LayoutDashboard, X } from "lucide-react";
import type { SidebarConfig } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";
import { SidebarItem } from "@app/shared/layouts/dashboard-layout/components/Sidebar/SidebarItem";

export default function Sidebarlayout({
  logoUrl,
  nameCompany,
  items,
  isOpen,
  setIsOpen,
}: SidebarConfig) {
  const mainItems = items.filter((item) => !item.isFooter);
  const footerItems = items.filter((item) => item.isFooter);

  return (
    <aside
      className={`dark:bg-[#272b34] border-r border-neutral-700 flex flex-col transition-all duration-300 ease-in-out z-50 h-screen shrink-0 fixed md:relative top-0 left-0
        ${isOpen ? "translate-x-0 w-full md:w-64" : "-translate-x-full md:translate-x-0 md:w-20"}
      `}
    >
      <header className="shrink-0 w-full h-16 border-b border-neutral-700 px-5 flex items-center">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center overflow-hidden min-w-0">
            <img
              src={logoUrl}
              alt={nameCompany}
              className="h-8 w-8 rounded-lg shrink-0"
            />
            <span
              className={`ml-3 text-sm font-bold text-white whitespace-nowrap transition-all duration-300 ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                }`}
            >
              {nameCompany}
            </span>
          </div>

          {isOpen && (
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="md:hidden shrink-0 p-2 hover:text-white rounded-lg cursor-pointer hover:bg-neutral-800"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </header>

      {/* <div className="scrollbar-dashboard flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4 pt-5 pb-4"> */}
      <div className="scrollbar-dashboard flex min-h-0 flex-1 flex-col py-5 overflow-y-auto">
        <SidebarItem
          item={{
            icon: LayoutDashboard,
            path: "dashboard",
            label: "Dashboard",
            isFooter: false,
            id: "0"            
          }}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
          
        {mainItems.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        ))}
      </div>

      {footerItems.length > 0 && (
        <footer className="shrink-0 border-t border-neutral-700 px-3 py-3 space-y-2">
          {footerItems.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          ))}
        </footer>
      )}
    </aside>
  );
}
