import { DropdownProps, DropdownMenuProps, HandleDropdownKeyDownProps, MenuPositionDropdown, type Option } from "./dropdown.types";
import { ErrorTooltip } from "../shared/error-tooltip";
import { m, LazyMotion, AnimatePresence } from "framer-motion";

import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  type KeyboardEvent,
} from "react";

import { createPortal } from "react-dom";

const MENU_GAP = 4;
const MENU_MAX_HEIGHT = 240;
const VIEWPORT_PADDING = 8;

const loadFeatures = () => import("framer-motion").then((res) => res.domAnimation);

function getTriggerBorderRing(isError: boolean, isOpen: boolean, isDarkSurface: boolean) {
  if (isError) return "border-red-400 ring-red-50 dark:ring-red-900/40";
  if (isOpen && isDarkSurface) return "border-blue-500 ring-2 ring-blue-500/25";
  if (isOpen && !isDarkSurface) return "border-slate-600 hover:border-slate-500";
  if (!isOpen && isDarkSurface) return "border-blue-200 hover:border-blue-300";
  return "border-slate-600 hover:border-slate-500";
}

function getDropdownAppearance(
  isDarkSurface: boolean,
  triggerBorderRing: string,
  valueClassName?: string,
) {
  if (isDarkSurface) {
    return {
      triggerSurface: `bg-[#272b34] border ${triggerBorderRing}`,
      placeholderClass: "text-slate-400",
      inputPlaceholderClass: "placeholder:text-slate-400",
      valueColorClass: valueClassName ?? "text-white",
      menuSurface: "bg-[#272b34] border border-slate-600 shadow-xl",
      itemBase: "text-slate-200 hover:bg-slate-700/80",
      itemSelected: "text-blue-400 bg-blue-500/15 font-medium",
      checkIconClass: "text-blue-400",
    };
  }

  return {
    triggerSurface: `bg-white border ${triggerBorderRing}`,
    placeholderClass: "text-slate-500",
    inputPlaceholderClass: "placeholder:text-slate-500",
    valueColorClass: valueClassName ?? "text-zinc-900",
    menuSurface: "bg-white border border-slate-200 shadow-xl",
    itemBase: "text-slate-600 hover:bg-slate-200",
    itemSelected: "text-blue-600 bg-blue-50 font-medium",
    checkIconClass: "text-blue-600",
  };
}

const OPTION_DISABLED_CLASS =
  "cursor-not-allowed text-slate-400 dark:text-slate-300 opacity-80";

function getNextEnabledIndex(
  options: Option[],
  currentIndex: number,
  direction: 1 | -1,
): number {
  const length = options.length;
  if (length === 0) return -1;

  let nextIndex = currentIndex;
  for (let step = 0; step < length; step++) {
    nextIndex += direction;
    if (nextIndex < 0 || nextIndex >= length) return currentIndex;
    if (!options[nextIndex]?.disabled) return nextIndex;
  }

  return currentIndex;
}

function moveActiveIndex(
  setActiveIndex: HandleDropdownKeyDownProps["setActiveIndex"],
  options: Option[],
  direction: 1 | -1,
  fromIndex?: number,
) {
  setActiveIndex((prev) =>
    getNextEnabledIndex(options, fromIndex ?? prev, direction),
  );
}

const keyHandlers = {
  Enter: (evt: KeyboardEvent<HTMLDivElement>, props: HandleDropdownKeyDownProps) => {
    evt.preventDefault();
    const { isOpen, activeIndex, filteredOptions, handleSelect, setIsOpen } = props;
    const option = isOpen ? filteredOptions[activeIndex] : undefined;

    if (option) {
      handleSelect(option.value);
      return;
    }

    setIsOpen(!isOpen);
  },
  ArrowDown: (evt: KeyboardEvent<HTMLDivElement>, props: HandleDropdownKeyDownProps) => {
    evt.preventDefault();
    const { isOpen, filteredOptions, setIsOpen, setActiveIndex } = props;
    if (!isOpen) setIsOpen(true);
    moveActiveIndex(setActiveIndex, filteredOptions, 1, isOpen ? undefined : -1);
  },
  ArrowUp: (evt: KeyboardEvent<HTMLDivElement>, props: HandleDropdownKeyDownProps) => {
    evt.preventDefault();
    moveActiveIndex(props.setActiveIndex, props.filteredOptions, -1);
  },
  Tab: (evt: KeyboardEvent<HTMLDivElement>, props: HandleDropdownKeyDownProps) => {
    evt.preventDefault();
    props.setIsOpen(false);
  },
  Escape: (evt: KeyboardEvent<HTMLDivElement>, props: HandleDropdownKeyDownProps) => {
    evt.preventDefault();
    evt.stopPropagation();
    props.setIsOpen(false);
  },
};

