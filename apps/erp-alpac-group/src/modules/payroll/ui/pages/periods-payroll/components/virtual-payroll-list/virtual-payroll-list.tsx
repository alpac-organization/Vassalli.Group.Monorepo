import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Button } from "@alpac/design-system";
import { PayrollHistoryCard } from "@app/modules/payroll/ui/pages/periods-payroll/components/payroll-history-card/payroll-history-card";
import { Loader } from "@app/shared/components/loaders/loader";
import { AlertCircle, Milestone } from "lucide-react";
import type { VirtualPayrollListProps } from "@app/modules/payroll/ui/pages/periods-payroll/components/virtual-payroll-list/types/virtual-payroll-list.types";

export function VirtualPayrollList({
  items,
  itemHeight,
  hasNextPage,
  isFetchingNextPage,
  isError,
  fetchNextPage,
  className = "",
}: VirtualPayrollListProps) {
  const isInitialFetchError = isError && items.length === 0;
  const isLoadMoreError = isError && items.length > 0;

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(800);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const overscan = 3;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan,
  );

  const visibleItems = useMemo(() => {
    const result = [];
    for (let i = startIndex; i <= endIndex; i++) {
      if (items[i]) {
        result.push({
          item: items[i],
          index: i,
        });
      }
    }
    return result;
  }, [items, startIndex, endIndex]);

  const totalListHeight = items.length * itemHeight;

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage || isLoadMoreError) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, isLoadMoreError, hasNextPage, fetchNextPage],
  );

  if (isInitialFetchError) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center px-3 py-4 sm:px-4 ${className}`}
      >
        <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-500 p-4 sm:rounded-xl sm:p-6 dark:border-red-800 dark:bg-red-900/10">
          <div className="flex flex-wrap items-center justify-center gap-2 py-2 text-center text-sm font-medium text-red-600 sm:py-12 sm:text-base dark:text-red-400">
            <AlertCircle size={18} className="shrink-0 sm:h-5 sm:w-5" />
            <span>
              Ha ocurrido un Error al cargar el historial inicial. Intente
              nuevamente mas tarde.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`relative overflow-y-auto px-2 sm:px-4 ${className}`}
      style={{ contain: "strict" }}
    >
      <div
        style={{ height: totalListHeight, position: "relative", width: "100%" }}
      >
        {visibleItems.map(({ item, index }) => (
          <PayrollHistoryCard
            key={item.payrollId}
            period={item}
            style={{
              height: itemHeight,
              transform: `translateY(${index * itemHeight}px)`,
            }}
          />
        ))}
      </div>

      <div className="flex w-full flex-col items-center py-2 sm:py-4">
        <div ref={sentinelRef} className="h-1 w-full" />

        {isFetchingNextPage && (
          <div className="flex justify-center items-center py-4 w-full">
            <Loader title="Cargando más periodos..." />
          </div>
        )}

        {isLoadMoreError && (
          <div className="mt-2 flex w-full flex-col items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 sm:mt-4 sm:rounded-xl sm:p-6 dark:border-red-800 dark:bg-red-900/10">
            <div className="flex flex-wrap items-center justify-center gap-2 text-center text-sm font-medium text-red-600 sm:text-base dark:text-red-400">
              <AlertCircle size={18} className="shrink-0 sm:h-5 sm:w-5" />
              <span>
                Ha ocurrido un Error al cargar más periodos de nómina, inténtelo
                nuevamente.
              </span>
            </div>
            <Button
              type="button"
              label="Reintentar"
              onClick={() => fetchNextPage()}
              className="bg-red-400 text-white hover:bg-red-700 dark:bg-red-500/60 dark:hover:bg-red-600/40"
            />
          </div>
        )}

        {!hasNextPage && items.length > 0 && !isFetchingNextPage && (
          <div className="flex w-full justify-center px-2 py-3 sm:px-4 sm:py-5">
            <div className="flex w-full max-w-2xl flex-col items-center justify-center rounded-lg border border-red-200 bg-red-500 p-3 sm:rounded-xl sm:p-6 dark:border-red-800 dark:bg-red-900/10">
              <div className="flex flex-wrap items-center justify-center gap-2 text-center text-xs font-medium text-red-600 sm:text-sm dark:text-red-400">
                <Milestone
                  size={16}
                  className="shrink-0 sm:h-5 sm:w-5"
                />
                <span>Has llegado al final del historial de periodos.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
