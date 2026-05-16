import { Navigate, Outlet } from "react-router-dom";
import { CookieStorageAdapter } from "@app/core/adapters/cookie-storage-adapter";

export const PublicGuard = () => {
   const isAuth = CookieStorageAdapter.hasSession();
   const alias = CookieStorageAdapter.getCompanyAlias();

   if (isAuth && alias) {
      return <Navigate to={`/${alias}/dashboard`} replace />;
   }

   return <Outlet />;
};