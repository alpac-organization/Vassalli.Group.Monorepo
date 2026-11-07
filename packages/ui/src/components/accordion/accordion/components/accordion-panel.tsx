import { ChevronDown } from "lucide-react";
import { AccordionProps } from "../types/accordion.type";
import { ReactElement, ReactNode } from "react";

const panelTransition =
  "grid overflow-hidden transition-[grid-template-rows] duration-500 ease-in-out motion-reduce:transition-none motion-reduce:duration-0";
const contentFade =
  "transition-opacity duration-500 ease-in-out motion-reduce:transition-none";
const chevronTransition =
  "h-4 w-4 shrink-0 text-slate-500 transition-transform duration-500 ease-in-out motion-reduce:transition-none dark:text-slate-400";
const triggerButtonClassName =
  "flex min-w-0 flex-1 cursor-pointer items-center text-left text-sm font-medium text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25 focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-100";
const headerWithSlotsClassName =
  "flex w-full min-w-0 flex-wrap items-center gap-2 p-2 transition-colors duration-200 ease-out hover:bg-slate-50 dark:bg-[#363a45] dark:hover:bg-white/5";

export function AccordionPanel({
  title,
  leading,
  actions,
  children,
  isOpen,
  onToggle,
  disabled = false,
  className = "",
  triggerClassName = "",
  contentClassName = "",
  icon: Icon = ChevronDown,
  panelId,
  triggerId,
}: {
  title: AccordionProps["title"];
  leading?: ReactNode;
  actions?: ReactNode;
  children: AccordionProps["children"];
  isOpen: boolean;
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  icon?: AccordionProps["icon"];
  panelId: string;
  triggerId: string;
}): ReactElement {
  const hasHeaderSlots = Boolean(leading) || Boolean(actions);

  const chevron = (
    <Icon
      className={`${chevronTransition} ${isOpen ? "rotate-180" : "rotate-0"}`}
      aria-hidden
    />
  );

  return (
    <div
      className={`overflow-hidden h-fit rounded-lg border border-slate-200 bg-white dark:border-slate-600/50 dark:bg-[#272b34] ${className}`}
    >
      {hasHeaderSlots ? (
        <div className={`${headerWithSlotsClassName} ${triggerClassName}`}>
          {leading ? (
            <div className="flex min-w-0 flex-1 items-center overflow-hidden">
              {leading}
            </div>
          ) : null}
          {actions ? (
            <div className="flex shrink-0 items-center">
              {actions}
            </div>
          ) : null}
          <button
            type="button"
            tabIndex={-1}
            aria-expanded={isOpen}
            aria-controls={panelId}
            aria-label={isOpen ? "Contraer" : "Expandir"}
            disabled={disabled}
            onClick={onToggle}
            className="flex shrink-0 items-center"
          >
            {chevron}
          </button>
          <h3
            className={`m-0! flex min-w-0 ${
              leading ? "w-full basis-full md:w-auto md:flex-1 md:basis-auto" : "flex-1"
            }`}
          >
            <button
              id={triggerId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              disabled={disabled}
              onClick={onToggle}
              className={`${triggerButtonClassName} ${leading ? "pl-10 md:pl-0" : ""}`}
            >
              <span className="min-w-0 flex-1">{title}</span>
            </button>
          </h3>
        </div>
      ) : (
        <h3 className="m-0!">
          <button
            id={triggerId}
            type="button"
            aria-expanded={isOpen}
            aria-controls={panelId}
            disabled={disabled}
            onClick={onToggle}
            className={`flex w-full cursor-pointer h-10 p-2 dark:bg-[#363a45] items-center justify-between gap-3 text-left text-sm font-medium text-slate-800 outline-none transition-colors duration-200 ease-out hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-600/25 focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-100 dark:hover:bg-white/5 ${triggerClassName}`}
          >
            <span className="min-w-0 flex-1">{title}</span>
            {chevron}
          </button>
        </h3>
      )}

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!isOpen}
        className={`${panelTransition} ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`${contentFade} text-sm text-slate-600 dark:text-slate-300 ${
              isOpen ? "opacity-100" : "opacity-0"
            } ${contentClassName}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
