import { ButtonRounded } from "@alpac/design-system";
import { LogOut } from "lucide-react";

export const Navbar = function ({ user_name, email, urlImage, onLogout }: { user_name: string, email: string, urlImage: string, onLogout: () => {} }) {
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
                  icon={ LogOut }
                  label="Cerrar Sesión"
                  onClick={ () => onLogout() }
               />

            </div>
         </div>
      </nav>
   )
}