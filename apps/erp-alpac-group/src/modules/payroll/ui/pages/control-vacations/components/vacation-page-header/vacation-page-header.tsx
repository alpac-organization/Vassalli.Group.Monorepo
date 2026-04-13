import type { VacationPageHeaderProps } from "@app/modules/payroll/ui/pages/control-vacations/components/vacation-page-header/type/vacation-page-header.props";

export function ControlVacationPageHeader({
  collaboratorDisplayName,
  logoSrc,
  logoAlt = "",
}: VacationPageHeaderProps) {
  const subtitle = collaboratorDisplayName?.trim() || "control de vacaciones";

  return (
    <div className="flex justify-between items-center pb-2 gap-4">
      <div className="flex flex-col justify-center min-w-0">
        <h3 className="p-0! m-0! text-xl font-semibold text-neutral-900 dark:text-white">
          Control de Vacaciones
        </h3>
        <small className="text-gray-500 dark:text-gray-300 mt-1">
          {subtitle}
        </small>
      </div>
      {logoSrc ? (
        <div className="shrink-0 flex items-center">
          <img
            className="h-12 sm:h-16 md:h-20 w-auto object-contain"
            src={logoSrc}
            alt={logoAlt}
          />
        </div>
      ) : null}
    </div>
  );
}
