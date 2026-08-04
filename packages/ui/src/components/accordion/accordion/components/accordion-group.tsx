import {
  createContext,
  useCallback,
  useContext,
  useId,
  useState,
  type ReactElement,
} from "react";
import { ChevronDown } from "lucide-react";
import type { AccordionType } from "../types/accordion.type";
import type { AccordionGroupProps } from "./types/accordion-group.props";

type AccordionGroupContextValue = {
  type: AccordionType;
  openValues: string[];
  toggle: (value: string) => void;
  collapsible: boolean;
};

export const AccordionGroupContext =
  createContext<AccordionGroupContextValue | null>(null);

function normalizeValues(
  value: string | string[] | undefined,
  type: AccordionType,
): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) {
    return type === "single" ? value.slice(0, 1) : value;
  }
  return [value];
}

export function AccordionGroup({
  children,
  type = "single",
  defaultValue,
  value: valueProp,
  onValueChange,
  className = "",
  collapsible = true,
}: AccordionGroupProps): ReactElement {
  const [uncontrolled, setUncontrolled] = useState(() =>
    normalizeValues(defaultValue, type),
  );
  const isControlled = valueProp !== undefined;
  const openValues = isControlled
    ? normalizeValues(valueProp, type)
    : uncontrolled;

  const setOpenValues = useCallback(
    (next: string[]) => {
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(type === "single" ? (next[0] ?? "") : next);
    },
    [isControlled, onValueChange, type],
  );

  const toggle = useCallback(
    (itemValue: string) => {
      const isOpen = openValues.includes(itemValue);

      if (type === "single") {
        if (isOpen) {
          if (collapsible) setOpenValues([]);
          return;
        }
        setOpenValues([itemValue]);
        return;
      }

      setOpenValues(
        isOpen
          ? openValues.filter((v) => v !== itemValue)
          : [...openValues, itemValue],
      );
    },
    [collapsible, openValues, setOpenValues, type],
  );

  return (
    <AccordionGroupContext.Provider
      value={{ type, openValues, toggle, collapsible }}
    >
      <div className={`flex flex-col gap-2 ${className}`}>{children}</div>
    </AccordionGroupContext.Provider>
  );
}
