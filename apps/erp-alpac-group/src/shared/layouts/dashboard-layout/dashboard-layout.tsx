import { Outlet, useLocation } from "react-router-dom";
import Sidebarlayout from "@app/shared/layouts/dashboard-layout/components/Sidebar/Sidebar-layout";
import { TopNavbar } from "@app/shared/layouts/dashboard-layout/components/navbar/top-navbar";
import { sidebarData } from "@app/shared/layouts/dashboard-layout/data/data.route";
import useSessionStorageSidebar from "@app/shared/layouts/dashboard-layout/hooks/useSessionStorageSidebar";
import { AnimatePresence, motion } from "framer-motion";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { ModuleEnum } from "@app/core/enums/module.enum";
import { Modal } from "@alpac/design-system";
import { useEffect, useState } from "react";
import { CookieStorageAdapter } from "@app/core/adapters/cookie-storage-adapter";
import { useAuth } from "@app/modules/auth/ui/hooks/useAuth";

export const DashboardLayout = ({}) => {
  const [showModal, setShowModal] = useState(false);
  const [isLogout, setLogout] = useState(false);
  const { moduleCode, role } = useUserStore();
  const { isOpenSidebar, setIsOpenSidebar } = useSessionStorageSidebar();
  const { startProcessToCloseSession } = useAuth();
  const location = useLocation();

  // mapeas la secciones = []
  const registry = sidebarData.navigationRegistry;
  const authorizedRoles = registry[moduleCode as keyof typeof registry] ?? [];
  const publicItems = registry[ModuleEnum.PUBLIC] ?? [];
  const moduleItems =
    authorizedRoles[role as keyof typeof authorizedRoles] ?? [];

  const authorizedItems = [...moduleItems, ...publicItems];

  const isAuthorizedPath = authorizedItems.some((item) => {
    return location.pathname.includes(item.path);
  });

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

  return (
    <motion.div
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
        <main className="flex-1 overflow-y-auto p-5 md:p-7.5 relative ">
          <AnimatePresence mode="wait">
            {isAuthorizedPath && <Outlet key={location.pathname} />}
          </AnimatePresence>
          {!isAuthorizedPath && (
            <Modal
              isOpen={showModal}
              variant="warning"
              title="Acceso denegado"
              description="No tienes permiso para acceder a esta ruta"
              onClose={() => {
                setShowModal(false);
              }}
            />
          )}
        </main>
      </div>
    </motion.div>
  );
};
