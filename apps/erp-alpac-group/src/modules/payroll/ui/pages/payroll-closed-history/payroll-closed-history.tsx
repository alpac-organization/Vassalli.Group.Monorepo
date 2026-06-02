import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Breadcrumb, Button } from "@alpac/design-system";
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
import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import type { CollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/collaborator.request";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

export function PayrollClosedHistoryPage() {
  const { payroll_id, alias_company } = useParams<{
    payroll_id: string;
    alias_company: string;
  }>();
  const location = useLocation();
  const navigate = useNavigate();

  const branch_id = location.state?.branch_id as string | undefined;
  const type_payroll = location.state?.type as string | undefined;

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

  const [identificationFilter, setIdentificationFilter] = useState("");
  const [workAreaFilter, setWorkAreaFilter] = useState<number | null>(null);
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
        work_area_id: workAreaFilter || undefined,
        job_position_id: jobPositionFilter || undefined,
        page_number: pageNumber,
        page_size: maxPageSize,
      },
      Boolean(payroll_id && branch_id),
    );

  const items = detailsData?.payroll_details?.ordinary_payroll_data ?? [];
  console.log("items", items);
  const totalRecords = detailsData?.payroll_details?.total_items ?? 0;

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

  const handleGenerateExcel = useCallback(async () => {
    if (!companyId || !moduleCode || !branch_id || !payroll_id || !type_payroll)
      return;
    try {
      setIsGeneratingExcel(true);
      await exportPayrollExcel({
        data: items,
        visibleKeys,
        companyName,
        branchName: detailsData?.branch_name ?? "",
        startDate: detailsData?.start_date,
        endDate: detailsData?.end_date,
        typePayroll: type_payroll as any,
        logoUrl: useCompanyStore.getState().urlImage,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingExcel(false);
    }
  }, [
    companyId,
    moduleCode,
    branch_id,
    payroll_id,
    items,
    visibleKeys,
    companyName,
    detailsData,
    type_payroll,
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
          <h3 className="text-xl font-bold mb-1 dark:text-white">
            Detalle de Nómina Cerrada
          </h3>
          <p className="text-sm text-gray-200 mb-4">
            Visualizando la nómina del{" "}
            {formatDateToSpanishWords(detailsData?.start_date)} al{" "}
            {formatDateToSpanishWords(detailsData?.end_date)}
          </p>

          <PayrollFiltersBar
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
          />

          <div className="mb-4 mt-2">
            <Button
              type="button"
              size="giant"
              label="Exportar Excel de nómina"
              isLoading={isGeneratingExcel}
              disabled={items.length === 0}
              onClick={handleGenerateExcel}
              className="w-full lg:w-auto min-h-[48px] px-4 text-center text-[15px] font-normal rounded-md text-white bg-alpac-primary-500 dark:bg-alpac-primary-700"
            />
          </div>

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
      </m.div>
    </LazyMotion>
  );
}
