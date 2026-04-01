import { Outlet, useLocation } from "react-router-dom";
import Sidebarlayout from "@app/shared/layouts/dashboard-layout/components/Sidebar/Sidebar-layout";
import { TopNavbar } from "@app/shared/layouts/dashboard-layout/components/navbar/top-navbar";
import { sidebarData } from "@app/shared/layouts/dashboard-layout/data/data.route";
import useSessionStorageSidebar from "@app/shared/layouts/dashboard-layout/hooks/useSessionStorageSidebar";
import { AnimatePresence, motion } from "framer-motion";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { ModuleEnum } from "@app/core/enums/module.enum";

export const DashboardLayout = ({}) => {
  const { moduleCode, userType } = useUserStore();
  const { isOpenSidebar, setIsOpenSidebar } = useSessionStorageSidebar();
  const location = useLocation();

  // mapeas la secciones = []
  const registry = sidebarData.navigationRegistry;
  const moduleItems = registry[moduleCode as keyof typeof registry] ?? [];
  const genericItems = registry[ModuleEnum.GENERIC] ?? [];

  const allAvailableItems = [...moduleItems, ...genericItems];

  const authorizedItems = allAvailableItems.filter((item) => {
    if (!("user_types" in item)) return false;
    return (item.user_types as string[]).includes(userType);
  });

  const isAuthorizedPath = authorizedItems.some((item) => {
    return location.pathname.includes(item.path);
  });

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
        <TopNavbar isOpen={isOpenSidebar} setIsOpen={setIsOpenSidebar} />
        <main className="flex-1 overflow-y-auto p-5 md:p-7.5 relative ">
          <AnimatePresence mode="wait">
            {isAuthorizedPath && <Outlet key={location.pathname} />}
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
};
