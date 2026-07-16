import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { TabHeaderProps } from "./tabs-header.type";

function MobileTabSelect<T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: TabHeaderProps<T>) {
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  const activeLabel = tabs.find((t) => t.id === activeTab)?.label ?? "";

  useLayoutEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      triggerRef.current?.focus();
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const handlePick = (id: T) => {
    onTabChange(id);
    setIsOpen(false);
  };

  return (
    <div ref={rootRef} className="relative w-full min-w-0">
      <button
        ref={triggerRef}
        id={`${baseId}-trigger`}
        type="button"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((o) => !o)}
        className={`flex h-11 w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-lg border bg-[#1e2229] px-3 text-left text-sm font-medium text-slate-100 outline-none transition-all duration-300 ease-out hover:border-slate-500/70 focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600/25 ${
          isOpen
            ? "border-blue-600/60 ring-1 ring-blue-600/25"
            : "border-slate-600/50"
        }`}
      >
        <span className="min-w-0 flex-1 truncate">{activeLabel}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-blue-400 transition-transform duration-300 ease-out ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          aria-hidden
        />
      </button>

      <ul
        id={listboxId}
        role="listbox"
        aria-labelledby={`${baseId}-label`}
        aria-hidden={!isOpen}
        className={`absolute left-0 right-0 top-full z-50 mt-2 max-h-60 origin-top overflow-auto rounded-xl border border-slate-600/50 bg-[#1b1e23] py-1 shadow-xl shadow-black/50 ring-1 ring-white/5 transition-all duration-300 ease-out motion-reduce:transition-none ${
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1.5 scale-[0.98] opacity-0"
        }`}
      >
        {tabs.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <li key={tab.id} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={selected}
                tabIndex={isOpen ? 0 : -1}
                onClick={() => handlePick(tab.id)}
                className={`flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm transition-colors duration-200 ease-out ${
                  selected
                    ? "bg-blue-600/15 font-medium text-blue-400"
                    : "text-slate-200 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="min-w-0 flex-1 truncate">{tab.label}</span>
                {selected ? (
                  <Check
                    className="h-4 w-4 shrink-0 text-blue-400"
                    aria-hidden
                  />
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export const TabHeader = <T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: TabHeaderProps<T>) => {
  return (
    <div className="w-full min-w-0">
      <div className="sm:hidden">
        <MobileTabSelect
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      </div>

      <div
        role="tablist"
        aria-label="Secciones del perfil"
        className="hidden min-w-0 border-b border-slate-600/40 sm:flex sm:flex-wrap sm:items-end sm:gap-x-8 sm:gap-y-0 sm:overflow-x-auto items-center"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`min-h-0 w-auto shrink-0 touch-manipulation rounded-t-md border-b-2 px-3 py-3 text-left text-sm font-medium transition-colors duration-200 -mb-px ${
              activeTab === tab.id
                ? "border-blue-600 bg-blue-600/15 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
