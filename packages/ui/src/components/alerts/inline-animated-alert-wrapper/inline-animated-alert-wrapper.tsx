import { useEffect, useRef, useState, type ReactNode } from "react";
import type { InlineAnimatedAlertWrapperProps } from "./inline-animated-alert-wrapper.types";

const TRANSITION_MS = 320;

const boxTransition =
  "transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none motion-reduce:duration-0";

export function InlineAnimatedAlertWrapper({
  open,
  children,
}: InlineAnimatedAlertWrapperProps): ReactNode {
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

  if (!mounted && !open) {
    return null;
  }

  const content = children ?? savedRef.current;
  if (!content) {
    return null;
  }

  const motionClass = visible
    ? "translate-y-0 opacity-100"
    : "-translate-y-2 opacity-0";

  return (
    <div className={`${boxTransition} ${motionClass}`}>{content}</div>
  );
}
