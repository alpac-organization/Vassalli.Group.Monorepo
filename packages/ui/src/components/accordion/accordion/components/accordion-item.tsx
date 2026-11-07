import { ReactElement, useContext, useId } from "react";
import { AccordionItemProps } from "./types/accordion-item.props";
import { AccordionGroupContext } from "./accordion-group";
import { AccordionPanel } from "./accordion-panel";
export function AccordionItem({
  value,
  title,
  children,
  leading,
  actions,
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
  icon
}: AccordionItemProps): ReactElement {

  const ctx = useContext(AccordionGroupContext);
  const baseId = useId();

  if (!ctx) {
    throw new Error("AccordionItem debe usarse dentro de un AccordionGroup.");
  }

  const isOpenItem = ctx.openValues.includes(value);

  return (
    <AccordionPanel
      title={title}
      leading={leading}
      actions={actions}
      isOpen={isOpenItem}
      onToggle={() => {
        if (!disabled) ctx.toggle(value);
      }}
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
