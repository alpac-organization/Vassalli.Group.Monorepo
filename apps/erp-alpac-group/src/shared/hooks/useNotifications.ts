import { getToken, type Messaging } from 'firebase/messaging';
import { getMessagingInstance } from '@app/firebase-config';
import { useState, useEffect, useCallback } from 'react';
import { useNotificationConfig } from '@app/modules/dashboard/ui/hooks/useNotificationConfig';
import { useUserStore } from '../stores/useUserStore';
import { getDeviceName } from '@app/shared/utils/device-name.utils';

interface UseNotificationResult {
   permissionGranted: boolean | null;
   requestPermission: () => Promise<void>;
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

         await RegisterPushToken.mutateAsync({
            company_id: companyId, token,
            device_name: getDeviceName()
         });

         return true;
      }
      catch (error) {
         console.error('Error obteniendo/enviando el token FCM:', error);
         return false;
      }

   }, [RegisterPushToken, companyId]);

   const requestPermission = useCallback(async () => {

      if (isIOS && !isStandalone()) {
         setNeedsInstallOnIOS(true);
         return;
      }

      if (typeof Notification === 'undefined') {
         console.warn('Este navegador no soporta notificaciones.');
         return;
      }

      try {
         setIsLoading(true);
         const currentPermission = Notification.permission;

         if (currentPermission === 'granted') {
            setPermissionGranted(true);
            await getAndSendToken();
         }
         else if (currentPermission === 'denied') {
            setPermissionGranted(false);
         }
         else {
            const result = await Notification.requestPermission();
            const granted = result === 'granted';
            setPermissionGranted(granted);

            if (granted) {
               await getAndSendToken();
            }
         }
      }
      catch (error) {
         console.error('Error solicitando permiso de notificaciones:', error);
         setPermissionGranted(false);
      }
      finally {
         setIsLoading(false);
      }
   }, [isIOS, getAndSendToken]);

   return {
      permissionGranted,
      requestPermission,
      isLoading,
      needsInstallOnIOS,
      isIOS,
      fcmToken,
   };
};