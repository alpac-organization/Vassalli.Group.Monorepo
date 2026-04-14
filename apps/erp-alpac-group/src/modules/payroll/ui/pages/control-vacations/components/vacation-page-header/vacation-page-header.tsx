import { Button } from "@alpac/design-system";
import type { VacationPageHeaderProps } from "@app/modules/payroll/ui/pages/control-vacations/components/vacation-page-header/type/vacation-page-header.props";

export function ControlVacationPageHeader({
  logoSrc,
  logoAlt = "",
  onGenerateTableReportClick,
  isGenerateTableReportPending,
}: VacationPageHeaderProps) {
  const subtitle = "Descripción del control de vacaciones";
  const showRightColumn = Boolean(logoSrc) || Boolean(onGenerateTableReportClick);

  return (
    <div className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex min-w-0 flex-col justify-center">
        <h3 className="p-0! m-0! text-xl font-semibold text-neutral-900 dark:text-white">
          Control de Vacaciones
        </h3>
        <small className="text-gray-500 dark:text-gray-300 mt-1">
          {subtitle}
        </small>
      </div>
      {showRightColumn ? (
        <div className="flex w-full max-w-full shrink-0 flex-col items-center gap-3 md:gap-4 sm:w-auto">
          {logoSrc ? (
            <img
              className="h-12 w-auto object-contain sm:h-16 md:h-20"
              src={logoSrc}
              alt={logoAlt}
            />
          ) : null}
          {onGenerateTableReportClick ? (
            <div className="mx-auto w-full max-w-sm sm:mx-0 sm:max-w-none">
              <Button
                type="button"
                size="giant"
                label="Generar reporte"
                disabled={isGenerateTableReportPending}
                onClick={onGenerateTableReportClick}
                className="w-full text-[14px]! md:text-[16px]! rounded-md! bg-alpac-primary-500 text-white! shadow-sm transition-all active:scale-95 dark:bg-alpac-primary-700 px-4! md:px-8! py-2.5! sm:w-auto!"
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
