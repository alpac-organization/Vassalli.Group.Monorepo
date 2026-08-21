import { app } from '@app/firebase-config';
import { useState, useEffect } from 'react';
import { getId, getInstallations } from 'firebase/installations';

interface UseNotificationResult {
  permissionGranted: boolean | null;
  requestPermission: () => Promise<void>;
  isLoading: boolean;
  needsInstallOnIOS: boolean;
  isIOS: boolean;
}

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

   useEffect(() => {
      if (isIOS && !isStandalone()) {
         setNeedsInstallOnIOS(true);
         return;
      }

      if (typeof Notification !== 'undefined') {
         setPermissionGranted(Notification.permission === 'granted');
      }
   }, [isIOS]);

   //Obtener token del dispositivo
   const getAndSendToken = async () => {
      try {
         console.log("Obteniendo device-installation-id (FID)...");

         if (Notification.permission === 'denied') {
            console.log("Permiso denegado");
            return false;
         }

         const installations = getInstallations(app);
         const fid = await getId(installations);
         
         console.log(JSON.stringify(fid, null, 3));
      } 
      catch (error) {
         console.error('Error obteniendo el FID de Firebase:', error);
      }
   };

   //Solicitar o verificar permisos de las notificaciones.
   const requestPermission = async () => {
      
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
         
         // Ya existe un permiso autorizado.
         if (currentPermission === 'granted') {
            setPermissionGranted(true);
            await getAndSendToken();
         } 
         // Ya existe un permiso denegado.
         else if (currentPermission === 'denied') {
            setPermissionGranted(false);
         } 
         // Es la primera vez que solicita permisos.
         else {
            const result = await Notification.requestPermission();
            const granted = result === 'granted';

            setPermissionGranted(granted);

            if(Notification.permission === "granted"){
               //Obtener y registrar token en el backend, para poder enviar la push
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
   };

   return { 
      permissionGranted, 
      requestPermission,
      isLoading,
      needsInstallOnIOS, 
      isIOS 
   };
};