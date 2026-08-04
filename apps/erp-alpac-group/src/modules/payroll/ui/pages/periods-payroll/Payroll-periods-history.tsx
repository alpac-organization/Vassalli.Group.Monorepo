import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Breadcrumb,
  Dropdown,
  Modal,
  Button,
  useTheme,
} from "@alpac/design-system";
import {
  payrollTypeOptions,
  DROPDOWN_DISABLED_TRIGGER_CLASS,
} from "@app/modules/payroll/ui/pages/nomina/constants/payroll.constants";
import { Loader } from "@app/shared/components/loaders/loader";
import { useNavigate, useParams } from "react-router-dom";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import { usePayrollPeriodsHistory } from "@app/modules/payroll/ui/hooks/payroll/usePayrollPeriodsHistory";
import { VirtualPayrollList } from "@app/modules/payroll/ui/pages/periods-payroll/components/virtual-payroll-list/virtual-payroll-list";
import { PayrollPeriodsSummary } from "@app/modules/payroll/ui/pages/periods-payroll/components/payroll-periods-summary/payroll-periods-summary";
import { PayrollPeriodsResultsHeader } from "@app/modules/payroll/ui/pages/periods-payroll/components/payroll-periods-results-header/payroll-periods-results-header";
import type { PayrollPeriodSummaryStatItem } from "@app/modules/payroll/ui/pages/periods-payroll/components/payroll-periods-summary/payroll-periods-summary.types";
import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
import { PAYROLL_TYPE_LABELS } from "@app/modules/payroll/domain/enums/payroll-enums/payroll-enum";
import { AlertCircle, History, UserCheck } from "lucide-react";

const CARD_HEIGHT_DESKTOP = 200;
const MOBILE_LAYOUT_BREAKPOINT = "(max-width: 767px)";

