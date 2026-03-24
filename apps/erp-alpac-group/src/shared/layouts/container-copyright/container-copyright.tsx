import { Outlet } from "react-router-dom";
import { CopyRight } from "@app/shared/components/copy-right/copy-right";
import { useInactivityGuard } from "@app/shared/hooks/useInactivityGuard";

export const ContainerCopyright = () => {

   useInactivityGuard();

   return (
      <div className="flex flex-col min-h-screen w-full">
         <main className="grow flex flex-col w-full">
            <Outlet />
         </main>

         <footer className="w-full py-4 hidden md:block mt-auto">
            <div className="container mx-auto px-4 text-center">
               <CopyRight />
            </div>
         </footer>
      </div>
   );
};