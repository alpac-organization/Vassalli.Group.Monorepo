import { useLayoutEffect, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

type ErrorTooltipProps = {
  message: string;
  anchorRef: RefObject<HTMLElement | null>;
};

type TooltipPosition = {
  top: number;
  left: number;
  maxWidth: number;
  placement: "bottom" | "right" | "left";
};

const VIEWPORT_PADDING = 8;
const DESKTOP_BREAKPOINT = "(min-width: 640px)";
const DESKTOP_TOOLTIP_MAX_WIDTH = 280;
const SIDE_GAP = 8;

export function ErrorTooltip({ message, anchorRef }: ErrorTooltipProps) {
  const [position, setPosition] = useState<TooltipPosition | null>(null);

  useLayoutEffect(() => {
    const update = () => {
      const el = anchorRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const isDesktop = window.matchMedia(DESKTOP_BREAKPOINT).matches;

      if (isDesktop) {
        const maxWidth = Math.min(
          DESKTOP_TOOLTIP_MAX_WIDTH,
          window.innerWidth - VIEWPORT_PADDING * 2,
        );

        let left = rect.left - maxWidth - SIDE_GAP;
        if (left < VIEWPORT_PADDING) {
          left = VIEWPORT_PADDING;
        }

        setPosition({
          top: rect.top + rect.height / 2,
          left,
          maxWidth,
          placement: "left",
        });
        return;
      }

      const availableWidth = window.innerWidth - VIEWPORT_PADDING * 2;
      const maxWidth = Math.min(availableWidth, Math.max(rect.width, 220));

      let left = rect.left;
      if (left + maxWidth > window.innerWidth - VIEWPORT_PADDING) {
        left = window.innerWidth - maxWidth - VIEWPORT_PADDING;
      }
      if (left < VIEWPORT_PADDING) {
        left = VIEWPORT_PADDING;
      }

      setPosition({
        top: rect.bottom + 4,
        left,
        maxWidth,
        placement: "bottom",
      });
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

  const isSide =
    position.placement === "right" || position.placement === "left";

  return createPortal(
    <span
      role="tooltip"
      className={[
        "pointer-events-none fixed z-9999 flex",
        isSide ? "flex-row items-center" : "flex-col items-start",
        position.placement === "left" ? "flex-row-reverse" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        top: position.top,
        left: position.left,
        width: position.maxWidth,
        maxWidth: position.maxWidth,
        transform: isSide ? "translateY(-50%)" : undefined,
      }}
    >
      {position.placement === "bottom" && (
        <span
          className="h-0 w-0 ml-3 shrink-0 border-x-[6px] border-b-[6px] border-x-transparent border-b-[#7a1f2b] dark:border-b-[#6b1e2a]"
          aria-hidden={true}
        />
      )}
      {position.placement === "right" && (
        <span
          className="h-0 w-0 shrink-0 border-y-[6px] border-r-[6px] border-y-transparent border-r-[#7a1f2b] dark:border-r-[#6b1e2a]"
          aria-hidden={true}
        />
      )}
      {position.placement === "left" && (
        <span
          className="h-0 w-0 shrink-0 border-y-[6px] border-l-[6px] border-y-transparent border-l-[#7a1f2b] dark:border-l-[#6b1e2a]"
          aria-hidden={true}
        />
      )}
      <span className="w-full rounded-lg bg-[#7a1f2b] dark:bg-[#6b1e2a] px-3 py-2 text-sm font-semibold leading-snug text-white wrap-break-words whitespace-normal">
        {message}
      </span>
    </span>,
    document.body,
  );
}
