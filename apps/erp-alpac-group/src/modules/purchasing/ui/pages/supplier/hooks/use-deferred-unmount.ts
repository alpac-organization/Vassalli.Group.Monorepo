import { useEffect, useState } from "react";

const MODAL_EXIT_MS = 300;

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
