import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LazyMotion, m } from "framer-motion";
import { EllipsisVerticalIcon } from "lucide-react";
import type { ContextMenuProps } from "./context-menu.type";

const loadFeatures = () =>
   import("framer-motion").then((res) => res.domAnimation);

export const ContextMenu = ({ items, triggerLabel }: ContextMenuProps) => {
   const [open, setOpen] = useState(false);
   const containerRef = useRef<HTMLDivElement>(null);

   const getScrollParent = (el: HTMLElement | null): HTMLElement | null => {
      let parent = el?.parentElement ?? null;

      while (parent) {
         const style = getComputedStyle(parent);
         const overflow = style.overflow + style.overflowX + style.overflowY;
         if (/(auto|scroll)/.test(overflow)) return parent;
         parent = parent.parentElement;
      }

      return null;
   };

   const isScrollbarClick = (event: MouseEvent, el: HTMLElement) => {
      const rect = el.getBoundingClientRect();

      const onVertical = event.clientX >= rect.left + el.clientWidth;
      const onHorizontal = event.clientY >= rect.top + el.clientHeight;

      return onVertical || onHorizontal;
   };

   useEffect(() => {
      if (!open) return;

      const scrollParent = getScrollParent(containerRef.current);

      const handleClickOutside = (event: MouseEvent) => {

         if (containerRef.current?.contains(event.target as Node)) return;

         if (scrollParent && isScrollbarClick(event, scrollParent)) return;

         setOpen(false);
      };

      const handleEscape = (event: KeyboardEvent) => {
         if (event.key === "Escape") setOpen(false);
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
         document.removeEventListener("keydown", handleEscape);
      };
   }, [open]);

   return (
      <div ref={containerRef} className="relative inline-block">
         <button
            type="button"
            aria-expanded={open}
            aria-haspopup="menu"
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-md border w-fit border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition-colors
                   hover:bg-slate-50
                   dark:border-slate-600 dark:bg-[#272b34] dark:text-slate-200 dark:hover:bg-slate-700/40"
         >
            {triggerLabel ? (
               triggerLabel
            ) : (
               <EllipsisVerticalIcon size={20} />
            )}
         </button>

         <LazyMotion features={loadFeatures} strict>
            <AnimatePresence>
               {open && (
                  <m.ul
                     role="menu"
                     initial={{ opacity: 0, y: -6, scale: 0.98 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: -4, scale: 0.98 }}
                     transition={{ duration: 0.16, ease: "easeOut" }}
                     className="m-0! absolute right-0 z-50 mt-2 min-w-40 origin-top-right overflow-hidden rounded-lg border border-slate-200
                         bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:bg-[#272b34] dark:border-slate-600 dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
                  >
                     {items.map((item, index) => {
                        if (item.separator) {
                           return (
                              <li
                                 key={`separator-${index}`}
                                 role="separator"
                                 className="my-1 border-t border-slate-200 dark:border-slate-600"
                              />
                           );
                        }

                        const showDivider =
                           index < items.length - 1 && !items[index + 1]?.separator;

                        return (
                           <li
                              key={item.label}
                              role="none"
                              className={
                                 showDivider
                                    ? "border-b border-slate-200 dark:border-slate-600"
                                    : undefined
                              }
                           >
                              <button
                                 type="button"
                                 role="menuitem"
                                 disabled={item.disabled}
                                 onClick={() => {
                                    item.onClick();
                                    setOpen(false);
                                 }}
                                 className="w-full px-3 py-2 text-left text-sm text-slate-700 transition-colors
                                 hover:bg-slate-100 whitespace-nowrap
                                 disabled:cursor-not-allowed disabled:opacity-50
                                 dark:text-slate-200 dark:hover:bg-slate-700/60"
                              >
                                 {item.label}
                              </button>
                           </li>
                        );
                     })}
                  </m.ul>
               )}
            </AnimatePresence>
         </LazyMotion>
      </div>
   );
};
