import type { PermissionRequestDetailsUiState } from "@app/modules/vacations/ui/pages/vacation-index/utils/permission-details-view-state";

type PermissionRequestDetailsContentProps = {
  details: PermissionRequestDetailsUiState;
};

export function PermissionRequestDetailsContent({
  details,
}: PermissionRequestDetailsContentProps) {
  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="wrap-break-word text-xl font-bold leading-snug text-slate-900 dark:text-white">
            {details.fullName || "—"}
          </p>
          <p className="mt-0.5 text-[13px] text-slate-500 dark:text-slate-400">
            ID Colaborador: {details.collaboratorCode}
          </p>
          <span className="mt-1.5 inline-block rounded-md bg-slate-100 px-2.5 py-0.5 text-[12px] font-medium text-slate-700 dark:bg-slate-700/50 dark:text-slate-300">
            {details.permissionTypeLabel}
          </span>
        </div>
        <span
          className={`shrink-0 rounded-md px-2.5 py-1 text-[13px] font-semibold ${details.statusColorClass}`}
        >
          {details.statusLabel}
        </span>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
            Fecha de inicio
          </p>
          <p className="mt-1 text-[14px] font-bold leading-snug text-slate-900 dark:text-white">
            {details.startDateFormatted}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
            Fecha de fin
          </p>
          <p className="mt-1 text-[14px] font-bold leading-snug text-slate-900 dark:text-white">
            {details.endDateFormatted}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
            Días solicitados
          </p>
          <p
            className={`mt-1 text-2xl font-bold ${
              details.requestedDays > 0
                ? "text-white"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {details.requestedDays}
          </p>
        </div>
      </div>

      {!details.isVacationType && (
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
              Hora de inicio
            </p>
            <p className="mt-1 text-[14px] font-bold leading-snug text-slate-900 dark:text-white">
              {details.startTime ?? "—"}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
              Hora de fin
            </p>
            <p className="mt-1 text-[14px] font-bold leading-snug text-slate-900 dark:text-white">
              {details.endTime ?? "—"}
            </p>
          </div>
        </div>
      )}

      <div className="min-w-0">
        <p className="mb-1.5 text-[13px] font-medium text-slate-600 dark:text-slate-400">
          Descripción
        </p>
        <div className="min-h-10 rounded-md py-2.5 text-[14px] leading-relaxed text-white">
          {details.description}
        </div>
      </div>

      <div className="border-t border-slate-200 pt-3 dark:border-neutral-600">
        <p className="text-[13px] text-white">
          <span className="font-medium">Solicitado el:</span>{" "}
          {details.requestedAtFormatted}
        </p>
      </div>
    </div>
  );
}
