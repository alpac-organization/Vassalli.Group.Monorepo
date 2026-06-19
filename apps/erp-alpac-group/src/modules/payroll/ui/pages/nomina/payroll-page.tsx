import {
  Breadcrumb,
  useTheme,
  Modal,
  Button,
  Dropdown,
  AnimatedAlertWrapper,
  Alert,
} from "@alpac/design-system";
import { m, LazyMotion } from "framer-motion";
import { useCallback, useState, useMemo, useEffect } from "react";
import { getSignatures } from "@app/modules/payroll/ui/pages/nomina/components/check-pdf/utils/getSignatures";
import { getProcessedSignatureImage } from "@app/modules/payroll/ui/pages/nomina/components/check-pdf/utils/processSignatureImage";
const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);
import { useNavigate } from "react-router-dom";
import { FileX } from "lucide-react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { payrollTypeOptions } from "@app/modules/payroll/ui/pages/nomina/constants/payroll.constants";
import {
  usePayrollStatus,
  usePayrollDetails,
  useInitializePayroll,
  useClosePayroll,
} from "@app/modules/payroll/ui/hooks/payroll/usePayroll";
import {
  INCOME_KEYS,
  DEDUCTION_KEYS,
} from "@app/modules/payroll/ui/pages/nomina/utils/payroll.utls";
import { Loader } from "@app/shared/components/loaders/loader";
import PayrollPageHeader from "@app/modules/payroll/ui/pages/nomina/components/payroll-page-header/payroll-page-header";
import PayrollCycleFormalization from "@app/modules/payroll/ui/pages/nomina/components/payroll-cycle-formalization/payroll-cycle-formalization";
import PayrollGenerateReportsModal from "@app/modules/payroll/ui/pages/nomina/components/payroll-generate-reports-modal/payroll-generate-reports-modal";
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
import { pdf } from "@react-pdf/renderer";
import { PayrollPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/payroll-pdf/payroll-pdf-document";
import { CheckPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/check-pdf/check-pdf-document";
import { PaymentReceiptDocument } from "@app/modules/payroll/ui/pages/nomina/components/payment-receipts/payment-receipt";
import { AccumulatedPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/accumulated-pdf/accumulated-pdf-document";
import { IncomeSummaryPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/income-review-pdf/income-summary-pdf-document";
import { DeductionSummaryPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/deduction-review-pdf/deduction-review.pdf";
import { VacationControlPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/components/vacation-control-pdf";
import { VacationControlAreaPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/components/vacation-control-area-pdf";
import { VacationAccrualAreaPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/components/vacation-accrual-area-pdf";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
import { PayrollServices } from "@app/modules/payroll/infrastructure/services/payroll-services/PayrollServices";
import { PermissionServices } from "@app/modules/payroll/infrastructure/services/permission-services/PermissionServices";
import { DeductionsServicesByPayroll } from "@app/modules/payroll/infrastructure/services/deduction-services/DeductionsServicesByPayroll";
import {
  buildVacationControlPages,
  fetchAllPermissionsByPayroll,
} from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/utils/vacation-control.utils";
import { buildVacationAccrualAreaRows } from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/utils/vacation-accrual-area.utils";
import { buildVacationControlAreaRows } from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/utils/vacation-control-area.utils";
import { exportVacationAccrualAreaExcel } from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/utils/export-vacation-accrual-area-excel";
import { getPayrollColumns } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/utils/payroll-columns";
import { payrollColumns } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/utils/payroll-columns";
import { exportPayrollExcel } from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/utils/export-payroll-excel";
import { ConsolidatedAreaPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/consolidated-area-report/pdf/consolidated-area-pdf-document";
import { EmployeeReceivablesPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/employee-receivables-pdf/employee-receivables-pdf-document";
import { buildEmployeeReceivablesReportData } from "@app/modules/payroll/ui/pages/nomina/components/employee-receivables-pdf/utils/build-employee-receivables-data";
import { exportEmployeeReceivablesExcel } from "@app/modules/payroll/ui/pages/nomina/components/employee-receivables-pdf/excel/export-employee-receivables-excel";
import { exportConsolidatedAreaExcel } from "@app/modules/payroll/ui/pages/nomina/components/consolidated-area-report/excel/export-consolidated-area-excel";
import { exportAccumulatedHistoryExcel } from "@app/modules/payroll/ui/pages/nomina/components/accumulated-pdf/excel/export-accumulated-history-excel";
import { exportIncomeSummaryExcel } from "@app/modules/payroll/ui/pages/nomina/components/income-review-pdf/excel/export-income-summary-excel";
import { exportDeductionSummaryExcel } from "@app/modules/payroll/ui/pages/nomina/components/deduction-review-pdf/excel/export-deduction-summary-excel";
import type { InitializePayrollParams } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-initialize.request";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { PayrollActionValue } from "@app/modules/payroll/ui/pages/nomina/types/payroll-actions.types";
import type { StoredPayrollSelection } from "@app/modules/payroll/ui/pages/nomina/types/payroll.types";
import {
  PAYROLL_SELECTION_STORAGE_KEY,
  DROPDOWN_DISABLED_TRIGGER_CLASS,
} from "@app/modules/payroll/ui/pages/nomina/constants/payroll.constants";
import { actionSupportsExcel } from "@app/modules/payroll/ui/pages/nomina/constants/payroll-generate-formats.constants";
import { isSelectablePayrollType } from "@app/modules/payroll/ui/pages/nomina/utils/payroll.utls";
import { CreateIncomeModal } from "@app/modules/payroll/ui/pages/nomina/components/incomes/create-income-modal/create-income-modal";
import { AddDeductionModal } from "@app/modules/payroll/ui/pages/nomina/components/deductions/add-deduction-modal/add-deduction-modal";
import { NewPermissionRequestModal } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/new-permission-modal";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { parseAdditionalDeductions } from "./components/payroll-table/utils/parse-additional-deductions";
import type { AdditionalDeductions } from "./components/payroll-table/types/payroll-table.types";
import { ModalDetailsPayroll } from "@app/modules/payroll/ui/pages/nomina/components/collaborator-details-payroll/modal-details-payroll";

export function PayrollPage() {
  const maxPageSize = 10;
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { companyId, moduleCode, companyName } = useUserStore();
  const { GetBranchesQuery: branchesQuery, GetCompaniesQuery } = useCompanies(
    companyId ? { company_id: companyId } : undefined,
  );

  const signatures = getSignatures(companyName);
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
  const [
    isPermissionApplicationModalOpen,
    setIsPermissionApplicationModalOpen,
  ] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<string[]>(() =>
    payrollColumns.map((col) => col.key as string),
  );
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingExcel, setIsGeneratingExcel] = useState(false);
  const [isGeneratingPaymentRequestsPdf, setIsGeneratingPaymentRequestsPdf] =
    useState(false);
  const [isGeneratingPaymentReceiptsPdf, setIsGeneratingPaymentReceiptsPdf] =
    useState(false);
  const [
    isGeneratingAccumulatedHistoryPdf,
    setIsGeneratingAccumulatedHistoryPdf,
  ] = useState(false);
  const [isGeneratingVacationControlPdf, setIsGeneratingVacationControlPdf] =
    useState(false);
  const [
    isGeneratingVacationControlAreaPdf,
    setIsGeneratingVacationControlAreaPdf,
  ] = useState(false);
  const [
    isGeneratingVacationAccrualAreaReport,
    setIsGeneratingVacationAccrualAreaReport,
  ] = useState(false);
  const [isGeneratingIncomeSummaryPdf, setIsGeneratingIncomeSummaryPdf] =
    useState(false);
  const [isGeneratingDeductionSummaryPdf, setIsGeneratingDeductionSummaryPdf] =
    useState(false);
  const [isGeneratingConsolidatedAreaPdf, setIsGeneratingConsolidatedAreaPdf] =
    useState(false);
  const [
    isGeneratingConsolidatedAreaExcel,
    setIsGeneratingConsolidatedAreaExcel,
  ] = useState(false);
  const [
    isGeneratingEmployeeReceivablesPdf,
    setIsGeneratingEmployeeReceivablesPdf,
  ] = useState(false);
  const [identificationFilter, setIdentificationFilter] = useState("");
  const [workAreaFilter, setWorkAreaFilter] = useState<number | null>(null);
  const [jobPositionFilter, setJobPositionFilter] = useState<number | null>(
    null,
  );
  const [selectedAction, setSelectedAction] =
    useState<PayrollActionValue | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [generatePdfChecked, setGeneratePdfChecked] = useState(false);
  const [generateExcelChecked, setGenerateExcelChecked] = useState(false);
  const [isStatusErrorModalOpen, setIsStatusErrorModalOpen] = useState(false);
  const [isInitializeConfirmModalOpen, setIsInitializeConfirmModalOpen] =
    useState(false);
  const [initializeModalPayrollType, setInitializeModalPayrollType] =
    useState<PayrollType | null>(null);
  const [initializeModalBranch, setInitializeModalBranch] = useState<
    string | null
  >(null);
  const payrollColumnDefs = useMemo(
    () => getPayrollColumns(companyName),
    [companyName],
  );
  useEffect(() => {
    const allowedKeys = payrollColumnDefs.map((c) => c.key as string);
    const allowedSet = new Set(allowedKeys);
    setVisibleKeys((prev) => {
      const kept = prev.filter((k) => allowedSet.has(k));
      const additions = allowedKeys.filter((k) => !kept.includes(k));
      return [...kept, ...additions];
    });
  }, [payrollColumnDefs]);

  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false);

  const {
    alertState,
    handleCloseAlert,
    handleRequestError,
    handleRequestSuccess,
  } = useAlertState();

  const handlePdfGenerationError = useCallback(
    (message: string) => {
      handleRequestError(message);
    },
    [handleRequestError],
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

  const handleOpenPermissionApplicationModal = useCallback(() => {
    setIsPermissionApplicationModalOpen(true);
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

  const payrollDetailsQuery = usePayrollDetails({
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

  const { data: selectedOrdinaryPayroll } = payrollDetailsQuery;

  const statusFetchInFlight =
    selectedPayrollType !== null &&
    selectedBranch !== null &&
    payrollStatusQuery.isFetching;
  const detailsFetchInFlight =
    selectedPayrollType !== null &&
    selectedBranch !== null &&
    existPayrollInProgress === true &&
    payrollDetailsQuery.isFetching;
  const displayedBranchName =
    payrollDetailsQuery.data?.branch_name?.trim() || selectedBranchName;

  const hasCollaboratorsWithoutBankAccount = useMemo(() => {
    const items = payrollDetailsQuery.data?.payroll_details?.items ?? [];
    return items.some((item) => !item.collaborator?.bank_account?.trim());
  }, [payrollDetailsQuery.data]);
  const totalPayrollRecords =
    payrollDetailsQuery.data?.payroll_details?.total_items ?? 0;
  const hasPayrollData = totalPayrollRecords > 0;

  const payrollActionOptions = useMemo(() => {
    const options: { label: string; value: PayrollActionValue }[] = [
      { label: "Generar Reporte Nómina", value: "report" },
      { label: "Generar Recibos de Pago", value: "payment_receipts" },
      {
        label: "Generar Historial Acumulado",
        value: "accumulated_history",
      },
      { label: "Generar Reporte de Ingresos", value: "income_report" },
      { label: "Generar Reporte de Deducciones", value: "deduction_report" },
      {
        label: "Generar Control de Vacaciones",
        value: "vacation_control_report",
      },
      {
        label: "Generar Control de Vacaciones por Área",
        value: "vacation_control_area_report",
      },
      {
        label: "Generar Acumulado Vacaciones aguinaldo",
        value: "vacation_accrual_area_report",
      },
      {
        label: "Generar  Nómina Consolidada por Área",
        value: "consolidated_area_report",
      },
      {
        label: "Generar Saldos por Cobrar a Empleados",
        value: "employee_receivables_report",
      },
      // {
      //   label: "Generar Acumulado de Vacaciones",
      //   value: "vacation_accruals_history",
      // },
    ];
    const startDate = payrollDetailsQuery.data?.start_date;
    const endDate = payrollDetailsQuery.data?.end_date;
    const startDay = startDate ? new Date(startDate).getUTCDate() : null;
    const endDay = endDate ? new Date(endDate).getUTCDate() : null;
    const PAYROLL_FIRST_PERIOD_END_DAY = 15;
    if (endDay === PAYROLL_FIRST_PERIOD_END_DAY) {
      const actionQuincenal: { label: string; value: PayrollActionValue }[] = [
        {
          label: "Generar Reporte Quincenal Acumulado",
          value: "quincenal_accumulated_report",
        },
        {
          label: "Generar Reporte Quincenal IR",
          value: "quincenal_ir_report",
        },
        {
          label: "Generar Reporte Quincenal INSS",
          value: "quincenal_inss_report",
        },
      ];
      actionQuincenal.forEach((option) => options.push(option));
    }
    const PAYROLL_SECOND_PERIOD_START_DAY = 16;
    if (startDay === PAYROLL_SECOND_PERIOD_START_DAY) {
      const actionMonthly: { label: string; value: PayrollActionValue }[] = [
        {
          label: "Generar Reporte Mensual Acumulado",
          value: "monthly_accumulated_report",
        },
        {
          label: "Generar Reporte Mensual IR",
          value: "monthly_ir_report",
        },
        {
          label: "Generar Reporte mensual INSS",
          value: "monthly_inss_report",
        },
      ];
      actionMonthly.forEach((option) => options.push(option));
    }
    if (hasCollaboratorsWithoutBankAccount && !detailsFetchInFlight) {
      options.push({
        label: "Generar Solicitudes de Pago",
        value: "payment_requests",
      });
    }
    return options;
  }, [
    hasCollaboratorsWithoutBankAccount,
    detailsFetchInFlight,
    payrollDetailsQuery.data,
  ]);

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
  const closePayrollMutation = useClosePayroll();

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
          handleRequestSuccess(
            "La nómina se inicializó correctamente.",
            "Nómina inicializada",
          );
        },
        onError: (error) => {
          const apiError = error as ApiErrorResponse;
          handleRequestError(
            apiError?.error?.description ||
              "No se pudo inicializar la nómina. Inténtelo nuevamente.",
          );
        },
      },
    );
  }, [
    companyId,
    moduleCode,
    initializeModalPayrollType,
    initializeModalBranch,
    initializePayrollMutation,
    handleRequestError,
    handleRequestSuccess,
  ]);

  const handleConfirmFormalizacion = useCallback(async () => {
    const payrollId = selectedOrdinaryPayroll?.payroll_id;
    if (
      !payrollId ||
      !selectedBranch ||
      !selectedPayrollType ||
      selectedPayrollType === "None"
    ) {
      handleRequestError("No se encontró la nómina activa para formalizar.");
      throw new Error("Missing payroll close context");
    }

    try {
      await closePayrollMutation.mutateAsync({
        companie_id: companyId,
        module_code: moduleCode,
        payroll_id: payrollId,
        branch_id: selectedBranch,
        payroll_type: selectedPayrollType,
      });
      handleRequestSuccess(
        "La nómina se formalizó correctamente.",
        "Nómina formalizada",
      );
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      handleRequestError(
        apiError?.error?.description ||
          "No se pudo formalizar la nómina. Inténtelo nuevamente.",
      );
      throw error;
    }
  }, [
    selectedOrdinaryPayroll?.payroll_id,
    selectedBranch,
    selectedPayrollType,
    companyId,
    moduleCode,
    closePayrollMutation,
    handleRequestError,
    handleRequestSuccess,
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

      const detailsData = payrollDetailsQuery.data;
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

      const preparedSignatureImageSrc = signatures.solicitado.signatureImage
        ? await getProcessedSignatureImage(signatures.solicitado.signatureImage)
        : "";
      const reviewedSignatureImageSrc = signatures.signatureImage
        ? await getProcessedSignatureImage(signatures.signatureImage)
        : "";

      const blob = await pdf(
        <PayrollPdfDocument
          typePayroll={selectedPayrollType}
          data={allItems}
          branchName={displayedBranchName ?? ""}
          companyName={companyName}
          startDate={payrollDetailsQuery.data?.start_date}
          endDate={payrollDetailsQuery.data?.end_date}
          visibleKeys={visibleKeys}
          preparedBy={{
            name: signatures.solicitado.name,
          }}
          reviewedBy={{
            name: signatures.revisado.name,
            role: signatures.revisado.role,
          }}
          preparedSignatureImageSrc={preparedSignatureImageSrc}
          reviewedSignatureImageSrc={reviewedSignatureImageSrc}
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
    payrollDetailsQuery.data,
    displayedBranchName,
    visibleKeys,
    companyName,
    currentCompanyImageUrl,
    identificationFilter,
    workAreaFilter,
    jobPositionFilter,
    handlePdfGenerationError,
  ]);

  const handleGeneratePaymentReceiptsPdf = useCallback(async () => {
    if (!selectedPayrollType || !selectedBranch || !companyId || !moduleCode)
      return;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay datos en la tabla de nómina para generar los recibos de pago.",
      );
      return;
    }
    try {
      setIsGeneratingPaymentReceiptsPdf(true);
      const payrollServices = new PayrollServices(httpHandler);

      const detailsData = payrollDetailsQuery.data;
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
      const hasNoPayableData = allItems.every((item) => {
        const deductions = parseAdditionalDeductions(
          item.deductions_additional_data,
        );
        const isIncomeZero = INCOME_KEYS.every(
          (key) => item[key as keyof PayrollItemResponse] === 0,
        );
        const isDeductionsZero = DEDUCTION_KEYS.every(
          (key) => deductions?.[key as keyof AdditionalDeductions] === 0,
        );
        return isIncomeZero && isDeductionsZero;
      });
      if (hasNoPayableData) {
        handlePdfGenerationError(
          "No hay datos disponibles para generar los recibos de pago.",
        );
        return;
      }
      const blob = await pdf(
        <PaymentReceiptDocument
          data={allItems}
          startDate={payrollDetailsQuery.data?.start_date}
          endDate={payrollDetailsQuery.data?.end_date}
          branchName={displayedBranchName ?? ""}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar los recibos de pago en PDF.",
      );
    } finally {
      setIsGeneratingPaymentReceiptsPdf(false);
    }
  }, [
    selectedPayrollType,
    selectedBranch,
    companyId,
    moduleCode,
    hasPayrollData,
    payrollDetailsQuery.data,
    displayedBranchName,
    companyName,
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

      const detailsData = payrollDetailsQuery.data;
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
      if (allItems.length === 0) {
        handlePdfGenerationError(
          "No hay datos disponibles para generar las solicitudes de pago, intente nuevamente mas tarde.",
        );
        return;
      }
      const filteredItems = allItems.filter(
        (item) => !item.collaborator?.bank_account?.trim(),
      );

      if (filteredItems.length === 0) {
        handlePdfGenerationError(
          "No hay colaboradores sin cuenta bancaria para generar las solicitudes de pago.",
        );
        return;
      }
      const { signatureImage } = getSignatures(companyName);
      const signatureImageSrc =
        await getProcessedSignatureImage(signatureImage);
      const blob = await pdf(
        <CheckPdfDocument
          data={filteredItems}
          startDate={payrollDetailsQuery.data?.start_date}
          endDate={payrollDetailsQuery.data?.end_date}
          signatureImageSrc={signatureImageSrc}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      handlePdfGenerationError(
        "Ocurrió un error al generar las solicitudes de pago en PDF, intente nuevamente mas tarde.",
      );
    } finally {
      setIsGeneratingPaymentRequestsPdf(false);
    }
  }, [
    selectedPayrollType,
    selectedBranch,
    companyId,
    moduleCode,
    companyName,
    payrollDetailsQuery.data,
    currentCompanyImageUrl,
    identificationFilter,
    workAreaFilter,
    jobPositionFilter,
    handlePdfGenerationError,
  ]);

  const handleGenerateAccumulatedHistoryPdf = useCallback(async () => {
    const payrollId = payrollDetailsQuery.data?.payroll_id;
    if (!companyId || !payrollId || !moduleCode || !selectedPayrollType) return;
    try {
      setIsGeneratingAccumulatedHistoryPdf(true);
      const payrollServices = new PayrollServices(httpHandler);

      const reportResponse = await payrollServices.generateReportsPayroll({
        companie_id: companyId,
        module_code: moduleCode,
        payroll_type: selectedPayrollType ?? "None",
        payroll_id: payrollId,
        report_type: "Accumulated",
      });
      const reportData = reportResponse.accumulated_history ?? [];

      if (!reportData.length) {
        handlePdfGenerationError(
          "No hay datos disponibles para generar el historial acumulado, intente nuevamente mas tarde.",
        );
        return;
      }

      const reviewedSignatureImageSrc = signatures.solicitado.signatureImage
        ? await getProcessedSignatureImage(signatures.solicitado.signatureImage)
        : "";
      const yearNow = new Date().getFullYear();
      const monthNow = "01 enero";
      const blob = await pdf(
        <AccumulatedPdfDocument
          data={reportData}
          branchName={displayedBranchName ?? ""}
          startDate={`${monthNow}-${yearNow}`}
          endDate={payrollDetailsQuery.data?.end_date}
          reviewedBy={{
            name: signatures.solicitado.name,
            role: signatures.solicitado.role,
          }}
          reviewedSignatureImageSrc={reviewedSignatureImageSrc}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      handlePdfGenerationError(
        "Ocurrió un error al generar el reporte de historial acumulado, intente nuevamente mas tarde.",
      );
    } finally {
      setIsGeneratingAccumulatedHistoryPdf(false);
    }
  }, [
    companyId,
    moduleCode,
    selectedPayrollType,
    companyName,
    payrollDetailsQuery.data?.payroll_id,
    payrollDetailsQuery.data?.start_date,
    payrollDetailsQuery.data?.end_date,
    handlePdfGenerationError,
  ]);
  const handleGenerateVacationControlPdf = useCallback(async () => {
    const payrollId = payrollDetailsQuery.data?.payroll_id;
    if (
      !companyId ||
      !moduleCode ||
      !selectedPayrollType ||
      !selectedBranch ||
      !payrollId
    ) {
      return;
    }
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay colaboradores en la nómina para generar el control de vacaciones.",
      );
      return;
    }
    const startDate = payrollDetailsQuery.data?.start_date;
    const endDate = payrollDetailsQuery.data?.end_date;
    try {
      setIsGeneratingVacationControlPdf(true);
      const payrollServices = new PayrollServices(httpHandler);
      const permissionServices = new PermissionServices(httpHandler);

      const detailsData = payrollDetailsQuery.data;
      const totalRecords = detailsData?.payroll_details?.total_items ?? 0;

      const [reportResponse, payrollResponse, allPermissions] =
        await Promise.all([
          payrollServices.generateReportsPayroll({
            companie_id: companyId,
            module_code: moduleCode,
            payroll_type: selectedPayrollType ?? "None",
            payroll_id: payrollId,
            report_type: "VacationAccrual",
          }),
          payrollServices.getPayroll({
            companie_id: companyId,
            module_code: moduleCode,
            type: selectedPayrollType,
            branch_id: selectedBranch,
            page_number: 1,
            page_size: totalRecords > 0 ? totalRecords : maxPageSize,
          } as PayrollRequest),
          fetchAllPermissionsByPayroll(permissionServices, {
            companie_id: companyId,
            module_code: moduleCode,
            payroll_id: payrollId,
          }),
        ]);
      const payrollItems = payrollResponse.payroll_details?.items ?? [];
      const accrualData = reportResponse.vacation_accruals_history ?? [];
      const pages = buildVacationControlPages(
        payrollItems,
        accrualData,
        allPermissions,
      );
      if (!pages.length) {
        handlePdfGenerationError(
          "No hay colaboradores disponibles para generar el control de vacaciones.",
        );
        return;
      }

      const blob = await pdf(
        <VacationControlPdfDocument
          pages={pages}
          startDate={startDate}
          endDate={endDate}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      handlePdfGenerationError(
        "Ocurrió un error al generar el control de vacaciones, intente nuevamente mas tarde.",
      );
    } finally {
      setIsGeneratingVacationControlPdf(false);
    }
  }, [
    companyId,
    moduleCode,
    selectedPayrollType,
    selectedBranch,
    hasPayrollData,
    payrollDetailsQuery.data,
    handlePdfGenerationError,
  ]);

  const handleGenerateVacationControlAreaPdf = useCallback(async () => {
    const payrollId = payrollDetailsQuery.data?.payroll_id;
    if (
      !companyId ||
      !moduleCode ||
      !selectedPayrollType ||
      !selectedBranch ||
      !payrollId
    ) {
      return;
    }
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay colaboradores en la nómina para generar el control de vacaciones por área.",
      );
      return;
    }
    const startDate = payrollDetailsQuery.data?.start_date;
    const endDate = payrollDetailsQuery.data?.end_date;
    try {
      setIsGeneratingVacationControlAreaPdf(true);
      const payrollServices = new PayrollServices(httpHandler);
      const permissionServices = new PermissionServices(httpHandler);

      const detailsData = payrollDetailsQuery.data;
      const totalRecords = detailsData?.payroll_details?.total_items ?? 0;

      const [reportResponse, payrollResponse, allPermissions] =
        await Promise.all([
          payrollServices.generateReportsPayroll({
            companie_id: companyId,
            module_code: moduleCode,
            payroll_type: selectedPayrollType ?? "None",
            payroll_id: payrollId,
            report_type: "VacationAccrual",
          }),
          payrollServices.getPayroll({
            companie_id: companyId,
            module_code: moduleCode,
            type: selectedPayrollType,
            branch_id: selectedBranch,
            page_number: 1,
            page_size: totalRecords > 0 ? totalRecords : maxPageSize,
          } as PayrollRequest),
          fetchAllPermissionsByPayroll(permissionServices, {
            companie_id: companyId,
            module_code: moduleCode,
            payroll_id: payrollId,
          }),
        ]);
      const payrollItems = payrollResponse.payroll_details?.items ?? [];
      const accrualData = reportResponse.vacation_accruals_history ?? [];
      const rows = buildVacationControlAreaRows(
        payrollItems,
        accrualData,
        allPermissions,
      );
      if (!rows.length) {
        handlePdfGenerationError(
          "No hay colaboradores disponibles para generar el control de vacaciones por área.",
        );
        return;
      }

      const blob = await pdf(
        <VacationControlAreaPdfDocument
          rows={rows}
          branchName={displayedBranchName ?? ""}
          startDate={startDate}
          endDate={endDate}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el control de vacaciones por área, intente nuevamente mas tarde.",
      );
    } finally {
      setIsGeneratingVacationControlAreaPdf(false);
    }
  }, [
    companyId,
    moduleCode,
    selectedPayrollType,
    selectedBranch,
    hasPayrollData,
    payrollDetailsQuery.data,
    displayedBranchName,
    handlePdfGenerationError,
  ]);

  const loadVacationAccrualAreaReportData = useCallback(async () => {
    const payrollId = payrollDetailsQuery.data?.payroll_id;
    if (
      !companyId ||
      !moduleCode ||
      !selectedPayrollType ||
      !selectedBranch ||
      !payrollId
    ) {
      return null;
    }
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay colaboradores en la nómina para generar el acumulado de vacaciones aguinaldo.",
      );
      return null;
    }

    const payrollServices = new PayrollServices(httpHandler);
    const detailsData = payrollDetailsQuery.data;
    const totalRecords = detailsData?.payroll_details?.total_items ?? 0;

    const [reportResponse, payrollResponse] = await Promise.all([
      payrollServices.generateReportsPayroll({
        companie_id: companyId,
        module_code: moduleCode,
        payroll_type: selectedPayrollType ?? "None",
        payroll_id: payrollId,
        report_type: "VacationAccrual",
      }),
      payrollServices.getPayroll({
        companie_id: companyId,
        module_code: moduleCode,
        type: selectedPayrollType,
        branch_id: selectedBranch,
        identification_number: identificationFilter || undefined,
        work_area_id: workAreaFilter || undefined,
        job_position_id: jobPositionFilter || undefined,
        page_number: 1,
        page_size: totalRecords > 0 ? totalRecords : maxPageSize,
      } as PayrollRequest),
    ]);

    const payrollItems = payrollResponse.payroll_details?.items ?? [];
    const accrualData = reportResponse.vacation_accruals_history ?? [];
    const rows = buildVacationAccrualAreaRows(payrollItems, accrualData);

    if (!rows.length) {
      handlePdfGenerationError(
        "No hay colaboradores disponibles para generar el acumulado de vacaciones aguinaldo.",
      );
      return null;
    }

    return rows;
  }, [
    companyId,
    moduleCode,
    selectedPayrollType,
    selectedBranch,
    hasPayrollData,
    payrollDetailsQuery.data,
    identificationFilter,
    workAreaFilter,
    jobPositionFilter,
    handlePdfGenerationError,
  ]);

  const handleGenerateVacationAccrualAreaPdf = useCallback(async () => {
    const startDate = payrollDetailsQuery.data?.start_date;
    const endDate = payrollDetailsQuery.data?.end_date;
    try {
      setIsGeneratingVacationAccrualAreaReport(true);
      const rows = await loadVacationAccrualAreaReportData();
      if (!rows) return;

      const blob = await pdf(
        <VacationAccrualAreaPdfDocument
          rows={rows}
          branchName={displayedBranchName ?? ""}
          startDate={startDate}
          endDate={endDate}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el acumulado de vacaciones aguinaldo en PDF, intente nuevamente mas tarde.",
      );
    } finally {
      setIsGeneratingVacationAccrualAreaReport(false);
    }
  }, [
    payrollDetailsQuery.data,
    loadVacationAccrualAreaReportData,
    displayedBranchName,
    handlePdfGenerationError,
  ]);

  const handleGenerateVacationAccrualAreaExcel = useCallback(async () => {
    try {
      setIsGeneratingVacationAccrualAreaReport(true);
      const rows = await loadVacationAccrualAreaReportData();
      if (!rows) return;

      await exportVacationAccrualAreaExcel({
        rows,
        branchName: displayedBranchName ?? "",
        startDate: payrollDetailsQuery.data?.start_date,
        endDate: payrollDetailsQuery.data?.end_date,
        logoUrl: useCompanyStore.getState().urlImage,
      });
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el acumulado de vacaciones aguinaldo en Excel, intente nuevamente mas tarde.",
      );
    } finally {
      setIsGeneratingVacationAccrualAreaReport(false);
    }
  }, [
    loadVacationAccrualAreaReportData,
    displayedBranchName,
    payrollDetailsQuery.data,
    handlePdfGenerationError,
  ]);

  const handleGenerateIncomeSummaryPdf = useCallback(async () => {
    if (!selectedPayrollType || !selectedBranch || !companyId || !moduleCode)
      return;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay datos en la tabla de nómina para generar el resumen de ingresos.",
      );
      return;
    }
    try {
      setIsGeneratingIncomeSummaryPdf(true);
      const payrollServices = new PayrollServices(httpHandler);

      const detailsData = payrollDetailsQuery.data;
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
      const hasNotIncomes = allItems.every((item) => {
        return INCOME_KEYS.every(
          (key) => item[key as keyof PayrollItemResponse] === 0,
        );
      });
      if (hasNotIncomes) {
        handlePdfGenerationError(
          "No hay datos disponibles para generar el resumen de ingresos.",
        );
        return;
      }
      const blob = await pdf(
        <IncomeSummaryPdfDocument
          data={allItems}
          branchName={displayedBranchName ?? ""}
          startDate={payrollDetailsQuery.data?.start_date}
          endDate={payrollDetailsQuery.data?.end_date}
          periodCode={payrollDetailsQuery.data?.start_date ?? ""}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el resumen de ingresos en PDF.",
      );
    } finally {
      setIsGeneratingIncomeSummaryPdf(false);
    }
  }, [
    selectedPayrollType,
    selectedBranch,
    companyId,
    moduleCode,
    hasPayrollData,
    payrollDetailsQuery.data,
    displayedBranchName,
    identificationFilter,
    workAreaFilter,
    jobPositionFilter,
    handlePdfGenerationError,
  ]);
  const handleGenerateDeductionSummaryPdf = useCallback(async () => {
    if (!selectedPayrollType || !selectedBranch || !companyId || !moduleCode)
      return;

    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay datos en la tabla de nómina para generar el resumen de ingresos.",
      );
      return;
    }

    try {
      setIsGeneratingDeductionSummaryPdf(true);
      const payrollServices = new PayrollServices(httpHandler);

      const detailsData = payrollDetailsQuery.data;
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
      const hasNotDeductions = allItems.every((item) => {
        const currentDeduction = parseAdditionalDeductions(
          item.deductions_additional_data,
        );
        return DEDUCTION_KEYS.every(
          (key) => currentDeduction?.[key as keyof AdditionalDeductions] === 0,
        );
      });
      if (hasNotDeductions) {
        handlePdfGenerationError(
          "No hay datos disponibles para generar el resumen de deducciones.",
        );
        return;
      }
      const blob = await pdf(
        <DeductionSummaryPdfDocument
          data={allItems}
          branchName={displayedBranchName ?? ""}
          startDate={payrollDetailsQuery.data?.start_date}
          endDate={payrollDetailsQuery.data?.end_date}
          periodCode={payrollDetailsQuery.data?.start_date ?? ""}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el resumen de deducciones en PDF.",
      );
    } finally {
      setIsGeneratingDeductionSummaryPdf(false);
    }
  }, [
    selectedPayrollType,
    selectedBranch,
    companyId,
    moduleCode,
    hasPayrollData,
    payrollDetailsQuery.data,
    displayedBranchName,
    handlePdfGenerationError,
  ]);

  const handleGenerateAccumulatedHistoryExcel = useCallback(async () => {
    const payrollId = payrollDetailsQuery.data?.payroll_id;
    if (!companyId || !payrollId || !moduleCode || !selectedPayrollType) return;
    try {
      setIsGeneratingAccumulatedHistoryPdf(true);
      const payrollServices = new PayrollServices(httpHandler);

      const reportResponse = await payrollServices.generateReportsPayroll({
        companie_id: companyId,
        module_code: moduleCode,
        payroll_type: selectedPayrollType ?? "None",
        payroll_id: payrollId,
        report_type: "Accumulated",
      });
      const reportData = reportResponse.accumulated_history ?? [];

      if (!reportData.length) {
        handlePdfGenerationError(
          "No hay datos disponibles para generar el historial acumulado, intente nuevamente mas tarde.",
        );
        return;
      }

      const yearNow = new Date().getFullYear();
      const monthNow = "01 enero";
      await exportAccumulatedHistoryExcel({
        data: reportData,
        branchName: displayedBranchName ?? "",
        startDate: `${monthNow}-${yearNow}`,
        endDate: payrollDetailsQuery.data?.end_date,
        logoUrl: useCompanyStore.getState().urlImage,
      });
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el historial acumulado en Excel, intente nuevamente mas tarde.",
      );
    } finally {
      setIsGeneratingAccumulatedHistoryPdf(false);
    }
  }, [
    companyId,
    moduleCode,
    selectedPayrollType,
    payrollDetailsQuery.data?.payroll_id,
    payrollDetailsQuery.data?.end_date,
    displayedBranchName,
    handlePdfGenerationError,
  ]);

  const handleGenerateIncomeSummaryExcel = useCallback(async () => {
    if (!selectedPayrollType || !selectedBranch || !companyId || !moduleCode)
      return;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay datos en la tabla de nómina para generar el resumen de ingresos.",
      );
      return;
    }
    try {
      setIsGeneratingIncomeSummaryPdf(true);
      const payrollServices = new PayrollServices(httpHandler);

      const detailsData = payrollDetailsQuery.data;
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
      const hasNotIncomes = allItems.every((item) => {
        return INCOME_KEYS.every(
          (key) => item[key as keyof PayrollItemResponse] === 0,
        );
      });
      if (hasNotIncomes) {
        handlePdfGenerationError(
          "No hay datos disponibles para generar el resumen de ingresos.",
        );
        return;
      }

      await exportIncomeSummaryExcel({
        data: allItems,
        branchName: displayedBranchName ?? "",
        startDate: payrollDetailsQuery.data?.start_date,
        endDate: payrollDetailsQuery.data?.end_date,
        periodCode: payrollDetailsQuery.data?.start_date ?? "",
        logoUrl: useCompanyStore.getState().urlImage,
      });
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el resumen de ingresos en Excel.",
      );
    } finally {
      setIsGeneratingIncomeSummaryPdf(false);
    }
  }, [
    selectedPayrollType,
    selectedBranch,
    companyId,
    moduleCode,
    hasPayrollData,
    payrollDetailsQuery.data,
    displayedBranchName,
    identificationFilter,
    workAreaFilter,
    jobPositionFilter,
    handlePdfGenerationError,
  ]);

  const handleGenerateDeductionSummaryExcel = useCallback(async () => {
    if (!selectedPayrollType || !selectedBranch || !companyId || !moduleCode)
      return;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay datos en la tabla de nómina para generar el resumen de deducciones.",
      );
      return;
    }
    try {
      setIsGeneratingDeductionSummaryPdf(true);
      const payrollServices = new PayrollServices(httpHandler);

      const detailsData = payrollDetailsQuery.data;
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
      const hasNotDeductions = allItems.every((item) => {
        const currentDeduction = parseAdditionalDeductions(
          item.deductions_additional_data,
        );
        return DEDUCTION_KEYS.every(
          (key) => currentDeduction?.[key as keyof AdditionalDeductions] === 0,
        );
      });
      if (hasNotDeductions) {
        handlePdfGenerationError(
          "No hay datos disponibles para generar el resumen de deducciones.",
        );
        return;
      }

      await exportDeductionSummaryExcel({
        data: allItems,
        branchName: displayedBranchName ?? "",
        startDate: payrollDetailsQuery.data?.start_date,
        endDate: payrollDetailsQuery.data?.end_date,
        periodCode: payrollDetailsQuery.data?.start_date ?? "",
        logoUrl: useCompanyStore.getState().urlImage,
      });
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el resumen de deducciones en Excel.",
      );
    } finally {
      setIsGeneratingDeductionSummaryPdf(false);
    }
  }, [
    selectedPayrollType,
    selectedBranch,
    companyId,
    moduleCode,
    hasPayrollData,
    payrollDetailsQuery.data,
    displayedBranchName,
    identificationFilter,
    workAreaFilter,
    jobPositionFilter,
    handlePdfGenerationError,
  ]);

  const handleGenerateExcel = useCallback(async () => {
    if (!selectedPayrollType || !selectedBranch || !companyId || !moduleCode)
      return;
    try {
      setIsGeneratingExcel(true);
      const payrollServices = new PayrollServices(httpHandler);

      const detailsData = payrollDetailsQuery.data;
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

      await exportPayrollExcel({
        data: allItems,
        visibleKeys,
        companyName,
        branchName: displayedBranchName,
        startDate: payrollDetailsQuery.data?.start_date,
        endDate: payrollDetailsQuery.data?.end_date,
        typePayroll: selectedPayrollType,
        logoUrl: useCompanyStore.getState().urlImage,
      });
    } catch (error) {
      handlePdfGenerationError(
        "Ocurrió un error al generar el reporte de nómina en Excel, intente nuevamente mas tarde.",
      );
    } finally {
      setIsGeneratingExcel(false);
    }
  }, [
    selectedPayrollType,
    selectedBranch,
    companyId,
    moduleCode,
    payrollDetailsQuery.data,
    displayedBranchName,
    visibleKeys,
    companyName,
    identificationFilter,
    workAreaFilter,
    jobPositionFilter,
    handlePdfGenerationError,
  ]);
  const handleGenerateConsolidatedAreaPdf = useCallback(async () => {
    if (!selectedPayrollType || !selectedBranch || !companyId || !moduleCode)
      return;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay datos en la tabla de nómina para generar el reporte.",
      );
      return;
    }
    try {
      setIsGeneratingConsolidatedAreaPdf(true);
      const payrollServices = new PayrollServices(httpHandler);

      const detailsData = payrollDetailsQuery.data;
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

      const preparedSignatureImageSrc = signatures.solicitado.signatureImage
        ? await getProcessedSignatureImage(signatures.solicitado.signatureImage)
        : "";
      // const reviewedSignatureImageSrc = signatures.signatureImage
      //   ? await getProcessedSignatureImage(signatures.signatureImage)
      //   : "";

      const blob = await pdf(
        <ConsolidatedAreaPdfDocument
          data={allItems}
          branchName={displayedBranchName ?? ""}
          companyName={companyName}
          startDate={payrollDetailsQuery.data?.start_date}
          endDate={payrollDetailsQuery.data?.end_date}
          preparedBy={{
            name: signatures.solicitado.name,
          }}
          //  reviewedBy={{
          //    name: signatures.revisado.name,
          //    role: signatures.revisado.role,
          //  }}
          preparedSignatureImageSrc={preparedSignatureImageSrc}
          //  reviewedSignatureImageSrc={reviewedSignatureImageSrc}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el reporte consolidado por área en PDF.",
      );
    } finally {
      setIsGeneratingConsolidatedAreaPdf(false);
    }
  }, [
    selectedPayrollType,
    selectedBranch,
    companyId,
    moduleCode,
    hasPayrollData,
    payrollDetailsQuery.data,
    displayedBranchName,
    companyName,
    signatures,
    identificationFilter,
    workAreaFilter,
    jobPositionFilter,
    handlePdfGenerationError,
  ]);

  const loadEmployeeReceivablesReportData = useCallback(async () => {
    if (!selectedPayrollType || !selectedBranch || !companyId || !moduleCode)
      return null;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay datos en la tabla de nómina para generar el reporte.",
      );
      return null;
    }

    const payrollServices = new PayrollServices(httpHandler);
    const deductionsService = new DeductionsServicesByPayroll(httpHandler);

    const detailsData = payrollDetailsQuery.data;
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

    const reportData = await buildEmployeeReceivablesReportData({
      allItems,
      companyId,
      moduleCode,
      deductionsService,
    });

    if (reportData.length === 0) {
      handlePdfGenerationError(
        "No hay deducciones de préstamos para los colaboradores en esta nómina.",
      );
      return null;
    }

    return reportData;
  }, [
    selectedPayrollType,
    selectedBranch,
    companyId,
    moduleCode,
    hasPayrollData,
    payrollDetailsQuery.data,
    identificationFilter,
    workAreaFilter,
    jobPositionFilter,
    handlePdfGenerationError,
  ]);

  const handleGenerateEmployeeReceivablesPdf = useCallback(async () => {
    try {
      setIsGeneratingEmployeeReceivablesPdf(true);
      const reportData = await loadEmployeeReceivablesReportData();
      if (!reportData) return;

      const preparedSignatureImageSrc = signatures.solicitado.signatureImage
        ? await getProcessedSignatureImage(signatures.solicitado.signatureImage)
        : "";

      const blob = await pdf(
        <EmployeeReceivablesPdfDocument
          data={reportData}
          companyName={companyName}
          preparedBy={{
            name: signatures.solicitado.name,
            role: signatures.solicitado.role,
          }}
          preparedSignatureImageSrc={preparedSignatureImageSrc}
          logoUrl={useCompanyStore.getState().urlImage}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el reporte de saldos por cobrar a empleados.",
      );
    } finally {
      setIsGeneratingEmployeeReceivablesPdf(false);
    }
  }, [
    loadEmployeeReceivablesReportData,
    companyName,
    signatures,
    handlePdfGenerationError,
  ]);

  const handleGenerateEmployeeReceivablesExcel = useCallback(async () => {
    try {
      setIsGeneratingEmployeeReceivablesPdf(true);
      const reportData = await loadEmployeeReceivablesReportData();
      if (!reportData) return;

      await exportEmployeeReceivablesExcel({
        data: reportData,
        companyName,
        branchName: displayedBranchName,
        logoUrl: useCompanyStore.getState().urlImage,
      });
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el reporte de saldos por cobrar a empleados en Excel.",
      );
    } finally {
      setIsGeneratingEmployeeReceivablesPdf(false);
    }
  }, [
    loadEmployeeReceivablesReportData,
    companyName,
    displayedBranchName,
    handlePdfGenerationError,
  ]);

  const handleGenerateConsolidatedAreaExcel = useCallback(async () => {
    if (!selectedPayrollType || !selectedBranch || !companyId || !moduleCode)
      return;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay datos en la tabla de nómina para generar el reporte.",
      );
      return;
    }
    try {
      setIsGeneratingConsolidatedAreaExcel(true);
      const payrollServices = new PayrollServices(httpHandler);

      const detailsData = payrollDetailsQuery.data;
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

      await exportConsolidatedAreaExcel({
        data: allItems,
        companyName,
        branchName: displayedBranchName,
        startDate: payrollDetailsQuery.data?.start_date,
        endDate: payrollDetailsQuery.data?.end_date,
        logoUrl: useCompanyStore.getState().urlImage,
      });
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el reporte consolidado por área en Excel.",
      );
    } finally {
      setIsGeneratingConsolidatedAreaExcel(false);
    }
  }, [
    selectedPayrollType,
    selectedBranch,
    companyId,
    moduleCode,
    hasPayrollData,
    payrollDetailsQuery.data,
    displayedBranchName,
    companyName,
    identificationFilter,
    workAreaFilter,
    jobPositionFilter,
    handlePdfGenerationError,
  ]);

  const executePdfForAction = useCallback(
    async (action: PayrollActionValue) => {
      switch (action) {
        case "report":
          await handleGeneratePdf();
          break;
        case "payment_receipts":
          await handleGeneratePaymentReceiptsPdf();
          break;
        case "payment_requests":
          await handleGeneratePaymentRequestsPdf();
          break;
        case "accumulated_history":
          await handleGenerateAccumulatedHistoryPdf();
          break;
        case "vacation_control_report":
          await handleGenerateVacationControlPdf();
          break;
        case "vacation_control_area_report":
          await handleGenerateVacationControlAreaPdf();
          break;
        case "vacation_accrual_area_report":
          await handleGenerateVacationAccrualAreaPdf();
          break;
        case "income_report":
          await handleGenerateIncomeSummaryPdf();
          break;
        case "deduction_report":
          await handleGenerateDeductionSummaryPdf();
          break;
        case "consolidated_area_report":
          await handleGenerateConsolidatedAreaPdf();
          break;
        case "employee_receivables_report":
          await handleGenerateEmployeeReceivablesPdf();
          break;
        default:
          break;
      }
    },
    [
      handleGeneratePdf,
      handleGeneratePaymentReceiptsPdf,
      handleGeneratePaymentRequestsPdf,
      handleGenerateAccumulatedHistoryPdf,
      handleGenerateVacationControlPdf,
      handleGenerateVacationControlAreaPdf,
      handleGenerateVacationAccrualAreaPdf,
      handleGenerateIncomeSummaryPdf,
      handleGenerateDeductionSummaryPdf,
      handleGenerateConsolidatedAreaPdf,
    ],
  );

  const isGenerateConfirmLoading =
    isGeneratingPdf ||
    isGeneratingExcel ||
    isGeneratingPaymentReceiptsPdf ||
    isGeneratingPaymentRequestsPdf ||
    isGeneratingAccumulatedHistoryPdf ||
    isGeneratingVacationControlPdf ||
    isGeneratingVacationControlAreaPdf ||
    isGeneratingVacationAccrualAreaReport ||
    isGeneratingIncomeSummaryPdf ||
    isGeneratingDeductionSummaryPdf ||
    isGeneratingConsolidatedAreaPdf ||
    isGeneratingEmployeeReceivablesPdf ||
    isGeneratingConsolidatedAreaExcel;

  const handleOpenGenerateModal = useCallback(() => {
    setSelectedAction(null);
    setGeneratePdfChecked(false);
    setGenerateExcelChecked(false);
    setIsGenerateModalOpen(true);
  }, []);

  const handleCloseGenerateModal = useCallback(() => {
    if (isGenerateConfirmLoading) return;
    setIsGenerateModalOpen(false);
  }, [isGenerateConfirmLoading]);

  const executeExcelForAction = useCallback(
    async (action: PayrollActionValue) => {
      switch (action) {
        case "report":
          await handleGenerateExcel();
          break;
        case "consolidated_area_report":
          await handleGenerateConsolidatedAreaExcel();
          break;
        case "vacation_accrual_area_report":
          await handleGenerateVacationAccrualAreaExcel();
          break;
        case "accumulated_history":
          await handleGenerateAccumulatedHistoryExcel();
          break;
        case "income_report":
          await handleGenerateIncomeSummaryExcel();
          break;
        case "deduction_report":
          await handleGenerateDeductionSummaryExcel();
          break;
        case "employee_receivables_report":
          await handleGenerateEmployeeReceivablesExcel();
          break;
        case "monthly_accumulated_report":
        case "monthly_ir_report":
        case "monthly_inss_report":
          handlePdfGenerationError(
            "La exportación en Excel para este reporte aún no está disponible.",
          );
          break;
        default:
          break;
      }
    },
    [
      handleGenerateExcel,
      handleGenerateVacationAccrualAreaExcel,
      handleGenerateAccumulatedHistoryExcel,
      handleGenerateIncomeSummaryExcel,
      handleGenerateDeductionSummaryExcel,
      handleGenerateEmployeeReceivablesExcel,
      handlePdfGenerationError,
    ],
  );

  const handleConfirmGenerate = useCallback(async () => {
    if (!selectedAction) return;
    if (!generatePdfChecked && !generateExcelChecked) return;
    try {
      if (generatePdfChecked) {
        await executePdfForAction(selectedAction);
      }
      if (generateExcelChecked && actionSupportsExcel(selectedAction)) {
        await executeExcelForAction(selectedAction);
      }
    } finally {
      setIsGenerateModalOpen(false);
    }
  }, [
    selectedAction,
    generatePdfChecked,
    generateExcelChecked,
    executePdfForAction,
    executeExcelForAction,
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

  const handleRegisterIncome = useCallback(() => {
    setIsIncomeModalOpen(true);
  }, []);

  const handleRegisterDeduction = useCallback(() => {
    setIsDeductionModalOpen(true);
  }, []);

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
      const detailsData = payrollDetailsQuery.data;
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
              columns={payrollColumnDefs}
              currentPage={pageNumber}
              pageSize={maxPageSize}
              totalRecords={totalRecords}
              visibleKeys={visibleKeys}
              onVisibleKeysChange={setVisibleKeys}
              onPageChange={handlePageChange}
              onRowDoubleClick={handleOpenPayrollDetailModal}
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
    <LazyMotion features={loadFeatures} strict>
      <ModalDetailsPayroll
        isOpen={isPayrollDetailModalOpen}
        onClose={handleClosePayrollDetailModal}
        payrollItem={selectedPayrollRow}
        payrollId={payrollDetailsQuery.data?.payroll_id}
        payrollType={selectedPayrollType ?? "None"}
      />

      <PayrollGenerateReportsModal
        isOpen={isGenerateModalOpen}
        onClose={handleCloseGenerateModal}
        options={payrollActionOptions}
        appearance={theme === "dark" ? "dark" : "default"}
        selectedAction={selectedAction}
        onSelectedActionChange={setSelectedAction}
        generatePdfChecked={generatePdfChecked}
        generateExcelChecked={generateExcelChecked}
        onGeneratePdfChange={setGeneratePdfChecked}
        onGenerateExcelChange={setGenerateExcelChecked}
        onConfirm={handleConfirmGenerate}
        isConfirmLoading={isGenerateConfirmLoading}
        confirmDisabled={!existPayrollInProgress}
      />

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

      <m.div
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
                cicloInicial={payrollDetailsQuery.data?.start_date ?? "—"}
                cicloFinal={payrollDetailsQuery.data?.end_date ?? "—"}
                existPayrollInProgress={existPayrollInProgress}
                statusLoading={statusFetchInFlight}
                formalizeLoading={closePayrollMutation.isPending}
                onConfirmFormalizacion={handleConfirmFormalizacion}
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
                  cicloInicial={payrollDetailsQuery.data?.start_date ?? "—"}
                  cicloFinal={payrollDetailsQuery.data?.end_date ?? "—"}
                  existPayrollInProgress={existPayrollInProgress}
                  statusLoading={statusFetchInFlight}
                  formalizeLoading={closePayrollMutation.isPending}
                  onConfirmFormalizacion={handleConfirmFormalizacion}
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

                <Button
                  type="button"
                  size="giant"
                  label="Cambiar tipo de nómina y sucursal"
                  onClick={handleOpenChangePayrollSelection}
                  className="hidden! lg:flex! w-full! lg:w-auto! min-h-[48px]! px-4! text-center! text-[15px]! leading-snug! font-normal! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
                />
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
              <div className="flex flex-col justify-center">
                <h3 className="p-0! m-0!">Acciones Directas</h3>
                <small className="text-gray-500 dark:text-gray-300">
                  Aquí puedes cambiar el tipo de nómina y sucursal, generar
                  reportes desde el botón Generar (PDF y, para reporte de
                  nómina, Excel) y realizar otras acciones directas.
                </small>
              </div>
            </div>

            <div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
              <div className="w-full flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-start">
                <div className="w-full lg:w-[20rem]">
                  <Button
                    type="button"
                    size="giant"
                    label="Generar reportes"
                    isLoading={isGenerateConfirmLoading}
                    disabled={
                      !existPayrollInProgress || isGenerateConfirmLoading
                    }
                    onClick={handleOpenGenerateModal}
                    className={`w-full! min-h-[48px]! px-4! text-center! text-[15px]! leading-snug! font-normal! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! ${
                      isGenerateConfirmLoading
                        ? "disabled:opacity-100! disabled:bg-alpac-primary-500! disabled:dark:bg-alpac-primary-700!"
                        : ""
                    }`}
                  />
                </div>
                <Button
                  type="button"
                  size="giant"
                  label="Registrar Ingreso"
                  disabled={!existPayrollInProgress}
                  onClick={handleRegisterIncome}
                  className={`w-full! lg:w-auto! min-h-[48px]! px-4! text-center! text-[15px]! leading-snug! font-normal! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! ${
                    isGeneratingPdf ||
                    isGeneratingPaymentReceiptsPdf ||
                    isGeneratingPaymentRequestsPdf ||
                    isGeneratingAccumulatedHistoryPdf ||
                    isGeneratingVacationControlPdf ||
                    isGeneratingVacationControlAreaPdf ||
                    isGeneratingVacationAccrualAreaReport ||
                    isGeneratingEmployeeReceivablesPdf
                      ? "disabled:opacity-100! disabled:bg-alpac-primary-500! disabled:dark:bg-alpac-primary-700!"
                      : ""
                  }`}
                />

                <Button
                  type="button"
                  size="giant"
                  label="Registrar Deducción"
                  disabled={!existPayrollInProgress}
                  onClick={handleRegisterDeduction}
                  className={`w-full! lg:w-auto! min-h-[48px]! px-4! text-center! text-[15px]! leading-snug! font-normal! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! ${
                    isGeneratingPdf ||
                    isGeneratingPaymentReceiptsPdf ||
                    isGeneratingPaymentRequestsPdf ||
                    isGeneratingAccumulatedHistoryPdf ||
                    isGeneratingVacationControlPdf ||
                    isGeneratingVacationControlAreaPdf ||
                    isGeneratingVacationAccrualAreaReport ||
                    isGeneratingEmployeeReceivablesPdf
                      ? "disabled:opacity-100! disabled:bg-alpac-primary-500! disabled:dark:bg-alpac-primary-700!"
                      : ""
                  }`}
                />

                <Button
                  size="giant"
                  label="Crear Solicitud de Permiso"
                  disabled={!existPayrollInProgress}
                  onClick={handleOpenPermissionApplicationModal}
                  className={`w-full! lg:w-auto! min-h-[48px]! px-4! text-center! text-[15px]! leading-snug! font-normal! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! ${
                    isGeneratingPdf ||
                    isGeneratingPaymentRequestsPdf ||
                    isGeneratingAccumulatedHistoryPdf ||
                    isGeneratingVacationControlPdf ||
                    isGeneratingVacationControlAreaPdf ||
                    isGeneratingVacationAccrualAreaReport ||
                    isGeneratingEmployeeReceivablesPdf
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

        <CreateIncomeModal
          isOpen={isIncomeModalOpen}
          payrollId={selectedOrdinaryPayroll?.payroll_id!}
          branchId={selectedBranch ?? ""}
          onClose={() => setIsIncomeModalOpen(false)}
          onRequestSuccess={(successMessage) => {
            handleRequestSuccess(successMessage, "Ingreso registrado");
            setIsIncomeModalOpen(false);
          }}
          onRequestError={(errorMessage) => {
            handleRequestError(errorMessage || "Error al registrar el ingreso");
          }}
        />

        <AddDeductionModal
          isOpen={isDeductionModalOpen}
          branchId={selectedBranch ?? ""}
          payrollId={selectedOrdinaryPayroll?.payroll_id!}
          onClose={() => setIsDeductionModalOpen(false)}
          onRequestSuccess={(successMessage) => {
            handleRequestSuccess(successMessage, "Deducción registrada");
            setIsDeductionModalOpen(false);
          }}
          onRequestError={(errorMessage) => {
            handleRequestError(
              errorMessage || "Error al registrar la deducción",
            );
          }}
        />

        <NewPermissionRequestModal
          isOpen={isPermissionApplicationModalOpen}
          payrollId={selectedOrdinaryPayroll?.payroll_id!}
          onClose={() => setIsPermissionApplicationModalOpen(false)}
          onRequestSuccess={(successMessage) => {
            handleRequestSuccess(
              successMessage,
              "Solicitud de permiso creada exitosamente",
            );
            setIsPermissionApplicationModalOpen(false);
          }}
          onRequestError={(errorMessage) => {
            handleRequestError(
              errorMessage || "Error al crear la solicitud de permiso",
            );
          }}
        />

        <AnimatedAlertWrapper open={!!alertState?.open}>
          <Alert
            type={alertState?.type || "info"}
            title={alertState?.title || ""}
            message={alertState?.message || ""}
            onClose={handleCloseAlert}
          />
        </AnimatedAlertWrapper>
      </m.div>
    </LazyMotion>
  );
}
