// src/components/react/FloatingButtonTheme.jsx
import { Button } from "@alpac/design-system";
import { useTheme } from "@hooks/useTheme";
import { MoonStar, SunIcon } from "lucide-react";

export const FloatingButtonTheme = function () {
   const { isDark, toggleTheme } = useTheme();

   return (

      <Button
         type="button"
         size="small"
         label=""
         icon={
            isDark ? <SunIcon size={18} /> : <MoonStar size={18} color="white" />
         }
         ariaLabel="Agregar Solicitud"
         className="min-h-12! min-w-12! rounded-full!
             bg-alpac-primary-500! 
             dark:bg-white! 
             text-black! 
             active:scale-100! 
             md:hover:brightness-110! 
             md:hover:shadow-2xl! 
             focus-visible:outline-none! 
             focus-visible:ring-2! 
             focus-visible:ring-alpac-primary-400! 
             focus-visible:ring-offset-2!
             ml-auto!
             dark:focus-visible:ring-offset-[#0f172a]!"
         onClick={toggleTheme}
      />
   );
};