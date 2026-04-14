import {
  Alert,
  AnimatedAlertWrapper,
  Breadcrumb,
  useTheme,
} from "@alpac/design-system";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ControlVacationPageHeader } from "@app/modules/payroll/ui/pages/control-vacations/components/vacation-page-header/vacation-page-header";
import { ControlVacationFiltersBar } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-filters/filters-bar";
import { useControlVacations } from "@app/modules/payroll/ui/hooks/useVacations";
import type {
  GetVacationsHistoryResponse,
  GetVacationsListResponse,
} from "@app/modules/payroll/domain/ApiContract/Responses/get-control-vacations-response";
import { ControlModalVacationDetails } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacations-details/control-vacacion.details.modal";
import type { ControlVacationHistoryRequest } from "@app/modules/payroll/domain/ApiContract/Requests/control-vacations-request";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Loader } from "@app/shared/components/loaders/loader";
import { ControlVacationsTable } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-table/control-vacations-table";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";

const PAGE_SIZE = 10;

export default function ControlVacationsPage() {
  const navigate = useNavigate();
  const { companyId, moduleCode, identificationNumber, fullName } =
    useUserStore();

  const { theme } = useTheme();
  const { urlImage, neutralUrlImage } = useCompanyStore();

  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;
  const [pageNumber, setPageNumber] = useState(1);
  const [alertState, setAlertState] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({ open: false, type: "success", message: "" });

  useEffect(() => {
    if (!alertState.open) return;
    const timer = window.setTimeout(
      () => setAlertState((prev) => ({ ...prev, open: false })),
      5000,
    );
    return () => window.clearTimeout(timer);
  }, [alertState.open]);

  const historyFilters = useMemo<
    ControlVacationHistoryRequest | undefined
  >(() => {
    if (!companyId || !moduleCode || !identificationNumber) return undefined;
    return {
      company_id: companyId,
      module_code: moduleCode,
      identification_number: identificationNumber,
      page_size: PAGE_SIZE,
      page_number: pageNumber,
    };
  }, [companyId, moduleCode, identificationNumber, pageNumber]);

  const {
    GetControlVacationHistoryQuery,
    generateVacationTableReportMutation,
  } = useControlVacations({
    filtersVacations: historyFilters,
  });

  const [selectedVacationItem, setSelectedVacationItem] =
    useState<GetVacationsHistoryResponse | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const tableData = useMemo<GetVacationsListResponse>(() => {
    const raw = GetControlVacationHistoryQuery.data;
    if (!raw) {
      return {
        data: [],
        total_records: 0,
        page_size: PAGE_SIZE,
        page_number: pageNumber,
        total_vacations: 0,
      };
    }
    return {
      ...raw,
      page_number: pageNumber,
      data: (raw.data ?? []).map((row) => ({
        ...row,
        full_name: fullName ?? row.full_name,
      })),
    };
  }, [GetControlVacationHistoryQuery.data, fullName, pageNumber]);

  const handleApplyFilters = useCallback(() => {
    setPageNumber(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setPageNumber(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  const handleViewDetails = useCallback(
    (row: GetVacationsHistoryResponse) => {
      const item = GetControlVacationHistoryQuery.data?.data?.find(
        (i) =>
          String(i.id_control_vacation) === String(row.id_control_vacation),
      );
      if (!item) return;
      setSelectedVacationItem(item);
      setIsDetailsOpen(true);
    },
    [GetControlVacationHistoryQuery.data],
  );

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
  }, []);

  const handleGenerateTableReport = useCallback(() => {
    if (!companyId || !moduleCode) return;
    generateVacationTableReportMutation.mutate(
      {
        company_id: companyId,
        module_code: moduleCode,
      },
      {
        onSuccess: (data) => {
          const url = data?.document_url?.trim();
          if (url) {
            window.open(url, "_blank", "noopener,noreferrer");
          }
          setAlertState({
            open: true,
            type: "success",
            message: "Documento generado exitosamente.",
          });
        },
        onError: () => {
          setAlertState({
            open: true,
            type: "error",
            message: "No se pudo generar el documento. Intente nuevamente.",
          });
        },
      },
    );
  }, [companyId, moduleCode, generateVacationTableReportMutation]);

  if (
    historyFilters &&
    GetControlVacationHistoryQuery.fetchStatus === "fetching" &&
    GetControlVacationHistoryQuery.data === undefined
  ) {
    return <Loader title="Cargando control de vacaciones..." />;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-0 sm:gap-1">
          <div className="flex justify-start">
            <Breadcrumb
              items={[
                {
                  label: "Dashboard",
                  url: "/",
                  onClick: (url) => navigate(url),
                },
                {
                  label: "Control de vacaciones",
                  url: "/payroll/control-vacations",
                  onClick: (url) => navigate(url),
                },
              ]}
            />
          </div>
          <ControlVacationPageHeader
            collaboratorDisplayName={fullName}
            logoSrc={activeLogo}
            onGenerateTableReportClick={handleGenerateTableReport}
            isGenerateTableReportPending={
              generateVacationTableReportMutation.isPending
            }
          />
        </div>
        <ControlModalVacationDetails
          isOpen={isDetailsOpen}
          onClose={handleCloseDetails}
          item={selectedVacationItem}
          collaboratorFullName={fullName ?? ""}
        />

        <ControlVacationFiltersBar
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />

        <ControlVacationsTable
          data={tableData}
          onPageChange={handlePageChange}
          isPending={GetControlVacationHistoryQuery.isFetching}
          onViewDetails={handleViewDetails}
        />
      </motion.div>

      <AnimatedAlertWrapper open={alertState.open}>
        <Alert
          type={alertState.type}
          title={alertState.type === "success" ? "Éxito" : "Error"}
          message={alertState.message}
          showCloseButton
          onClose={() => setAlertState((prev) => ({ ...prev, open: false }))}
        />
      </AnimatedAlertWrapper>
    </>
  );
}
