import { Button, Dropdown, useTheme } from "@alpac/design-system";
import type { ControlVacationDirectActionsProps } from "./types/control-vacation-direct-actions.props";
import type { VacationReportType } from "@app/modules/payroll/domain/ApiContract/Requests/control-vacation-requests/control-vacations-request";

export function ControlVacationDirectActions({
  reportOptions,
  selectedReportAction,
  onReportActionChange,
  onGenerate,
  isGenerating = false,
  onOpenChangeSelection,
  canChangeSelection = false,
}: ControlVacationDirectActionsProps) {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center border-t border-t-slate-600 pt-4 dark:border-t-neutral-600">
        <div className="flex flex-col justify-center">
          <h3 className="p-0! m-0!">Acciones directas</h3>
          <small className="text-gray-500 dark:text-gray-300">
            Cambie tipo de control y sucursal o genere reportes de vacaciones
          </small>
        </div>
      </div>

      <div className="w-full rounded-md border border-slate-600 p-4 dark:border-neutral-600 dark:bg-[#272b34]!">
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-start lg:gap-3">
          <Button
            type="button"
            size="giant"
            label="Cambiar tipo de control y sucursal"
            onClick={onOpenChangeSelection}
            disabled={!canChangeSelection}
            className="w-full! lg:w-auto! min-h-[48px]! px-4! text-center! text-[15px]! leading-snug! font-normal! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! enabled:opacity-100! disabled:pointer-events-none disabled:opacity-50"
          />

          <div className="w-full lg:w-[18rem]">
            <Dropdown
              placeholder="Seleccione una acción a generar"
              options={reportOptions}
              value={selectedReportAction ?? undefined}
              appearance={theme === "dark" ? "dark" : "default"}
              onChange={(value) =>
                onReportActionChange(value as VacationReportType)
              }
            />
          </div>

          <Button
            type="button"
            size="giant"
            label="Generar"
            isLoading={isGenerating}
            disabled={!selectedReportAction || isGenerating}
            onClick={onGenerate}
            className={`w-full! lg:w-auto! min-h-[48px]! px-4! text-center! text-[15px]! leading-snug! font-normal! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! ${
              isGenerating
                ? "disabled:opacity-100! disabled:bg-alpac-primary-500! disabled:dark:bg-alpac-primary-700!"
                : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
}
