import { ButtonRounded } from "@alpac/design-system";
import { Bell, LogOut } from "lucide-react";
import { useNotificationSidebarStore } from "@app/shared/stores/useNotificationSidebarStore";

export const Navbar = function ({ user_name, email, urlImage, onLogout }: { user_name: string, email: string, urlImage: string, onLogout: () => {} }) {

   const { openNotifications } = useNotificationSidebarStore();

   return (
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

            </div>
         </div>
      </nav>
   )
}