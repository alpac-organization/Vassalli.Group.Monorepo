import type { PayrollPageHeaderProps } from "@app/modules/payroll/ui/pages/nomina/components/payroll-page-header/types/payroll-page-header.types";
import { Badges, Button } from "@alpac/design-system";
export default function PayrollPageHeader({
  logoSrc,
  logoAlt = "",
  branchName = null,
  onRequestChangePayrollSelection,
}: PayrollPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-3">
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
      {branchName ? (
        <div className="mt-3 flex flex-col items-center gap-3 sm:mt-1 sm:items-end sm:gap-2">
          <Badges
            label={`Nomina de ${branchName}`}
            color="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
            className="max-w-72 text-[13px]! sm:text-[13px]! font-semibold! leading-snug! wrap-break-word text-center sm:text-right"
          />
          {onRequestChangePayrollSelection ? (
            <Button
              type="button"
              size="giant"
              label="Cambiar tipo de nómina y sucursal"
              onClick={onRequestChangePayrollSelection}
              className="w-full! min-h-[48px]! px-4! text-center! text-[15px]! leading-snug! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:w-auto!"
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
