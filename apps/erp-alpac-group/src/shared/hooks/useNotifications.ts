import { getToken, type Messaging } from 'firebase/messaging';
import { getMessagingInstance } from '@app/firebase-config';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNotificationConfig } from '@app/modules/dashboard/ui/hooks/useNotificationConfig';
import { useUserStore } from '../stores/useUserStore';
import { getDeviceName } from '@app/shared/utils/device-name.utils';

export type PermissionRequestOutcome = "granted" | "denied" | "no-prompt";

interface UseNotificationResult {
   permissionGranted: boolean | null;
   requestPermission: () => Promise<PermissionRequestOutcome>;
   isLoading: boolean;
   needsInstallOnIOS: boolean;
   isIOS: boolean;
   fcmToken: string | null;
}

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

const isIOSDevice = (): boolean => {
   return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

const isStandalone = (): boolean => {
   return (
      window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true
   );
};

export const getFirebaseCloudMessagingToken = async (messaging: Messaging) => {
   const registration = await navigator.serviceWorker.ready;

   return await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
   });
}

export const useNotification = (): UseNotificationResult => {

   const { RegisterPushToken } = useNotificationConfig();
   const companyId = useUserStore((state) => state.companyId);

   const [isIOS] = useState(isIOSDevice());
   const [isLoading, setIsLoading] = useState(false);
   const [needsInstallOnIOS, setNeedsInstallOnIOS] = useState(false);
   const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
   const [fcmToken, setFcmToken] = useState<string | null>(null);

   const hasRegisteredToken = useRef(false);
   const { mutateAsync: registerPushToken } = RegisterPushToken;

   useEffect(() => {
      if (isIOS && !isStandalone()) {
         setNeedsInstallOnIOS(true);
         return;
      }

      const syncPermission = () => {
         setPermissionGranted(Notification.permission === 'granted');
      }

      syncPermission();

      let permissionStatus: PermissionStatus | null = null;

      navigator.permissions
         .query({ name: "notifications" })
         .then((status: PermissionStatus) => {
            permissionStatus = status;
            status.onchange = syncPermission;
         });

      const handleVisibilityChange = () => {
         if (document.visibilityState === 'visible') syncPermission();
      }

      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
         if (permissionStatus) permissionStatus.onchange = null;
         document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
   }, [isIOS]);

   // Obtiene el token FCM y lo envía al backend en AWS
   const getAndSendToken = useCallback(async (): Promise<boolean> => {
      try {
         const messaging = await getMessagingInstance();

         if (!messaging) {
            console.warn('Firebase Messaging no está soportado en este navegador.');
            return false;
         }

         if (!VAPID_KEY) {
            console.error('Falta VITE_FIREBASE_VAPID_KEY en las variables de entorno.');
            return false;
         }

         const token = await getFirebaseCloudMessagingToken(messaging);

         if (!token) {
            console.warn('No se pudo generar el token FCM.');
            return false;
         }

         setFcmToken(token);

         await registerPushToken({
            company_id: companyId, token,
            device_name: getDeviceName()
         });

         return true;
      }
      catch (error) {
         console.error('Error obteniendo/enviando el token FCM:', error);
         return false;
      }

   }, [registerPushToken, companyId]);

   useEffect(() => {
      if (isIOS && !isStandalone()) return;
      if (!companyId) return;
      if (hasRegisteredToken.current) return;
      if (Notification.permission !== "granted") return;

      void getAndSendToken().then(() => {
         hasRegisteredToken.current = true;
      });
   }, [companyId]);

   // Indica si el navegador puede levantar el popup nativo de permisos.
   // En iOS el popup nativo solo aparece si el PWA está instalado (standalone).
   const canAskNative = useCallback((): boolean => {
      if (typeof Notification === "undefined") return false;
      if (isIOS && !isStandalone()) return false;
      return true;
   }, [isIOS]);

   const requestPermission = useCallback(async (): Promise<PermissionRequestOutcome> => {

      if (!canAskNative()) {
         if (isIOS && !isStandalone()) setNeedsInstallOnIOS(true);
         return "no-prompt";
      }

      const currentPermission = Notification.permission;

      if (currentPermission === "granted") {
         setPermissionGranted(true);
         await getAndSendToken();
         return "granted";
      }

      if (currentPermission === "denied") {
         setPermissionGranted(false);
         return "denied";
      }

      try {
         setIsLoading(true);
         const result = await Notification.requestPermission();
         const granted = result === "granted";
         setPermissionGranted(granted);

         if (granted) {
            await getAndSendToken();
            return "granted";
         }

         // 'denied' => el usuario (o el navegador) lo bloqueó, no se repregunta.
         // 'default' => el popup no se levantó o se descartó: no se obtuvo permiso.
         return result === "denied" ? "denied" : "no-prompt";
      }
      catch (error) {
         console.error('Error solicitando permiso de notificaciones:', error);
         setPermissionGranted(false);
         return "no-prompt";
      }
      finally {
         setIsLoading(false);
      }
   }, [canAskNative, isIOS, getAndSendToken]);

   return {
      permissionGranted,
      requestPermission,
      isLoading,
      needsInstallOnIOS,
      isIOS,
      fcmToken,
   };
};