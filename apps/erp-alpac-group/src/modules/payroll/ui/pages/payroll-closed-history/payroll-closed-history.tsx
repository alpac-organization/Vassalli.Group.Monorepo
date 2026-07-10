import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  Button,
  useTheme,
  AnimatedAlertWrapper,
  Alert,
} from "@alpac/design-system";
import { m, LazyMotion } from "framer-motion";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { usePayrollClosedDetails } from "@app/modules/payroll/ui/hooks/payroll/usePayroll";
import { Loader } from "@app/shared/components/loaders/loader";
import { PayrollTable } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/payroll-table";
import {
  getPayrollColumns,
  payrollColumns,
} from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/utils/payroll-columns";
import { ModalDetailsPayroll } from "@app/modules/payroll/ui/pages/nomina/components/collaborator-details-payroll/modal-details-payroll";
import PayrollFiltersBar from "@app/modules/payroll/ui/pages/nomina/components/payroll-filters/payroll-filtersbar";
import PayrollGenerateReportsModal from "@app/modules/payroll/ui/pages/nomina/components/payroll-generate-reports-modal/payroll-generate-reports-modal";
import { exportPayrollExcel } from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/utils/export-payroll-excel";
import { ConsolidatedAreaPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/consolidated-area-report/pdf/consolidated-area-pdf-document";
import { exportConsolidatedAreaExcel } from "@app/modules/payroll/ui/pages/nomina/components/consolidated-area-report/excel/export-consolidated-area-excel";
import { exportAccumulatedHistoryExcel } from "@app/modules/payroll/ui/pages/nomina/components/accumulated-pdf/excel/export-accumulated-history-excel";
import { filterAccumulatedHistoryByPayrollItems } from "@app/modules/payroll/ui/pages/nomina/components/accumulated-pdf/utils/filter-accumulated-history.utils";
import { exportIncomeSummaryExcel } from "@app/modules/payroll/ui/pages/nomina/components/income-review-pdf/excel/export-income-summary-excel";
import { exportDeductionSummaryExcel } from "@app/modules/payroll/ui/pages/nomina/components/deduction-review-pdf/excel/export-deduction-summary-excel";
import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import type { CollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/collaborator.request";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { pdf } from "@react-pdf/renderer";
import { PayrollPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/payroll-pdf/payroll-pdf-document";
import { PaymentReceiptDocument } from "@app/modules/payroll/ui/pages/nomina/components/payment-receipts/payment-receipt";
import { VacationControlPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/components/vacation-control-pdf";
import { VacationControlAreaPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/components/vacation-control-area-pdf";
import { VacationAccrualAreaPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/components/vacation-accrual-area-pdf";
import {
  buildVacationControlPages,
  fetchAllPermissionsByPayroll,
} from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/utils/vacation-control.utils";
import { buildVacationAccrualAreaRows } from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/utils/vacation-accrual-area.utils";
import { buildVacationControlAreaRows } from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/utils/vacation-control-area.utils";
import { exportVacationAccrualAreaExcel } from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/utils/export-vacation-accrual-area-excel";
import { VacationPermissionsSummaryPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/vacation-permissions-summary/vacation-permissions-summary-pdf-document";
import {
  buildVacationPermissionsSummaryHeader,
  buildVacationPermissionsSummaryRows,
  fetchApprovedVacationPermissionsByPayroll,
} from "@app/modules/payroll/ui/pages/nomina/components/vacation-permissions-summary/utils/build-vacation-permissions-summary.utils";
import { InssReportPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/inss-report-pdf/inss-report-pdf-document";
import { exportInssReportExcel } from "@app/modules/payroll/ui/pages/nomina/components/inss-report-pdf/excel/export-inss-report-excel";
import { resolveInssReportPeriodDates } from "@app/modules/payroll/ui/pages/nomina/components/inss-report-pdf/utils/inss-report.utils";
import { DepreciationReportPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/depreciation-report-pdf/depreciation-report-pdf-document";
import { exportDepreciationReportExcel } from "@app/modules/payroll/ui/pages/nomina/components/depreciation-report-pdf/excel/export-depreciation-report-excel";
import { BacReportPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/bac-report-pdf/bac-report-pdf-document";
import { exportBacReportExcel } from "@app/modules/payroll/ui/pages/nomina/components/bac-report-pdf/excel/export-bac-report-excel";
import { mapPayrollItemsToBacRows } from "@app/modules/payroll/ui/pages/nomina/components/bac-report-pdf/utils/bac-report.utils";
import { buildMonthlyRetentionReportRows } from "@app/modules/payroll/ui/pages/nomina/components/monthly-retention-report/utils/build-monthly-retention-report.utils";
import { exportMonthlyRetentionReportExcel } from "@app/modules/payroll/ui/pages/nomina/components/monthly-retention-report/excel/export-monthly-retention-report-excel";
import type { ReportPayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/generate-report-payroll";
import { exportVacationPermissionsSummaryExcel } from "@app/modules/payroll/ui/pages/nomina/components/vacation-permissions-summary/excel/export-vacation-permissions-summary-excel";
import { IrReportPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/ir-report-pdf/ir-report-pdf-document";
import { exportIrReportExcel } from "@app/modules/payroll/ui/pages/nomina/components/ir-report-pdf/excel/export-ir-report-excel";
import { EmployeeReceivablesPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/employee-receivables-pdf/employee-receivables-pdf-document";
import { exportEmployeeReceivablesExcel } from "@app/modules/payroll/ui/pages/nomina/components/employee-receivables-pdf/excel/export-employee-receivables-excel";
import { buildEmployeeReceivablesReportData } from "@app/modules/payroll/ui/pages/nomina/components/employee-receivables-pdf/utils/build-employee-receivables-data";
import { AccumulatedPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/accumulated-pdf/accumulated-pdf-document";
import { IncomeSummaryPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/income-review-pdf/income-summary-pdf-document";
import { DeductionSummaryPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/deduction-review-pdf/deduction-review.pdf";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
import { PayrollServices } from "@app/modules/payroll/infrastructure/services/payroll-services/PayrollServices";
import { PermissionServices } from "@app/modules/payroll/infrastructure/services/permission-services/PermissionServices";
import { DeductionsServicesByPayroll } from "@app/modules/payroll/infrastructure/services/deduction-services/DeductionsServicesByPayroll";
import {
  getSignaturesForPayroll,
  getReviewedSignatureImage,
} from "@app/modules/payroll/ui/pages/nomina/components/check-pdf/utils/getSignatures";
import { getProcessedSignatureImage } from "@app/modules/payroll/ui/pages/nomina/components/check-pdf/utils/processSignatureImage";
import {
  INCOME_KEYS,
  DEDUCTION_KEYS,
} from "@app/modules/payroll/ui/pages/nomina/utils/payroll.utls";
import { parseAdditionalDeductions } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/utils/parse-additional-deductions";
import type { AdditionalDeductions } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/types/payroll-table.types";
import { SubsidiesReportPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/subsidies-report-pdf/subsidies-report-pdf-document";
import { exportSubsidiesReportExcel } from "@app/modules/payroll/ui/pages/nomina/components/subsidies-report-pdf/excel/export-subsidies-report-excel";
import type { PayrollActionValue } from "@app/modules/payroll/ui/pages/nomina/types/payroll-actions.types";
import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
import { actionSupportsExcel } from "@app/modules/payroll/ui/pages/nomina/constants/payroll-generate-formats.constants";
import { useAlertState } from "@app/shared/hooks/useAlertState";

const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

export function PayrollClosedHistoryPage() {
  const { payroll_id, alias_company } = useParams<{
    payroll_id: string;
    alias_company: string;
  }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const branch_id = location.state?.branch_id as string | undefined;
  const type_payroll = location.state?.type as PayrollType | undefined;

  const { companyId, moduleCode, companyName } = useUserStore();
  const maxPageSize = 10;

  const [pageNumber, setPageNumber] = useState(1);
  const [selectedPayrollRow, setSelectedPayrollRow] =
    useState<PayrollItemResponse | null>(null);
  const [isPayrollDetailModalOpen, setIsPayrollDetailModalOpen] =
    useState(false);
  const [visibleKeys, setVisibleKeys] = useState<string[]>(() =>
    payrollColumns.map((col) => col.key as string),
  );
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingExcel, setIsGeneratingExcel] = useState(false);
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
  const [isGeneratingInssReport, setIsGeneratingInssReport] = useState(false);
  const [isGeneratingIrReport, setIsGeneratingIrReport] = useState(false);
  const [isGeneratingDepreciationReport, setIsGeneratingDepreciationReport] =
    useState(false);
  const [isGeneratingSubsidiesReport, setIsGeneratingSubsidiesReport] =
    useState(false);
  const [isGeneratingBacReport, setIsGeneratingBacReport] = useState(false);
  const [isGeneratingMonthlyRetentionReport, setIsGeneratingMonthlyRetentionReport] =
    useState(false);
  const [
    isGeneratingVacationPermissionsSummary,
    setIsGeneratingVacationPermissionsSummary,
  ] = useState(false);
  const [selectedAction, setSelectedAction] =
    useState<PayrollActionValue | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [generatePdfChecked, setGeneratePdfChecked] = useState(false);
  const [generateExcelChecked, setGenerateExcelChecked] = useState(false);

  const [identificationFilter, setIdentificationFilter] = useState("");
  const [workAreaFilter, setWorkAreaFilter] = useState<string | null>(null);
  const [jobPositionFilter, setJobPositionFilter] = useState<number | null>(
    null,
  );

  const { data: detailsData, isFetching: detailsFetchInFlight } =
    usePayrollClosedDetails(
      {
        companie_id: companyId,
        module_code: moduleCode,
        payroll_id: payroll_id!,
        branch_id: branch_id ?? "",
        identification_number: identificationFilter || undefined,
        area_id: workAreaFilter || undefined,
        job_position_id: jobPositionFilter || undefined,
        page_number: pageNumber,
        page_size: maxPageSize,
      },
      Boolean(payroll_id && branch_id),
    );

  const items = detailsData?.payroll_details?.items ?? [];
  const totalRecords = detailsData?.payroll_details?.total_items ?? 0;
  const hasPayrollData = totalRecords > 0;
  const branchName = detailsData?.branch_name ?? "";

  const signatures = useMemo(
    () => getSignaturesForPayroll(companyName, branchName),
    [companyName, branchName],
  );

  const { alertState, handleCloseAlert, handleRequestError } = useAlertState();

  const handlePdfGenerationError = useCallback(
    (message: string) => {
      handleRequestError(message);
    },
    [handleRequestError],
  );

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
        label: "Generar descargue de vacaciones",
        value: "vacation_permissions_summary_report",
      },
      {
        label: "Generar Nómina Consolidada por Área",
        value: "consolidated_area_report",
      },
      {
        label: "Generar Saldos por Cobrar a Empleados",
        value: "employee_receivables_report",
      },
      {
        label: "Generar Reporte de Depreciaciones",
        value: "depreciation_report",
      },
      {
        label: "Generar Reporte BAC",
        value: "bac_report",
      },
      {
        label: "Generar Reporte de Subsidios",
        value: "subsidies_report",
      },
    ];
    const startDate = detailsData?.start_date;
    const endDate = detailsData?.end_date;
    const startDay = startDate ? new Date(startDate).getUTCDate() : null;
    const endDay = endDate ? new Date(endDate).getUTCDate() : null;
    const PAYROLL_FIRST_PERIOD_END_DAY = 15;
    const PAYROLL_SECOND_PERIOD_START_DAY = 16;
    if (
      endDay === PAYROLL_FIRST_PERIOD_END_DAY ||
      startDay === PAYROLL_SECOND_PERIOD_START_DAY
    ) {
      options.push(
        {
          label: "Generar Reporte Quincenal IR",
          value: "quincenal_ir_report",
        },
        {
          label: "Generar Reporte Quincenal INSS",
          value: "quincenal_inss_report",
        },
      );
    }
    if (startDay === PAYROLL_SECOND_PERIOD_START_DAY) {
      options.push(
        { label: "Generar Reporte Mensual IR", value: "monthly_ir_report" },
        {
          label: "Generar Reporte Mensual INSS",
          value: "monthly_inss_report",
        },
        {
          label: "Generar Informe de Retenciones Mensual",
          value: "monthly_retention_report",
        },
      );
    }
    return options;
  }, [detailsData?.start_date, detailsData?.end_date]);

  useEffect(() => {
    if (
      selectedAction &&
      !payrollActionOptions.some((o) => o.value === selectedAction)
    ) {
      setSelectedAction(null);
    }
  }, [selectedAction, payrollActionOptions]);

  const fetchAllItems = useCallback(async () => {
    const svc = new PayrollServices(httpHandler);
    const response = await svc.getPayrollClosedDetails({
      companie_id: companyId,
      module_code: moduleCode,
      payroll_id: payroll_id!,
      branch_id: branch_id!,
      identification_number: identificationFilter || undefined,
      area_id: workAreaFilter || undefined,
      job_position_id: jobPositionFilter || undefined,
      page_number: 1,
      page_size: totalRecords > 0 ? totalRecords : maxPageSize,
    });
    return response.payroll_details?.items ?? [];
  }, [
    companyId,
    moduleCode,
    payroll_id,
    branch_id,
    identificationFilter,
    workAreaFilter,
    jobPositionFilter,
    totalRecords,
    maxPageSize,
  ]);

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

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

  const handleApplyFilters = useCallback(
    (
      data: Pick<CollaboratorRequest, "identification_number"> & {
        job_position: number;
        work_area: string;
      },
    ) => {
      const normalizedIdentification = (data.identification_number ?? "")
        .trim()
        .replace(/-/g, "");
      setIdentificationFilter(normalizedIdentification);
      setWorkAreaFilter(data.work_area?.trim() ? data.work_area : null);
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

  const handleGeneratePdf = useCallback(async () => {
    if (!payroll_id || !branch_id || !companyId || !moduleCode) return;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay datos en la tabla de nómina para generar el reporte.",
      );
      return;
    }
    try {
      setIsGeneratingPdf(true);
      const allItems = await fetchAllItems();
      const preparedSignatureImageSrc = signatures.solicitado.signatureImage
        ? await getProcessedSignatureImage(signatures.solicitado.signatureImage)
        : "";
      const reviewedSignatureImage = getReviewedSignatureImage(signatures);
      const reviewedSignatureImageSrc = reviewedSignatureImage
        ? await getProcessedSignatureImage(reviewedSignatureImage)
        : "";
      const blob = await pdf(
        <PayrollPdfDocument
          typePayroll={type_payroll ?? "Ordinary"}
          data={allItems}
          branchName={branchName}
          companyName={companyName}
          startDate={detailsData?.start_date}
          endDate={detailsData?.end_date}
          visibleKeys={visibleKeys}
          preparedBy={{ name: signatures.solicitado.name }}
          reviewedBy={{
            name: signatures.revisado.name,
            role: signatures.revisado.role,
          }}
          preparedSignatureImageSrc={preparedSignatureImageSrc}
          reviewedSignatureImageSrc={reviewedSignatureImageSrc}
        />,
      ).toBlob();
      window.open(URL.createObjectURL(blob), "_blank");
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el reporte de nómina en PDF.",
      );
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [
    payroll_id,
    branch_id,
    companyId,
    moduleCode,
    hasPayrollData,
    fetchAllItems,
    signatures,
    type_payroll,
    detailsData,
    companyName,
    visibleKeys,
    branchName,
    handlePdfGenerationError,
  ]);

  const handleGeneratePaymentReceiptsPdf = useCallback(async () => {
    if (!payroll_id || !branch_id || !companyId || !moduleCode) return;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay datos en la tabla de nómina para generar los recibos de pago.",
      );
      return;
    }
    try {
      setIsGeneratingPaymentReceiptsPdf(true);
      const allItems = await fetchAllItems();
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
          startDate={detailsData?.start_date}
          endDate={detailsData?.end_date}
          branchName={branchName}
        />,
      ).toBlob();
      window.open(URL.createObjectURL(blob), "_blank");
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar los recibos de pago en PDF.",
      );
    } finally {
      setIsGeneratingPaymentReceiptsPdf(false);
    }
  }, [
    payroll_id,
    branch_id,
    companyId,
    moduleCode,
    hasPayrollData,
    fetchAllItems,
    detailsData,
    branchName,
    handlePdfGenerationError,
  ]);

  const handleGenerateAccumulatedHistoryPdf = useCallback(async () => {
    if (!companyId || !payroll_id || !moduleCode || !type_payroll) return;
    try {
      setIsGeneratingAccumulatedHistoryPdf(true);
      const svc = new PayrollServices(httpHandler);
      const [reportResponse, payrollItems] = await Promise.all([
        svc.generateReportsPayroll({
          companie_id: companyId,
          module_code: moduleCode,
          payroll_type: type_payroll,
          payroll_id,
          report_type: "Accumulated",
        }),
        fetchAllItems(),
      ]);
      const reportData = filterAccumulatedHistoryByPayrollItems(
        reportResponse.accumulated_history ?? [],
        payrollItems,
      );
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
          startDate={`${monthNow}-${yearNow}`}
          endDate={detailsData?.end_date}
          branchName={detailsData?.branch_name ?? ""}
          reviewedBy={{
            name: signatures.solicitado.name,
            role: signatures.solicitado.role,
          }}
          reviewedSignatureImageSrc={reviewedSignatureImageSrc}
        />,
      ).toBlob();
      window.open(URL.createObjectURL(blob), "_blank");
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el reporte de historial acumulado, intente nuevamente mas tarde.",
      );
    } finally {
      setIsGeneratingAccumulatedHistoryPdf(false);
    }
  }, [
    companyId,
    payroll_id,
    moduleCode,
    type_payroll,
    signatures,
    branchName,
    detailsData?.end_date,
    fetchAllItems,
    handlePdfGenerationError,
  ]);

  const handleGenerateVacationControlPdf = useCallback(async () => {
    if (!companyId || !moduleCode || !type_payroll || !branch_id || !payroll_id)
      return;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay colaboradores en la nómina para generar el control de vacaciones.",
      );
      return;
    }
    const startDate = detailsData?.start_date;
    const endDate = detailsData?.end_date;
    try {
      setIsGeneratingVacationControlPdf(true);
      const payrollServices = new PayrollServices(httpHandler);
      const permissionServices = new PermissionServices(httpHandler);

      const [reportResponse, allItems, allPermissions] = await Promise.all([
        payrollServices.generateReportsPayroll({
          companie_id: companyId,
          module_code: moduleCode,
          payroll_type: type_payroll,
          payroll_id,
          report_type: "VacationAccrual",
        }),
        fetchAllItems(),
        fetchAllPermissionsByPayroll(permissionServices, {
          companie_id: companyId,
          module_code: moduleCode,
          payroll_id,
        }),
      ]);
      const accrualData = reportResponse.vacation_accruals_history ?? [];
      const pages = buildVacationControlPages(
        allItems,
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
      window.open(URL.createObjectURL(blob), "_blank");
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el control de vacaciones, intente nuevamente mas tarde.",
      );
    } finally {
      setIsGeneratingVacationControlPdf(false);
    }
  }, [
    companyId,
    moduleCode,
    type_payroll,
    branch_id,
    payroll_id,
    hasPayrollData,
    detailsData,
    fetchAllItems,
    handlePdfGenerationError,
  ]);

  const handleGenerateVacationControlAreaPdf = useCallback(async () => {
    if (!companyId || !moduleCode || !type_payroll || !branch_id || !payroll_id)
      return;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay colaboradores en la nómina para generar el control de vacaciones por área.",
      );
      return;
    }
    const startDate = detailsData?.start_date;
    const endDate = detailsData?.end_date;
    try {
      setIsGeneratingVacationControlAreaPdf(true);
      const payrollServices = new PayrollServices(httpHandler);
      const permissionServices = new PermissionServices(httpHandler);

      const [reportResponse, allItems, allPermissions] = await Promise.all([
        payrollServices.generateReportsPayroll({
          companie_id: companyId,
          module_code: moduleCode,
          payroll_type: type_payroll,
          payroll_id,
          report_type: "VacationAccrual",
        }),
        fetchAllItems(),
        fetchAllPermissionsByPayroll(permissionServices, {
          companie_id: companyId,
          module_code: moduleCode,
          payroll_id,
        }),
      ]);
      const accrualData = reportResponse.vacation_accruals_history ?? [];
      const rows = buildVacationControlAreaRows(
        allItems,
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
          branchName={branchName}
          startDate={startDate}
          endDate={endDate}
        />,
      ).toBlob();
      window.open(URL.createObjectURL(blob), "_blank");
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
    type_payroll,
    branch_id,
    payroll_id,
    hasPayrollData,
    detailsData,
    fetchAllItems,
    branchName,
    handlePdfGenerationError,
  ]);

  const handleGenerateVacationPermissionsSummaryPdf = useCallback(async () => {
    if (!companyId || !moduleCode || !payroll_id) return;

    const startDate = detailsData?.start_date;
    const endDate = detailsData?.end_date;

    try {
      setIsGeneratingVacationPermissionsSummary(true);
      const permissionServices = new PermissionServices(httpHandler);
      const permissions = await fetchApprovedVacationPermissionsByPayroll(
        permissionServices,
        {
          companie_id: companyId,
          module_code: moduleCode,
          payroll_id,
        },
      );

      if (!permissions.length) {
        handlePdfGenerationError(
          "No hay permisos de vacaciones aprobados para esta quincena.",
        );
        return;
      }

      const header = buildVacationPermissionsSummaryHeader(startDate, endDate);
      const rows = buildVacationPermissionsSummaryRows(permissions);

      const blob = await pdf(
        <VacationPermissionsSummaryPdfDocument
          header={header}
          rows={rows}
          branchName={branchName}
        />,
      ).toBlob();

      window.open(URL.createObjectURL(blob), "_blank");
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el descargue de vacaciones, intente nuevamente mas tarde.",
      );
    } finally {
      setIsGeneratingVacationPermissionsSummary(false);
    }
  }, [
    companyId,
    moduleCode,
    payroll_id,
    detailsData,
    branchName,
    handlePdfGenerationError,
  ]);

  const handleGenerateVacationPermissionsSummaryExcel =
    useCallback(async () => {
      if (!companyId || !moduleCode || !payroll_id) return;

      const startDate = detailsData?.start_date;
      const endDate = detailsData?.end_date;

      try {
        setIsGeneratingVacationPermissionsSummary(true);
        const permissionServices = new PermissionServices(httpHandler);
        const permissions = await fetchApprovedVacationPermissionsByPayroll(
          permissionServices,
          {
            companie_id: companyId,
            module_code: moduleCode,
            payroll_id,
          },
        );

        if (!permissions.length) {
          handlePdfGenerationError(
            "No hay permisos de vacaciones aprobados para esta quincena.",
          );
          return;
        }

        const header = buildVacationPermissionsSummaryHeader(
          startDate,
          endDate,
        );
        const rows = buildVacationPermissionsSummaryRows(permissions);

        await exportVacationPermissionsSummaryExcel({
          header,
          rows,
          branchName,
          startDate,
          endDate,
        });
      } catch {
        handlePdfGenerationError(
          "Ocurrió un error al generar el descargue de vacaciones en Excel, intente nuevamente mas tarde.",
        );
      } finally {
        setIsGeneratingVacationPermissionsSummary(false);
      }
    }, [
      companyId,
      moduleCode,
      payroll_id,
      detailsData,
      branchName,
      handlePdfGenerationError,
    ]);

  const loadVacationAccrualAreaReportData = useCallback(async () => {
    if (!companyId || !moduleCode || !type_payroll || !branch_id || !payroll_id)
      return null;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay colaboradores en la nómina para generar el acumulado de vacaciones aguinaldo.",
      );
      return null;
    }
    const payrollServices = new PayrollServices(httpHandler);
    const [reportResponse, allItems] = await Promise.all([
      payrollServices.generateReportsPayroll({
        companie_id: companyId,
        module_code: moduleCode,
        payroll_type: type_payroll,
        payroll_id,
        report_type: "VacationAccrual",
      }),
      fetchAllItems(),
    ]);
    const accrualData = reportResponse.vacation_accruals_history ?? [];
    const rows = buildVacationAccrualAreaRows(allItems, accrualData);
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
    type_payroll,
    branch_id,
    payroll_id,
    hasPayrollData,
    fetchAllItems,
    handlePdfGenerationError,
  ]);

  const handleGenerateVacationAccrualAreaPdf = useCallback(async () => {
    const startDate = detailsData?.start_date;
    const endDate = detailsData?.end_date;
    try {
      setIsGeneratingVacationAccrualAreaReport(true);
      const rows = await loadVacationAccrualAreaReportData();
      if (!rows) return;
      const blob = await pdf(
        <VacationAccrualAreaPdfDocument
          rows={rows}
          branchName={branchName}
          startDate={startDate}
          endDate={endDate}
        />,
      ).toBlob();
      window.open(URL.createObjectURL(blob), "_blank");
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el acumulado de vacaciones aguinaldo en PDF, intente nuevamente mas tarde.",
      );
    } finally {
      setIsGeneratingVacationAccrualAreaReport(false);
    }
  }, [
    detailsData,
    loadVacationAccrualAreaReportData,
    branchName,
    handlePdfGenerationError,
  ]);

  const handleGenerateVacationAccrualAreaExcel = useCallback(async () => {
    try {
      setIsGeneratingVacationAccrualAreaReport(true);
      const rows = await loadVacationAccrualAreaReportData();
      if (!rows) return;
      await exportVacationAccrualAreaExcel({
        rows,
        branchName,
        startDate: detailsData?.start_date,
        endDate: detailsData?.end_date,
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
    branchName,
    detailsData,
    handlePdfGenerationError,
  ]);

  const handleGenerateIncomeSummaryPdf = useCallback(async () => {
    if (!payroll_id || !branch_id || !companyId || !moduleCode) return;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay datos en la tabla de nómina para generar el resumen de ingresos.",
      );
      return;
    }
    try {
      setIsGeneratingIncomeSummaryPdf(true);
      const allItems = await fetchAllItems();
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
          branchName={branchName}
          startDate={detailsData?.start_date}
          endDate={detailsData?.end_date}
          periodCode={detailsData?.start_date ?? ""}
        />,
      ).toBlob();
      window.open(URL.createObjectURL(blob), "_blank");
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el resumen de ingresos en PDF.",
      );
    } finally {
      setIsGeneratingIncomeSummaryPdf(false);
    }
  }, [
    payroll_id,
    branch_id,
    companyId,
    moduleCode,
    hasPayrollData,
    fetchAllItems,
    detailsData,
    branchName,
    handlePdfGenerationError,
  ]);

  const handleGenerateDeductionSummaryPdf = useCallback(async () => {
    if (!payroll_id || !branch_id || !companyId || !moduleCode) return;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay datos en la tabla de nómina para generar el resumen de deducciones.",
      );
      return;
    }
    try {
      setIsGeneratingDeductionSummaryPdf(true);
      const allItems = await fetchAllItems();
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
          branchName={branchName}
          startDate={detailsData?.start_date}
          endDate={detailsData?.end_date}
          periodCode={detailsData?.start_date ?? ""}
        />,
      ).toBlob();
      window.open(URL.createObjectURL(blob), "_blank");
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el resumen de deducciones en PDF.",
      );
    } finally {
      setIsGeneratingDeductionSummaryPdf(false);
    }
  }, [
    payroll_id,
    branch_id,
    companyId,
    moduleCode,
    hasPayrollData,
    fetchAllItems,
    detailsData,
    branchName,
    handlePdfGenerationError,
  ]);

  const handleGenerateAccumulatedHistoryExcel = useCallback(async () => {
    if (!companyId || !payroll_id || !moduleCode || !type_payroll) return;
    try {
      setIsGeneratingAccumulatedHistoryPdf(true);
      const svc = new PayrollServices(httpHandler);
      const [reportResponse, payrollItems] = await Promise.all([
        svc.generateReportsPayroll({
          companie_id: companyId,
          module_code: moduleCode,
          payroll_type: type_payroll,
          payroll_id,
          report_type: "Accumulated",
        }),
        fetchAllItems(),
      ]);
      const reportData = filterAccumulatedHistoryByPayrollItems(
        reportResponse.accumulated_history ?? [],
        payrollItems,
      );
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
        branchName,
        startDate: `${monthNow}-${yearNow}`,
        endDate: detailsData?.end_date,
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
    payroll_id,
    moduleCode,
    type_payroll,
    branchName,
    detailsData?.end_date,
    fetchAllItems,
    handlePdfGenerationError,
  ]);
  const handleGenerateIncomeSummaryExcel = useCallback(async () => {
    if (!payroll_id || !branch_id || !companyId || !moduleCode) return;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay datos en la tabla de nómina para generar el resumen de ingresos.",
      );
      return;
    }
    try {
      setIsGeneratingIncomeSummaryPdf(true);
      const allItems = await fetchAllItems();
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
        branchName,
        startDate: detailsData?.start_date,
        endDate: detailsData?.end_date,
        periodCode: detailsData?.start_date ?? "",
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
    payroll_id,
    branch_id,
    companyId,
    moduleCode,
    hasPayrollData,
    fetchAllItems,
    detailsData,
    branchName,
    handlePdfGenerationError,
  ]);

  const handleGenerateDeductionSummaryExcel = useCallback(async () => {
    if (!payroll_id || !branch_id || !companyId || !moduleCode) return;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay datos en la tabla de nómina para generar el resumen de deducciones.",
      );
      return;
    }
    try {
      setIsGeneratingDeductionSummaryPdf(true);
      const allItems = await fetchAllItems();
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
        branchName,
        startDate: detailsData?.start_date,
        endDate: detailsData?.end_date,
        periodCode: detailsData?.start_date ?? "",
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
    payroll_id,
    branch_id,
    companyId,
    moduleCode,
    hasPayrollData,
    fetchAllItems,
    detailsData,
    branchName,
    handlePdfGenerationError,
  ]);

  const handleGenerateConsolidatedAreaPdf = useCallback(async () => {
    if (!payroll_id || !branch_id || !companyId || !moduleCode || !type_payroll)
      return;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay datos en la tabla de nómina para generar el reporte.",
      );
      return;
    }
    try {
      setIsGeneratingConsolidatedAreaPdf(true);
      const allItems = await fetchAllItems();
      const payrollServices = new PayrollServices(httpHandler);
      const inssResponse = await payrollServices.generateReportsPayroll({
        companie_id: companyId,
        report_type: "InssFortnightly",
        payroll_id: payroll_id,
        payroll_type: type_payroll,
        module_code: moduleCode,
        identification_number: identificationFilter || undefined,
      });
      const inssInformation = inssResponse.inss_information ?? [];
      const preparedSignatureImageSrc = signatures.solicitado.signatureImage
        ? await getProcessedSignatureImage(signatures.solicitado.signatureImage)
        : "";
      const blob = await pdf(
        <ConsolidatedAreaPdfDocument
          data={allItems}
          inssInformation={inssInformation}
          branchName={branchName}
          companyName={companyName}
          startDate={detailsData?.start_date}
          endDate={detailsData?.end_date}
          preparedBy={{ name: signatures.solicitado.name }}
          preparedSignatureImageSrc={preparedSignatureImageSrc}
        />,
      ).toBlob();
      window.open(URL.createObjectURL(blob), "_blank");
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el reporte consolidado por área en PDF.",
      );
    } finally {
      setIsGeneratingConsolidatedAreaPdf(false);
    }
  }, [
    payroll_id,
    branch_id,
    companyId,
    moduleCode,
    type_payroll,
    hasPayrollData,
    fetchAllItems,
    signatures,
    detailsData,
    branchName,
    companyName,
    identificationFilter,
    handlePdfGenerationError,
  ]);

  const loadEmployeeReceivablesReportData = useCallback(async () => {
    if (!payroll_id || !branch_id || !companyId || !moduleCode) return null;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay datos en la tabla de nómina para generar el reporte.",
      );
      return null;
    }
    const allItems = await fetchAllItems();
    const deductionsService = new DeductionsServicesByPayroll(httpHandler);
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
    payroll_id,
    branch_id,
    companyId,
    moduleCode,
    hasPayrollData,
    fetchAllItems,
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
      window.open(URL.createObjectURL(blob), "_blank");
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
        branchName,
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
    branchName,
    handlePdfGenerationError,
  ]);

  const handleGenerateConsolidatedAreaExcel = useCallback(async () => {
    const payrollType = type_payroll;
    if (!companyId || !moduleCode || !branch_id || !payroll_id || !payrollType)
      return;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay datos en la tabla de nómina para generar el reporte.",
      );
      return;
    }
    try {
      setIsGeneratingConsolidatedAreaExcel(true);
      const allItems = await fetchAllItems();
      const payrollServices = new PayrollServices(httpHandler);
      const inssResponse = await payrollServices.generateReportsPayroll({
        companie_id: companyId,
        report_type: "InssFortnightly",
        payroll_id: payroll_id,
        payroll_type: payrollType,
        module_code: moduleCode,
        identification_number: identificationFilter || undefined,
      });
      const inssInformation = inssResponse.inss_information ?? [];
      await exportConsolidatedAreaExcel({
        data: allItems,
        inssInformation,
        companyName,
        branchName,
        startDate: detailsData?.start_date,
        endDate: detailsData?.end_date,
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
    companyId,
    moduleCode,
    branch_id,
    payroll_id,
    type_payroll,
    hasPayrollData,
    fetchAllItems,
    companyName,
    branchName,
    detailsData,
    identificationFilter,
    handlePdfGenerationError,
  ]);

  const handleGenerateExcel = useCallback(async () => {
    if (!companyId || !moduleCode || !branch_id || !payroll_id) return;
    try {
      setIsGeneratingExcel(true);
      const allItems = await fetchAllItems();
      await exportPayrollExcel({
        data: allItems,
        visibleKeys,
        companyName,
        branchName,
        startDate: detailsData?.start_date,
        endDate: detailsData?.end_date,
        typePayroll: type_payroll as PayrollType,
        logoUrl: useCompanyStore.getState().urlImage,
      });
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el reporte de nómina en Excel, intente nuevamente mas tarde.",
      );
    } finally {
      setIsGeneratingExcel(false);
    }
  }, [
    companyId,
    moduleCode,
    branch_id,
    payroll_id,
    fetchAllItems,
    visibleKeys,
    companyName,
    branchName,
    detailsData,
    type_payroll,
    handlePdfGenerationError,
  ]);

  const loadInssReportData = useCallback(
    async (isFortnightly: boolean) => {
      if (!companyId || !payroll_id || !moduleCode || !type_payroll)
        return null;
      if (!hasPayrollData) {
        handlePdfGenerationError(
          "No hay datos en la tabla de nómina para generar el reporte.",
        );
        return null;
      }
      const payrollServices = new PayrollServices(httpHandler);
      const reportType: ReportPayrollType = isFortnightly
        ? "InssFortnightly"
        : "InssMonthly";

      const payload = {
        companie_id: companyId,
        report_type: reportType,
        payroll_id: payroll_id,
        payroll_type: type_payroll,
        module_code: moduleCode,
        identification_number: identificationFilter || undefined,
      };

      const response = await payrollServices.generateReportsPayroll(payload);
      return response.inss_information ?? [];
    },
    [
      type_payroll,
      payroll_id,
      companyId,
      moduleCode,
      hasPayrollData,
      identificationFilter,
      handlePdfGenerationError,
    ],
  );

  const handleGenerateInssReportPdf = useCallback(
    async (isFortnightly: boolean) => {
      try {
        setIsGeneratingInssReport(true);
        const inssData = await loadInssReportData(isFortnightly);
        if (!inssData) return;

        const { start, end } = resolveInssReportPeriodDates(
          detailsData?.start_date,
          detailsData?.end_date,
          isFortnightly,
        );

        const blob = await pdf(
          <InssReportPdfDocument
            data={inssData}
            startDate={start}
            endDate={end}
            branchName={branchName}
            isFortnightly={isFortnightly}
          />,
        ).toBlob();

        window.open(URL.createObjectURL(blob), "_blank");
      } catch {
        handlePdfGenerationError(
          "Ocurrió un error al generar el reporte INSS en PDF.",
        );
      } finally {
        setIsGeneratingInssReport(false);
      }
    },
    [loadInssReportData, detailsData, branchName, handlePdfGenerationError],
  );

  const handleGenerateInssReportExcel = useCallback(
    async (isFortnightly: boolean) => {
      try {
        setIsGeneratingInssReport(true);
        const inssData = await loadInssReportData(isFortnightly);
        if (!inssData) return;

        const { start, end } = resolveInssReportPeriodDates(
          detailsData?.start_date,
          detailsData?.end_date,
          isFortnightly,
        );

        await exportInssReportExcel({
          data: inssData,
          branchName,
          startDate: start,
          endDate: end,
          logoUrl: useCompanyStore.getState().urlImage,
          isFortnightly,
        });
      } catch {
        handlePdfGenerationError(
          "Ocurrió un error al generar el reporte INSS en Excel.",
        );
      } finally {
        setIsGeneratingInssReport(false);
      }
    },
    [loadInssReportData, branchName, detailsData, handlePdfGenerationError],
  );

  const loadIrReportData = useCallback(async () => {
    if (!companyId || !moduleCode || !type_payroll || !branch_id || !payroll_id)
      return null;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay datos en la tabla de nómina para generar el reporte.",
      );
      return null;
    }
    const payrollServices = new PayrollServices(httpHandler);

    const payload = {
      companie_id: companyId,
      report_type: "IrAndSalaryEarned" as const,
      payroll_id: payroll_id,
      payroll_type: type_payroll,
      module_code: moduleCode,
      identification_number: identificationFilter || undefined,
    };

    const response = await payrollServices.generateReportsPayroll(payload);
    return response.ir_and_salary_earned ?? [];
  }, [
    type_payroll,
    payroll_id,
    companyId,
    moduleCode,
    hasPayrollData,
    identificationFilter,
    handlePdfGenerationError,
  ]);

  const handleGenerateIrReportPdf = useCallback(
    async (isFortnightly: boolean) => {
      try {
        setIsGeneratingIrReport(true);
        const irData = await loadIrReportData();
        if (!irData) return;

        const blob = await pdf(
          <IrReportPdfDocument
            data={irData}
            startDate={detailsData?.start_date}
            endDate={detailsData?.end_date}
            branchName={branchName}
            isFortnightly={isFortnightly}
          />,
        ).toBlob();

        window.open(URL.createObjectURL(blob), "_blank");
      } catch {
        handlePdfGenerationError(
          "Ocurrió un error al generar el reporte IR en PDF.",
        );
      } finally {
        setIsGeneratingIrReport(false);
      }
    },
    [loadIrReportData, detailsData, branchName, handlePdfGenerationError],
  );

  const handleGenerateIrReportExcel = useCallback(
    async (isFortnightly: boolean) => {
      try {
        setIsGeneratingIrReport(true);
        const irData = await loadIrReportData();
        if (!irData) return;

        await exportIrReportExcel({
          data: irData,
          branchName: branchName ?? "",
          startDate: detailsData?.start_date,
          endDate: detailsData?.end_date,
          logoUrl: useCompanyStore.getState().urlImage,
          isFortnightly,
        });
      } catch {
        handlePdfGenerationError(
          "Ocurrió un error al generar el reporte IR en Excel.",
        );
      } finally {
        setIsGeneratingIrReport(false);
      }
    },
    [loadIrReportData, detailsData, branchName, handlePdfGenerationError],
  );

  const loadDepreciationReportData = useCallback(async () => {
    if (!companyId || !payroll_id || !moduleCode || !type_payroll) return null;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay datos en la tabla de nómina para generar el reporte.",
      );
      return null;
    }
    const payrollServices = new PayrollServices(httpHandler);

    const payload = {
      companie_id: companyId,
      report_type: "Depreciations" as const,
      payroll_id: payroll_id,
      payroll_type: type_payroll,
      module_code: moduleCode,
      identification_number: identificationFilter || undefined,
    };

    const response = await payrollServices.generateReportsPayroll(payload);
    const depreciations = response.depreciations ?? [];

    if (depreciations.length === 0) {
      handlePdfGenerationError(
        "No hay datos de depreciación para generar el reporte.",
      );
      return null;
    }

    return depreciations;
  }, [
    type_payroll,
    payroll_id,
    companyId,
    moduleCode,
    hasPayrollData,
    identificationFilter,
    handlePdfGenerationError,
  ]);

  const handleGenerateDepreciationReportPdf = useCallback(async () => {
    try {
      setIsGeneratingDepreciationReport(true);
      const depreciationData = await loadDepreciationReportData();
      if (!depreciationData) return;

      const blob = await pdf(
        <DepreciationReportPdfDocument
          data={depreciationData}
          startDate={detailsData?.start_date}
          endDate={detailsData?.end_date}
          branchName={branchName}
        />,
      ).toBlob();

      window.open(URL.createObjectURL(blob), "_blank");
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el reporte de Depreciaciones en PDF.",
      );
    } finally {
      setIsGeneratingDepreciationReport(false);
    }
  }, [
    loadDepreciationReportData,
    detailsData,
    branchName,
    handlePdfGenerationError,
  ]);

  const handleGenerateDepreciationReportExcel = useCallback(async () => {
    try {
      setIsGeneratingDepreciationReport(true);
      const depreciationData = await loadDepreciationReportData();
      if (!depreciationData) return;

      await exportDepreciationReportExcel({
        data: depreciationData,
        branchName,
        startDate: detailsData?.start_date,
        endDate: detailsData?.end_date,
        logoUrl: useCompanyStore.getState().urlImage,
      });
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el reporte de Depreciaciones en Excel.",
      );
    } finally {
      setIsGeneratingDepreciationReport(false);
    }
  }, [
    loadDepreciationReportData,
    branchName,
    detailsData,
    handlePdfGenerationError,
  ]);

  const loadBacReportData = useCallback(async () => {
    if (!payroll_id || !branch_id || !companyId || !moduleCode) return null;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay datos en la tabla de nómina para generar el reporte.",
      );
      return null;
    }

    const allItems = await fetchAllItems();
    const reportData = mapPayrollItemsToBacRows(allItems);

    if (reportData.length === 0) {
      handlePdfGenerationError(
        "No hay colaboradores con cuenta bancaria registrada para generar el reporte BAC.",
      );
      return null;
    }

    return reportData;
  }, [
    payroll_id,
    branch_id,
    companyId,
    moduleCode,
    hasPayrollData,
    fetchAllItems,
    handlePdfGenerationError,
  ]);

  const handleGenerateBacReportPdf = useCallback(async () => {
    try {
      setIsGeneratingBacReport(true);
      const bacData = await loadBacReportData();
      if (!bacData) return;

      const blob = await pdf(
        <BacReportPdfDocument
          data={bacData}
          startDate={detailsData?.start_date}
          endDate={detailsData?.end_date}
          branchName={branchName}
        />,
      ).toBlob();

      window.open(URL.createObjectURL(blob), "_blank");
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el reporte BAC en PDF.",
      );
    } finally {
      setIsGeneratingBacReport(false);
    }
  }, [loadBacReportData, detailsData, branchName, handlePdfGenerationError]);

  const handleGenerateBacReportExcel = useCallback(async () => {
    try {
      setIsGeneratingBacReport(true);
      const bacData = await loadBacReportData();
      if (!bacData) return;

      await exportBacReportExcel({
        data: bacData,
        branchName,
      });
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el reporte BAC en Excel.",
      );
    } finally {
      setIsGeneratingBacReport(false);
    }
  }, [loadBacReportData, branchName, handlePdfGenerationError]);

  const loadMonthlyRetentionReportData = useCallback(async () => {
    if (!companyId || !payroll_id || !moduleCode || !type_payroll) return null;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay datos en la tabla de nómina para generar el reporte.",
      );
      return null;
    }

    const payrollServices = new PayrollServices(httpHandler);

    const reportPayload = {
      companie_id: companyId,
      payroll_id: payroll_id,
      payroll_type: type_payroll,
      module_code: moduleCode,
      identification_number: identificationFilter || undefined,
    };

    const [inssResponse, irResponse, allItems] = await Promise.all([
      payrollServices.generateReportsPayroll({
        ...reportPayload,
        report_type: "InssMonthly",
      }),
      payrollServices.generateReportsPayroll({
        ...reportPayload,
        report_type: "IrAndSalaryEarned",
      }),
      fetchAllItems(),
    ]);

    const reportData = buildMonthlyRetentionReportRows(
      inssResponse.inss_information ?? [],
      irResponse.ir_and_salary_earned ?? [],
      allItems,
    );

    if (reportData.length === 0) {
      handlePdfGenerationError(
        "No hay datos para generar el informe de retenciones mensual.",
      );
      return null;
    }

    return reportData;
  }, [
    companyId,
    payroll_id,
    moduleCode,
    type_payroll,
    hasPayrollData,
    identificationFilter,
    fetchAllItems,
    handlePdfGenerationError,
  ]);

  const handleGenerateMonthlyRetentionReportExcel = useCallback(async () => {
    try {
      setIsGeneratingMonthlyRetentionReport(true);
      const reportData = await loadMonthlyRetentionReportData();
      if (!reportData) return;

      await exportMonthlyRetentionReportExcel({
        data: reportData,
        branchName,
      });
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el informe de retenciones mensual.",
      );
    } finally {
      setIsGeneratingMonthlyRetentionReport(false);
    }
  }, [loadMonthlyRetentionReportData, branchName, handlePdfGenerationError]);

  const loadSubsidiesReportData = useCallback(async () => {
    if (!companyId || !payroll_id || !moduleCode || !type_payroll) return null;
    if (!hasPayrollData) {
      handlePdfGenerationError(
        "No hay datos en la tabla de nómina para generar el reporte.",
      );
      return null;
    }
    const payrollServices = new PayrollServices(httpHandler);

    const payload = {
      companie_id: companyId,
      report_type: "Subsidies" as const,
      payroll_id: payroll_id,
      payroll_type: type_payroll,
      module_code: moduleCode,
      identification_number: identificationFilter || undefined,
    };

    const response = await payrollServices.generateReportsPayroll(payload);
    const subsidies = response.subsidies_history ?? [];

    if (subsidies.length === 0) {
      handlePdfGenerationError(
        "No hay subsidios registrados para generar el reporte en este período.",
      );
      return null;
    }

    return subsidies;
  }, [
    type_payroll,
    payroll_id,
    companyId,
    moduleCode,
    hasPayrollData,
    identificationFilter,
    handlePdfGenerationError,
  ]);

  const handleGenerateSubsidiesReportPdf = useCallback(async () => {
    try {
      setIsGeneratingSubsidiesReport(true);
      const subsidiesData = await loadSubsidiesReportData();
      if (!subsidiesData) return;

      const blob = await pdf(
        <SubsidiesReportPdfDocument
          data={subsidiesData}
          startDate={detailsData?.start_date}
          endDate={detailsData?.end_date}
          branchName={branchName}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el reporte de Subsidios en PDF.",
      );
    } finally {
      setIsGeneratingSubsidiesReport(false);
    }
  }, [
    loadSubsidiesReportData,
    detailsData,
    branchName,
    handlePdfGenerationError,
  ]);

  const handleGenerateSubsidiesReportExcel = useCallback(async () => {
    try {
      setIsGeneratingSubsidiesReport(true);
      const subsidiesData = await loadSubsidiesReportData();
      if (!subsidiesData) return;

      await exportSubsidiesReportExcel({
        data: subsidiesData,
        branchName: branchName,
        startDate: detailsData?.start_date,
        endDate: detailsData?.end_date,
        logoUrl: useCompanyStore.getState().urlImage,
      });
    } catch {
      handlePdfGenerationError(
        "Ocurrió un error al generar el reporte de Subsidios en Excel.",
      );
    } finally {
      setIsGeneratingSubsidiesReport(false);
    }
  }, [
    loadSubsidiesReportData,
    detailsData,
    branchName,
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
        case "vacation_permissions_summary_report":
          await handleGenerateVacationPermissionsSummaryPdf();
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
        case "quincenal_inss_report":
          await handleGenerateInssReportPdf(true);
          break;
        case "monthly_inss_report":
          await handleGenerateInssReportPdf(false);
          break;
        case "quincenal_ir_report":
          await handleGenerateIrReportPdf(true);
          break;
        case "monthly_ir_report":
          await handleGenerateIrReportPdf(false);
          break;
        case "depreciation_report":
          await handleGenerateDepreciationReportPdf();
          break;
        case "bac_report":
          await handleGenerateBacReportPdf();
          break;
        case "subsidies_report":
          await handleGenerateSubsidiesReportPdf();
          break;
        default:
          break;
      }
    },
    [
      handleGeneratePdf,
      handleGeneratePaymentReceiptsPdf,
      handleGenerateAccumulatedHistoryPdf,
      handleGenerateVacationControlPdf,
      handleGenerateVacationControlAreaPdf,
      handleGenerateVacationAccrualAreaPdf,
      handleGenerateVacationPermissionsSummaryPdf,
      handleGenerateIncomeSummaryPdf,
      handleGenerateDeductionSummaryPdf,
      handleGenerateConsolidatedAreaPdf,
      handleGenerateEmployeeReceivablesPdf,
      handleGenerateInssReportPdf,
      handleGenerateIrReportPdf,
      handleGenerateDepreciationReportPdf,
      handleGenerateBacReportPdf,
    ],
  );

  const isGenerateConfirmLoading =
    isGeneratingPdf ||
    isGeneratingExcel ||
    isGeneratingPaymentReceiptsPdf ||
    isGeneratingAccumulatedHistoryPdf ||
    isGeneratingVacationControlPdf ||
    isGeneratingVacationControlAreaPdf ||
    isGeneratingVacationAccrualAreaReport ||
    isGeneratingIncomeSummaryPdf ||
    isGeneratingDeductionSummaryPdf ||
    isGeneratingConsolidatedAreaPdf ||
    isGeneratingEmployeeReceivablesPdf ||
    isGeneratingVacationPermissionsSummary ||
    isGeneratingConsolidatedAreaExcel ||
    isGeneratingInssReport ||
    isGeneratingIrReport ||
    isGeneratingDepreciationReport ||
    isGeneratingSubsidiesReport ||
    isGeneratingBacReport ||
    isGeneratingMonthlyRetentionReport;

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
        case "vacation_permissions_summary_report":
          await handleGenerateVacationPermissionsSummaryExcel();
          break;
        case "quincenal_inss_report":
          await handleGenerateInssReportExcel(true);
          break;
        case "monthly_inss_report":
          await handleGenerateInssReportExcel(false);
          break;
        case "quincenal_ir_report":
          await handleGenerateIrReportExcel(true);
          break;
        case "monthly_ir_report":
          await handleGenerateIrReportExcel(false);
          break;
        case "monthly_retention_report":
          await handleGenerateMonthlyRetentionReportExcel();
          break;
        case "depreciation_report":
          await handleGenerateDepreciationReportExcel();
          break;
        case "bac_report":
          await handleGenerateBacReportExcel();
          break;
        case "subsidies_report":
          await handleGenerateSubsidiesReportExcel();
          break;
        default:
          break;
      }
    },
    [
      handleGenerateExcel,
      handleGenerateConsolidatedAreaExcel,
      handleGenerateVacationAccrualAreaExcel,
      handleGenerateAccumulatedHistoryExcel,
      handleGenerateIncomeSummaryExcel,
      handleGenerateDeductionSummaryExcel,
      handleGenerateEmployeeReceivablesExcel,
      handleGenerateVacationPermissionsSummaryExcel,
      handleGenerateInssReportExcel,
      handleGenerateIrReportExcel,
      handleGenerateDepreciationReportExcel,
      handleGenerateBacReportExcel,
      handleGenerateMonthlyRetentionReportExcel,
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

  if (!branch_id || !type_payroll) {
    return (
      <div className="p-12 text-center text-red-500">
        Información incompleta para mostrar la nómina. Regresa al historial.
      </div>
    );
  }

  return (
    <LazyMotion features={loadFeatures} strict>
      <ModalDetailsPayroll
        isOpen={isPayrollDetailModalOpen}
        onClose={handleClosePayrollDetailModal}
        payrollItem={selectedPayrollRow}
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
        confirmDisabled={!hasPayrollData}
      />

      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        {detailsFetchInFlight && (
          <Loader title="Cargando detalles de la nómina..." />
        )}

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
              {
                label: "Detalles",
                url: `/${alias_company}/dashboard/payroll/historial-periodos-nomina/${payroll_id}`,
                onClick: () => {},
              },
            ]}
          />
        </div>

        <div className="flex flex-col">
          <h3 className="p-0! m-0!">Detalle de Nómina Cerrada</h3>
          <small className="text-gray-500 dark:text-gray-300">
            Visualizando la nómina del{" "}
            {formatDateToSpanishWords(detailsData?.start_date)} al{" "}
            {formatDateToSpanishWords(detailsData?.end_date)}
          </small>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
          <div className="flex flex-col justify-center">
            <h3 className="p-0! m-0!">Acciones Directas</h3>
            <small className="text-gray-500 dark:text-gray-300">
              Aquí puedes generar reportes desde el botón Generar (PDF y, para
              reportes compatibles, Excel).
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
                disabled={!hasPayrollData || isGenerateConfirmLoading}
                onClick={handleOpenGenerateModal}
                className={`w-full! min-h-[48px]! px-4! text-center! text-[15px]! leading-snug! font-normal! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! ${
                  isGenerateConfirmLoading
                    ? "disabled:opacity-100! disabled:bg-alpac-primary-500! disabled:dark:bg-alpac-primary-700!"
                    : ""
                }`}
              />
            </div>
          </div>
        </div>
        <PayrollFiltersBar
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />

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
      </m.div>

      <AnimatedAlertWrapper open={!!alertState?.open}>
        <Alert
          type={alertState?.type ?? "error"}
          title={alertState?.title ?? ""}
          message={alertState?.message ?? ""}
          onClose={handleCloseAlert}
        />
      </AnimatedAlertWrapper>
    </LazyMotion>
  );
}
