import { NavLink } from "react-router-dom";
import type { SidebarItemsProps } from "../sidebar.types";
import SidebarTooltip from "./SidebarTooltip";

export const SidebarItem = ({ item, isOpen }: SidebarItemsProps) => {
  return (
    <div className="relative group">
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `w-full flex items-center p-3 rounded-xl transition-color duration-200 cursor-pointer ${isActive ? "text-blue bg-blue-500/10" : "text-neutral-400 hover:text-white hover:bg-neutral-800"}`
        }
      >
        <div
          className={`flex items-center justify-center ${isOpen ? "mr-3" : "w-full"}`}
        >
          <span className="w-5 h-5 bg-current opacity-70 mask-icon">
            LogoTipo
          </span>
          <span
            className={`font-medium text-sm whitespace-nowrap transition-all duration-300 overflow-hidden ${isOpen ? "opacity-100 w-full" : "opacity-0 w-0"}`}
          >
            {item.label}
          </span>
        </div>
      </NavLink>
      {!isOpen && <SidebarTooltip text={item.label} />}
    </div>
  );
};
