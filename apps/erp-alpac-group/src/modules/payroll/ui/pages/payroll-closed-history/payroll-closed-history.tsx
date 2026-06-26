import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Breadcrumb, Button, Dropdown, useTheme } from "@alpac/design-system";
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
import { exportPayrollExcel } from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/utils/export-payroll-excel";
import { ConsolidatedAreaPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/consolidated-area-report/pdf/consolidated-area-pdf-document";
import { exportConsolidatedAreaExcel } from "@app/modules/payroll/ui/pages/nomina/components/consolidated-area-report/excel/export-consolidated-area-excel";
import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import type { CollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/collaborator.request";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { pdf } from "@react-pdf/renderer";
import { PayrollPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/payroll-pdf/payroll-pdf-document";
import { CheckPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/check-pdf/check-pdf-document";
import { PaymentReceiptDocument } from "@app/modules/payroll/ui/pages/nomina/components/payment-receipts/payment-receipt";
import { AccumulatedPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/accumulated-pdf/accumulated-pdf-document";
import { IncomeSummaryPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/income-review-pdf/income-summary-pdf-document";
import { DeductionSummaryPdfDocument } from "@app/modules/payroll/ui/pages/nomina/components/deduction-review-pdf/deduction-review.pdf";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
import { PayrollServices } from "@app/modules/payroll/infrastructure/services/payroll-services/PayrollServices";
import { getSignatures } from "@app/modules/payroll/ui/pages/nomina/components/check-pdf/utils/getSignatures";
import { getProcessedSignatureImage } from "@app/modules/payroll/ui/pages/nomina/components/check-pdf/utils/processSignatureImage";
import type { PayrollActionValue } from "@app/modules/payroll/ui/pages/nomina/types/payroll-actions.types";
import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";

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
  const [isGeneratingExcel, setIsGeneratingExcel] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingPaymentReceiptsPdf, setIsGeneratingPaymentReceiptsPdf] =
    useState(false);
  const [isGeneratingPaymentRequestsPdf, setIsGeneratingPaymentRequestsPdf] =
    useState(false);
  const [
    isGeneratingAccumulatedHistoryPdf,
    setIsGeneratingAccumulatedHistoryPdf,
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
  const [selectedAction, setSelectedAction] =
    useState<PayrollActionValue | null>(null);

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
  const hasItems = items.length > 0;

  const hasCollaboratorsWithoutBankAccount = useMemo(
    () => items.some((item) => !item.collaborator?.bank_account?.trim()),
    [items],
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
      { label: "Generar Historial Acumulado", value: "accumulated_history" },
      { label: "Generar Reporte de Ingresos", value: "income_report" },
      { label: "Generar Reporte de Deducciones", value: "deduction_report" },
      {
        label: "Generar Reporte Nómina Consolidada por Área",
        value: "consolidated_area_report",
      },
    ];
    const startDate = detailsData?.start_date;
    const endDate = detailsData?.end_date;
    const startDay = startDate ? new Date(startDate).getUTCDate() : null;
    const endDay = endDate ? new Date(endDate).getUTCDate() : null;
    if (endDay === 15) {
      options.push(
        {
          label: "Generar Reporte Quincenal Acumulado",
          value: "quincenal_accumulated_report",
        },
        { label: "Generar Reporte Quincenal IR", value: "quincenal_ir_report" },
        {
          label: "Generar Reporte Quincenal INSS",
          value: "quincenal_inss_report",
        },
      );
    }
    if (startDay === 16) {
      options.push(
        {
          label: "Generar Reporte Mensual Acumulado",
          value: "monthly_accumulated_report",
        },
        { label: "Generar Reporte Mensual IR", value: "monthly_ir_report" },
        {
          label: "Generar Reporte mensual INSS",
          value: "monthly_inss_report",
        },
      );
    }
    if (hasCollaboratorsWithoutBankAccount && !detailsFetchInFlight) {
      options.push({
        label: "Generar Solicitudes de Pago",
        value: "payment_requests",
      });
    }
    return options;
  }, [
    detailsData?.start_date,
    detailsData?.end_date,
    hasCollaboratorsWithoutBankAccount,
    detailsFetchInFlight,
  ]);

  useEffect(() => {
    if (
      selectedAction &&
      !payrollActionOptions.some((o) => o.value === selectedAction)
    ) {
      setSelectedAction(null);
    }
  }, [selectedAction, payrollActionOptions]);

  const signatures = useMemo(() => getSignatures(companyName), [companyName]);

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
    if (!payroll_id || !branch_id || !companyId || !moduleCode || !hasItems)
      return;
    try {
      setIsGeneratingPdf(true);
      const allItems = await fetchAllItems();
      const preparedSignatureImageSrc = signatures.solicitado.signatureImage
        ? await getProcessedSignatureImage(signatures.solicitado.signatureImage)
        : "";
      const reviewedSignatureImageSrc = signatures.signatureImage
        ? await getProcessedSignatureImage(signatures.signatureImage)
        : "";
      const blob = await pdf(
        <PayrollPdfDocument
          typePayroll={type_payroll ?? "Ordinary"}
          data={allItems}
          branchName={detailsData?.branch_name ?? ""}
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
      console.error("Error generando el reporte PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [
    payroll_id,
    branch_id,
    companyId,
    moduleCode,
    hasItems,
    fetchAllItems,
    signatures,
    type_payroll,
    detailsData,
    companyName,
    visibleKeys,
  ]);

  const handleGeneratePaymentReceiptsPdf = useCallback(async () => {
    if (!payroll_id || !branch_id || !companyId || !moduleCode || !hasItems)
      return;
    try {
      setIsGeneratingPaymentReceiptsPdf(true);
      const allItems = await fetchAllItems();
      const blob = await pdf(
        <PaymentReceiptDocument
          data={allItems}
          startDate={detailsData?.start_date}
          endDate={detailsData?.end_date}
          branchName={detailsData?.branch_name ?? ""}
        />,
      ).toBlob();
      window.open(URL.createObjectURL(blob), "_blank");
    } catch {
      console.error("Error generando recibos de pago");
    } finally {
      setIsGeneratingPaymentReceiptsPdf(false);
    }
  }, [
    payroll_id,
    branch_id,
    companyId,
    moduleCode,
    hasItems,
    fetchAllItems,
    detailsData,
  ]);

  const handleGeneratePaymentRequestsPdf = useCallback(async () => {
    if (!payroll_id || !branch_id || !companyId || !moduleCode) return;
    try {
      setIsGeneratingPaymentRequestsPdf(true);
      const allItems = await fetchAllItems();
      const filteredItems = allItems.filter(
        (item) => !item.collaborator?.bank_account?.trim(),
      );
      if (!filteredItems.length) return;
      const { signatureImage } = getSignatures(companyName);
      const signatureImageSrc =
        await getProcessedSignatureImage(signatureImage);
      const blob = await pdf(
        <CheckPdfDocument
          data={filteredItems}
          startDate={detailsData?.start_date}
          endDate={detailsData?.end_date}
          signatureImageSrc={signatureImageSrc}
        />,
      ).toBlob();
      window.open(URL.createObjectURL(blob), "_blank");
    } catch {
      console.error("Error generando solicitudes de pago");
    } finally {
      setIsGeneratingPaymentRequestsPdf(false);
    }
  }, [
    payroll_id,
    branch_id,
    companyId,
    moduleCode,
    fetchAllItems,
    companyName,
    detailsData,
  ]);

  const handleGenerateAccumulatedHistoryPdf = useCallback(async () => {
    if (!companyId || !payroll_id || !moduleCode || !type_payroll) return;
    try {
      setIsGeneratingAccumulatedHistoryPdf(true);
      const svc = new PayrollServices(httpHandler);
      const reportResponse = await svc.generateReportsPayroll({
        companie_id: companyId,
        module_code: moduleCode,
        payroll_type: type_payroll,
        payroll_id,
        report_type: "Accumulated",
      });
      const reportData = reportResponse.accumulated_history ?? [];
      if (!reportData.length) return;
      const reviewedSignatureImageSrc = signatures.solicitado.signatureImage
        ? await getProcessedSignatureImage(signatures.solicitado.signatureImage)
        : "";
      const blob = await pdf(
        <AccumulatedPdfDocument
          data={reportData}
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
      console.error("Error generando historial acumulado");
    } finally {
      setIsGeneratingAccumulatedHistoryPdf(false);
    }
  }, [companyId, payroll_id, moduleCode, type_payroll, signatures]);

  const handleGenerateIncomeSummaryPdf = useCallback(async () => {
    if (!payroll_id || !branch_id || !companyId || !moduleCode || !hasItems)
      return;
    try {
      setIsGeneratingIncomeSummaryPdf(true);
      const allItems = await fetchAllItems();
      const blob = await pdf(
        <IncomeSummaryPdfDocument
          data={allItems}
          startDate={detailsData?.start_date}
          endDate={detailsData?.end_date}
          branchName={detailsData?.branch_name ?? ""}
        />,
      ).toBlob();
      window.open(URL.createObjectURL(blob), "_blank");
    } catch {
      console.error("Error generando resumen de ingresos");
    } finally {
      setIsGeneratingIncomeSummaryPdf(false);
    }
  }, [
    payroll_id,
    branch_id,
    companyId,
    moduleCode,
    hasItems,
    fetchAllItems,
    detailsData,
  ]);

  const handleGenerateDeductionSummaryPdf = useCallback(async () => {
    if (!payroll_id || !branch_id || !companyId || !moduleCode || !hasItems)
      return;
    try {
      setIsGeneratingDeductionSummaryPdf(true);
      const allItems = await fetchAllItems();
      const blob = await pdf(
        <DeductionSummaryPdfDocument
          data={allItems}
          startDate={detailsData?.start_date}
          endDate={detailsData?.end_date}
          branchName={detailsData?.branch_name ?? ""}
        />,
      ).toBlob();
      window.open(URL.createObjectURL(blob), "_blank");
    } catch {
      console.error("Error generando resumen de deducciones");
    } finally {
      setIsGeneratingDeductionSummaryPdf(false);
    }
  }, [
    payroll_id,
    branch_id,
    companyId,
    moduleCode,
    hasItems,
    fetchAllItems,
    detailsData,
  ]);

  const handleGenerateConsolidatedAreaPdf = useCallback(async () => {
    if (!payroll_id || !branch_id || !companyId || !moduleCode || !hasItems)
      return;
    try {
      setIsGeneratingConsolidatedAreaPdf(true);
      const allItems = await fetchAllItems();
      const preparedSignatureImageSrc = signatures.solicitado.signatureImage
        ? await getProcessedSignatureImage(signatures.solicitado.signatureImage)
        : "";
      const reviewedSignatureImageSrc = signatures.signatureImage
        ? await getProcessedSignatureImage(signatures.signatureImage)
        : "";
      const blob = await pdf(
        <ConsolidatedAreaPdfDocument
          data={allItems}
          branchName={detailsData?.branch_name ?? ""}
          companyName={companyName}
          startDate={detailsData?.start_date}
          endDate={detailsData?.end_date}
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
      console.error("Error generando reporte consolidado por área");
    } finally {
      setIsGeneratingConsolidatedAreaPdf(false);
    }
  }, [
    payroll_id,
    branch_id,
    companyId,
    moduleCode,
    hasItems,
    fetchAllItems,
    signatures,
    detailsData,
    companyName,
  ]);

  const handleGenerateConsolidatedAreaExcel = useCallback(async () => {
    if (!companyId || !moduleCode || !branch_id || !payroll_id || !hasItems)
      return;
    try {
      setIsGeneratingConsolidatedAreaExcel(true);
      const allItems = await fetchAllItems();
      await exportConsolidatedAreaExcel({
        data: allItems,
        companyName,
        branchName: detailsData?.branch_name ?? "",
        startDate: detailsData?.start_date,
        endDate: detailsData?.end_date,
        logoUrl: useCompanyStore.getState().urlImage,
      });
    } catch {
      console.error("Error generando Excel consolidado por área");
    } finally {
      setIsGeneratingConsolidatedAreaExcel(false);
    }
  }, [
    companyId,
    moduleCode,
    branch_id,
    payroll_id,
    hasItems,
    fetchAllItems,
    companyName,
    detailsData,
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
        branchName: detailsData?.branch_name ?? "",
        startDate: detailsData?.start_date,
        endDate: detailsData?.end_date,
        typePayroll: type_payroll as any,
        logoUrl: useCompanyStore.getState().urlImage,
      });
    } catch {
      console.error("Error generando Excel");
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
    detailsData,
    type_payroll,
  ]);

  const isAnyReportGenerating =
    isGeneratingPdf ||
    isGeneratingPaymentReceiptsPdf ||
    isGeneratingPaymentRequestsPdf ||
    isGeneratingAccumulatedHistoryPdf ||
    isGeneratingIncomeSummaryPdf ||
    isGeneratingDeductionSummaryPdf ||
    isGeneratingConsolidatedAreaPdf;

  const handleExecuteSelectedAction = useCallback(() => {
    switch (selectedAction) {
      case "report":
        void handleGeneratePdf();
        break;
      case "payment_receipts":
        void handleGeneratePaymentReceiptsPdf();
        break;
      case "payment_requests":
        void handleGeneratePaymentRequestsPdf();
        break;
      case "accumulated_history":
        void handleGenerateAccumulatedHistoryPdf();
        break;
      case "income_report":
        void handleGenerateIncomeSummaryPdf();
        break;
      case "deduction_report":
        void handleGenerateDeductionSummaryPdf();
        break;
      case "consolidated_area_report":
        void handleGenerateConsolidatedAreaPdf();
        break;
      default:
        break;
    }
  }, [
    selectedAction,
    handleGeneratePdf,
    handleGeneratePaymentReceiptsPdf,
    handleGeneratePaymentRequestsPdf,
    handleGenerateAccumulatedHistoryPdf,
    handleGenerateIncomeSummaryPdf,
    handleGenerateDeductionSummaryPdf,
    handleGenerateConsolidatedAreaPdf,
  ]);

  const handleExportExcel = useCallback(() => {
    if (selectedAction === "consolidated_area_report") {
      void handleGenerateConsolidatedAreaExcel();
      return;
    }
    void handleGenerateExcel();
  }, [
    selectedAction,
    handleGenerateConsolidatedAreaExcel,
    handleGenerateExcel,
  ]);

  const isExcelExportLoading =
    selectedAction === "consolidated_area_report"
      ? isGeneratingConsolidatedAreaExcel
      : isGeneratingExcel;

  const excelExportLabel =
    selectedAction === "consolidated_area_report"
      ? "Exportar Excel consolidado por área"
      : "Exportar Excel de nómina";

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
              Aquí puedes generar reportes y exportar el excel de la nómina.
            </small>
          </div>
        </div>
        <div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
          <div className="w-full flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-start">
            <div className="w-full lg:w-[20rem]">
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

            <Button
              type="button"
              size="giant"
              label="Generar"
              isLoading={isAnyReportGenerating}
              disabled={!selectedAction || !hasItems || isAnyReportGenerating}
              onClick={handleExecuteSelectedAction}
              className={`w-full! lg:w-auto! min-h-[48px]! px-4! text-center! text-[15px]! leading-snug! font-normal! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! ${
                isAnyReportGenerating
                  ? "disabled:opacity-100! disabled:bg-alpac-primary-500! disabled:dark:bg-alpac-primary-700!"
                  : ""
              }`}
            />

            <Button
              type="button"
              size="giant"
              label={excelExportLabel}
              isLoading={isExcelExportLoading}
              disabled={!hasItems || isExcelExportLoading}
              onClick={handleExportExcel}
              className={`w-full! lg:w-auto! min-h-[48px]! px-4! text-center! text-[15px]! leading-snug! font-normal! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! ${
                isExcelExportLoading
                  ? "disabled:opacity-100! disabled:bg-alpac-primary-500! disabled:dark:bg-alpac-primary-700!"
                  : ""
              }`}
            />
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
    </LazyMotion>
  );
}
