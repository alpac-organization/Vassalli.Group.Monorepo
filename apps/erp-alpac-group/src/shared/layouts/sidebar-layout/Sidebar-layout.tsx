import { useState } from "react";
import { Menu } from "lucide-react";
import type { SidebarProps } from "./sidebar.types";
export default function Sidebarlayout({ config }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-50 p-2.5 bg-[#1E1E2D] hover:bg-[#2A2A3D] text-white rounded-lg shadow-xl transition-all duration-300 border border-neutral-700 ${
          isOpen ? "top-4 left-[260px]" : "top-4 left-5"
        }`}
      >
        <Menu size={20} />
      </button>
      <aside
        className={`fixed top-0 h-full bg-[#151521] border-r border-neutral-700 flex flex-col transition-all duration-300 ease-in-out z-40 overflow-y-auto ${isOpen ? "w-64" : "w-20"} scrollbar-hide`}
      >
        <div>
          <img src={config.logoUrl} alt="w-8 h-8 rounded-lg" />
          <span
            className={`ml-3 text-sm font-bold text-white whitespace-nowrap transition-all duration-300 overflow-hidden ${
              isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
            }`}
          >
            {config.appName}
          </span>
        </div>
        <div></div>
      </aside>
    </>
  );
}