type DropdownOptionItemProps = {
  option: Option;
  isSelected: boolean;
  isActive: boolean;
  isDarkSurface: boolean;
  itemBase: string;
  itemSelected: string;
  checkIconClass: string;
  onSelect: (optionValue: string | number) => void;
  renderOptionAction: (option: Option) => ReactNode;
};

function getActiveOptionClass(isDarkSurface: boolean) {
  return isDarkSurface ? "bg-slate-700/80 text-white" : "bg-slate-100 text-slate-900";
}

function DropdownOptionItem({
  option,
  isSelected,
  isActive,
  isDarkSurface,
  itemBase,
  itemSelected,
  checkIconClass,
  onSelect,
  renderOptionAction,
}: DropdownOptionItemProps) {
  const isDisabled = Boolean(option.disabled);

  let itemClass = itemBase;
  if (isDisabled) itemClass = OPTION_DISABLED_CLASS;
  else if (isSelected) itemClass = itemSelected;
  else if (isActive) itemClass = getActiveOptionClass(isDarkSurface);

  return (
    <li
      aria-disabled={isDisabled}
      onClick={() => onSelect(option.value)}
      className={`px-4 py-2.5 text-[14px] flex items-center gap-2 justify-between transition-colors ${
        isDisabled ? "" : "cursor-pointer"
      } ${itemClass}`}
    >
      <span className="truncate">{option.label}</span>
      <div className="flex shrink-0 items-center ml-auto! gap-1.5">
        {!isDisabled && renderOptionAction(option)}
      </div>
      {isSelected && (
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
  );
}

function isOptionSelected(value: unknown, optionValue: string | number, multiple?: boolean) {
  if (multiple) {
    return Array.isArray(value) && value.includes(optionValue);
  }
  return value === optionValue;
}

function DropdownMenu({
  isOpen,
  menuPosition,
  menuRef,
  listRef,
  filteredOptions,
  value,
  multiple = false,
  activeIndex,
  isDarkSurface,
  menuSurface,
  itemBase,
  itemSelected,
  checkIconClass,
  onSelect,
  renderOptionAction,
}: DropdownMenuProps) {
  if (!isOpen || !menuPosition) return null;

  const offsetY = menuPosition.placement === "bottom" ? -4 : 4;

  return createPortal(
    <LazyMotion features={loadFeatures} strict>
      <AnimatePresence>
        <m.div
          ref={menuRef}
          initial={{ opacity: 0, y: offsetY }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: offsetY }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: menuPosition.top,
            bottom: menuPosition.bottom,
            left: menuPosition.left,
            width: menuPosition.width,
            zIndex: 9999,
          }}
          className={`rounded-xl overflow-hidden ${menuSurface}`}
        >
          <ul
            ref={listRef}
            className="overflow-y-auto py-1.5 px-0 m-0!"
            style={{ maxHeight: menuPosition.maxHeight }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <DropdownOptionItem
                  key={option.value ?? index}
                  option={option}
                  isSelected={isOptionSelected(value, option.value, multiple)}
                  isActive={index === activeIndex}
                  isDarkSurface={isDarkSurface}
                  itemBase={itemBase}
                  itemSelected={itemSelected}
                  checkIconClass={checkIconClass}
                  onSelect={onSelect}
                  renderOptionAction={renderOptionAction}
                />
              ))
            ) : (
              <li className="px-4 py-3 text-[14px] text-slate-500">
                Resultados no encontrados.
              </li>
            )}
          </ul>
        </m.div>
      </AnimatePresence>
    </LazyMotion>,
    document.body,
  );
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({
    label, options, placeholder,
    error, errorVariant = "text", onChange, value, multiple = false, className,
    labelClassName, isRequired, disabled = false, optional = false, valueClassName,
    appearance = "default", renderOptionAction, onEditOption }, ref) => {

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);
    const [menuPosition, setMenuPosition] = useState<MenuPositionDropdown | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const selectedValues = multiple
      ? (Array.isArray(value) ? value : [])
      : [];
    const selectedOptions = multiple
      ? options.filter((opt) => selectedValues.includes(opt.value))
      : [];
    const selectedOption = multiple
      ? undefined
      : options.find((opt) => opt.value === value);

    const displayLabel = multiple
      ? selectedOptions.length === 0
        ? undefined
        : selectedOptions.length <= 2
          ? selectedOptions.map((opt) => opt.label).join(", ")
          : `${selectedOptions.length} seleccionados`
      : selectedOption?.label;

    const updateMenuPosition = useCallback(() => {

      const trigger = triggerRef.current;

      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_PADDING;
      const spaceAbove = rect.top - VIEWPORT_PADDING;

      const isSpaceBelowLessThanMaxHeight = spaceBelow < Math.min(MENU_MAX_HEIGHT, 160);
      const isSpaceAboveGreaterThanSpaceBelow = spaceAbove > spaceBelow;
      const isPlacementValid = isSpaceBelowLessThanMaxHeight && isSpaceAboveGreaterThanSpaceBelow;

      const placement = isPlacementValid ? "top" : "bottom";

      const availableHeight = placement === "bottom" ? spaceBelow : spaceAbove;

      const maxHeight = Math.max(120, Math.min(MENU_MAX_HEIGHT, availableHeight - MENU_GAP));

      const menuPosition: MenuPositionDropdown = {
        ...(placement === "bottom" ? { top: rect.bottom + MENU_GAP } : { bottom: window.innerHeight - rect.top + MENU_GAP }),
        left: rect.left, width: rect.width, maxHeight, placement,
      };

      setMenuPosition(menuPosition);
    }, []);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        const clickedInsideTrigger = containerRef.current?.contains(target);
        const clickedInsideMenu = menuRef.current?.contains(target);

        if (!clickedInsideTrigger && !clickedInsideMenu) setIsOpen(false);
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      if (!isOpen) {
        setSearchTerm("");
        setActiveIndex(-1);
        setMenuPosition(null);
        return;
      }

      updateMenuPosition();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      const handleReposition = () => updateMenuPosition();

      window.addEventListener("resize", handleReposition);
      window.addEventListener("scroll", handleReposition, true);

      return () => {
        window.removeEventListener("resize", handleReposition);
        window.removeEventListener("scroll", handleReposition, true);
      };
    }, [isOpen, updateMenuPosition]);

    useEffect(() => {
      setActiveIndex(-1);
    }, [searchTerm]);

    useEffect(() => {
      if (disabled) {
        setIsOpen(false);
      }
    }, [disabled]);

    useEffect(() => {
      if (activeIndex >= 0 && listRef.current && isOpen) {
        const children = listRef.current?.children;
        if (!children || children.length === 0) return;
        const targetComponent = children[activeIndex] as HTMLElement;
        if (!targetComponent) return;
        targetComponent.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      }
    }, [activeIndex, isOpen]);

    const handleSelect = (optionValue: string | number) => {
      const option = options.find((item) => item.value === optionValue);
      if (option?.disabled) return;

      if (multiple) {
        const current = Array.isArray(value) ? [...value] : [];
        const next = current.includes(optionValue)
          ? current.filter((item) => item !== optionValue)
          : [...current, optionValue];
        onChange?.(next);
        return;
      }

      onChange?.(optionValue);
      setIsOpen(false);
    };

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isDarkSurface = appearance === "dark";

    const triggerBorderRing = getTriggerBorderRing(!!error, isOpen, isDarkSurface);

    const {
      triggerSurface,
      placeholderClass,
      inputPlaceholderClass,
      valueColorClass,
      menuSurface,
      itemBase,
      itemSelected,
      checkIconClass,
    } = getDropdownAppearance(isDarkSurface, triggerBorderRing, valueClassName);

    const defaultEditAction = (option: Option) => {
      if (!onEditOption) return null;
      return (
        <button
          type="button"
          title="Editar"
          aria-label={`Editar ${option.label}`}
          onClick={(event) => {
            event.stopPropagation();
            onEditOption(option);
            setIsOpen(false);
          }}
          className={`h-7 w-7 flex items-center ml-auto! justify-center rounded-md border transition-colors ${isDarkSurface
            ? "border-slate-500/40 text-slate-300 hover:text-white hover:border-blue-400 hover:bg-blue-500/10"
            : "border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50"
            }`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </button>
      );
    };

    const optionAction = (option: Option) =>
      renderOptionAction?.(option) ?? defaultEditAction(option);


    const handleDropdownKeyDown = (
      evt: React.KeyboardEvent<HTMLDivElement>, props: HandleDropdownKeyDownProps) => {
      const handler = keyHandlers[evt.key as keyof typeof keyHandlers];
      handler?.(evt, props);
    }

    return (
      <div className="flex flex-col gap-1.5 w-full min-w-0" ref={containerRef}>
        {label && (
          <label
            className={`text-[14px] font-medium ml-0.5 ${labelClassName || "text-slate-600"}`}
          >
            {label}
            {isRequired && !optional && (
              <span className="text-red-500 dark:text-red-400 ml-1 font-bold">
                *
              </span>
            )}
            {optional && (
              <span className="text-slate-400 dark:text-slate-500 ml-1 font-normal text-[12px]">
                (opcional)
              </span>
            )}
          </label>
        )}

        <LazyMotion features={loadFeatures} strict>
          <div className="relative w-full min-w-0" ref={ref}>
            <div
              ref={triggerRef}
              tabIndex={disabled ? -1 : 0}
              aria-disabled={disabled}
              onClick={() => {
                if (disabled) return;
                setIsOpen(!isOpen);
              }}
              onKeyDown={(e) => {

                handleDropdownKeyDown(e, {
                  disabled,
                  isOpen,
                  activeIndex,
                  filteredOptions,
                  handleSelect,
                  setIsOpen,
                  setActiveIndex,
                });
              }}
              className={`
                    flex items-center justify-between w-full min-w-0 h-11 sm:h-12 px-3 sm:px-4 rounded-[10px]
                    transition-all duration-200 text-[14px] sm:text-[15px] outline-none
                    ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
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
                  disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (disabled) return;
                  }}
                  className={`bg-transparent outline-none w-full min-w-0 truncate ${valueColorClass} ${inputPlaceholderClass}`}
                  placeholder={
                    displayLabel
                      ? String(displayLabel)
                      : placeholder || "Buscar..."
                  }
                />
              ) : (
                <span className={`truncate min-w-0 ${!displayLabel ? placeholderClass : valueColorClass}`}>
                  {displayLabel ?? placeholder}
                </span>
              )}

              <m.svg
                onClick={(e) => {
                  e.stopPropagation();
                  if (disabled) return;
                  setIsOpen(!isOpen);
                }}
                animate={{ rotate: isOpen ? 180 : 0 }}
                className={`w-5 h-5 text-slate-400 shrink-0 ml-2 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
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

            {error && errorVariant === "tooltip" && (
              <ErrorTooltip message={error} anchorRef={triggerRef} />
            )}
          </div>
        </LazyMotion>

        <DropdownMenu
          isOpen={isOpen}
          menuPosition={menuPosition}
          menuRef={menuRef}
          listRef={listRef}
          filteredOptions={filteredOptions}
          value={value}
          multiple={multiple}
          activeIndex={activeIndex}
          isDarkSurface={isDarkSurface}
          menuSurface={menuSurface}
          itemBase={itemBase}
          itemSelected={itemSelected}
          checkIconClass={checkIconClass}
          onSelect={handleSelect}
          renderOptionAction={optionAction}
        />

        {error && errorVariant === "text" && (
          <span className="text-xs text-red-500 dark:text-red-400 font-medium ml-1">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Dropdown.displayName = "Dropdown";
