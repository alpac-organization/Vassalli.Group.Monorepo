import { ReactElement, useCallback, useId, useState } from "react";
import { AccordionProps } from "./types/accordion.type";
import { AccordionPanel } from "./components/accordion-panel";
export function Accordion({
  title,
  children,
  leading,
  actions,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
  icon,
}: AccordionProps): ReactElement {
  const baseId = useId();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const isOpen = isControlled ? openProp : uncontrolledOpen;

  const handleToggle = useCallback(() => {
    if (disabled) return;
    const next = !isOpen;
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }, [disabled, isControlled, isOpen, onOpenChange]);

  return (
    <AccordionPanel
      title={title}
      leading={leading}
      actions={actions}
      isOpen={isOpen}
      onToggle={handleToggle}
      disabled={disabled}
      className={className}
      triggerClassName={triggerClassName}
      contentClassName={contentClassName}
      icon={icon}
      panelId={`${baseId}-panel`}
      triggerId={`${baseId}-trigger`}
    >
      {children}
    </AccordionPanel>
  );
}