export function PayrollPeriodsHistoryPage() {
  const navigate = useNavigate();
  const { alias_company } = useParams();
  const { theme } = useTheme();
  const { companyId, moduleCode } = useUserStore();
  const { GetBranchesQuery: branchesQuery } = useCompanies(
    companyId ? { company_id: companyId } : undefined,
  );

  const [selectedPayrollType, setSelectedPayrollType] =
    useState<PayrollType | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [tempSelectedType, setTempSelectedType] = useState<PayrollType | null>(
    null,
  );
  const [tempSelectedBranch, setTempSelectedBranch] = useState<string | null>(
    null,
  );
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(MOBILE_LAYOUT_BREAKPOINT).matches
      : false,
  );
  const [listRowHeight, setListRowHeight] = useState(CARD_HEIGHT_DESKTOP);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_LAYOUT_BREAKPOINT);
    const apply = () => {
      const mobile = mq.matches;
      setIsMobileLayout(mobile);
      if (!mobile) {
        setListRowHeight(CARD_HEIGHT_DESKTOP);
      }
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const branchOptions = useMemo(() => {
    return (branchesQuery.data ?? []).map((branch) => ({
      label: branch.branch_name,
      value: branch.branch_id,
    }));
  }, [branchesQuery.data]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = usePayrollPeriodsHistory({
    payload: {
      companie_id: companyId,
      module_code: moduleCode,
      type: selectedPayrollType ?? "None",
      branch_id: selectedBranch ?? "",
      page_size: 10,
    },
    enabled: selectedBranch !== null && selectedPayrollType !== null,
  });

  const allItems = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page);
  }, [data]);

  const selectedBranchLabel = useMemo(
    () => branchOptions.find((b) => b.value === selectedBranch)?.label ?? "",
    [branchOptions, selectedBranch],
  );

  const summaryStats = useMemo<PayrollPeriodSummaryStatItem[]>(() => {
    const currentYear = new Date().getFullYear();
    return [
      {
        id: "closed-periods",
        icon: History,
        iconContainerClassName: "bg-blue-500/10 dark:bg-blue-500/10",
        iconClassName: "text-blue-500 dark:text-blue-400",
        label: "Periodos cerrados",
        value: allItems.length > 0 ? allItems.length : "—",
        subLabel: `En ${currentYear}`,
      },
      {
        id: "active-employees",
        icon: UserCheck,
        iconContainerClassName: "bg-emerald-500/10 dark:bg-emerald-500/10",
        iconClassName: "text-emerald-500 dark:text-emerald-400",
        label: "Empleados activos",
        value: "—",
        subLabel: "Último periodo",
      },
    ];
  }, [allItems.length]);

  const periodTypeLabel = selectedPayrollType
    ? (PAYROLL_TYPE_LABELS[
        selectedPayrollType as keyof typeof PAYROLL_TYPE_LABELS
      ] ?? selectedPayrollType)
    : "";

  const handleSelectionModalClose = useCallback(() => {
    if (selectedPayrollType === null || selectedBranch === null) {
      navigate("/dashboard");
    } else {
      setIsSelectionModalOpen(false);
    }
  }, [selectedPayrollType, selectedBranch, navigate]);

  const handleConfirmTypeSelection = useCallback(() => {
    if (tempSelectedType && tempSelectedBranch) {
      setSelectedPayrollType(tempSelectedType);
      setSelectedBranch(tempSelectedBranch);
      setIsSelectionModalOpen(false);
    }
  }, [tempSelectedType, tempSelectedBranch]);

  const handleOpenChangePayrollSelection = useCallback(() => {
    setTempSelectedType(selectedPayrollType);
    setTempSelectedBranch(selectedBranch);
    setIsSelectionModalOpen(true);
  }, [selectedPayrollType, selectedBranch]);

  const isSelectionReady =
    selectedBranch !== null && selectedPayrollType !== null;

  return (
    <div className="flex min-h-0 flex-col gap-3 sm:gap-4 max-md:h-auto md:h-[calc(100vh-100px)]">
      <Modal
        isOpen={
          selectedPayrollType === null ||
          selectedBranch === null ||
          isSelectionModalOpen
        }
        onClose={handleSelectionModalClose}
        variant="default"
        size="sm"
        title="Seleccionar Nómina"
        description="Por favor, seleccione primero la sucursal y luego el tipo de nómina que desea consultar."
      >
        <div className="mt-4 flex flex-col gap-4">
          <Dropdown
            label="Sucursal"
            placeholder="Seleccione una sucursal"
            options={branchOptions}
            value={tempSelectedBranch || undefined}
            appearance={theme === "dark" ? "dark" : "default"}
            labelClassName="text-white!"
            onChange={(value) => {
              setTempSelectedBranch(String(value));
              setTempSelectedType(null);
            }}
          />
          <Dropdown
            label="Tipo de nómina"
            placeholder="Seleccione tipo de nómina"
            options={payrollTypeOptions}
            value={tempSelectedType || undefined}
            appearance={theme === "dark" ? "dark" : "default"}
            labelClassName="text-white!"
            className={
              !tempSelectedBranch ? DROPDOWN_DISABLED_TRIGGER_CLASS : undefined
            }
            onChange={(value) => setTempSelectedType(value as PayrollType)}
          />
        </div>
        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:items-stretch">
          <Button
            type="button"
            size="giant"
            label="Consultar"
            onClick={handleConfirmTypeSelection}
            disabled={!tempSelectedType || !tempSelectedBranch}
            className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:flex-1 sm:min-w-0 enabled:opacity-100! disabled:pointer-events-none disabled:opacity-50 disabled:saturate-75"
          />
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            onClick={handleSelectionModalClose}
            className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:flex-1 sm:min-w-0"
          />
        </div>
      </Modal>

      <div className="flex justify-start">
        <Breadcrumb
          items={[
            {
              label: "Dashboard",
              url: `/${alias_company}/dashboard`,
              onClick: (url) => navigate(url),
            },
            {
              label: "Historial de periodos",
              url: `/${alias_company}/dashboard/payroll/historial-periodos-nomina`,
              onClick: (url) => navigate(url),
            },
          ]}
        />
      </div>

      <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-200 pb-3 dark:border-neutral-700 sm:gap-4 sm:pb-4 md:flex-row md:items-end">
        <div className="min-w-0 pr-1">
          <h3 className="m-0 text-xl font-bold leading-tight text-slate-800 sm:text-2xl dark:text-white">
            Historial de Periodos de Nómina
          </h3>
          <p className="mt-1 text-xs leading-snug text-slate-500 sm:text-sm dark:text-slate-300">
            Visualiza de forma cronológica todos los periodos procesados
          </p>
        </div>
        <div className="w-full md:w-auto">
          {isSelectionReady && (
            <Button
              type="button"
              size="giant"
              label="Cambiar tipo de nómina y sucursal"
              onClick={handleOpenChangePayrollSelection}
              className="w-full! md:w-auto! min-h-[40px]! px-4! text-center! text-[14px]! leading-snug! font-normal! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
            />
          )}
        </div>
      </div>

      {isSelectionReady && !isLoading && (
        <PayrollPeriodsSummary stats={summaryStats} />
      )}

      {isSelectionReady && !isLoading && allItems.length > 0 && (
        <PayrollPeriodsResultsHeader
          totalPeriods={allItems.length}
          periodTypeLabel={periodTypeLabel}
          branchName={selectedBranchLabel}
        />
      )}

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-slate-200 bg-slate-50/50 p-3 max-md:flex-none max-md:overflow-visible max-md:min-h-0 sm:rounded-xl sm:p-2 dark:border-neutral-800 dark:bg-[#15181e]/50">
        {!isSelectionReady && (
          <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
            <p>
              Por favor, seleccione primero la sucursal y luego el tipo de
              nómina para ver el historial.
            </p>
          </div>
        )}

        {isSelectionReady && isLoading && (
          <Loader title="Cargando historial de periodos..." />
        )}

        {isSelectionReady &&
          !isLoading &&
          allItems.length === 0 &&
          !isError && (
            <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
              <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-500 p-4 sm:rounded-xl sm:p-6 dark:border-red-800 dark:bg-red-900/10">
                <div className="flex flex-wrap items-center justify-center gap-2 py-2 text-center text-sm font-medium text-red-600 sm:py-12 sm:text-base dark:text-red-400">
                  <AlertCircle size={18} className="shrink-0 sm:h-5 sm:w-5" />
                  <p>
                    No se encontraron periodos de nómina para esta selección.
                  </p>
                </div>
              </div>
            </div>
          )}

        {isSelectionReady && !isLoading && (allItems.length > 0 || isError) && (
          <VirtualPayrollList
            items={allItems}
            itemHeight={listRowHeight}
            hasNextPage={!!hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isError={isError}
            fetchNextPage={fetchNextPage}
            isMobileLayout={isMobileLayout}
            className={isMobileLayout ? "w-full" : "h-full w-full"}
            selectedBranch={selectedBranch}
            selectedPayrollType={selectedPayrollType}
          />
        )}
      </div>
    </div>
  );
}
