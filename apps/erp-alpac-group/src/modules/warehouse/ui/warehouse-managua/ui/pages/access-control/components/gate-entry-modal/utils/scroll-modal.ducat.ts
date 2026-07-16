import type { Variants } from "framer-motion";
export const EASE_OUT = [0.4, 0, 0.2, 1] as const;
export const ENTER_ANIMATION_MS = 280;

export const ducaItemVariants: Variants = {
  initial: { opacity: 0, y: -10, height: 0 },
  animate: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: { duration: 0.28, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -8,
    height: 0,
    transition: { duration: 0.22, ease: EASE_OUT },
  },
};
export function pinScrollToBottom(scrollParent: HTMLElement) {
  scrollParent.scrollTop = scrollParent.scrollHeight;
}
export function getScrollParent(element: HTMLElement): HTMLElement | null {
  let parent = element.parentElement;

  while (parent) {
    const { overflowY } = window.getComputedStyle(parent);
    const canScroll =
      overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay";

    if (canScroll) return parent;
    parent = parent.parentElement;
  }

  return null;
}
