import { Navigate, Outlet, useParams } from "react-router-dom";
import { CookieStorageAdapter } from "@app/core/adapters/cookie-storage-adapter";
import { SyncAuthenticatedCompanyDocument } from "@app/shared/components/sync-authenticated-company-document/sync-authenticated-company-document";
import { PushNotificationsRegistrar } from "@app/shared/components/push-notifications-registrar/push-notifications-registrar";

export const AuthGuard = () => {  const { alias_company } = useParams();

  const storedAlias = CookieStorageAdapter.getCompanyAlias();

  const isAuth = CookieStorageAdapter.hasSession();

  if (!isAuth) {
    return <Navigate to="/auth" replace />;
  }

  if (alias_company && alias_company !== storedAlias) {
    return <Navigate to={`/${storedAlias}/dashboard`} replace />;
  }

  return (
    <>
      <SyncAuthenticatedCompanyDocument />
      <PushNotificationsRegistrar />
      <Outlet />
    </>
  );
};
