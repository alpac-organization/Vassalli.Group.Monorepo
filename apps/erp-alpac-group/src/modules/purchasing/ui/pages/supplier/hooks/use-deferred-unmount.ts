import { useEffect, useState } from "react";

const MODAL_EXIT_MS = 300;

// este hook podria ser un shared pero aqui se agg, este permite retrasar el desmontaje de un componente es decir un debounce 
// para dar tiempo a que se complete la animación de salida antes de desmontar.
export const useDeferredUnmount = (isOpen: boolean) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  if (isOpen && !shouldRender) {
    setShouldRender(true);
  }

  useEffect(() => {
    if (isOpen || !shouldRender) return;

    const timeoutId = window.setTimeout(() => {
      setShouldRender(false);
    }, MODAL_EXIT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isOpen, shouldRender]);

  return shouldRender;
};
