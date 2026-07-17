import { createPortal } from "react-dom";
import { MODAL_SIZES, MODAL_VARIANTS } from "./modal.constants";
import { m, LazyMotion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ModalProps } from "./modal.type";
import { useState, useEffect } from "react";

const loadFeatures = () => import("framer-motion").then((res) => res.domAnimation);

export const Modal = ({
   isOpen,
   onClose,
   variant = "default",
   size = "md",
   title,
   description,
   children,
   panelClassName,
   contentClassName,
   closeButtonClassName,
}: ModalProps): React.ReactNode => {
   const [isMounted, setIsMounted] = useState(false);
   const configVariant = MODAL_VARIANTS[variant];
   const configSize = MODAL_SIZES[size];

   useEffect(() => {
      setIsMounted(true);
   }, []);

   useEffect(() => {
      if (isOpen) {
         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "unset";
      }
      return () => {
         document.body.style.overflow = "unset";
      };
   }, [isOpen]);

   useEffect(() => {
      const handleClose = (e: KeyboardEvent) => {
         if (e.key === "Escape" && isOpen) {
            onClose();
         }
      }

      if (isOpen) window.addEventListener("keydown", handleClose);
      return () => window.removeEventListener("keydown", handleClose);
   }, [isOpen, onClose]);

   if (!isMounted) return null;

   return createPortal(
      <LazyMotion features={loadFeatures} strict>
         <AnimatePresence>
            {isOpen && (
               <m.div
                  key="modal-overlay"
                  className="fixed inset-0 z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
               >
                  <div
                     className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
                     aria-hidden
                  />

                  <div className="fixed inset-0 overflow-y-auto">
                     <div className="flex min-h-full items-center justify-center p-4">
                        <m.div
                           role="dialog"
                           aria-modal="true"
                           className={`relative p-6 rounded-2xl shadow-xl dark:shadow-[0_0_50px_-12px_rgba(0,0,0,0.7)] ${configSize} w-full m-auto ${configVariant.bgClass} ${panelClassName ?? ""}`}
                           initial={{ opacity: 0, scale: 0.96, y: 16 }}
                           animate={{ opacity: 1, scale: 1, y: 0 }}
                           exit={{ opacity: 0, scale: 0.96, y: 16 }}
                           transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                        >
                           {configVariant.icon && (
                              <div className="flex items-center gap-2.5 mb-5">
                                 <div
                                    className={`flex items-center justify-center p-1.5 border rounded-full ${configVariant.borderClass} ${configVariant.iconTextClass}`}
                                 >
                                    {configVariant.icon.Icon}
                                 </div>
                                 <span
                                    className={`font-semibold text-sm ${configVariant.iconTextClass}`}
                                 >
                                    {configVariant.icon.label}
                                 </span>
                              </div>
                           )}

                           {configVariant.icon && (
                              <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6 mb-6" />
                           )}

                           {(title || description) && (
                              <div className="mb-4 pr-12">
                                 {title && (
                                    <h2
                                       className={`text-xl! font-bold m-0! ${configVariant.textClass}`}
                                    >
                                       {title}
                                    </h2>
                                 )}
                                 {description && (
                                    <small className="text-slate-500 dark:text-slate-400 text-[14px]! leading-relaxed">
                                       {description}
                                    </small>
                                 )}
                              </div>
                           )}

                           {children && (
                              <div className={contentClassName}>{children}</div>
                           )}

                           <button
                              type="button"
                              className={`absolute top-5 right-5 p-1.5 rounded-full transition-all ${closeButtonClassName ??
                                 "text-slate-700 hover:text-slate-900 hover:bg-slate-300 dark:text-white dark:hover:text-white dark:hover:bg-white/15"
                                 }`}
                              onClick={onClose}
                              aria-label="Cerrar modal"
                           >
                              <X size={20} />
                           </button>
                        </m.div>
                     </div>
                  </div>
               </m.div>
            )}
         </AnimatePresence>
      </LazyMotion>
      , document.body);
};
