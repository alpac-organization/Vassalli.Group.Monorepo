import {
  Alert,
  AnimatedAlertWrapper,
  Breadcrumb,
  useTheme,
} from "@alpac/design-system";
import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ControlVacationPageHeader } from "./components/vacation-page-header/vacation-page-header";
import { ControlVacationFiltersBar } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-filters/filters-bar";
import { useControlVacations } from "@app/modules/payroll/ui/hooks/useVacations";
import type { ControlVacationHistoryRow } from "@app/modules/payroll/domain/ApiContract/Requests/vacation-request";
import { ControlModalVacationDetails } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacations-details/control-vacacion.details.modal";
import type { ControlVacationHistoryRequest } from "@app/modules/payroll/domain/ApiContract/Requests/vacation-request";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Loader } from "@app/shared/components/loaders/loader";
import type { GetVacationsHistoryResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-vacations-response";
import { ControlVacationsTable } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-table/control-vacations-table";
import type { ControlVacationStatusFilterValues } from "@app/modules/payroll/domain/ApiContract/Requests/vacation-request";
import type { ControlVacationGenerateRequest } from "@app/modules/payroll/domain/ApiContract/Requests/vacation-generate-request";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";

export default function ControlVacationsPage() {
  const navigate = useNavigate();
  const { companyId, moduleCode, identificationNumber, fullName } =
    useUserStore();

  const { theme } = useTheme();
  const { urlImage, neutralUrlImage } = useCompanyStore();

  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;
  const [filterDraft, setFilterDraft] =
    useState<ControlVacationStatusFilterValues>("all");
  const [appliedStatus, setAppliedStatus] =
    useState<ControlVacationStatusFilterValues>("all");
  const [alertState, setAlertState] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({ open: false, type: "success", message: "" });

  // aqui se obtiene aqui los datos necesarios para consultar el saldo de vacaciones del colaborador actual,
  // const vacationSaldoPayload = useMemo<UseVacationPayload | undefined>(() => {
  //   if (!companyId || !moduleCode || !identificationNumber) return undefined;
  //   return {
  //     company_id: companyId,
  //     module_code: moduleCode,
  //     identification_number: identificationNumber,
  //   };
  // }, [companyId, moduleCode, identificationNumber]);

  // const saldoContextReady = Boolean(vacationSaldoPayload);

  const historyFilters = useMemo<
    ControlVacationHistoryRequest | undefined
  >(() => {
    if (!companyId || !moduleCode || !identificationNumber) return undefined;
    return {
      company_id: companyId,
      module_code: moduleCode,
      identification_number: identificationNumber,
      page_size: 10,
      page_number: 1,
      ...(appliedStatus !== "all" && { status: appliedStatus }),
    };
  }, [companyId, moduleCode, identificationNumber, appliedStatus]);
  const { GetControlVacationHistoryQuery, generateVacationDocumentMutation } =
    useControlVacations({
      filtersVacations: historyFilters,
    });

  const [selectedVacationItem, setSelectedVacationItem] =
    useState<GetVacationsHistoryResponse | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredRows = useMemo<ControlVacationHistoryRow[]>(() => {
    const items = GetControlVacationHistoryQuery.data;
    if (!Array.isArray(items) || items.length === 0) return [];
    const collaboratorName = fullName;
    return items.map((item) => ({
      full_name: collaboratorName,
      start_date: item.start_date,
      end_date: item.end_date,
      status: item.status,
      vacation_id: item.id_control_vacation,
    }));
  }, [fullName, GetControlVacationHistoryQuery.data]);

  const handleApplyFilters = useCallback(() => {
    setAppliedStatus(filterDraft);
  }, [filterDraft]);

  const handleClearFilters = useCallback(() => {
    setFilterDraft("all");
    setAppliedStatus("all");
  }, []);

  const handleViewDetails = useCallback(
    (row: ControlVacationHistoryRow) => {
      const item = GetControlVacationHistoryQuery.data?.find(
        (i) => String(i.id_control_vacation) === String(row.vacation_id),
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

  const handleGenerateDocument = useCallback(
    (_row: ControlVacationGenerateRequest) => {
      if (!companyId || !moduleCode) return;
      generateVacationDocumentMutation.mutate(
        {
          company_id: companyId,
          module_code: moduleCode,
          id_control_vacation: _row.id_control_vacation,
        },
        {
          onSuccess: () => {
            console.log("Documento generado exitosamente.");
            // window.open(
            //   generatePermissionDocumentMutation.data?.document_url,
            //   "_blank",
            // );
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
    },
    [],
  );

  // const showInitialPageLoader = utilsPermissionPageInitialLoader({
  //   contextReady: saldoContextReady,
  //   isSaldoPending: GetVacationSaldoQuery.isPending,
  //   isProfilePending: GetProfileDetails.isPending,
  //   isHistoryPending: GetPermissionHistory.isPending,
  // });

  if (GetControlVacationHistoryQuery.isPending) {
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
        <div className="flex justify-between items-center pb-2">
          <ControlVacationPageHeader collaboratorDisplayName={fullName} />
          <div className="flex justify-between items-center">
            <img
              className="h-12 sm:h-16 md:h-20 w-auto object-contain"
              src={activeLogo}
              alt="logo alpac"
            />
          </div>
        </div>
        <ControlModalVacationDetails
          isOpen={isDetailsOpen}
          onClose={handleCloseDetails}
          item={selectedVacationItem}
          collaboratorFullName={"Juan Perez"}
        />

        <ControlVacationFiltersBar
          filterDraft={filterDraft}
          onFilterDraftChange={setFilterDraft}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />

        <ControlVacationsTable
          data={filteredRows}
          onViewDetails={handleViewDetails}
          onGenerateDocument={handleGenerateDocument}
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
