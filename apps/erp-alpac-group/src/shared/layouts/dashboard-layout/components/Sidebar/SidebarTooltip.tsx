import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { SidebarToolTipProps } from "@app/shared/layouts/dashboard-layout/components/Sidebar/types/sidebar.types";

const DURACION_MILISECONDS = 200;

export default function SidebarTooltip({
  nameLink,
  open,
  anchorRef,
}: SidebarToolTipProps) {
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const [appear, setAppear] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (open) {
      setMounted(true);
      setAppear(false);
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setAppear(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }
    setAppear(false);
  }, [open]);

  useLayoutEffect(() => {
    if (!mounted) return;
    const el = anchorRef.current;
    if (!el) return;

    const update = () => {
      const r = el.getBoundingClientRect();
      setPos({
        top: r.top + r.height / 2,
        left: r.right + 12,
      });
    };

    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [mounted, anchorRef, nameLink]);

  useEffect(() => {
    if (open || !mounted) return;
    const el = tooltipRef.current;
    if (!el) {
      setMounted(false);
      return;
    }

    const onEnd = (e: TransitionEvent) => {
      if (e.target !== el) return;
      if (e.propertyName !== "opacity" && e.propertyName !== "transform")
        return;
      setMounted(false);
    };

    el.addEventListener("transitionend", onEnd);
    const fallback = window.setTimeout(
      () => setMounted(false),
      DURACION_MILISECONDS + 50,
    );

    return () => {
      el.removeEventListener("transitionend", onEnd);
      window.clearTimeout(fallback);
    };
  }, [open, mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={tooltipRef}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        transform: `translateY(-50%) translateX(${appear ? 0 : 8}px)`,
        opacity: appear ? 1 : 0,
        zIndex: 100000,
        transition: `opacity ${DURACION_MILISECONDS}ms ease-out, transform ${DURACION_MILISECONDS}ms ease-out`,
      }}
      className="
        px-3 py-1.5
        bg-neutral-700 text-white text-xs font-medium
        rounded-md shadow-lg
        whitespace-nowrap
        pointer-events-none
      "
      role="tooltip"
    >
      <div
        className="
          absolute top-1/2 -translate-y-1/2 -left-1.5
          border-t-[6px] border-t-transparent
          border-b-[6px] border-b-transparent
          border-r-[6px] border-r-neutral-700
        "
      />

      {nameLink}
    </div>,
    document.body,
  );
}
