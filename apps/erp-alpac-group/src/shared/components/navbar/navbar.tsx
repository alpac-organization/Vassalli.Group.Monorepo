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

                  {/*User name*/}
                  <span className="text-white font-medium text-sm">{user_name}</span>

                  {/*User email*/}
                  <span className="text-[#89909E] text-xs">{email}</span>
               </div>

               {/* Logout button */}
               <button
                  onClick={() => onLogout()}
                  className="group flex items-center justify-center gap-2 h-12 w-20 md:w-55 px-3 md:px-5 
                              bg-transparent border border-[#3E4552] rounded-full
                              text-[#89909E] font-medium text-sm
                              hover:bg-alpac-secondary-500 
                              hover:border-alpac-secondary-700 
                              hover:text-white 
                              transition-all 
                              duration-300 
                              ease-out 
                              shadow-sm
                              focus:outline-none 
                              focus:ring-2 
                              focus:ring-[#EF4444] 
                              focus:ring-offset-2 
                              focus:ring-offset-[#1A1D24]"
               >
                  <LogOut className="text-[#89909E] group-hover:text-white transition-colors" size={18} />
                  <span className="hidden md:block">Cerrar Sesión</span>
               </button>
            </div>
         </div>
      </nav>
   )
}