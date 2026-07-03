import { Outlet, useLocation } from "react-router-dom";
import { TopNavbar } from "@app/shared/layouts/dashboard-layout/components/navbar/top-navbar";
import { sidebarData } from "@app/shared/layouts/dashboard-layout/data/data.route";
import { m, LazyMotion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Modal } from "@alpac/design-system";
import { useEffect, useRef, useState } from "react";
import { CookieStorageAdapter } from "@app/core/adapters/cookie-storage-adapter";
import { useAuth } from "@app/modules/auth/ui/hooks/useAuth";
import { useNavigate } from "react-router-dom";

import Sidebarlayout from "@app/shared/layouts/dashboard-layout/components/Sidebar/Sidebar-layout";
import useSessionStorageSidebar from "@app/shared/layouts/dashboard-layout/hooks/useSessionStorageSidebar";

import type { SidebarLink } from "./components/Sidebar/types/sidebar.types";

const loadFeatures = () => import("framer-motion").then((res) => res.domAnimation);

export const DashboardLayout = () => {
   const [showModal, setShowModal] = useState(false);
   const [isLogout, setLogout] = useState(false);
   const { moduleCode, role } = useUserStore();
   const { isOpenSidebar, setIsOpenSidebar } = useSessionStorageSidebar();
   const { startProcessToCloseSession } = useAuth();
   const location = useLocation();
   const navigate = useNavigate();
   const mainContentRef = useRef<HTMLElement | null>(null);

   // mapeas la secciones = []
   const registry = sidebarData.navigationRegistry;
   const authorizedModules = registry[moduleCode as keyof typeof registry] ?? [];

   const moduleItems =
      authorizedModules[role as keyof typeof authorizedModules] ?? [];

   const authorizedItems = [...moduleItems];

   const isAuthorizedPath = authorizedItems.some((item: SidebarLink) => {
      return location.pathname.includes(item.path);
   });

   console.log(moduleItems, authorizedItems, role)

   const handleLogout = async function () {
      try {
         setLogout(true);

         const companyId = useUserStore.getState().companyId ?? "";
         const refreshToken = CookieStorageAdapter.getRefreshToken() ?? "";

         await startProcessToCloseSession.mutateAsync({
            company_id: companyId,
            refresh_token: refreshToken,
         });
      } catch (error) {
         throw error;
      } finally {
         setLogout(false);
      }
   };

   useEffect(() => {
      if (!isAuthorizedPath) {
         setShowModal(true);
      }
   }, [isAuthorizedPath]);

   useEffect(() => {
      mainContentRef.current?.scrollTo({ top: 0, behavior: "auto" });
   }, [location.pathname]);

   return (
      <LazyMotion features={loadFeatures} strict>
         <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex h-screen text-white overflow-hidden"
         >
            <Sidebarlayout
               setIsOpen={setIsOpenSidebar}
               isOpen={isOpenSidebar}
               logoUrl={sidebarData.logoUrl}
               nameCompany={sidebarData.nameCompany}
               items={authorizedItems}
            />

            <div className="flex flex-col flex-1 w-full overflow-hidden transition-all duration-300">
               <TopNavbar
                  isOpen={isOpenSidebar}
                  setIsOpen={setIsOpenSidebar}
                  onLogout={handleLogout}
                  isLoadingLogout={isLogout && startProcessToCloseSession.isPending}
               />
               <main
                  ref={mainContentRef}
                  className="flex-1 overflow-y-auto p-5 md:p-7.5 relative "
               >
                  <AnimatePresence mode="wait">
                     {isAuthorizedPath && <Outlet />}
                  </AnimatePresence>
                  {!isAuthorizedPath && (
                     <Modal
                        isOpen={showModal}
                        variant="warning"
                        title="Acceso denegado"
                        description="No tienes permiso para acceder a esta ruta"
                        onClose={() => {
                           setShowModal(false);
                           navigate("/dashboard");
                        }}
                     />
                  )}
               </main>
            </div>
         </m.div>
      </LazyMotion>
   );
};
