import { Breadcrumb, useTheme } from "@alpac/design-system";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator.request";
import { useCollaborators } from "@app/modules/payroll/ui/hooks/useCollaborators";
import PayrollFiltersBar from "@app/modules/payroll/ui/pages/nomina/components/payroll-filters/payroll-filtersbar";
import { PayrollTable } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/payroll-table";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { usePayrollProcessStatus } from "@app/shared/hooks/usePayrollStatus";
import { Loader } from "@app/shared/components/loaders/loader";
import PayrollPageHeader from "./components/payroll-page-header/payroll-page-header";
import PayrollCycleFormalization from "./components/payroll-cycle-formalization/payroll-cycle-formalization";
import type { PayrollProcessRequest } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-process.request";

export function PayrollPage() {
  const maxPageSize = 10;

  const [filters, setFilters] = useState<CollaboratorRequest>({
    identification_number: "",
    branch_id: 0,
    area_id: 0,
    page_number: 1,
    page_size: maxPageSize,
    status: "",
  } as CollaboratorRequest);

  const navigate = useNavigate();
  const { theme } = useTheme();
  const { companyId, moduleCode } = useUserStore();
  const { urlImage, neutralUrlImage } = useCompanyStore();
  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

  const { GetCollaboratorsQuery } = useCollaborators({
    Collaboratorsfilters: {
      ...filters,
      company_id: companyId,
      module_code: moduleCode,
    },
  });

  const payrollStatusQuery = usePayrollProcessStatus({
    payload: {
      companyId,
      moduleCode,
      payrol_type: "Ordinary",
    } as PayrollProcessRequest,
  });

  const statusBusy =
    payrollStatusQuery.isPending || payrollStatusQuery.isFetching;

  const {
    data: collaborators = {
      data: [],
      page_number: 0,
      total_records: 0,
      page_size: 0,
      total_active: 0,
      total_on_vacation: 0,
      total_on_subsidy: 0,
      total_collaborators: 0,
      total_on_exit: 0,
    },
  } = GetCollaboratorsQuery;

  const handleApplyFilters = useCallback(
    (
      data: Pick<
        CollaboratorRequest,
        "identification_number" | "area_id" | "branch_id"
      >,
    ) => {
      setFilters((prev) => ({ ...prev, ...data, page_number: 1 }));
    },
    [],
  );

  const handleClearFilters = useCallback(() => {
    setFilters({
      identification_number: "",
      branch_id: 0,
      area_id: 0,
      page_number: 1,
      page_size: maxPageSize,
      status: "",
    } as CollaboratorRequest);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page_number: page }));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4"
    >
      {GetCollaboratorsQuery.isPending && (
        <Loader title="Cargando proceso de nomina..." />
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
      <PayrollCycleFormalization
        cicloInicial="16 de abril de 2026"
        cicloFinal="31 de abril de 2026"
        existPayrollInProgress={
          payrollStatusQuery.data?.exist_payroll_in_progress
        }
        statusLoading={statusBusy}
        statusError={payrollStatusQuery.isError}
        onRetryProcessStatus={() => payrollStatusQuery.refetch()}
      />
      <PayrollFiltersBar
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <div className="flex flex-col">
        <PayrollTable
          rows={collaborators.data ?? []}
          currentPage={collaborators.page_number}
          pageSize={collaborators.page_size}
          totalRecords={collaborators.total_records}
          onPageChange={handlePageChange}
          isPending={GetCollaboratorsQuery.isPending}
        />
      </div>
    </motion.div>
  );
}
