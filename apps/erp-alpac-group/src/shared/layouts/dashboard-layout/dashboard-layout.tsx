import { Outlet } from "react-router-dom";
import Sidebarlayout from "@app/shared/layouts/dashboard-layout/components/Sidebar/Sidebar-layout";
import { TopNavbar } from "@app/shared/layouts/dashboard-layout/components/navbar/top-navbar";
import { sidebarData } from "./data/data.route";
import useSessionStorageSidebar from "@app/shared/layouts/dashboard-layout/hooks/useSessionStorageSidebar";

export const DashboardLayout = () => {
  const { isOpenSidebar, setIsOpenSidebar } = useSessionStorageSidebar();
  return (
    <div className="flex h-screen bg-[#0D0D14] text-white overflow-hidden">
      <Sidebarlayout
        setIsOpen={setIsOpenSidebar}
        isOpen={isOpenSidebar}
        logoUrl={sidebarData.logoUrl}
        nameCompany={sidebarData.nameCompany}
        items={sidebarData.items}
      />
      <div className="flex flex-col flex-1 w-full overflow-hidden transition-all duration-300">
        <TopNavbar isOpen={isOpenSidebar} setIsOpen={setIsOpenSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
