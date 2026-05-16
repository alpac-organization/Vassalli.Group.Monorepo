import { createPortal } from "react-dom";
import { AnimatePresence, m, LazyMotion } from "framer-motion";
import { X } from "lucide-react";
import { DrawerProps } from "./drawer.type";

const loadFeatures = () => import("framer-motion").then((res) => res.domAnimation);

export const Drawer = ({ isOpen, onClose, title, description, children, position = 'right' }: DrawerProps) => {
   return createPortal(
      <LazyMotion features={loadFeatures} strict>
         <AnimatePresence>
            {isOpen && (
               <div className={`fixed inset-0 z-50 flex justify-${position === "right" ? "end" : "start"}`}>

                  <m.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     onClick={onClose}
                     className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                  />


                  <m.div
                     initial={{ x: position === "right" ? "100%" : "-100%" }}
                     animate={{ x: 0 }}
                     exit={{ x: position === "right" ? "100%" : "-100%" }}
                     transition={{ type: "spring", damping: 25, stiffness: 200 }}
                     className={`relative w-full max-w-md h-full bg-white dark:bg-[#272b34] shadow-2xl flex flex-col ${position === 'right' ? 'border-l' : 'border-r'} border-slate-200 dark:border-neutral-700`}
                  >

                     <div className="p-6 border-b border-slate-100 dark:border-neutral-700 flex items-center justify-between">
                        <div>
                           {title && <h2 className="text-xl font-bold dark:text-white m-0!">{title}</h2>}
                           {description && <p className="text-sm text-slate-500 m-0!">{description}</p>}
                        </div>
                        <button
                           onClick={onClose}
                           className="p-2 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-full transition-colors dark:text-gray-400"
                        >
                           <X size={20} />
                        </button>
                     </div>


                     <div className="flex-1 overflow-y-auto p-6">
                        {children}
                     </div>
                  </m.div>
               </div>
            )}
         </AnimatePresence>
      </LazyMotion>,
      document.body
   );
};
