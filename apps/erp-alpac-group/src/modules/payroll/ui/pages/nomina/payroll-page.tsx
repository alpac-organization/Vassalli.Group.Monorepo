import {
  Breadcrumb,
  useTheme,
  Modal,
  Button,
  Dropdown,
  Badges,
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
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import type {
  PayrollProcessRequest,
  PayrollType,
} from "@app/modules/payroll/domain/ApiContract/Requests/payroll-process.request";
import type { PayrollRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-request";
import type { CollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator.request";
import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-payroll";
import { formatIdentificationNumber } from "@app/shared/utils/string.utils";

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
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [tempSelectedBranch, setTempSelectedBranch] = useState<string | null>(
    null,
  );
  const [pageNumber, setPageNumber] = useState(1);
  const [isPayrollSelectionModalOpen, setIsPayrollSelectionModalOpen] =
    useState(false);
  const [selectedPayrollRow, setSelectedPayrollRow] =
    useState<PayrollItemResponse | null>(null);
  const [isPayrollDetailModalOpen, setIsPayrollDetailModalOpen] =
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

  const handleOpenPayrollDetailModal = useCallback(
    (row: PayrollItemResponse) => {
      setSelectedPayrollRow(row);
      setIsPayrollDetailModalOpen(true);
    },
    [],
  );

  const handleClosePayrollDetailModal = useCallback(() => {
    setIsPayrollDetailModalOpen(false);
    setSelectedPayrollRow(null);
  }, []);

  const { GetBranchesQuery: branchesQuery } = useCompanies(
    companyId ? { company_id: companyId } : undefined,
  );

  const branchOptions = (branchesQuery.data ?? []).map((branch) => ({
    label: branch.branch_name,
    value: branch.branch_id,
  }));
  const selectedBranchName =
    (branchesQuery.data ?? []).find(
      (branch) => branch.branch_id === selectedBranch,
    )?.branch_name ?? null;

  const payrollStatusQuery = usePayroll({
    mode: "status",
    payload: {
      companyId,
      moduleCode,
      branch_id: selectedBranch ?? "",
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
      branch_id: selectedBranch ?? "",
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
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-neutral-800 mb-4">
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
            . Inicia uno ahora para comenzar a gestionarlo o cambia al tipo de
            nómina y sucursal que desea consultar.
          </p>

          <div className="flex w-full max-w-2xl flex-col gap-6 sm:flex-row sm:justify-center">
            <Button
              label="Inicializar nómina"
              onClick={() => {}}
              className="w-full! sm:w-[246px]! min-h-[48px]! py-2! text-[14px]! font-normal! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! flex! items-center! justify-center!"
            />
            <Button
              label="Cambiar tipo de nómina"
              onClick={handleOpenChangePayrollSelection}
              className="w-full! sm:w-[246px]! min-h-[48px]! py-2! px-4! text-[14px]! leading-snug! text-center! font-normal! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! flex! items-center! justify-center! gap-2!"
            />
          </div>
        </div>
      );
    }

    if (existPayrollInProgress === true) {
      const detailsData = ordinaryPayrollQuery.data;
      const items = detailsData?.payroll_details?.items ?? [];
      const totalRecords = detailsData?.payroll_details?.total_items ?? 0;

      return (
        <>
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
              onRowClick={handleOpenPayrollDetailModal}
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
        isOpen={isPayrollDetailModalOpen}
        onClose={handleClosePayrollDetailModal}
        variant="default"
        size="7xl"
        title={"Detalles especificos del colaborador"}
      >
        <div className="mt-2 flex flex-col gap-6">
          <section
            aria-labelledby="payroll-detail-collaborator-heading"
            className="rounded-xl border border-slate-200 bg-slate-50/90 p-6 dark:border-neutral-600 dark:bg-[#1e2229]"
          >
            <h5
              id="payroll-detail-collaborator-heading"
              className="mb-5 border-b border-slate-200 pb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-neutral-600 dark:text-slate-400"
            >
              Datos del colaborador
            </h5>
            {selectedPayrollRow?.collaborator ? (
              <dl className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex min-w-0 flex-col gap-1.5">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Código
                  </dt>
                  <dd className="truncate font-mono text-base font-semibold text-slate-900 dark:text-white">
                    {selectedPayrollRow.collaborator.collaborator_code || "—"}
                  </dd>
                </div>
                <div className="flex min-w-0 flex-col gap-1.5">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Nombre completo
                  </dt>
                  <dd className="text-base font-semibold leading-snug text-slate-900 dark:text-white">
                    {selectedPayrollRow.collaborator.full_name || "—"}
                  </dd>
                </div>
                <div className="flex min-w-0 flex-col gap-1.5 md:col-span-2">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Identificación
                  </dt>
                  <dd className="wrap-break-word font-mono text-base font-semibold text-slate-900 dark:text-white">
                    {(() => {
                      const identificationNumber =
                        selectedPayrollRow.collaborator.identification_number;
                      if (!identificationNumber) return "—";
                      if (identificationNumber.length !== 14)
                        return identificationNumber;
                      return formatIdentificationNumber(identificationNumber);
                    })()}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No hay información del colaborador asociada a este registro de
                nómina.
              </p>
            )}
          </section>
        </div>
      </Modal>

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
            onChange={(value) => setTempSelectedBranch(String(value))}
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

        {/* 
          Sección de gestión de nómina.
          - Esta sección incluye presentación adaptable para pantallas pequeñas y grandes.
          - Si no hay nómina en curso, solo se muestra el encabezado de la página.
        */}
        {existPayrollInProgress === true ? (
          <>
            {/* Vista para dispositivos pequeños (móvil/tablet) */}
            <div className="flex flex-col gap-6 lg:hidden">
              <PayrollPageHeader
                logoSrc={activeLogo}
                logoAlt="logo grupo alpac"
                branchName={selectedBranchName}
                onRequestChangePayrollSelection={
                  handleOpenChangePayrollSelection
                }
              />
              <PayrollCycleFormalization
                cicloInicial={ordinaryPayrollQuery.data?.start_date ?? "—"}
                cicloFinal={ordinaryPayrollQuery.data?.end_date ?? "—"}
                existPayrollInProgress={existPayrollInProgress}
                statusLoading={statusFetchInFlight}
                statusError={payrollStatusQuery.isError}
                onRetryProcessStatus={() => payrollStatusQuery.refetch()}
              />
            </div>

            {/* Vista para dispositivos grandes (escritorio) */}
            <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-6 lg:items-start">
              <div className="min-w-0 flex flex-col gap-4">
                <div className="flex flex-col justify-center">
                  <h3 className="p-0! m-0!">Gestión de nómina</h3>
                  <small className="text-gray-500 dark:text-gray-300">
                    Gestión de nómina y estadísticas
                  </small>
                </div>
                <PayrollCycleFormalization
                  cicloInicial={ordinaryPayrollQuery.data?.start_date ?? "—"}
                  cicloFinal={ordinaryPayrollQuery.data?.end_date ?? "—"}
                  existPayrollInProgress={existPayrollInProgress}
                  statusLoading={statusFetchInFlight}
                  statusError={payrollStatusQuery.isError}
                  onRetryProcessStatus={() => payrollStatusQuery.refetch()}
                />
              </div>
              <div className="w-[18rem] flex flex-col items-end gap-3">
                <img
                  className="h-12 sm:h-16 md:h-20 w-auto object-contain"
                  src={activeLogo}
                  alt="logo grupo alpac"
                />
                {selectedBranchName ? (
                  <Badges
                    label={`Nomina de ${selectedBranchName}`}
                    color="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                    className="max-w-72 text-[12px]! font-semibold! leading-snug! wrap-break-word text-right"
                  />
                ) : null}
                <Button
                  type="button"
                  size="giant"
                  label="Cambiar tipo de nómina y sucursal"
                  onClick={handleOpenChangePayrollSelection}
                  className="w-full! min-h-[48px]! px-4! text-center! text-[15px]! leading-snug! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
                />
              </div>
            </div>
          </>
        ) : (
          <PayrollPageHeader
            logoSrc={activeLogo}
            logoAlt="logo grupo alpac"
            branchName={null}
            onRequestChangePayrollSelection={undefined}
          />
        )}

        {selectedPayrollType !== null &&
          selectedBranch !== null &&
          renderContent()}
      </motion.div>
    </>
  );
}
