import { useEffect } from "react";
import { initPushNotifications } from "@app/shared/hooks/usePushNotifications";

/**
 * Se monta dentro del AuthGuard: cuando existe una sesion activa,
 * registra (o refresca) el token push del dispositivo contra el backend.
 */
export const PushNotificationsRegistrar = () => {
  useEffect(() => {
    void initPushNotifications();
  }, []);

  return null;
};
