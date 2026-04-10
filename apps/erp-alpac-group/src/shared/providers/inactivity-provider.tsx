import { useCallback, useEffect, useRef } from "react";
import { useInactivityStore } from "@app/shared/stores/useInactivityStore";

export const InactivityProvider = ({ timeout = 1_200_000 }) => { // 20 min por defecto
   const recordActivity = useInactivityStore((state) => state.recordActivity);
   const setIsInactive = useInactivityStore((state) => state.setIsInactive);
   const timerRef = useRef<NodeJS.Timeout | null>(null);

   const resetTimer = useCallback(() => {
      recordActivity();

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
         setIsInactive(true);
      }, timeout);
   }, [recordActivity, setIsInactive, timeout]);

   useEffect(() => {
      const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "wheel"];
      const handleActivity = () => resetTimer();

      events.forEach((event) => window.addEventListener(event, handleActivity));
      resetTimer();

      return () => {
         events.forEach((event) => window.removeEventListener(event, handleActivity));
         if (timerRef.current) clearTimeout(timerRef.current);
      };
   }, [resetTimer]);

   return null;
};