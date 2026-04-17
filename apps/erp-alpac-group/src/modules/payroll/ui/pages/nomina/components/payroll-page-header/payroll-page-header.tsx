import type { PayrollPageHeaderProps } from "@app/modules/payroll/ui/pages/nomina/components/payroll-page-header/types/payroll-page-header.types";
export default function PayrollPageHeader({
  logoSrc,
  logoAlt = "",
}: PayrollPageHeaderProps) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <div className="flex flex-col justify-center">
          <h3 className="p-0! m-0!">Gestión de nómina</h3>
          <small className="text-gray-500 dark:text-gray-300">
            Gestión de nómina y estadísticas
          </small>
        </div>
        <img
          className="h-12 sm:h-16 md:h-20 w-auto object-contain"
          src={logoSrc}
          alt={logoAlt || ""}
        />
      </div>
    </div>
  );
}
