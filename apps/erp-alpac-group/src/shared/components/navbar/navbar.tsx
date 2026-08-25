import { ButtonRounded } from "@alpac/design-system";
import { Bell, LogOut, Settings } from "lucide-react";
import { useNotificationSidebarStore } from "@app/shared/stores/useNotificationSidebarStore";
import { useNavigate } from "react-router-dom";
import { CookieStorageAdapter } from "@app/core/adapters/cookie-storage-adapter";
import type { NavbarProps } from "./navbar.types";
import { useNotification } from "@app/shared/hooks/useNotifications";
import { NotificationPermissionBanner } from "../notification/notification-banner/notification-banner";

export const Navbar = function ({ user_name, email, urlImage, onLogout, isSettingPage }: NavbarProps) {

   const navigate = useNavigate();

   const { openNotifications } = useNotificationSidebarStore();
   const { permissionGranted, requestPermission, isLoading } = useNotification();

   const handleSettingsClick = () => {
      const alias = CookieStorageAdapter.getCompanyAlias();
      if (!alias) return;
      navigate(`/${alias}/setting`, { replace: true });
   };

   const settingsIcon = (
      <Settings
         className="text-[#F3F3F3] group-hover:text-white transition-colors max-md:text-black"
         size={18}
      />
   );

   return (
      <>
         <nav className="dark:bg-[#272b34] h-24 md:h-28 border-b border-slate-600 flex items-center px-4">
            <div className="container max-w-330 flex h-full justify-between items-center m-auto">

               {/* Logo area */}
               <div className="shrink-0 flex items-center">
                  <img className="h-18 md:h-20 object-contain" src={urlImage} alt="logo" />
               </div>

               {/*Right side actions*/}
               <div className="flex items-center gap-3 md:gap-4">

                  {/* User info */}
                  <div className="hidden md:flex flex-col text-right">
                     <span className="text-white font-medium text-sm">{user_name}</span>
                     <span className="text-[#89909E] text-xs">{email}</span>
                  </div>

                  <ButtonRounded
                     hasIcon
                     icon={LogOut}
                     label="Cerrar Sesión"
                     onClick={() => onLogout()}
                  />

                  <ButtonRounded
                     hasIcon
                     icon={Bell}
                     className="md:w-17! focus:ring-[#286fe0]! focus:ring-offset-[#1568ed]! hover:bg-alpac-primary-500! hover:border-alpac-primary-500!"
                     onClick={openNotifications}
                  />

                  {!isSettingPage && (
                     <ButtonRounded
                        hasIcon
                        icon={settingsIcon}
                        className="hidden md:flex md:w-17! focus:ring-[#286fe0]! focus:ring-offset-[#1568ed]! hover:bg-alpac-primary-500! hover:border-alpac-primary-500!"
                        onClick={handleSettingsClick}
                     />
                  )}
               </div>
            </div>
         </nav>

         <NotificationPermissionBanner
            permissionGranted={permissionGranted}
            requestPermission={requestPermission}
            isLoading={isLoading}
         />

         {!isSettingPage && (
            <div className="md:hidden fixed bottom-20 right-3 z-50">
               <ButtonRounded
                  hasIcon
                  icon={settingsIcon}
                  className="h-12! w-12! min-w-12! p-0! rounded-full! bg-white! text-black shadow-md focus:ring-[#286fe0]! focus:ring-offset-[#1568ed]! hover:bg-alpac-primary-500! hover:border-alpac-primary-500!"
                  onClick={handleSettingsClick}
               />
            </div>
         )}
      </>
   )
}