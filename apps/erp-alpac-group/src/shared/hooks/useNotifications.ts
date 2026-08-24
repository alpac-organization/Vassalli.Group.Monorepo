import { getToken } from 'firebase/messaging';
import { getMessagingInstance } from '@app/firebase-config';
import { useState, useEffect, useCallback } from 'react';

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

export const useNotification = (): UseNotificationResult => {

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

      if (typeof Notification !== 'undefined') {
         setPermissionGranted(Notification.permission === 'granted');
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

         const registration = await navigator.serviceWorker.ready;

         const token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: registration,
         });

         if (!token) {
            console.warn('No se pudo generar el token FCM.');
            return false;
         }

         setFcmToken(token);
         // Enviar token al backend en AWS


         return true;
      }
      catch (error) {
         console.error('Error obteniendo/enviando el token FCM:', error);
         return false;
      }
   }, []);

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