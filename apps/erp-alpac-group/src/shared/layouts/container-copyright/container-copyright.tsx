import { Outlet } from "react-router-dom";
import { CopyRight } from "@app/shared/components/copy-right/copy-right";

export const ContainerCopyright = () => {
   return (
      <div className="flex flex-col flex-1 w-full">
         
         <main className="flex-1 flex flex-col w-full">
            <Outlet />
         </main>

         <footer className="w-full py-4 hidden md:block  ">
            <div className="container mx-auto px-4">
               <CopyRight />
            </div>
         </footer>
      </div>
   );
};