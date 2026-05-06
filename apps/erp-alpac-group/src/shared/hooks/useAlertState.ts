import type { AlertProps } from "@alpac/design-system";
import { useCallback, useEffect, useState } from "react";

interface AlertConfig {
   open: boolean;
   type: Exclude<AlertProps["type"], undefined>;
   title: string;
   message: string;
}

export const useAlertState = () => {

   const [alertState, setAlertState] = useState<AlertConfig | undefined>(undefined);

   useEffect(() => {
      if (!alertState?.open) return;
      const timer = setTimeout(() => setAlertState(undefined), 5000);
      return () => clearTimeout(timer);
   }, [alertState?.open]);

   const handleRequestSuccess = useCallback((message: string) => {
      setAlertState({
         open: true,
         type: "success",
         title: "Éxito",
         message,
      });
   }, []);

   const handleRequestError = useCallback((message?: string) => {
      setAlertState({
         open: true,
         type: "error",
         title: "Error",
         message: message ?? "Error al procesar la petición",
      });
   }, []);

   const handleRequestWarning = useCallback((message?: string) => {
      setAlertState({
         open: true,
         type: "warning",
         title: "Advertencia",
         message: message ?? "Advertencia al procesar la petición",
      });
   }, []);

   const handleRequestInfo = useCallback((message?: string) => {
      setAlertState({
         open: true,
         type: "info",
         title: "Información",
         message: message ?? "Información al procesar la petición",
      });
   }, []);

   const handleCloseAlert = useCallback(() => {
      setAlertState(undefined);
   }, []);

   return {
      alertState,
      handleCloseAlert,
      handleRequestError,
      handleRequestSuccess,
      handleRequestWarning,
      handleRequestInfo
   }
}