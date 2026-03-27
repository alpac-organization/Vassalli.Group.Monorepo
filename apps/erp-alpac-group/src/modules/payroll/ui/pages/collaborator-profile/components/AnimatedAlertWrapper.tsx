import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export const AnimatedAlertWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`fixed top-20 right-6 z-9999 w-full max-w-sm transition-all duration-400 ease-out transform ${
        show ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
      }`}
    >
      {children}
    </div>,
    document.body,
  );
};
