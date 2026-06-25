// src/components/react/FloatingButtonTheme.jsx
import { useTheme } from "../../hooks/useTheme"; 

export const FloatingButtonTheme = function() {
   const { isDark, toggleTheme } = useTheme();

   return (
      <button
         onClick={toggleTheme}
         type="button"
         aria-label="Cambiar tema de la aplicación"
         className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-neutral-200 bg-white/80 text-neutral-800 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-neutral-300 hover:bg-white hover:shadow-xl active:scale-95 dark:border-neutral-800/80 dark:bg-neutral-900/80 dark:text-neutral-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
      >
         <div className="relative h-6 w-6 flex items-center justify-center text-lg">
            {/* Icono de Sol (Se muestra en modo oscuro) */}
            <span 
               className={`absolute inset-0 transform transition-all duration-500 flex items-center justify-center ${
                  isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
               }`}
            >
               ☀️
            </span>

            {/* Icono de Luna (Se muestra en modo claro) */}
            <span 
               className={`absolute inset-0 transform transition-all duration-500 flex items-center justify-center ${
                  isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
               }`}
            >
               🌙
            </span>
         </div>
      </button>
   );
};