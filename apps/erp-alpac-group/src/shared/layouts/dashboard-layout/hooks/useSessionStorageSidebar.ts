import { useEffect, useState } from "react";
const SIDEBAR_OPEN_KEY = "erp-dashboard-sidebar-open";
export default function useSessionStorageSidebar() {
  const [isOpenSidebar, setIsOpenSidebar] = useState(readStoredSidebarOpen);
  useEffect(() => {
    window.sessionStorage.setItem(SIDEBAR_OPEN_KEY, String(isOpenSidebar));
  }, [isOpenSidebar]);
  return { isOpenSidebar, setIsOpenSidebar };
}
function readStoredSidebarOpen(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(SIDEBAR_OPEN_KEY) === "true";
}
