import { Outlet } from "react-router-dom";
import { CopyRight } from "@app/shared/components/copy-right/copy-right";
import { useInactivityGuard } from "@app/shared/hooks/useInactivityGuard";
import { AnimatePresence } from "framer-motion";

export const ContainerCopyright = () => {

   useInactivityGuard();

   return (
      <div className="flex flex-col min-h-screen w-full">
         <main className="grow flex flex-col w-full">
            <AnimatePresence mode="wait">
               <Outlet />
            </AnimatePresence>
         </main>

         <footer className="w-full py-4 block mt-auto border-t border-t-slate-600">
            <div className="container mx-auto px-4 text-center">
               <CopyRight />
            </div>
         </footer>
      </div>
   );
};