import type { ControlVacationPageHeaderProps } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-page-header/type/control-vacation-page-header.props";

export function ControlVacationPageHeader({
  logoSrc,
  logoAlt = "",
}: ControlVacationPageHeaderProps) {
  const subtitle = "Descripción del control de vacaciones";

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <div className="flex flex-col justify-center">
          <h3 className="p-0! m-0!">Control de Vacaciones</h3>
          <small className="text-gray-500 dark:text-gray-300">
            {subtitle}
          </small>
        </div>
        {logoSrc ? (
          <img
            className="h-12 w-auto object-contain sm:h-16 md:h-20"
            src={logoSrc}
            alt={logoAlt || "logo alpac"}
          />
        ) : null}
      </div>
    </div>
  );
}
