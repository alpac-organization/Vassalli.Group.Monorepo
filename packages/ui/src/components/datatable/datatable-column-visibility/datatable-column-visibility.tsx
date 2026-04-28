import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DataTableColumnVisibilityProps } from "./datatable-column-visibility.type";
export function DataTableColumnVisibility({
  title = "Columnas",
  options,
  selectedValues,
  onChange,
}: DataTableColumnVisibilityProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className="relative group" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border border-slate-600 bg-white text-gray-700 hover:bg-slate-100 dark:bg-[#272b34] dark:text-gray-200 dark:hover:bg-neutral-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
        <span>{title}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-60 w-64 max-w-[calc(100vw-2rem)] origin-bottom-right border border-slate-600 bg-white shadow-xl dark:bg-[#2c313c] md:origin-top-right
                     bottom-full mb-2 overflow-hidden rounded-lg
                     md:bottom-auto md:mb-0 md:mt-2 md:top-full"
          >
            <div className="border-b border-slate-600 p-3">
              <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                Visibilidad de Columnas
              </p>
            </div>
            <div className="max-h-[min(18rem,45vh)] overflow-y-auto p-2 md:max-h-72">
              {options.map((col) => (
                <label
                  key={col.value}
                  className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-neutral-800 rounded-md cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(col.value)}
                    onChange={() => toggleOption(col.value)}
                    className="w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-blue-500 dark:bg-neutral-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    {col.label}
                  </span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
