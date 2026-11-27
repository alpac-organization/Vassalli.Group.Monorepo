import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, CheckCircle2, Filter, Search, X } from "lucide-react";
import {
  Breadcrumb,
  Button,
  InputText,
  SectionHeader,
  TabHeader,
  useTheme,
} from "@alpac/design-system";

import { StockDailyReportModal } from "@app/modules/Inventory/ui/pages/reports/stock-daily/stock-daily-report-modal";
import { OutputsByEquipmentReportModal } from "@app/modules/Inventory/ui/pages/reports/outputs-by-equipment/outputs-by-equipment-report-modal";
import { OutputsDetailByEquipmentReportModal } from "@app/modules/Inventory/ui/pages/reports/outputs-detail-by-equipment/outputs-detail-by-equipment-report-modal";
import { OutputsConsolidatedByEquipmentReportModal } from "@app/modules/Inventory/ui/pages/reports/outputs-consolidated-by-equipment/outputs-consolidated-by-equipment-report-modal";
import { InventoryPeriodReportModal } from "@app/modules/Inventory/ui/pages/reports/inventory-period/inventory-period-report-modal";
import { InventoryMovementReportModal } from "@app/modules/Inventory/ui/pages/reports/inventory-movements/inventory-movement-report-modal";
import { InventoryTurnoverReportModal } from "@app/modules/Inventory/ui/pages/reports/inventory-turnover/inventory-turnover-report-modal";
import { KardexReportModal } from "@app/modules/Inventory/ui/pages/reports/kardex/kardex-report-modal";

import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";

import {
  REPORT_CATALOG,
  REPORT_CATEGORIES,
  REPORT_CATEGORY_ORDER,
} from "./reports.constants";
import type { ReportCatalogItem, ReportCategoryId } from "./reports.types";

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim();

