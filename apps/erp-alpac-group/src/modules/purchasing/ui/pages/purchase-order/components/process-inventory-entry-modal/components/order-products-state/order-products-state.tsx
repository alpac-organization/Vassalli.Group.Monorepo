import { Button } from "@alpac/design-system";

import type { OrderProductsStateProps } from "./order-products-state.types";

const SKELETON_ROWS = [0, 1, 2, 3] as const;

export const OrderProductsState = function ({
  variant,
  message,
  onRetry,
}: OrderProductsStateProps) {
  if (variant === "loading") {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label="Cargando detalle de la orden de compra"
        className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 dark:border-neutral-700"
      >
        <span className="sr-only">Cargando detalle de la orden de compra…</span>
        <div className="h-4 w-40 animate-pulse rounded bg-slate-200 dark:bg-neutral-700" />
        {SKELETON_ROWS.map((row) => (
          <div
            key={row}
            className="h-10 w-full animate-pulse rounded bg-slate-100 dark:bg-neutral-800"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={`flex flex-col items-center gap-3 rounded-xl border px-4 py-8 text-center ${
        variant === "error"
          ? "border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10"
          : "border-dashed border-slate-200 dark:border-neutral-700"
      }`}
    >
      <p className="m-0 text-sm text-slate-600 dark:text-slate-300">
        {message ??
          (variant === "error"
            ? "No se pudo cargar el detalle de la orden."
            : "Esta orden no tiene productos para procesar.")}
      </p>

      {variant === "error" && onRetry && (
        <Button
          type="button"
          size="medium"
          label="Reintentar"
          onClick={onRetry}
          className="w-full! rounded-md! bg-alpac-primary-500! text-white! dark:bg-alpac-primary-700! sm:w-auto!"
        />
      )}
    </div>
  );
};
