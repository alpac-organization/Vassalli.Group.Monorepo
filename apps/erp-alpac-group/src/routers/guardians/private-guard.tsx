import { Navigate, Outlet, useParams } from "react-router-dom";
import { CookieStorageAdapter } from "@app/core/adapters/cookie-storage-adapter";

export const AuthGuard = () => {
   const { alias_company } = useParams();

   const storedAlias = CookieStorageAdapter.getCompanyAlias();

   const isAuth = CookieStorageAdapter.hasSession();

   if (!isAuth) {
      return <Navigate to="/auth" replace />;
   }

   if (alias_company && alias_company !== storedAlias) {
      return <Navigate to={`/${storedAlias}/dashboard`} replace />;
   }

   return <Outlet />;
};