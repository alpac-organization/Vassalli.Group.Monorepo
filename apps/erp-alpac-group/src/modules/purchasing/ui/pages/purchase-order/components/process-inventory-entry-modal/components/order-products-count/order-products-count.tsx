import type { OrderProductsCountProps } from "./order-products-count.types";

export const OrderProductsCount = function ({
  itemCount,
}: OrderProductsCountProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-neutral-600 dark:bg-neutral-900/40 dark:text-slate-300">
      {itemCount} {itemCount === 1 ? "ítem" : "ítems"}
    </span>
  );
};
