import { Navigate, Outlet } from "react-router-dom";
import { CookieStorageAdapter } from "@app/core/adapters/cookie-storage-adapter";

export const PublicGuard = () => {
   const isAuth = CookieStorageAdapter.hasSession();
   return isAuth ? <Navigate to="/dashboard" replace /> : <Outlet />;
};