import { CheckCircle } from "lucide-react";
import type { ReportType } from "../types/report-types";

interface ReportSuccessStateProps {
  selected: ReportType | null;
  onReset: () => void;
}

export function ReportSuccessState({
  selected,
  onReset,
}: ReportSuccessStateProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15">
        <CheckCircle size={52} className="text-green-400" />
      </div>

      <h2 className="mb-2 text-xl font-semibold text-white">
        Reporte solicitado
      </h2>
      <p className="mb-1 max-w-sm text-sm text-gray-200">
        Tu solicitud de{" "}
        <span className="font-medium text-gray-200">{selected?.label}</span> ha
        sido enviada correctamente.
      </p>
      <p className="mb-8 text-xs text-gray-200">
        El servidor procesará la solicitud y el archivo estará disponible en
        breve.
      </p>

      <div className="flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-[#3a4560] px-5 py-2.5 bg-alpac-primary-500 text-sm font-medium text-gray-300"
        >
          Generar otro reporte
        </button>
      </div>
    </div>
  );
}