export const Reports = function () {
  const navigate = useNavigate();
  const { baseUrl } = useBaseUrl();
  const { moduleBasePath } = useUserStore();
  const { urlImage, neutralUrlImage } = useCompanyStore();
  const { theme } = useTheme();
  const { AlertComponent } = useAlertState();

  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

  const [activeCategory, setActiveCategory] =
    useState<ReportCategoryId>("existences");
  const [searchQuery, setSearchQuery] = useState("");

  const [isStockDailyModalOpen, setIsStockDailyModalOpen] = useState(false);
  const [isOutputsByEquipmentModalOpen, setIsOutputsByEquipmentModalOpen] =
    useState(false);
  const [
    isOutputsDetailByEquipmentModalOpen,
    setIsOutputsDetailByEquipmentModalOpen,
  ] = useState(false);
  const [
    isOutputsConsolidatedByEquipmentModalOpen,
    setIsOutputsConsolidatedByEquipmentModalOpen,
  ] = useState(false);
  const [isInventoryPeriodModalOpen, setIsInventoryPeriodModalOpen] =
    useState(false);
  const [isInventoryMovementModalOpen, setIsInventoryMovementModalOpen] =
    useState(false);
  const [isInventoryTurnoverModalOpen, setIsInventoryTurnoverModalOpen] =
    useState(false);
  const [isKardexModalOpen, setIsKardexModalOpen] = useState(false);

  const openReportBySlug: Record<string, () => void> = {
    "stock-daily": () => setIsStockDailyModalOpen(true),
    "inventory-period": () => setIsInventoryPeriodModalOpen(true),
    kardex: () => setIsKardexModalOpen(true),
    "inventory-movements": () => setIsInventoryMovementModalOpen(true),
    "inventory-turnover": () => setIsInventoryTurnoverModalOpen(true),
    "outputs-by-equipment": () => setIsOutputsByEquipmentModalOpen(true),
    "outputs-detail-by-equipment": () =>
      setIsOutputsDetailByEquipmentModalOpen(true),
    "outputs-consolidated-by-equipment": () =>
      setIsOutputsConsolidatedByEquipmentModalOpen(true),
  };

  const handleTriggerReport = (report: ReportCatalogItem) => {
    if (!report.isAvailable) return;
    const handler = openReportBySlug[report.slug];
    if (handler) {
      handler();
    }
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<ReportCategoryId, number> = {
      existences: 0,
      movements: 0,
      "equipment-outputs": 0,
    };

    for (const item of REPORT_CATALOG) {
      counts[item.categoryId] += 1;
    }

    return counts;
  }, []);

  const categoryTabs = useMemo(
    () =>
      REPORT_CATEGORY_ORDER.map((categoryId) => ({
        id: categoryId,
        label: `${REPORT_CATEGORIES[categoryId].tabLabel} (${categoryCounts[categoryId]})`,
      })),
    [categoryCounts],
  );

  const filteredReports = useMemo(() => {
    const query = normalizeText(searchQuery);

    return REPORT_CATALOG.filter((item) => {
      if (item.categoryId !== activeCategory) {
        return false;
      }

      if (!query) return true;

      const searchableBlob = normalizeText(
        [
          item.title,
          item.description,
          ...item.highlights,
          ...item.availableFilters,
        ].join(" "),
      );

      return searchableBlob.includes(query);
    });
  }, [activeCategory, searchQuery]);

  const currentCategory = REPORT_CATEGORIES[activeCategory];
  const CurrentCategoryIcon = currentCategory.icon;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex min-w-0 justify-start overflow-x-auto">
        <Breadcrumb
          items={[
            {
              label: "Dashboard",
              url: `${baseUrl}/`,
              onClick: (url) => navigate(url),
            },
            {
              label: "Gestión de Reportes",
              url: `${baseUrl}/${moduleBasePath}/reports-management`,
              onClick: (url) => navigate(url),
            },
          ]}
        />
      </div>

      <div className="flex min-w-0 flex-row items-start justify-between gap-4 sm:items-center">
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <SectionHeader
            title="Gestión de Reportes"
            subtitle="Selecciona una categoría operativa, revisa el alcance de cada reporte y configura sus filtros antes de exportar o consultar."
          />
        </div>

        {activeLogo && (
          <img
            className="h-10 w-auto max-w-[35%] shrink-0 self-start object-contain sm:h-16 sm:max-w-none sm:self-center md:h-20"
            src={activeLogo}
            alt="Logo de la empresa"
          />
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between dark:border-slate-600 dark:bg-[#272b34]">
        <div className="min-w-0 flex-1">
          <TabHeader
            tabs={categoryTabs}
            activeTab={activeCategory}
            onTabChange={(nextTab) => setActiveCategory(nextTab)}
          />
        </div>

        <div className="relative w-full lg:w-80">
          <InputText
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Buscar en esta categoría..."
            icon={<Search size={16} />}
            className="h-10! rounded-lg! border-slate-300! bg-slate-50! text-sm! text-slate-900! placeholder:text-slate-400! dark:border-slate-600! dark:bg-[#1e2229]! dark:text-white!"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Limpiar búsqueda"
              className="absolute inset-y-0 right-2.5 my-auto flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-600 dark:bg-[#272b34]">
          <span className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-[#1e2229] dark:text-slate-300">
            <Search size={20} />
          </span>
          <div className="max-w-md">
            <h4 className="m-0 text-base font-semibold text-slate-900 dark:text-white">
              No se encontraron reportes en &ldquo;{currentCategory.tabLabel}&rdquo;
            </h4>
            <p className="m-0 mt-1 text-sm text-slate-500 dark:text-slate-400">
              Intenta con otro término de búsqueda o limpia el filtro actual.
            </p>
          </div>
          <Button
            size="small"
            label="Limpiar búsqueda"
            onClick={() => setSearchQuery("")}
          />
        </div>
      ) : (
        <section className="flex flex-col gap-4">
          <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 shadow-xs dark:border-slate-600 dark:bg-[#272b34]">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 ${currentCategory.accentBgClass} ${currentCategory.accentTextClass} ${currentCategory.accentRingClass}`}
              >
                <CurrentCategoryIcon size={19} />
              </span>
              <div className="min-w-0">
                <h3 className="m-0 text-base font-semibold text-slate-900 dark:text-white">
                  {currentCategory.title}
                </h3>
                <p className="m-0 text-xs text-slate-500 dark:text-slate-400">
                  {currentCategory.subtitle}
                </p>
              </div>
            </div>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-600 dark:bg-[#1e2229] dark:text-slate-300">
              {filteredReports.length}{" "}
              {filteredReports.length === 1 ? "reporte" : "reportes"}
            </span>
          </header>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredReports.map((item) => {
              const ItemIcon = item.icon;

              return (
                <article
                  key={item.slug}
                  className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-alpac-primary-500/60 hover:shadow-md dark:border-slate-600 dark:bg-[#272b34] dark:hover:border-alpac-primary-500/70"
                >
                  <div className="flex flex-col gap-3.5">
                    <div className="flex items-start gap-3.5">
                      <span
                        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ring-1 transition-transform duration-200 group-hover:scale-[1.03] ${currentCategory.accentBgClass} ${currentCategory.accentTextClass} ${currentCategory.accentRingClass}`}
                      >
                        <ItemIcon size={20} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <h4 className="m-0 text-base font-semibold text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                        <p className="m-0 mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <ul className="m-0 flex list-none flex-col gap-1.5 border-t border-slate-100 pt-3 p-0 dark:border-slate-700/70">
                      {item.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300"
                        >
                          <CheckCircle2
                            size={13}
                            className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                          />
                          <span className="leading-snug">{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <Filter size={11} />
                        Filtros:
                      </span>
                      {item.availableFilters.map((filterLabel) => (
                        <span
                          key={filterLabel}
                          className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-600 dark:bg-[#1e2229] dark:text-slate-300"
                        >
                          {filterLabel}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end border-t border-slate-200 pt-3.5 dark:border-slate-700">
                    <Button
                      size="small"
                      label={item.actionLabel}
                      disabled={!item.isAvailable}
                      icon={
                        item.isAvailable ? (
                          <ArrowUpRight size={14} />
                        ) : undefined
                      }
                      onClick={() => handleTriggerReport(item)}
                      className={
                        item.isAvailable
                          ? "rounded-lg! bg-alpac-primary-500! hover:bg-alpac-primary-700! text-white!"
                          : "rounded-lg!"
                      }
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <OutputsByEquipmentReportModal
        isOpen={isOutputsByEquipmentModalOpen}
        onClose={() => setIsOutputsByEquipmentModalOpen(false)}
      />

      <OutputsDetailByEquipmentReportModal
        isOpen={isOutputsDetailByEquipmentModalOpen}
        onClose={() => setIsOutputsDetailByEquipmentModalOpen(false)}
      />

      <OutputsConsolidatedByEquipmentReportModal
        isOpen={isOutputsConsolidatedByEquipmentModalOpen}
        onClose={() => setIsOutputsConsolidatedByEquipmentModalOpen(false)}
      />

      <StockDailyReportModal
        isOpen={isStockDailyModalOpen}
        onClose={() => setIsStockDailyModalOpen(false)}
      />

      <InventoryPeriodReportModal
        isOpen={isInventoryPeriodModalOpen}
        onClose={() => setIsInventoryPeriodModalOpen(false)}
      />

      <InventoryMovementReportModal
        isOpen={isInventoryMovementModalOpen}
        onClose={() => setIsInventoryMovementModalOpen(false)}
      />

      <InventoryTurnoverReportModal
        isOpen={isInventoryTurnoverModalOpen}
        onClose={() => setIsInventoryTurnoverModalOpen(false)}
      />

      <KardexReportModal
        isOpen={isKardexModalOpen}
        onClose={() => setIsKardexModalOpen(false)}
      />

      {AlertComponent}
    </div>
  );
};
