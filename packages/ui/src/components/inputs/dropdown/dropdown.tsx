import { DropdownProps } from "./dropdown.types";
import { motion, AnimatePresence } from "framer-motion";
import { forwardRef, useState, useRef, useEffect } from "react";

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(({
   label,
   options,
   placeholder,
   error, onChange,
   value, className,
   labelClassName,
   valueClassName
}, ref) => {

   const [isOpen, setIsOpen] = useState(false);
   const containerRef = useRef<HTMLDivElement>(null);

   const selectedOption = options.find((opt) => opt.value === value);

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setIsOpen(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   const handleSelect = (optionValue: string | number) => {
      if (onChange) onChange(optionValue);
      setIsOpen(false);
   };

   return (
      <div className="flex flex-col gap-1.5 w-full" ref={containerRef}>
         {
            label && (
               <label className={`text-[14px] font-medium ml-0.5 ${labelClassName || "text-slate-600"}`}>
                  {label}
               </label>
            )
         }

         <div
            className="relative w-full"
            ref={ref}
         >
            <button
               type="button"
               onClick={() => setIsOpen(!isOpen)}
               className={`
                  flex items-center justify-between w-full h-12 px-4 rounded-[10px] border 
                  bg-white transition-all duration-200 text-[15px] outline-none
                  ${isOpen ? "border-blue-500 ring-2 ring-blue-50" : "border-blue-200 hover:border-blue-300"}
                  ${error ? "border-red-400 ring-red-50" : ""}
                  ${className}
               `}
            >
               <span className={`truncate ${!selectedOption ? "text-slate-500" : (valueClassName || "text-zinc-900")}`}>
                  {selectedOption ? selectedOption.label : placeholder}
               </span>

               <motion.svg
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  className="w-5 h-5 text-slate-400 shrink-0"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"
               >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
               </motion.svg>
            </button>

            <AnimatePresence>
               {
                  isOpen && (
                     <motion.ul
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: 4 }}
                        exit={{ opacity: 0, y: 0 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute inset-x-0 top-full z-100 mt-1 bg-white border border-slate-200 shadow-xl rounded-[12px] py-1.5 max-h-60 overflow-y-auto"
                     >
                        {
                           options.map((option) => (
                              <li
                                 key={option.value}
                                 onClick={() => handleSelect(option.value)}
                                 className={`
                                    px-4 py-2.5 cursor-pointer text-[14px] flex items-center justify-between transition-colors
                                    ${value === option.value ? "text-blue-600 bg-blue-50 font-medium" : "text-slate-600 hover:bg-slate-200"}
                                 `}
                              >
                                 <span className="truncate">{option.label}</span>
                                 {
                                    value === option.value && (
                                       <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                       </svg>
                                    )
                                 }
                              </li>
                           ))
                        }
                     </motion.ul>
                  )
               }
            </AnimatePresence>
         </div>
         {error && <span className="text-xs text-red-500 font-medium ml-1">{error}</span>}
      </div>
   );
}
);