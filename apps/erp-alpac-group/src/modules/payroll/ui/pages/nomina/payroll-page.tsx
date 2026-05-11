import {
  Breadcrumb,
  useTheme,
  Modal,
  Button,
  Dropdown,
  Badges,
  AnimatedAlertWrapper,
  Alert,
} from "@alpac/design-system";
import { motion } from "framer-motion";
import { useCallback, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileX } from "lucide-react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import {
  usePayrollStatus,
  usePayrollDetails,
  useInitializePayroll,
} from "@app/modules/payroll/ui/hooks/payroll/usePayroll";
import { Loader } from "@app/shared/components/loaders/loader";
import PayrollPageHeader from "@app/modules/payroll/ui/pages/nomina/components/payroll-page-header/payroll-page-header";
import PayrollCycleFormalization from "@app/modules/payroll/ui/pages/nomina/components/payroll-cycle-formalization/payroll-cycle-formalization";
import PayrollFiltersBar from "@app/modules/payroll/ui/pages/nomina/components/payroll-filters/payroll-filtersbar";
import { PayrollTable } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/payroll-table";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import type {
  PayrollProcessRequest,
  PayrollType,
} from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
import type { PayrollRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-request";
import type { CollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/collaborator.request";
import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import { formatIdentificationNumber } from "@app/shared/utils/string.utils";
import { pdf } from "@react-pdf/renderer";
import { PayrollPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/payroll-pdf/payroll-pdf-document";
import { CheckPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/check-pdf/check-pdf-document";
import { AccumulatedHistoryPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/accumulated-history-pdf/accumulated-history-pdf-document";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
import { PayrollServices } from "@app/modules/payroll/infrastructure/services/payroll-services/PayrollServices";
import { payrollColumns } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/utils/payroll-columns";
// import { exportPayrollExcel } from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/utils/export-payroll-excel";
import type { InitializePayrollParams } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-initialize.request";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
// import { fetchImageAsDataUri } from "@app/modules/payroll/ui/pages/nomina/components/payroll-pdf/utils/fetch-image-as-data-uri";
import type { PayrollActionValue } from "@app/modules/payroll/ui/pages/nomina/types/payroll-actions.types";
import type { StoredPayrollSelection } from "@app/modules/payroll/ui/pages/nomina/types/payroll.types";
import {
  PAYROLL_SELECTION_STORAGE_KEY,
  DROPDOWN_DISABLED_TRIGGER_CLASS,
} from "@app/modules/payroll/ui/pages/nomina/constants/payroll.constants";
import { isSelectablePayrollType } from "@app/modules/payroll/ui/pages/nomina/utils/payroll.utls";

export function PayrollPage() {
  const maxPageSize = 10;
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { companyId, moduleCode } = useUserStore();
  const { GetBranchesQuery: branchesQuery, GetCompaniesQuery } = useCompanies(
    companyId ? { company_id: companyId } : undefined,
  );

  const companiesData = GetCompaniesQuery?.data;

  const currentCompanyImageUrl = useMemo(() => {
    if (!Array.isArray(companiesData)) return undefined;

    const company = companiesData.find((c) => c.company_id === companyId);

    if (company) {
      const url =
        theme === "dark" ? company.neutral_image_url : company.image_url;
      return url ? url : undefined;
    }

    const alpac = companiesData.find((c) => c.alias?.toLowerCase() === "alpac");
    const fallbackUrl =
      theme === "dark" ? alpac?.neutral_image_url : alpac?.image_url;
    return fallbackUrl ? fallbackUrl : undefined;
  }, [companiesData, companyId, theme]);

  useEffect(() => {
    if (Array.isArray(companiesData) && companyId) {
      const company = companiesData.find((c) => c.company_id === companyId);
      if (company) {
        useCompanyStore.setState({
          urlImage: company.image_url ?? "",
          neutralUrlImage: company.neutral_image_url ?? "",
        });
      }
    }
  }, [companiesData, companyId]);

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
  const [selectionHydrated, setSelectionHydrated] = useState(false);
  const [selectedPayrollRow, setSelectedPayrollRow] =
    useState<PayrollItemResponse | null>(null);
  const [isPayrollDetailModalOpen, setIsPayrollDetailModalOpen] =
    useState(false);
  const [visibleKeys, setVisibleKeys] = useState<string[]>(() =>
    payrollColumns.map((col) => col.key as string),
  );
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  //   const [isGeneratingExcel, setIsGeneratingExcel] = useState(false);
  const [isGeneratingPaymentRequestsPdf, setIsGeneratingPaymentRequestsPdf] =
    useState(false);
  const [
    isGeneratingAccumulatedHistoryPdf,
    setIsGeneratingAccumulatedHistoryPdf,
  ] = useState(false);
  const [identificationFilter, setIdentificationFilter] = useState("");
  const [workAreaFilter, setWorkAreaFilter] = useState<number | null>(null);
  const [jobPositionFilter, setJobPositionFilter] = useState<number | null>(
    null,
  );
  const [selectedAction, setSelectedAction] =
    useState<PayrollActionValue | null>(null);
  const [isStatusErrorModalOpen, setIsStatusErrorModalOpen] = useState(false);
  const [isInitializeConfirmModalOpen, setIsInitializeConfirmModalOpen] =
    useState(false);
  const [initializeModalPayrollType, setInitializeModalPayrollType] =
    useState<PayrollType | null>(null);
  const [initializeModalBranch, setInitializeModalBranch] = useState<
    string | null
  >(null);
  const [showAlert, setShowAlert] = useState<{
    show: boolean;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  }>({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

  const handleCloseAlert = useCallback(() => {
    setTimeout(() => {
      setShowAlert({ show: false, type: "info", title: "", message: "" });
    }, 3000);
  }, []);

  const handlePdfGenerationError = useCallback(
    (message: string) => {
      setShowAlert({
        show: true,
        type: "error",
        title: "Error",
        message,
      });
      handleCloseAlert();
    },
    [handleCloseAlert],
  );

  const handleSelectionModalClose = useCallback(() => {
    if (selectedPayrollType === null || selectedBranch === null) {
      navigate("/dashboard");
    } else {
      setIsPayrollSelectionModalOpen(false);
    }
  }, [selectedPayrollType, selectedBranch, navigate]);

  const handleOpenChangePayrollSelection = useCallback(() => {
    if (selectedPayrollType !== null && selectedBranch !== null) {
      setTempSelectedBranch(null);
      setTempSelectedType(null);
      setIsPayrollSelectionModalOpen(true);
    }
  }, [selectedPayrollType, selectedBranch]);

  const handleOpenPayrollSelectionFromStatusError = useCallback(() => {
    setIsStatusErrorModalOpen(false);
    setTempSelectedBranch(null);
    setTempSelectedType(null);
    setIsPayrollSelectionModalOpen(true);
  }, []);

  const handleCloseStatusErrorModal = useCallback(() => {
    setIsStatusErrorModalOpen(false);
    navigate("/dashboard");
  }, [navigate]);

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

  const selectionStorageKey = useMemo(() => {
    if (!companyId || !moduleCode) return null;
    return `${PAYROLL_SELECTION_STORAGE_KEY}:${companyId}:${moduleCode}`;
  }, [companyId, moduleCode]);

  const branchOptions = useMemo(
    () =>
      (branchesQuery.data ?? []).map((branch) => ({
        label: branch.branch_name,
        value: branch.branch_id,
      })),
    [branchesQuery.data],
  );

  useEffect(() => {
    if (selectionHydrated) return;
    if (!selectionStorageKey || branchesQuery.isPending) return;

    const storedSelectionRaw = localStorage.getItem(selectionStorageKey);
    if (!storedSelectionRaw) {
      setSelectionHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(
        storedSelectionRaw,
      ) as Partial<StoredPayrollSelection>;
      const restoredType = parsed.type;
      const restoredBranch = parsed.branch_id;

      const hasValidType = isSelectablePayrollType(restoredType);
      const hasValidBranch =
        typeof restoredBranch === "string" &&
        branchOptions.some((branch) => branch.value === restoredBranch);

      if (!hasValidType || !hasValidBranch) {
        localStorage.removeItem(selectionStorageKey);
        setSelectionHydrated(true);
        return;
      }

      setSelectedPayrollType(restoredType);
      setSelectedBranch(restoredBranch);
      setTempSelectedType(restoredType);
      setTempSelectedBranch(restoredBranch);
      setIsPayrollSelectionModalOpen(false);
      setSelectionHydrated(true);
    } catch {
      localStorage.removeItem(selectionStorageKey);
      setSelectionHydrated(true);
    }
  }, [selectionStorageKey, branchOptions, branchesQuery.isPending]);

  const selectedBranchName =
    (branchesQuery.data ?? []).find(
      (branch) => branch.branch_id === selectedBranch,
    )?.branch_name ?? null;

  const payrollStatusQuery = usePayrollStatus({
    payload: {
      companie_id: companyId,
      module_code: moduleCode,
      branch_id: selectedBranch ?? "",
      payrol_type: selectedPayrollType ?? "Ordinary",
    } as PayrollProcessRequest,
    enabled: selectedPayrollType !== null && selectedBranch !== null,
  });

  const existPayrollInProgress =
    payrollStatusQuery.data?.exist_payroll_in_progress;

  const ordinaryPayrollQuery = usePayrollDetails({
    payload: {
      companie_id: companyId,
      module_code: moduleCode,
      type: selectedPayrollType ?? "None",
      branch_id: selectedBranch ?? "",
      identification_number: identificationFilter || undefined,
      work_area_id: workAreaFilter || undefined,
      job_position_id: jobPositionFilter || undefined,
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
  const displayedBranchName =
    ordinaryPayrollQuery.data?.branch_name?.trim() || selectedBranchName;

  const hasCollaboratorsWithoutInss = useMemo(() => {
    const items = ordinaryPayrollQuery.data?.payroll_details?.items ?? [];
    return items.some((item) => !item.collaborator?.inss_number?.trim());
  }, [ordinaryPayrollQuery.data]);
  const totalPayrollRecords =
    ordinaryPayrollQuery.data?.payroll_details?.total_items ?? 0;
  const hasPayrollData = totalPayrollRecords > 0;

  const payrollActionOptions = useMemo(() => {
    const options: { label: string; value: PayrollActionValue }[] = [
      { label: "Generar Reporte Nómina", value: "report" },
      {
        label: "Generar Historial Acumulado",
        value: "accumulated_history",
      },
    ];
    if (hasCollaboratorsWithoutInss && !detailsFetchInFlight) {
      options.push({
        label: "Generar Solicitudes de Pago",
        value: "payment_requests",
      });
    }
    return options;
  }, [hasCollaboratorsWithoutInss, detailsFetchInFlight]);

  useEffect(() => {
    if (
      selectedAction &&
      !payrollActionOptions.some((o) => o.value === selectedAction)
    ) {
      setSelectedAction(null);
    }
  }, [selectedAction, payrollActionOptions]);

  useEffect(() => {
    const hasActiveSelection =
      selectedPayrollType !== null && selectedBranch !== null;
    if (
      hasActiveSelection &&
      payrollStatusQuery.isError &&
      !statusFetchInFlight
    ) {
      setIsStatusErrorModalOpen(true);
    }
  }, [
    selectedPayrollType,
    selectedBranch,
    payrollStatusQuery.isError,
    statusFetchInFlight,
  ]);

  useEffect(() => {
    if (!payrollStatusQuery.isError) {
      setIsStatusErrorModalOpen(false);
    }
  }, [payrollStatusQuery.isError]);

  const initializePayrollMutation = useInitializePayroll();

  const handleOpenInitializePayrollConfirmModal = useCallback(() => {
    if (initializePayrollMutation.isPending) {
      return;
    }

    setInitializeModalPayrollType(selectedPayrollType);
    setInitializeModalBranch(selectedBranch);
    setIsInitializeConfirmModalOpen(true);
  }, [
    selectedPayrollType,
    selectedBranch,
    initializePayrollMutation.isPending,
  ]);

  const handleCloseInitializePayrollConfirmModal = useCallback(() => {
    if (initializePayrollMutation.isPending) return;
    setIsInitializeConfirmModalOpen(false);
  }, [initializePayrollMutation.isPending]);

  const handleInitializePayroll = useCallback(() => {
    if (!initializeModalPayrollType || !initializeModalBranch) return;

    initializePayrollMutation.mutate(
      {
        companie_id: companyId,
        module_code: moduleCode,
        type: initializeModalPayrollType,
        branch_id: initializeModalBranch,
      } as InitializePayrollParams,
      {
        onSuccess: () => {
          setSelectedPayrollType(initializeModalPayrollType);
          setSelectedBranch(initializeModalBranch);
          setIsInitializeConfirmModalOpen(false);
          setShowAlert({
            show: true,
            type: "success",
            title: "Nómina inicializada",
            message: "La nómina se inicializó correctamente.",
          });
          handleCloseAlert();
        },
        onError: (error) => {
          const apiError = error as ApiErrorResponse;
          setShowAlert({
            show: true,
            type: "error",
            title: "No se pudo inicializar",
            message:
              apiError?.error?.description ||
              "No se pudo inicializar la nómina. Inténtelo nuevamente.",
          });
          handleCloseAlert();
        },
      },
    );
  }, [
    companyId,
    moduleCode,
    initializeModalPayrollType,
    initializeModalBranch,
    initializePayrollMutation,
    handleCloseAlert,
  ]);

  const handleConfirmTypeSelection = useCallback(() => {
    if (tempSelectedType && tempSelectedBranch) {
      const isSameSelection =
        tempSelectedType === selectedPayrollType &&
        tempSelectedBranch === selectedBranch;

      setSelectedPayrollType(tempSelectedType);
      setSelectedBranch(tempSelectedBranch);
      setIsPayrollSelectionModalOpen(false);
      setPageNumber(1);

      if (selectionStorageKey) {
        const selectionToStore: StoredPayrollSelection = {
          type: tempSelectedType,
          branch_id: tempSelectedBranch,
        };
        localStorage.setItem(
          selectionStorageKey,
          JSON.stringify(selectionToStore),
        );
      }

      if (isSameSelection) {
        void payrollStatusQuery.refetch();
      }
    }
  }, [
    tempSelectedType,
    tempSelectedBranch,
    selectedPayrollType,
    selectedBranch,
    selectionStorageKey,
    payrollStatusQuery,
  ]);

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  const handleGeneratePdf = useCallback(async () => {
    if (!selectedPayrollType || !selectedBranch || !companyId || !moduleCode)
      return;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay datos en la tabla de nómina para generar el reporte.",
      );
      return;
    }
    try {
      setIsGeneratingPdf(true);
      const payrollServices = new PayrollServices(httpHandler);

      const detailsData = ordinaryPayrollQuery.data;
      const totalRecords = detailsData?.payroll_details?.total_items ?? 0;

      const payload = {
        companie_id: companyId,
        module_code: moduleCode,
        type: selectedPayrollType,
        branch_id: selectedBranch,
        identification_number: identificationFilter || undefined,
        work_area_id: workAreaFilter || undefined,
        job_position_id: jobPositionFilter || undefined,
        page_number: 1,
        page_size: totalRecords > 0 ? totalRecords : maxPageSize,
      } as PayrollRequest;

      const response = await payrollServices.getPayroll(payload);
      const allItems = response.payroll_details?.items ?? [];

      // let logoDataUri: string | undefined = undefined;
      // try {
      //   const imageUrl = useCompanyStore.getState().urlImage;
      //   if (imageUrl) {
      //     logoDataUri = await fetchImageAsDataUri(imageUrl);
      //   }
      // } catch (imageError) {
      //   console.warn(
      //     "No se pudo cargar el logo para el PDF debido a un error de red o CORS.",
      //   );
      // }

      const blob = await pdf(
        <PayrollPdfDocument
          typePayroll={selectedPayrollType}
          data={allItems}
          branchName={displayedBranchName ?? ""}
          startDate={ordinaryPayrollQuery.data?.start_date}
          endDate={ordinaryPayrollQuery.data?.end_date}
          visibleKeys={visibleKeys}
          preparedBy={{
            name: "Lic Aracelly Guillen",
            role: "Talento Humano",
          }}
          reviewedBy={{
            name: "Isolina Reyes",
            role: "Contador General",
          }}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      handlePdfGenerationError(
        "Ocurrió un error al generar el reporte de nómina en PDF.",
      );
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [
    selectedPayrollType,
    selectedBranch,
    companyId,
    moduleCode,
    hasPayrollData,
    ordinaryPayrollQuery.data,
    displayedBranchName,
    visibleKeys,
    currentCompanyImageUrl,
    identificationFilter,
    workAreaFilter,
    jobPositionFilter,
    handlePdfGenerationError,
  ]);

  const handleGeneratePaymentRequestsPdf = useCallback(async () => {
    if (!selectedPayrollType || !selectedBranch || !companyId || !moduleCode)
      return;
    try {
      setIsGeneratingPaymentRequestsPdf(true);
      const payrollServices = new PayrollServices(httpHandler);

      const detailsData = ordinaryPayrollQuery.data;
      const totalRecords = detailsData?.payroll_details?.total_items ?? 0;

      const payload = {
        companie_id: companyId,
        module_code: moduleCode,
        type: selectedPayrollType,
        branch_id: selectedBranch,
        identification_number: identificationFilter || undefined,
        work_area_id: workAreaFilter || undefined,
        job_position_id: jobPositionFilter || undefined,
        page_number: 1,
        page_size: totalRecords > 0 ? totalRecords : 1000,
      } as PayrollRequest;

      const response = await payrollServices.getPayroll(payload);
      const allItems = response.payroll_details?.items ?? [];

      const filteredItems = allItems.filter(
        (item) => !item.collaborator?.inss_number?.trim(),
      );

      if (filteredItems.length === 0) {
        return;
      }

      const blob = await pdf(
        <CheckPdfDocument
          data={filteredItems}
          startDate={ordinaryPayrollQuery.data?.start_date}
          endDate={ordinaryPayrollQuery.data?.end_date}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      handlePdfGenerationError(
        "Ocurrió un error al generar las solicitudes de pago en PDF.",
      );
    } finally {
      setIsGeneratingPaymentRequestsPdf(false);
    }
  }, [
    selectedPayrollType,
    selectedBranch,
    companyId,
    moduleCode,
    ordinaryPayrollQuery.data,
    currentCompanyImageUrl,
    identificationFilter,
    workAreaFilter,
    jobPositionFilter,
    handlePdfGenerationError,
  ]);

  const handleGenerateAccumulatedHistoryPdf = useCallback(async () => {
    if (!companyId) return;
    const payrollId = ordinaryPayrollQuery.data?.payroll_id;
    if (!payrollId) return;

    try {
      setIsGeneratingAccumulatedHistoryPdf(true);
      const payrollServices = new PayrollServices(httpHandler);

      const reportResponse = await payrollServices.generateReportsPayroll({
        companie_id: companyId,
        payroll_id: payrollId,
        report_type: "Accumulated",
      });

      const reportData = reportResponse.accumulated_history ?? [];

      if (!reportData.length) {
        handlePdfGenerationError(
          "No hay datos disponibles para generar el historial acumulado.",
        );
        return;
      }

      const blob = await pdf(
        <AccumulatedHistoryPdfDocument
          data={reportData}
          reviewedBy={{
            name: "Aracelly Guillen",
            role: "Gerente de Recursos Humanos",
          }}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      handlePdfGenerationError(
        "Ocurrió un error al generar el reporte de historial acumulado.",
      );
    } finally {
      setIsGeneratingAccumulatedHistoryPdf(false);
    }
  }, [
    companyId,
    ordinaryPayrollQuery.data?.payroll_id,
    handlePdfGenerationError,
  ]);

  //   const handleGenerateExcel = useCallback(async () => {
  //     if (!selectedPayrollType || !selectedBranch || !companyId || !moduleCode)
  //       return;
  //     try {
  //       setIsGeneratingExcel(true);
  //       const payrollServices = new PayrollServices(httpHandler);

  //       const detailsData = ordinaryPayrollQuery.data;
  //       const totalRecords = detailsData?.payroll_details?.total_items ?? 0;

  //       const payload = {
  //         companie_id: companyId,
  //         module_code: moduleCode,
  //         type: selectedPayrollType,
  //         branch_id: selectedBranch,
  //         identification_number: identificationFilter || undefined,
  //         work_area_id: workAreaFilter || undefined,
  //         job_position_id: jobPositionFilter || undefined,
  //         page_number: 1,
  //         page_size: totalRecords > 0 ? totalRecords : maxPageSize,
  //       } as PayrollRequest;

  //       const response = await payrollServices.getPayroll(payload);
  //       const allItems = response.payroll_details?.items ?? [];

  //       exportPayrollExcel({
  //         data: allItems,
  //         visibleKeys,
  //         branchName: displayedBranchName,
  //         startDate: ordinaryPayrollQuery.data?.start_date,
  //         endDate: ordinaryPayrollQuery.data?.end_date,
  //         typePayroll: selectedPayrollType,
  //       });
  //     } catch (error) {
  //       handlePdfGenerationError(
  //         "Ocurrió un error al generar el reporte de nómina en Excel.",
  //       );
  //     } finally {
  //       setIsGeneratingExcel(false);
  //     }
  //   }, [
  //     selectedPayrollType,
  //     selectedBranch,
  //     companyId,
  //     moduleCode,
  //     ordinaryPayrollQuery.data,
  //     displayedBranchName,
  //     visibleKeys,
  //     identificationFilter,
  //     workAreaFilter,
  //     jobPositionFilter,
  //     handlePdfGenerationError,
  //   ]);

  const handleExecuteSelectedAction = useCallback(() => {
    switch (selectedAction) {
      case "report":
        void handleGeneratePdf();
        break;
      case "payment_requests":
        void handleGeneratePaymentRequestsPdf();
        break;
      case "accumulated_history":
        void handleGenerateAccumulatedHistoryPdf();
        break;
      default:
        break;
    }
  }, [
    selectedAction,
    handleGeneratePdf,
    handleGeneratePaymentRequestsPdf,
    handleGenerateAccumulatedHistoryPdf,
  ]);

  const handleApplyFilters = useCallback(
    (
      data: Pick<CollaboratorRequest, "identification_number"> & {
        job_position: number;
        work_area: number;
      },
    ) => {
      const normalizedIdentification = (data.identification_number ?? "")
        .trim()
        .replace(/-/g, "");
      setIdentificationFilter(normalizedIdentification);
      setWorkAreaFilter(
        data.work_area && data.work_area > 0 ? data.work_area : null,
      );
      setJobPositionFilter(
        data.job_position && data.job_position > 0 ? data.job_position : null,
      );
      setPageNumber(1);
    },
    [],
  );

  const handleClearFilters = useCallback(() => {
    setIdentificationFilter("");
    setWorkAreaFilter(null);
    setJobPositionFilter(null);
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
              onClick={handleOpenInitializePayrollConfirmModal}
              disabled={initializePayrollMutation.isPending}
              isLoading={initializePayrollMutation.isPending}
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
              visibleKeys={visibleKeys}
              onVisibleKeysChange={setVisibleKeys}
              onPageChange={handlePageChange}
              onRowClick={handleOpenPayrollDetailModal}
              isPending={detailsFetchInFlight}
            />
          </div>
        </>
      );
    }

    if (!statusFetchInFlight) {
      return (
        <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-neutral-700 dark:bg-[#272b34]">
          <h3 className="mb-2 text-xl font-bold text-slate-800 dark:text-white">
            No se pudo verificar el estado de la nómina
          </h3>
          <p className="mx-auto mb-8 max-w-md text-slate-500 dark:text-slate-400">
            Intente con otra combinación de tipo de nómina y sucursal para
            continuar la consulta.
          </p>
          <Button
            label="Cambiar tipo de nómina"
            onClick={handleOpenChangePayrollSelection}
            className="w-full! sm:w-[246px]! min-h-[48px]! py-2! px-4! text-[14px]! leading-snug! text-center! font-normal! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! flex! items-center! justify-center!"
          />
        </div>
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
          selectionHydrated &&
          (isPayrollSelectionModalOpen ||
            selectedPayrollType === null ||
            selectedBranch === null)
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

      <Modal
        isOpen={isInitializeConfirmModalOpen}
        onClose={handleCloseInitializePayrollConfirmModal}
        variant="default"
        size="sm"
        title="Confirmar inicialización"
        description="Por favor, seleccione primero la sucursal y luego el tipo de nómina para inicializar."
      >
        <div className="mt-4 flex flex-col gap-4">
          <Dropdown
            label="Sucursal"
            placeholder="Seleccione una sucursal"
            options={branchOptions}
            value={initializeModalBranch || undefined}
            appearance={theme === "dark" ? "dark" : "default"}
            labelClassName="text-white!"
            onChange={(value) => {
              setInitializeModalBranch(String(value));
              setInitializeModalPayrollType(null);
            }}
          />
          <Dropdown
            label="Tipo de nómina"
            placeholder="Seleccione tipo de nómina"
            options={payrollTypeOptions}
            value={initializeModalPayrollType || undefined}
            appearance={theme === "dark" ? "dark" : "default"}
            labelClassName="text-white!"
            className={
              !initializeModalBranch
                ? DROPDOWN_DISABLED_TRIGGER_CLASS
                : undefined
            }
            onChange={(value) =>
              setInitializeModalPayrollType(value as PayrollType)
            }
          />
        </div>
        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:items-stretch">
          <Button
            type="button"
            size="giant"
            label="Inicializar"
            onClick={handleInitializePayroll}
            isLoading={initializePayrollMutation.isPending}
            disabled={
              initializePayrollMutation.isPending ||
              !initializeModalPayrollType ||
              !initializeModalBranch
            }
            className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:flex-1 sm:min-w-0 enabled:opacity-100! disabled:pointer-events-none disabled:opacity-50 disabled:saturate-75"
          />
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            onClick={handleCloseInitializePayrollConfirmModal}
            disabled={initializePayrollMutation.isPending}
            className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:flex-1 sm:min-w-0"
          />
        </div>
      </Modal>

      <Modal
        isOpen={isStatusErrorModalOpen}
        onClose={handleCloseStatusErrorModal}
        variant="error"
        size="md"
        title="No se pudo verificar el estado"
        description="No se pudo comprobar si ya existe una nómina en progreso para la selección realizada. Verifique su conexión o cambie el tipo de nómina y sucursal."
      >
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            size="giant"
            label="Cambiar nómina"
            onClick={handleOpenPayrollSelectionFromStatusError}
            className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:w-auto!"
          />
          <Button
            type="button"
            size="giant"
            label="Cerrar"
            onClick={handleCloseStatusErrorModal}
            className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:w-auto!"
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

        {existPayrollInProgress === true ? (
          <>
            {/* Vista para dispositivos pequeños (móvil/tablet) */}
            <div className="flex flex-col gap-6 lg:hidden">
              <PayrollPageHeader
                logoSrc={currentCompanyImageUrl}
                logoAlt="logo grupo alpac"
                branchName={displayedBranchName}
                onRequestChangePayrollSelection={
                  handleOpenChangePayrollSelection
                }
              />
              <PayrollCycleFormalization
                cicloInicial={ordinaryPayrollQuery.data?.start_date ?? "—"}
                cicloFinal={ordinaryPayrollQuery.data?.end_date ?? "—"}
                existPayrollInProgress={existPayrollInProgress}
                statusLoading={statusFetchInFlight}
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
                />
              </div>
              <div className="w-[18rem] flex flex-col items-end gap-3">
                {currentCompanyImageUrl && (
                  <img
                    className="h-12 sm:h-16 md:h-20 w-auto object-contain"
                    src={currentCompanyImageUrl}
                    alt="logo grupo alpac"
                  />
                )}

                {displayedBranchName ? (
                  <Badges
                    label={`Nomina de ${displayedBranchName}`}
                    color="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                    className="max-w-72 text-[12px]! font-semibold! leading-snug! wrap-break-word text-right"
                  />
                ) : null}
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
              <div className="flex flex-col justify-center">
                <h3 className="p-0! m-0!">Accesos Directos</h3>
                <small className="text-gray-500 dark:text-gray-300">
                  Aqui puedes cambiar el tipo de nómina y sucursal, tambien
                  puedes generar reportes
                </small>
              </div>
            </div>

            <div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
              <div className="w-full flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-start">
                <Button
                  type="button"
                  size="giant"
                  label="Cambiar tipo de nómina y sucursal"
                  onClick={handleOpenChangePayrollSelection}
                  className="hidden! lg:flex! w-full! lg:w-auto! min-h-[48px]! px-4! text-center! text-[15px]! leading-snug! font-normal! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                />
                <div className="w-full lg:w-[18rem]">
                  <Dropdown
                    placeholder="Seleccione una acción a generar"
                    options={payrollActionOptions}
                    value={selectedAction ?? undefined}
                    appearance={theme === "dark" ? "dark" : "default"}
                    onChange={(value) =>
                      setSelectedAction(value as PayrollActionValue)
                    }
                  />
                </div>
                {/* <Button
                  type="button"
                  size="giant"
                  label="Exportar Excel"
                  isLoading={isGeneratingExcel}
                  disabled={!existPayrollInProgress}
                  onClick={handleGenerateExcel}
                  className={`w-full! min-h-[48px]! px-4! text-center! text-[15px]! leading-snug! font-normal! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! ${
                    isGeneratingExcel
                      ? "disabled:opacity-100! disabled:bg-alpac-primary-500! disabled:dark:bg-alpac-primary-700!"
                      : ""
                  }`}
                /> */}
                <Button
                  type="button"
                  size="giant"
                  label="Generar"
                  isLoading={
                    isGeneratingPdf ||
                    isGeneratingPaymentRequestsPdf ||
                    isGeneratingAccumulatedHistoryPdf
                  }
                  disabled={
                    !selectedAction ||
                    !existPayrollInProgress ||
                    isGeneratingPdf ||
                    isGeneratingPaymentRequestsPdf ||
                    isGeneratingAccumulatedHistoryPdf
                  }
                  onClick={handleExecuteSelectedAction}
                  className={`w-full! lg:w-auto! min-h-[48px]! px-4! text-center! text-[15px]! leading-snug! font-normal! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! ${
                    isGeneratingPdf ||
                    isGeneratingPaymentRequestsPdf ||
                    isGeneratingAccumulatedHistoryPdf
                      ? "disabled:opacity-100! disabled:bg-alpac-primary-500! disabled:dark:bg-alpac-primary-700!"
                      : ""
                  }`}
                />
                <Button
                  type="button"
                  size="giant"
                  label="Registrar deducciones"
                  disabled
                  className={`w-full! lg:w-auto! min-h-[48px]! px-4! text-center! text-[15px]! leading-snug! font-normal! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! ${
                    isGeneratingPdf ||
                    isGeneratingPaymentRequestsPdf ||
                    isGeneratingAccumulatedHistoryPdf
                      ? "disabled:opacity-100! disabled:bg-alpac-primary-500! disabled:dark:bg-alpac-primary-700!"
                      : ""
                  }`}
                />
              </div>
            </div>
          </>
        ) : (
          <PayrollPageHeader
            logoSrc={currentCompanyImageUrl}
            logoAlt="logo grupo alpac"
            branchName={null}
            onRequestChangePayrollSelection={undefined}
          />
        )}
        {selectedPayrollType !== null &&
          selectedBranch !== null &&
          renderContent()}

        <AnimatedAlertWrapper open={showAlert.show}>
          <Alert
            type={showAlert.type}
            title={showAlert.title}
            message={showAlert.message}
            onClose={() => setShowAlert((prev) => ({ ...prev, show: false }))}
          />
        </AnimatedAlertWrapper>
      </motion.div>
    </>
  );
}
