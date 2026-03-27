import { useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import type { SidebarItemsProps } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";
import SidebarTooltip from "@app/shared/layouts/dashboard-layout/components/Sidebar/SidebarTooltip";

export const SidebarItem = ({ item, isOpen, setIsOpen }: SidebarItemsProps) => {
  const { alias_company } = useParams<{ alias_company: string }>();
  const Icon = item.icon;
  const itemRootRef = useRef<HTMLDivElement>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const dashboardHref =
    alias_company != null && alias_company !== ""
      ? `/${alias_company}/dashboard/${item.path}`
      : `/dashboard/${item.path}`;

  const handleClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={itemRootRef}
      className="relative group transition-all ease-in-out hover:bg-neutral-700/70"
      onMouseEnter={() => {
        if (!isOpen) setTooltipOpen(true);
      }}
      onMouseLeave={() => setTooltipOpen(false)}
    >
      <NavLink
        to={dashboardHref}
        end
        onClick={handleClick}
        className={({ isActive }) =>
          `
          relative flex items-center w-full overflow-hidden px-3 py-2.5
          text-sm font-medium leading-none
          transition-all duration-200 ease-in-out
          focus-visible:none no-underline! hover:hover:no-underline! focus:no-underline! focus-visible:focus-visible:no-underline!
          outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0
          ${isActive
            ? `
              bg-blue-500/12 text-blue-100
              `
            : `
              text-neutral-400
              bg-transparent
              hover:bg-neutral-700/50 hover:text-white
              `
          }
          `
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 top-1/2 h-9 w-[3px] -translate-y-1/2 rounded-full bg-linear-to-b from-sky-400 via-blue-500 to-blue-600"
              />
            )}

            <div
              className={`
            flex items-center justify-center shrink-0
            transition-all duration-200
            ${isOpen ? "mr-3" : "w-full"}
          `}
            >
              <Icon
                size="1.125em"
                className={`
              shrink-0 transition-colors duration-200
              ${isActive ? "text-sky-300" : "text-neutral-400 group-hover:text-white"}
            `}
                aria-hidden
              />
            </div>

            <span
              className={`
            whitespace-nowrap overflow-hidden
            transition-all duration-300
            ${isOpen ? "opacity-100 w-auto ml-1" : "opacity-0 w-0"}
            ${isActive ? "text-blue-50" : "text-neutral-300"}
          `}
            >
              {item.label}
            </span>
          </>
        )}
      </NavLink>

      {!isOpen && (
        <SidebarTooltip
          nameLink={item.label}
          open={tooltipOpen}
          anchorRef={itemRootRef}
        />
      )}
    </div>
  );
};
