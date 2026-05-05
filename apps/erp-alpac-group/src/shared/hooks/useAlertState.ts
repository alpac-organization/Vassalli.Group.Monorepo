import { useCallback, useEffect, useState } from "react";

interface AlertConfig {
   open: boolean;
   type: "success" | "error";
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
         message,
      });
   }, []);

   const handleRequestError = useCallback((message: string) => {
      setAlertState({
         open: true,
         type: "error",
         message,
      });
   }, []);

   return {
      alertState,
      handleRequestError,
      handleRequestSuccess
   }
}