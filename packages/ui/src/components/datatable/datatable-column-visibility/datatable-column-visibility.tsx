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
          <>
            <motion.button
              type="button"
              aria-label="Cerrar selector de columnas"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/20 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-x-3 bottom-3 z-50 w-auto overflow-hidden rounded-lg border border-slate-600 bg-white shadow-xl dark:bg-[#2c313c]
                       md:absolute md:inset-auto md:right-0 md:bottom-full md:mb-2 md:w-64 md:max-w-[calc(100vw-2rem)]"
            >
              <div className="flex items-center justify-between gap-3 border-b border-slate-600 p-3">
                <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                  Visibilidad de Columnas
                </p>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md border border-slate-500 px-2 py-1 text-xs font-semibold text-gray-600 transition-colors hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-neutral-700 md:hidden"
                >
                  Cerrar
                </button>
              </div>
              <div className="max-h-[min(20rem,60vh)] overflow-y-auto p-2 md:max-h-72">
                {options.map((col) => (
                  <label
                    key={col.value}
                    className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-slate-50 dark:hover:bg-neutral-800"
                  >
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(col.value)}
                      onChange={() => toggleOption(col.value)}
                      className="h-4 w-4 rounded border-slate-600 text-blue-600 focus:ring-blue-500 dark:bg-neutral-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-200">
                      {col.label}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
