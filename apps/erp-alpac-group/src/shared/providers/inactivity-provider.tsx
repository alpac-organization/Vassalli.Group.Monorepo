import { useCallback, useEffect, useRef } from "react";
import { useInactivityStore } from "@app/shared/stores/useInactivityStore";

/**
 * Provider que se encarga de manejar el tiempo de inactividad del usuario.
 * @param timeout Tiempo en milisegundos para que el usuario sea considerado inactivo.
 * @default 1_200_000 (20 minutos)
 * @returns
 */
export const InactivityProvider = ({ timeout = 1_200_000 }) => {
  const { setIsInactive } = useInactivityStore();

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    setIsInactive(false, 0);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setIsInactive(true, timeout);
    }, timeout);
  }, [setIsInactive, timeout]);

  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "wheel",
    ];

    const handleActivity = () => resetTimer();

    events.forEach((event) => window.addEventListener(event, handleActivity));

    resetTimer();

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity),
      );

      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer]);

  return null;
};
