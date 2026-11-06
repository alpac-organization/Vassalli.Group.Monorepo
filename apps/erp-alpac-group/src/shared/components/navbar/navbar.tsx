import { Bell, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@app/shared/hooks/useNotifications";
import { CookieStorageAdapter } from "@app/core/adapters/cookie-storage-adapter";
import { useNotificationSidebarStore } from "@app/shared/stores/useNotificationSidebarStore";
import { NotificationPermissionBanner } from "../notification/notification-banner/notification-banner";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { UserMenu, type UserMenuItem } from "@alpac/design-system";

import type { NavbarProps } from "./navbar.types";

export const Navbar = function ({ user_name, email, urlImage, onLogout, isSettingPage }: NavbarProps) {

   const navigate = useNavigate();
   const { costCenterName } = useUserStore();

   const { openNotifications } = useNotificationSidebarStore();
   const { permissionGranted, requestPermission, isLoading } = useNotification();

   const handleSettingsClick = () => {
      const alias = CookieStorageAdapter.getCompanyAlias();
      if (!alias) return;
      navigate(`/${alias}/setting`, { replace: true });
   };

   const menuItems: UserMenuItem[] = [
      {
         id: "settings",
         label: "Configuración",
         icon: Settings,
         onClick: handleSettingsClick,
         disabled: true,
         badge: "Próximamente",
         hidden: isSettingPage,
      },
      {
         id: "logout",
         label: "Cerrar sesión",
         icon: LogOut,
         onClick: onLogout,
         variant: "danger",
      },
   ];

   return (
      <>
         <header className="sticky top-0 z-30 border-b border-white/10 bg-[#272b34]/95 backdrop-blur supports-[backdrop-filter]:bg-[#272b34]/85">
            <nav className="mx-auto flex h-16 max-w-330 items-center justify-between px-4 md:h-24">

               {/* Logo */}
               <div className="flex min-w-0 shrink items-center">
                  <img className="h-10 max-w-40 object-contain md:h-16 md:max-w-none" src={urlImage} alt="logo" />
               </div>

               {/* Acciones */}
               <div className="flex shrink-0 items-center gap-2 md:gap-3">
                  <button
                     type="button"
                     onClick={openNotifications}
                     aria-label="Abrir notificaciones"
                     className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#F3F3F3] transition-colors hover:border-alpac-primary-500 hover:bg-alpac-primary-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#286fe0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#272b34]"
                  >
                     <Bell size={18} />
                  </button>

                  <UserMenu
                     userName={user_name}
                     email={email}
                     costCenterName={costCenterName}
                     items={menuItems}
                  />
               </div>
            </nav>
         </header>

         <NotificationPermissionBanner
            permissionGranted={permissionGranted}
            requestPermission={requestPermission}
            isLoading={isLoading}
         />
      </>
   );
};