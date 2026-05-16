import { Button } from "@alpac/design-system";
import { ChevronDown, LogOut, User, ArrowLeftRight } from "lucide-react";
import { useState } from "react";

interface TopNavbarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onLogout: () => void;
  isLoadingLogout: boolean;
}

export const TopNavbar = ({
  isOpen,
  setIsOpen,
  onLogout,
  isLoadingLogout,
}: TopNavbarProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="h-16 dark:bg-[#272b34] border-b border-neutral-700 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 relative">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 cursor-pointer hover:bg-neutral-800 text-white rounded-lg transition-colors "
        >
          <ArrowLeftRight />
        </button>
        {/* De momento este hola no tiene relevancia */}
      </div>

      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 hover:bg-[#1E1E2D] p-2 rounded-lg transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-[#2962ff] text-white flex items-center justify-center">
            <User size={16} />
          </div>
          <span className="text-sm font-medium hidden sm:block">Mi cuenta</span>
          <ChevronDown
            size={16}
            className={`text-neutral-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        <div
          className={`absolute right-0 mt-2 w-48 bg-[#1E1E2D] border border-neutral-700 rounded-lg shadow-xl py-1 z-50 transform origin-top-right transition-all duration-200 ease-out
            ${dropdownOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}
          `}
        >
          <Button
            onClick={onLogout}
            label="Cerrar Sesión"
            size="medium"
            icon={<LogOut size={16} />}
            isLoading={isLoadingLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm bg-transparent! text-black! dark:text-red-400! hover:bg-neutral-800! transition-colors"
          />
        </div>
      </div>
    </header>
  );
};
