import type { VacationPageHeaderProps } from "@app/modules/payroll/ui/pages/control-vacations/components/vacation-page-header/type/vacation-page-header.props";

export function ControlVacationPageHeader({
  collaboratorDisplayName,
}: VacationPageHeaderProps) {
  const subtitle = collaboratorDisplayName?.trim() || "control de vacaciones";

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
      <div className="flex flex-col justify-center">
        <h3 className="p-0! m-0! text-xl font-semibold text-neutral-900 dark:text-white">
          Control de vacaciones
        </h3>
        <small className="text-gray-500 dark:text-gray-300 mt-1">
          {subtitle}
        </small>
      </div>
    </div>
  );
}
