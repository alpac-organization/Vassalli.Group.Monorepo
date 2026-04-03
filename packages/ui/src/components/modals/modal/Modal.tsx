import { createPortal } from "react-dom";
import { MODAL_VARIANTS } from "./modal.constants";
import type { ModalVariant } from "./modal.type";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ModalProps } from "./modal.type";
import { useState, useEffect } from "react";

export const Modal = ({
  isOpen,
  onClose,
  variant,
  title,
  description,
  children,
  panelClassName = "",
}: ModalProps): any => {
  const [isMounted, setIsMounted] = useState(false);
  const resolvedVariant: ModalVariant = variant ?? "default";
  const config = MODAL_VARIANTS[resolvedVariant];
  const titleSectionClass =
    resolvedVariant === "default"
      ? "mb-6"
      : "mb-6 border-t border-t-slate-300";

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

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            className={`relative p-6 rounded-2xl shadow-xl max-w-lg w-full mx-4 ${config.bgClass} ${panelClassName}`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {config.icon && (
              <div className="flex items-center gap-2.5 mb-5 border-b border-slate-100">
                <div
                  className={`flex items-center justify-center p-1.5 border rounded-full ${config.borderClass} ${config.iconTextClass}`}
                >
                  {config.icon.Icon}
                </div>
                <span
                  className={`font-semibold text-sm ${config.iconTextClass}`}
                >
                  {config.icon.label}
                </span>
              </div>
            )}

            {(title || description) && (
              <div className={titleSectionClass}>
                {title && (
                  <h2 className={`text-xl font-bold mb-2 ${config.textClass}`}>
                    {title}
                  </h2>
                )}
                {description && (
                  <div className="text-slate-500 text-[15px] leading-relaxed">
                    {description}
                  </div>
                )}
              </div>
            )}

            {children && <div className="mt-4">{children}</div>}

            <button
              className="absolute top-5 right-5 p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-300 dark:text-slate-200 dark:hover:text-white dark:hover:bg-slate-600 rounded-full transition-all"
              onClick={onClose}
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
