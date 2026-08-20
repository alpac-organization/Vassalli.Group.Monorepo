import {
  useState,
  useEffect,
  useRef,
  type ReactNode,
  type ReactPortal,
} from "react";
import { createPortal } from "react-dom";

import type { AnimatedAlertWrapperProps } from "./animated-alert-wrapper.types";

const TRANSITION_MS = 320;

const boxTransition =
  "transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none motion-reduce:duration-0";

export function AnimatedAlertWrapper({
  open,
  children,
}: AnimatedAlertWrapperProps): ReactPortal | null {
  const [mounted, setMounted] = useState(!!open);
  const [visible, setVisible] = useState(false);
  const savedRef = useRef<ReactNode | null>(null);

  if (children) {
    savedRef.current = children;
  }

  useEffect(() => {
    if (open) {
      setMounted(true);
      setVisible(false);
      let innerRaf = 0;
      const outerRaf = requestAnimationFrame(() => {
        innerRaf = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(outerRaf);
        if (innerRaf) cancelAnimationFrame(innerRaf);
      };
    }

    setVisible(false);
    const timer = window.setTimeout(() => {
      setMounted(false);
      savedRef.current = null;
    }, TRANSITION_MS);

    return () => window.clearTimeout(timer);
  }, [open]);

  if (typeof document === "undefined") {
    return null;
  }

  if (!mounted && !open) {
    return null;
  }

  const content = children ?? savedRef.current;

  if (!content) {
    return null;
  }

  const motionClass = visible
    ? "translate-y-0 opacity-100"
    : "-translate-y-full opacity-0";

  return createPortal(
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-10000 flex justify-center px-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:justify-end sm:px-6 sm:pt-6"
      role="presentation"
    >
      <div
        className={`pointer-events-auto w-full min-w-0 max-w-md md:max-w-lg ${boxTransition} ${motionClass} drop-shadow-xl`}
      >
        {content}
      </div>
    </div>,
    document.body,
  );
}
