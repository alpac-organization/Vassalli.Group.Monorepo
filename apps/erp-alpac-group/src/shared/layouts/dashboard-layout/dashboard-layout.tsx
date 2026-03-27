import { Outlet, useLocation } from "react-router-dom";
import Sidebarlayout from "@app/shared/layouts/dashboard-layout/components/Sidebar/Sidebar-layout";
import { TopNavbar } from "@app/shared/layouts/dashboard-layout/components/navbar/top-navbar";
import { sidebarData } from "./data/data.route";
import useSessionStorageSidebar from "@app/shared/layouts/dashboard-layout/hooks/useSessionStorageSidebar";
import { AnimatePresence, motion } from "framer-motion";

export const DashboardLayout = () => {
  const { isOpenSidebar, setIsOpenSidebar } = useSessionStorageSidebar();
  const location = useLocation()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex h-screen text-white overflow-hidden">

      <Sidebarlayout
        setIsOpen={setIsOpenSidebar}
        isOpen={isOpenSidebar}
        logoUrl={sidebarData.logoUrl}
        nameCompany={sidebarData.nameCompany}
        items={sidebarData.items}
      />

      <div className="flex flex-col flex-1 w-full overflow-hidden transition-all duration-300">
        <TopNavbar isOpen={isOpenSidebar} setIsOpen={setIsOpenSidebar} />
        <main className="flex-1 overflow-y-auto p-[20px] md:p-[30px] relative ">

          <AnimatePresence mode="wait">
            <Outlet key={location.pathname} />
          </AnimatePresence>

        </main>
      </div>
    </motion.div>
  );
};
