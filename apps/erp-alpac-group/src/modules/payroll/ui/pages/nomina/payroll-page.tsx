import {
  Breadcrumb,
  useTheme,
  Modal,
  Button,
  Dropdown,
} from "@alpac/design-system";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileX } from "lucide-react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { usePayroll } from "@app/modules/payroll/ui/hooks/usePayroll";
import { Loader } from "@app/shared/components/loaders/loader";
import PayrollPageHeader from "@app/modules/payroll/ui/pages/nomina/components/payroll-page-header/payroll-page-header";
import PayrollCycleFormalization from "@app/modules/payroll/ui/pages/nomina/components/payroll-cycle-formalization/payroll-cycle-formalization";
import PayrollFiltersBar from "@app/modules/payroll/ui/pages/nomina/components/payroll-filters/payroll-filtersbar";
import { PayrollTable } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/payroll-table";
import { CatalogEnum } from "@app/core/enums/catalog.enum";
import { useCatalog } from "@app/modules/catalog/ui/hooks/useCatalog";
import { mapCatalogToOptions } from "@app/shared/utils/catalog.utils";
import type {
  PayrollProcessRequest,
  PayrollType,
} from "@app/modules/payroll/domain/ApiContract/Requests/payroll-process.request";
import type { PayrollRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-request";
import type { CollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator.request";

export function PayrollPage() {
  const maxPageSize = 10;
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { companyId, moduleCode } = useUserStore();
  const { urlImage, neutralUrlImage } = useCompanyStore();
  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

  const [selectedPayrollType, setSelectedPayrollType] =
    useState<PayrollType | null>(null);
  const [tempSelectedType, setTempSelectedType] = useState<PayrollType | null>(
    null,
  );
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [tempSelectedBranch, setTempSelectedBranch] = useState<number | null>(
    null,
  );
  const [pageNumber, setPageNumber] = useState(1);
  const [isPayrollSelectionModalOpen, setIsPayrollSelectionModalOpen] =
    useState(false);

  const handleSelectionModalClose = useCallback(() => {
    if (selectedPayrollType === null || selectedBranch === null) {
      navigate("/dashboard");
    } else {
      setIsPayrollSelectionModalOpen(false);
    }
  }, [selectedPayrollType, selectedBranch, navigate]);

  const handleOpenChangePayrollSelection = useCallback(() => {
    if (selectedPayrollType !== null && selectedBranch !== null) {
      setTempSelectedType(selectedPayrollType);
      setTempSelectedBranch(selectedBranch);
      setIsPayrollSelectionModalOpen(true);
    }
  }, [selectedPayrollType, selectedBranch]);

  const { GetCatalogListQuery: branchesQuery } = useCatalog({
    company_id: companyId,
    catalog_type_id: CatalogEnum.BRANCHES,
  });

  const branchOptions = mapCatalogToOptions(branchesQuery.data ?? []);

  const payrollStatusQuery = usePayroll({
    mode: "status",
    payload: {
      companyId,
      moduleCode,
      branch_id: selectedBranch ?? 0,
      payrol_type: selectedPayrollType ?? "Ordinary",
    } as PayrollProcessRequest,
    enabled: selectedPayrollType !== null && selectedBranch !== null,
  });

  const existPayrollInProgress =
    payrollStatusQuery.data?.exist_payroll_in_progress;

  const ordinaryPayrollQuery = usePayroll({
    mode: "details",
    payload: {
      companie_id: companyId,
      module_code: moduleCode,
      type: selectedPayrollType ?? "None",
      branch_id: selectedBranch ?? 0,
      page_number: pageNumber,
      page_size: maxPageSize,
    } as PayrollRequest,
    enabled:
      selectedPayrollType !== null &&
      selectedBranch !== null &&
      existPayrollInProgress === true,
  });

  const statusFetchInFlight =
    selectedPayrollType !== null &&
    selectedBranch !== null &&
    payrollStatusQuery.isFetching;
  const detailsFetchInFlight =
    selectedPayrollType !== null &&
    selectedBranch !== null &&
    existPayrollInProgress === true &&
    ordinaryPayrollQuery.isFetching;

  const handleConfirmTypeSelection = useCallback(() => {
    if (tempSelectedType && tempSelectedBranch) {
      setSelectedPayrollType(tempSelectedType);
      setSelectedBranch(tempSelectedBranch);
      setIsPayrollSelectionModalOpen(false);
      setPageNumber(1);
    }
  }, [tempSelectedType, tempSelectedBranch]);

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  const handleApplyFilters = useCallback(
    (
      _data: Pick<
        CollaboratorRequest,
        "identification_number" | "area_id" | "branch_id"
      >,
    ) => {
      setPageNumber(1);
    },
    [],
  );

  const handleClearFilters = useCallback(() => {
    setPageNumber(1);
  }, []);

  const payrollTypeOptions = [
    { label: "Ordinaria", value: "Ordinary" },
    { label: "Variable", value: "Provided" },
  ];
  const renderContent = () => {
    if (existPayrollInProgress === false) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-[#272b34] rounded-xl border border-slate-200 dark:border-neutral-700 shadow-sm mt-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-neutral-800 mb-6">
            <FileX
              size={32}
              className="text-slate-400 dark:text-slate-500"
              strokeWidth={1.5}
            />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            No hay nómina en curso
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
            No se ha inicializado un proceso de nómina para el tipo seleccionado
            . Inicia uno ahora para comenzar a gestionarlo.
          </p>
          <Button
            label="Inicializar nómina"
            size="giant"
            onClick={() => {
              /* Placeholder para iniciar nomina */
            }}
            className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
          />
        </div>
      );
    }

    if (existPayrollInProgress === true) {
      const detailsData = ordinaryPayrollQuery.data;
      const items = detailsData?.payroll_details?.items ?? [];
      const totalRecords = detailsData?.payroll_details?.total_items ?? 0;
      const cicloInicial = detailsData?.start_date ?? "—";
      const cicloFinal = detailsData?.end_date ?? "—";

      return (
        <>
          <PayrollCycleFormalization
            cicloInicial={cicloInicial}
            cicloFinal={cicloFinal}
            existPayrollInProgress={existPayrollInProgress}
            statusLoading={statusFetchInFlight}
            statusError={payrollStatusQuery.isError}
            onRetryProcessStatus={() => payrollStatusQuery.refetch()}
            onRequestChangePayrollSelection={handleOpenChangePayrollSelection}
          />
          <PayrollFiltersBar
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
          />
          <div className="flex flex-col">
            <PayrollTable
              rows={items}
              currentPage={pageNumber}
              pageSize={maxPageSize}
              totalRecords={totalRecords}
              onPageChange={handlePageChange}
              isPending={detailsFetchInFlight}
            />
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <>
      <Modal
        isOpen={
          selectedPayrollType === null ||
          selectedBranch === null ||
          isPayrollSelectionModalOpen
        }
        onClose={handleSelectionModalClose}
        variant="default"
        size="sm"
        title="Seleccionar Nómina"
        description="Por favor, primeramente seleccione el tipo de nómina y la sucursal que desea consultar."
      >
        <div className="mt-4 flex flex-col gap-4">
          <Dropdown
            label="Tipo de nómina"
            placeholder="Seleccione tipo de nómina"
            options={payrollTypeOptions}
            value={tempSelectedType || undefined}
            appearance={theme === "dark" ? "dark" : "default"}
            labelClassName="text-white!"
            onChange={(value) => setTempSelectedType(value as PayrollType)}
          />
          <Dropdown
            label="Sucursal"
            placeholder="Seleccione una sucursal"
            options={branchOptions}
            value={tempSelectedBranch || undefined}
            appearance={theme === "dark" ? "dark" : "default"}
            labelClassName="text-white!"
            onChange={(value) => setTempSelectedBranch(Number(value))}
          />
        </div>
        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:items-stretch">
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            onClick={handleSelectionModalClose}
            className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:flex-1 sm:min-w-0"
          />
          <Button
            type="button"
            size="giant"
            label="Consultar"
            onClick={handleConfirmTypeSelection}
            disabled={!tempSelectedType || !tempSelectedBranch}
            className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:flex-1 sm:min-w-0 enabled:opacity-100! disabled:pointer-events-none disabled:opacity-50 disabled:saturate-75"
          />
        </div>
      </Modal>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        {(statusFetchInFlight || detailsFetchInFlight) && (
          <Loader
            title={
              statusFetchInFlight
                ? "Consultando proceso de nómina..."
                : "Cargando detalles de nómina..."
            }
          />
        )}

        <div className="flex justify-start">
          <Breadcrumb
            items={[
              { label: "Dashboard", url: "/", onClick: (url) => navigate(url) },
              {
                label: "Gestión de nómina",
                url: "/payroll/gestion-nomina",
                onClick: (url) => navigate(url),
              },
            ]}
          />
        </div>

        <PayrollPageHeader logoSrc={activeLogo} logoAlt="logo grupo alpac" />

        {selectedPayrollType !== null &&
          selectedBranch !== null &&
          renderContent()}
      </motion.div>
    </>
  );
}
