import type { CatalogLinkItemForm } from "../catalog-link-editor.types";

export const loadMotionFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

export const itemAccordionValue = (item: CatalogLinkItemForm, index: number) =>
  item.entity_id || `tmp-${index}`;

export const resolveOpenItem = (
  items: CatalogLinkItemForm[],
  previousLength: number,
  currentOpen: string,
) => {
  if (items.length === 0) return "";

  if (items.length > previousLength) {
    return itemAccordionValue(items[items.length - 1], items.length - 1);
  }

  if (!currentOpen) return currentOpen;

  const stillExists = items.some(
    (item, index) => itemAccordionValue(item, index) === currentOpen,
  );

  if (stillExists) return currentOpen;

  return itemAccordionValue(items[items.length - 1], items.length - 1);
};
