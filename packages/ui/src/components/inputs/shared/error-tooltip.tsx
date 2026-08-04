import { useLayoutEffect, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

type ErrorTooltipProps = {
  message: string;
  anchorRef: RefObject<HTMLElement | null>;
};

export function ErrorTooltip({ message, anchorRef }: ErrorTooltipProps) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null,
  );

  useLayoutEffect(() => {
    const update = () => {
      const el = anchorRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setPosition({ top: rect.bottom + 4, left: rect.left + 4 });
    };

    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [anchorRef, message]);

  if (!position || typeof document === "undefined") return null;

  return createPortal(
    <span
      role="tooltip"
      className="pointer-events-none fixed z-[9999] flex flex-col items-start"
      style={{ top: position.top, left: position.left }}
    >
      <span
        className="h-0 w-0 ml-3 shrink-0 border-x-[6px] border-b-[6px] border-x-transparent border-b-red-500 dark:border-b-red-600"
        aria-hidden={true}
      />
      <span className="whitespace-nowrap rounded-lg bg-red-500 dark:bg-red-600 px-3 py-2 text-sm font-semibold text-white">
        {message}
      </span>
    </span>,
    document.body,
  );
}
