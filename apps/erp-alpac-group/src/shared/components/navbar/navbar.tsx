import { LogOut } from "lucide-react";

export const Navbar = function ({ user_name, email, urlImage, onLogout }: { user_name: string, email: string, urlImage: string, onLogout: () => {} }) {
   return (
      <nav className="bg-[#272b34] h-25 border-b border-slate-600">
         <div className="max-w-330 flex h-full justify-between m-auto">
            <div>
               <img className="h-full p-3" src={urlImage} alt="logo alpac" />
            </div>

            <div className="flex items-center gap-6 pr-3">
               <div className="text-right flex flex-col items-end mr-2">
                  <span className="text-white font-medium text-sm">{user_name}</span>
                  <span className="text-[#89909E] text-xs">{email}</span>
               </div>

               <button
                  onClick={() => onLogout()}
                  className="group flex items-center gap-2 px-5 py-2.5 
                              bg-transparent border border-[#3E4552] rounded-full
                              text-[#89909E] font-medium text-sm
                              hover:bg-alpac-secondary-500 hover:border-alpac-secondary-700 hover:text-white 
                              transition-all duration-300 ease-out shadow-sm
                              focus:outline-none focus:ring-2 focus:ring-[#EF4444] focus:ring-offset-2 focus:ring-offset-[#1A1D24]"
               >
                  <LogOut size={18} className="text-[#89909E] group-hover:text-white transition-colors" />
                  <span>Cerrar Sesión</span>
               </button>
            </div>
         </div>
      </nav>
   )
}