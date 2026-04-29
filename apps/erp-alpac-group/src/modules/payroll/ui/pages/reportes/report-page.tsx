import { useEffect, useState } from "react";
import { ReportActionBar } from "./components/report-action-bar";
import { ReportSuccessState } from "./components/report-success-state";
import { ReportTypeGrid } from "./components/report-type-grid";
import type { ReportType } from "@app/modules/payroll/domain/ApiContract/Requests/reports-requests/generate-report-request";
import { Breadcrumb } from "@alpac/design-system";
import { useNavigate } from "react-router-dom";
import { Loader } from "@app/shared/components/loaders/loader";
import { useReports } from "@app/modules/payroll/ui/hooks/reportes/useReports";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { REPORT_TYPES } from "@app/modules/payroll/ui/pages/reportes/types/report-types";
export function ReportsPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<ReportType | null>(null);
  const [requested, setRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoadingReportTypes, setIsLoadingReportTypes] = useState(true);
  const { companyId } = useUserStore();
  const { generateReportsMutation } = useReports({
    payloadReport: {
      companie_id: companyId,
      type: selected as ReportType,
    },
  });
  useEffect(() => {
    const mainScrollableContainer = document.querySelector(
      "main.overflow-y-auto",
    );
    if (mainScrollableContainer instanceof HTMLElement) {
      mainScrollableContainer.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [requested]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoadingReportTypes(false);
    }, 700);

    return () => clearTimeout(timeout);
  }, []);

  const handleRequest = async () => {
    if (!selected) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);
    setRequested(true);
  };

  const handleReset = () => {
    setSelected(null);
    setRequested(false);
  };

  const handleToggleReport = (report: ReportType) => {
    setSelected((current) => (current === report ? null : report));
  };

  return (
    <div className="min-h-screen bg-[#363a45] p-4 text-gray-100 sm:p-6 lg:p-8">
      {isLoadingReportTypes && <Loader title="Cargando tipo de reportes..." />}
      <div className="mb-8">
        <div className="flex justify-start">
          <Breadcrumb
            items={[
              { label: "Dashboard", url: "/", onClick: (url) => navigate(url) },
              {
                label: "Gestión de reportes",
                url: "/payroll/reportes",
                onClick: (url) => navigate(url),
              },
            ]}
          />
        </div>
        <h3 className="pl-2 pt-4 m-0!">Gestión de reportes</h3>
        <p className="mt-1 pl-2 text-sm text-gray-200 sm:text-base">
          Selecciona el tipo de reporte que deseas generar.
        </p>
      </div>

      {!requested ? (
        <>
          <div className="mb-8">
            <ReportTypeGrid
              reports={REPORT_TYPES}
              selected={selected}
              onToggleReport={handleToggleReport}
            />
          </div>

          <ReportActionBar
            selected={selected}
            loading={loading}
            onCancel={handleReset}
            onGenerate={handleRequest}
          />
        </>
      ) : (
        <ReportSuccessState selected={selected} onReset={handleReset} />
      )}
    </div>
  );
}
