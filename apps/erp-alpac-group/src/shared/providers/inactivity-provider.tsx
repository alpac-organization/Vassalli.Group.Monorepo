import { useCallback, useEffect, useRef } from "react";
import { CookieStorageAdapter } from "@app/core/adapters/cookie-storage-adapter";
import {
   INACTIVITY_TIMEOUT_MS,
   useInactivityStore,
} from "@app/shared/stores/useInactivityStore";

const ACTIVITY_THROTTLE_MS = 1_000;
const ACTIVITY_EVENTS: ReadonlyArray<keyof WindowEventMap> = [
   "mousedown",
   "mousemove",
   "keydown",
   "scroll",
   "touchstart",
   "wheel",
   "click",
];

export const InactivityProvider = ({
   timeout = INACTIVITY_TIMEOUT_MS,
}: {
   timeout?: number;
}) => {
   const recordActivity = useInactivityStore((state) => state.recordActivity);
   const setIsInactive = useInactivityStore((state) => state.setIsInactive);
   const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
   const lastRecordedRef = useRef<number>(0);

   const scheduleInactivityTimeout = useCallback(
      (delayMs: number) => {
         if (timerRef.current) clearTimeout(timerRef.current);

         timerRef.current = setTimeout(() => {
            if (CookieStorageAdapter.hasSession()) {
               setIsInactive(true);
            }
         }, Math.max(0, delayMs));
      },
      [setIsInactive],
   );

   const checkElapsedInactivity = useCallback((): boolean => {
      if (!CookieStorageAdapter.hasSession()) {
         return false;
      }

      const { isInactive, lastActivity } = useInactivityStore.getState();
      const elapsed = Date.now() - lastActivity;

      if (isInactive || elapsed >= timeout) {
         if (timerRef.current) clearTimeout(timerRef.current);
         setIsInactive(true);
         return true;
      }

      scheduleInactivityTimeout(timeout - elapsed);
      return false;
   }, [scheduleInactivityTimeout, setIsInactive, timeout]);

   const handleUserActivity = useCallback(() => {
      if (checkElapsedInactivity()) {
         return;
      }

      const now = Date.now();
      if (now - lastRecordedRef.current >= ACTIVITY_THROTTLE_MS) {
         lastRecordedRef.current = now;
         recordActivity();
         scheduleInactivityTimeout(timeout);
      }
   }, [checkElapsedInactivity, recordActivity, scheduleInactivityTimeout, timeout]);

   useEffect(() => {
      const listenerOptions: AddEventListenerOptions = {
         capture: true,
         passive: true,
      };

      const handleVisibilityOrFocus = () => {
         if (document.visibilityState === "visible") {
            void checkElapsedInactivity();
         }
      };

      ACTIVITY_EVENTS.forEach((eventName) =>
         window.addEventListener(eventName, handleUserActivity, listenerOptions),
      );
      document.addEventListener("visibilitychange", handleVisibilityOrFocus);
      window.addEventListener("focus", handleVisibilityOrFocus);

      lastRecordedRef.current = Date.now();
      recordActivity();
      scheduleInactivityTimeout(timeout);

      return () => {
         ACTIVITY_EVENTS.forEach((eventName) =>
            window.removeEventListener(eventName, handleUserActivity, listenerOptions),
         );
         document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
         window.removeEventListener("focus", handleVisibilityOrFocus);
         if (timerRef.current) clearTimeout(timerRef.current);
      };
   }, [checkElapsedInactivity, handleUserActivity, recordActivity, scheduleInactivityTimeout, timeout]);

   return null;
};
