import { createPortal } from "react-dom";
import { MODAL_VARIANTS } from "./modal.constants";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ModalProps } from "./modal.type";
import { useState, useEffect, ReactElement } from "react";
export const Modal = ({
  isOpen,
  onClose,
  variant = "default",
  children,
}: ModalProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const config = MODAL_VARIANTS[variant];
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            className={`relative p-6 rounded-2xl shadow-xl max-w-lg w-full mx-4 ${config.bgClass} ${config.textClass}`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {config.icon && (
              <div className="flex items-center gap-3 mb-4">
                <config.icon.Icon size={28} />
                <span className="font-semibold text-lg">
                  {config.icon.label}
                </span>
              </div>
            )}

            <div className="mb-4">{children}</div>

            <button
              className="absolute top-4 right-4 p-1.5 text-current opacity-70 hover:opacity-100 hover:bg-black/5 rounded-full transition-all"
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
