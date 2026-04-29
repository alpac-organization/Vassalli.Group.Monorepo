import { ArrowRight } from "lucide-react";
import type { ReportType } from "@app/modules/payroll/domain/ApiContract/Requests/reports-requests/generate-report-request";
import { ReportDetails } from "@app/modules/payroll/ui/pages/reportes/types/report-types";
interface ReportActionBarProps {
  selected: ReportType | null;
  loading: boolean;
  onCancel: () => void;
  onGenerate: () => void;
}

export function ReportActionBar({
  selected,
  loading,
  onCancel,
  onGenerate,
}: ReportActionBarProps) {
  return (
    <>
      <div
        className={[
          "fixed bottom-0 left-0 right-0 border-t border-[#2a3044] bg-[#272b34] px-4 py-4 transition-all duration-300",
          "sm:static sm:flex sm:items-center sm:justify-between sm:border-0 sm:bg-transparent sm:px-0 sm:py-0",
          selected
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-full opacity-0 sm:pointer-events-auto sm:translate-y-0 sm:opacity-100",
        ].join(" ")}
      >
        <div className="hidden sm:block">
          {selected && (
            <p className="text-sm text-gray-400">
              Reporte seleccionado:{" "}
              <span className="font-medium text-white">
                {ReportDetails[selected].name}
              </span>
            </p>
          )}
        </div>

        <div className="mb-2 flex items-center justify-between sm:hidden">
          {selected && (
            <p className="text-sm text-gray-400">
              Seleccionado:{" "}
              <span className="font-medium text-white">
                {ReportDetails[selected].name}
              </span>
            </p>
          )}
        </div>

        <div className="flex gap-3 sm:ml-auto">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-[#3a4560] px-4 py-2.5 text-sm font-medium text-gray-300 bg-[#272b34] transition-transform duration-150 ease-in-out sm:flex-none hover:scale-105 focus:scale-105"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onGenerate}
            disabled={!selected || loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white  transition-transform duration-150 ease-in-out disabled:cursor-not-allowed disabled:opacity-50 hover:scale-105 focus:scale-105 sm:flex-none"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Generando...
              </>
            ) : (
              <>
                Generar reporte
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      {selected && <div className="h-24 sm:hidden" />}
    </>
  );
}
