import { DropdownProps } from "./dropdown.types";

const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);
import { m, LazyMotion, AnimatePresence } from "framer-motion";
import { forwardRef, useState, useRef, useEffect } from "react";

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      label,
      options,
      placeholder,
      error,
      onChange,
      value,
      className,
      labelClassName,
      isRequired,
      valueClassName,
      appearance = "default",
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

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

      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      if (!isOpen) {
        setSearchTerm("");
        setActiveIndex(-1);
      } else {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 50);
      }
    }, [isOpen]);

    useEffect(() => {
      setActiveIndex(-1);
    }, [searchTerm]);

    useEffect(() => {
      if (activeIndex >= 0 && listRef.current && isOpen) {
        const targetComponent = listRef.current?.children[
          activeIndex
        ] as HTMLElement;
        if (targetComponent) {
          targetComponent.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
          });
        }
      }
    }, [activeIndex]);

    const handleSelect = (optionValue: string | number) => {
      if (onChange) onChange(optionValue);
      setIsOpen(false);
    };

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const isDarkSurface = appearance === "dark";

    const triggerBorderRing = error
      ? "border-red-400 ring-red-50 dark:ring-red-900/40"
      : isOpen
        ? isDarkSurface
          ? "border-blue-500 ring-2 ring-blue-500/25"
          : "border-blue-500 ring-2 ring-blue-50"
        : isDarkSurface
          ? "border-slate-600 hover:border-slate-500"
          : "border-blue-200 hover:border-blue-300";

    const triggerSurface = isDarkSurface
      ? `bg-[#272b34] border ${triggerBorderRing}`
      : `bg-white border ${triggerBorderRing}`;

    const placeholderClass = isDarkSurface
      ? "text-slate-400"
      : "text-slate-500";
    const inputPlaceholderClass = isDarkSurface
      ? "placeholder:text-slate-400"
      : "placeholder:text-slate-500";
    const valueColorClass =
      valueClassName ?? (isDarkSurface ? "text-white" : "text-zinc-900");

    const menuSurface = isDarkSurface
      ? "bg-[#272b34] border border-slate-600 shadow-xl"
      : "bg-white border border-slate-200 shadow-xl";

    const itemBase = isDarkSurface
      ? "text-slate-200 hover:bg-slate-700/80"
      : "text-slate-600 hover:bg-slate-200";
    const itemSelected = isDarkSurface
      ? "text-blue-400 bg-blue-500/15 font-medium"
      : "text-blue-600 bg-blue-50 font-medium";
    const checkIconClass = isDarkSurface ? "text-blue-400" : "text-blue-600";

    return (
      <div className="flex flex-col gap-1.5 w-full" ref={containerRef}>
        {label && (
          <label
            className={`text-[14px] font-medium ml-0.5 ${labelClassName || "text-slate-600"}`}
          >
            {label}
            {isRequired && (
              <span className="text-red-500 dark:text-red-400 ml-1 font-bold">
                *
              </span>
            )}
          </label>
        )}

        <LazyMotion features={loadFeatures} strict>
          <div className="relative w-full" ref={ref}>
            <div
              tabIndex={0}
              onClick={() => setIsOpen(!isOpen)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (
                    isOpen &&
                    activeIndex >= 0 &&
                    filteredOptions[activeIndex]
                  ) {
                    handleSelect(filteredOptions[activeIndex].value);
                  } else {
                    setIsOpen(!isOpen);
                  }
                }
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  if (!isOpen) {
                    setIsOpen(true);
                  } else {
                    setActiveIndex((prev) =>
                      prev < filteredOptions.length - 1 ? prev + 1 : prev,
                    );
                  }
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
                }
                if (e.key === "Tab") {
                  setIsOpen(false);
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOpen(false);
                }
              }}
              className={`
                    flex items-center justify-between w-full h-12 px-4 rounded-[10px] cursor-pointer
                    transition-all duration-200 text-[15px] outline-none
                    ${triggerSurface}
                    ${className ?? ""}
                 `}
            >
              {isOpen ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className={`bg-transparent outline-none w-full truncate ${valueColorClass} ${inputPlaceholderClass}`}
                  placeholder={
                    selectedOption
                      ? String(selectedOption.label)
                      : placeholder || "Buscar..."
                  }
                />
              ) : (
                <span
                  className={`truncate ${!selectedOption ? placeholderClass : valueColorClass}`}
                >
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
              )}

              <m.svg
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
                animate={{ rotate: isOpen ? 180 : 0 }}
                className="w-5 h-5 text-slate-400 shrink-0 cursor-pointer ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </m.svg>
            </div>

            <AnimatePresence>
              {isOpen && (
                <m.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 4 }}
                  exit={{ opacity: 0, y: 0 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className={`absolute inset-x-0 top-full z-100 mt-1 rounded-[12px] overflow-hidden ${menuSurface}`}
                >
                  <ul
                    ref={listRef}
                    className="max-h-60 overflow-y-auto py-1.5 px-0 m-0!"
                  >
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option, index) => (
                        <li
                          key={option.value ?? index}
                          onClick={() => handleSelect(option.value)}
                          className={`
                                         px-4 py-2.5 cursor-pointer text-[14px] flex items-center justify-between transition-colors
                                         ${value === option.value ? itemSelected : index === activeIndex ? (isDarkSurface ? "bg-slate-700/80 text-white" : "bg-slate-100 text-slate-900") : itemBase}
                                      `}
                        >
                          <span className="truncate">{option.label}</span>
                          {value === option.value && (
                            <svg
                              className={`w-4 h-4 ${checkIconClass}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m4.5 12.75 6 6 9-13.5"
                              />
                            </svg>
                          )}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-3 text-[14px] text-slate-500">
                        Resultados no encontrados.
                      </li>
                    )}
                  </ul>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </LazyMotion>
        {error && (
          <span className="text-xs text-red-500 dark:text-red-400 font-medium ml-1">
            {error}
          </span>
        )}
      </div>
    );
  },
);
