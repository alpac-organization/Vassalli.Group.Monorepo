import { Button } from "@alpac/design-system";
import { FileSpreadsheet } from "lucide-react";
import type { ControlVacationDirectActionsProps } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-direct-actions/types/control-vacation-direct-actions.props";

export function ControlVacationDirectActions({
  onGenerateReport,
  isPending,
}: ControlVacationDirectActionsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center border-t border-t-slate-600 pt-4 dark:border-t-neutral-600">
        <div className="flex flex-col justify-center">
          <h3 className="p-0! m-0!">Acciones directas</h3>
          <small className="text-gray-500 dark:text-gray-300">
            Descripcion de acciones directas
          </small>
        </div>
      </div>

      <div className="w-full rounded-md border border-slate-600 p-4 dark:border-neutral-600 dark:bg-[#272b34]!">
        <div className="flex w-full flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-start">
          <Button
            type="button"
            size="giant"
            label="Generar reporte"
            icon={<FileSpreadsheet size={20} />}
            disabled={isPending}
            onClick={onGenerateReport}
            className="w-full! rounded-md! bg-alpac-primary-500! text-[15px]! text-white! dark:bg-alpac-primary-700! md:w-auto!"
          />
        </div>
      </div>
    </div>
  );
}
